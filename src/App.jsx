import { useState, useEffect } from "react";

const PHASES = ["Foundation", "Structure", "MEP", "Finishing", "Handover"];
const TRADES = ["Civil", "Electrical", "Plumbing", "HVAC", "Carpentry", "Steel", "Masonry"];
const STATUS_OPTIONS = ["Not Started", "In Progress", "On Hold", "Completed", "Delayed"];
const PRIORITY = ["Low", "Medium", "High", "Critical"];
const INVOICE_STATUS = ["Draft", "Sent", "Approved", "Paid", "Overdue", "Disputed"];
const PAYMENT_METHODS = ["Bank Transfer (RTGS)", "M-Pesa", "Cheque", "Cash", "SWIFT"];
const EXPENSE_CATS = ["Labour", "Materials", "Equipment", "Subcontractor", "Permits & Fees", "Transport", "Utilities", "Professional Fees", "Contingency", "Other"];
const VAT_RATE = 0.16;

const SC = { "Not Started":"#64748b","In Progress":"#f59e0b","On Hold":"#ef4444","Completed":"#10b981","Delayed":"#dc2626" };
const PC = { Low:"#64748b",Medium:"#3b82f6",High:"#f59e0b",Critical:"#ef4444" };
const IC = { Draft:"#64748b",Sent:"#3b82f6",Approved:"#8b5cf6",Paid:"#10b981",Overdue:"#ef4444",Disputed:"#f59e0b" };

const ksh = (n) => { const num=Number(n)||0; if(Math.abs(num)>=1000000) return `KSh ${(num/1000000).toFixed(2)}M`; if(Math.abs(num)>=1000) return `KSh ${(num/1000).toFixed(0)}K`; return `KSh ${num.toLocaleString("en-KE")}`; };
const kshFull = (n) => `KSh ${(Number(n)||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const initTasks = [
  {id:1,name:"Site Clearing & Grading",phase:"Foundation",trade:"Civil",status:"Completed",priority:"High",progress:100,startDate:"2025-01-10",endDate:"2025-01-25",assignee:"Team Alpha",notes:"Completed ahead of schedule",cost:580000,budgeted:546000},
  {id:2,name:"Foundation Excavation",phase:"Foundation",trade:"Civil",status:"Completed",priority:"High",progress:100,startDate:"2025-01-26",endDate:"2025-02-10",assignee:"Team Alpha",notes:"All zones cleared",cost:1014000,budgeted:1040000},
  {id:3,name:"Concrete Footings",phase:"Foundation",trade:"Civil",status:"Completed",priority:"Critical",progress:100,startDate:"2025-02-11",endDate:"2025-03-05",assignee:"Team Beta",notes:"Passed structural inspection",cost:1560000,budgeted:1495000},
  {id:4,name:"Ground Floor Slab",phase:"Foundation",trade:"Civil",status:"Completed",priority:"High",progress:100,startDate:"2025-03-06",endDate:"2025-03-28",assignee:"Team Beta",notes:"Cured and tested",cost:1235000,budgeted:1170000},
  {id:5,name:"Column & Beam Erection",phase:"Structure",trade:"Steel",status:"Completed",priority:"Critical",progress:100,startDate:"2025-03-29",endDate:"2025-05-15",assignee:"SteelCo Ltd",notes:"All columns plumb",cost:2860000,budgeted:2730000},
  {id:6,name:"Floor Decking Levels 2-5",phase:"Structure",trade:"Steel",status:"In Progress",priority:"Critical",progress:72,startDate:"2025-05-16",endDate:"2025-07-30",assignee:"SteelCo Ltd",notes:"Levels 2-3 done, 4-5 in progress",cost:2080000,budgeted:2535000},
  {id:7,name:"External Masonry Walls",phase:"Structure",trade:"Masonry",status:"In Progress",priority:"High",progress:45,startDate:"2025-06-01",endDate:"2025-08-15",assignee:"Team Gamma",notes:"Ground floor complete",cost:1144000,budgeted:2405000},
  {id:8,name:"Roof Structure",phase:"Structure",trade:"Steel",status:"Not Started",priority:"High",progress:0,startDate:"2025-08-01",endDate:"2025-09-15",assignee:"SteelCo Ltd",notes:"Pending floor decking",cost:0,budgeted:1885000},
  {id:9,name:"Main Electrical Distribution",phase:"MEP",trade:"Electrical",status:"In Progress",priority:"Critical",progress:30,startDate:"2025-06-15",endDate:"2025-09-30",assignee:"PowerTech Inc",notes:"Main panel installed",cost:715000,budgeted:2340000},
  {id:10,name:"Plumbing Roughing-In",phase:"MEP",trade:"Plumbing",status:"In Progress",priority:"High",progress:25,startDate:"2025-06-20",endDate:"2025-09-20",assignee:"FlowMasters",notes:"Main risers complete",cost:546000,budgeted:2080000},
  {id:11,name:"HVAC Ductwork",phase:"MEP",trade:"HVAC",status:"Not Started",priority:"Medium",progress:0,startDate:"2025-08-15",endDate:"2025-10-30",assignee:"ClimateControl Co",notes:"Awaiting structural completion",cost:0,budgeted:2860000},
  {id:12,name:"Fire Suppression System",phase:"MEP",trade:"Plumbing",status:"Not Started",priority:"Critical",progress:0,startDate:"2025-09-01",endDate:"2025-11-15",assignee:"SafetyFirst Ltd",notes:"Design approved by fire dept",cost:0,budgeted:1235000},
  {id:13,name:"Interior Plastering",phase:"Finishing",trade:"Masonry",status:"Not Started",priority:"Medium",progress:0,startDate:"2025-10-01",endDate:"2025-12-15",assignee:"FinishPro Team",notes:"Pending MEP completion",cost:0,budgeted:1690000},
  {id:14,name:"Flooring Installation",phase:"Finishing",trade:"Carpentry",status:"Not Started",priority:"Medium",progress:0,startDate:"2025-11-01",endDate:"2026-01-15",assignee:"FloorMasters",notes:"Material ordered",cost:0,budgeted:2275000},
  {id:15,name:"Facade & Glazing",phase:"Finishing",trade:"Steel",status:"Not Started",priority:"High",progress:0,startDate:"2025-10-15",endDate:"2026-01-30",assignee:"GlazeTech",notes:"Procurement in progress",cost:0,budgeted:3120000},
  {id:16,name:"Final Inspections & Certificates",phase:"Handover",trade:"Civil",status:"Not Started",priority:"Critical",progress:0,startDate:"2026-02-01",endDate:"2026-02-28",assignee:"Project Manager",notes:"",cost:0,budgeted:195000},
];

const initInvoices = [
  {id:"INV-001",vendor:"SteelCo Ltd",phase:"Structure",trade:"Steel",amount:2860000,vat:457600,total:3317600,status:"Paid",issueDate:"2025-05-20",dueDate:"2025-06-20",paidDate:"2025-06-18",method:"Bank Transfer (RTGS)",ref:"RTGS/2025/001",description:"Column & Beam Erection — Final Certificate",retentionPct:5,retentionAmt:143000},
  {id:"INV-002",vendor:"SteelCo Ltd",phase:"Structure",trade:"Steel",amount:1500000,vat:240000,total:1740000,status:"Approved",issueDate:"2025-07-01",dueDate:"2025-07-31",paidDate:"",method:"Bank Transfer (RTGS)",ref:"",description:"Floor Decking L2-L3 — Interim Payment #1",retentionPct:5,retentionAmt:75000},
  {id:"INV-003",vendor:"PowerTech Inc",phase:"MEP",trade:"Electrical",amount:715000,vat:114400,total:829400,status:"Paid",issueDate:"2025-08-10",dueDate:"2025-09-10",paidDate:"2025-09-05",method:"Bank Transfer (RTGS)",ref:"RTGS/2025/002",description:"Electrical Distribution — Interim #1",retentionPct:5,retentionAmt:35750},
  {id:"INV-004",vendor:"FlowMasters",phase:"MEP",trade:"Plumbing",amount:546000,vat:87360,total:633360,status:"Sent",issueDate:"2025-09-01",dueDate:"2025-10-01",paidDate:"",method:"Bank Transfer (RTGS)",ref:"",description:"Plumbing Roughing-In — Interim #1",retentionPct:5,retentionAmt:27300},
  {id:"INV-005",vendor:"Team Alpha",phase:"Foundation",trade:"Civil",amount:2389000,vat:382240,total:2771240,status:"Paid",issueDate:"2025-02-15",dueDate:"2025-03-15",paidDate:"2025-03-10",method:"Bank Transfer (RTGS)",ref:"RTGS/2025/003",description:"Foundation Excavation & Clearing — Final",retentionPct:5,retentionAmt:119450},
  {id:"INV-006",vendor:"Team Beta",phase:"Foundation",trade:"Civil",amount:2795000,vat:447200,total:3242200,status:"Overdue",issueDate:"2025-04-01",dueDate:"2025-05-01",paidDate:"",method:"Cheque",ref:"",description:"Footings & Ground Slab — Final Certificate",retentionPct:5,retentionAmt:139750},
];

const initExpenses = [
  {id:"EXP-001",description:"Cement — OPC 50Kg Bags x500",category:"Materials",vendor:"Bamburi Cement",amount:325000,date:"2025-03-01",phase:"Foundation",approved:true,receipt:"RCP-001"},
  {id:"EXP-002",description:"Rebar Steel BRC — 40 tonnes",category:"Materials",vendor:"Steel & Tubes Kenya",amount:1240000,date:"2025-03-15",phase:"Foundation",approved:true,receipt:"RCP-002"},
  {id:"EXP-003",description:"Site Labour — March 2025",category:"Labour",vendor:"Casual Workers Pool",amount:480000,date:"2025-03-31",phase:"Foundation",approved:true,receipt:"RCP-003"},
  {id:"EXP-004",description:"Excavator Hire — 20 days",category:"Equipment",vendor:"Rent-A-Plant Kenya",amount:320000,date:"2025-02-10",phase:"Foundation",approved:true,receipt:"RCP-004"},
  {id:"EXP-005",description:"NCA Permit Renewal",category:"Permits & Fees",vendor:"NCA",amount:85000,date:"2025-01-05",phase:"Foundation",approved:true,receipt:"RCP-005"},
  {id:"EXP-006",description:"Structural Steel — I-Beams",category:"Materials",vendor:"Steel & Tubes Kenya",amount:2100000,date:"2025-04-10",phase:"Structure",approved:true,receipt:"RCP-006"},
  {id:"EXP-007",description:"Tower Crane Monthly Hire",category:"Equipment",vendor:"Cranes East Africa",amount:650000,date:"2025-05-01",phase:"Structure",approved:true,receipt:"RCP-007"},
  {id:"EXP-008",description:"Electrical Cables & Conduit",category:"Materials",vendor:"Kenwest Cables",amount:430000,date:"2025-06-20",phase:"MEP",approved:true,receipt:"RCP-008"},
  {id:"EXP-009",description:"Site Labour — July 2025",category:"Labour",vendor:"Casual Workers Pool",amount:520000,date:"2025-07-31",phase:"Structure",approved:false,receipt:""},
  {id:"EXP-010",description:"Quantity Surveyor Fees Q2",category:"Professional Fees",vendor:"QS & Associates",amount:180000,date:"2025-07-01",phase:"Structure",approved:true,receipt:"RCP-009"},
];

const initPayments = [
  {id:"PMT-001",invoice:"INV-001",vendor:"SteelCo Ltd",amount:3317600,method:"Bank Transfer (RTGS)",date:"2025-06-18",ref:"RTGS/2025/001",notes:"Full payment after defects liability sign-off"},
  {id:"PMT-002",invoice:"INV-003",vendor:"PowerTech Inc",amount:829400,method:"Bank Transfer (RTGS)",date:"2025-09-05",ref:"RTGS/2025/002",notes:"Interim payment approved by PM"},
  {id:"PMT-003",invoice:"INV-005",vendor:"Team Alpha",amount:2771240,method:"Bank Transfer (RTGS)",date:"2025-03-10",ref:"RTGS/2025/003",notes:"Foundation phase final payment"},
];

const initLogs = [
  {id:1,date:"2026-03-09",time:"08:15",type:"Update",task:"Floor Decking Levels 2-5",message:"Level 4 decking 60% complete. On track.",author:"J. Kamau"},
  {id:2,date:"2026-03-08",time:"14:30",type:"Issue",task:"External Masonry Walls",message:"Material delivery delayed by 3 days.",author:"A. Wanjiku"},
  {id:3,date:"2026-03-07",time:"09:00",type:"Milestone",task:"Column & Beam Erection",message:"Final inspection passed. Phase complete.",author:"D. Ochieng"},
  {id:4,date:"2026-03-06",time:"16:45",type:"Update",task:"Main Electrical Distribution",message:"Floors 1-2 cabling complete. Starting floor 3.",author:"P. Njoroge"},
  {id:5,date:"2026-03-05",time:"11:20",type:"Alert",task:"Plumbing Roughing-In",message:"Weather delay — halted outdoor works. 1 day lost.",author:"R. Muthoni"},
];

const initIssues = [
  {id:1,title:"Material Delivery Delay - Bricks",severity:"High",status:"Open",phase:"Structure",assignee:"A. Wanjiku",date:"2026-03-08",description:"Brick supplier delayed 3 days due to transport issues."},
  {id:2,title:"RFI - Column Grid Dimension Conflict",severity:"Critical",status:"In Review",phase:"Structure",assignee:"D. Ochieng",date:"2026-03-05",description:"Drawing conflict on Grid C column alignment. Awaiting engineer response."},
  {id:3,title:"Weather Stoppage - 1 Day",severity:"Medium",status:"Closed",phase:"MEP",assignee:"R. Muthoni",date:"2026-03-05",description:"Heavy rain halted outdoor activities on March 5th."},
  {id:4,title:"Cost Overrun - Site Clearing",severity:"Medium",status:"Closed",phase:"Foundation",assignee:"J. Kamau",date:"2025-01-28",description:"Unexpected rocky soil added KSh 34,000 to clearing cost."},
];

const IS = {background:"#0f172a",border:"1px solid #334155",borderRadius:6,color:"#e2e8f0",padding:"8px 12px",width:"100%",fontSize:13,outline:"none",fontFamily:"inherit"};
const LS = {color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:4,display:"block"};
const CS = {background:"#1e293b",border:"1px solid #334155",borderRadius:12,padding:20};

export default function SitePulse() {
  const [tasks, setTasks] = useState(initTasks);
  const [invoices, setInvoices] = useState(initInvoices);
  const [expenses, setExpenses] = useState(initExpenses);
  const [payments, setPayments] = useState(initPayments);
  const [logs, setLogs] = useState(initLogs);
  const [issues, setIssues] = useState(initIssues);
  const [tab, setTab] = useState("dashboard");
  const [accTab, setAccTab] = useState("overview");
  const [liveTime, setLiveTime] = useState(new Date());
  const [notif, setNotif] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [fPhase, setFPhase] = useState("All");
  const [fTrade, setFTrade] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [modal, setModal] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({name:"",phase:"Foundation",trade:"Civil",status:"Not Started",priority:"Medium",progress:0,startDate:"",endDate:"",assignee:"",notes:"",cost:0,budgeted:0});
  const [newInv, setNewInv] = useState({vendor:"",phase:"Foundation",trade:"Civil",amount:0,vat:0,total:0,status:"Draft",issueDate:"",dueDate:"",paidDate:"",method:"Bank Transfer (RTGS)",ref:"",description:"",retentionPct:5,retentionAmt:0});
  const [newExp, setNewExp] = useState({description:"",category:"Materials",vendor:"",amount:0,date:"",phase:"Foundation",approved:false,receipt:""});
  const [newPmt, setNewPmt] = useState({invoice:"",vendor:"",amount:0,method:"Bank Transfer (RTGS)",date:"",ref:"",notes:""});
  const [newLog, setNewLog] = useState({type:"Update",task:"",message:"",author:""});
  const [newIssue, setNewIssue] = useState({title:"",severity:"Medium",status:"Open",phase:"Foundation",assignee:"",description:""});

  useEffect(()=>{const t=setInterval(()=>setLiveTime(new Date()),1000);return()=>clearInterval(t);},[]);
  const notify=(msg,type="success")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),3500);};

  const totalBudget=tasks.reduce((s,t)=>s+t.budgeted,0);
  const totalSpent=tasks.reduce((s,t)=>s+t.cost,0);
  const overallPct=Math.round(tasks.reduce((s,t)=>s+t.progress,0)/tasks.length);
  const budgetPct=Math.round((totalSpent/totalBudget)*100);
  const completedTasks=tasks.filter(t=>t.status==="Completed").length;
  const openIssues=issues.filter(i=>i.status!=="Closed").length;
  const criticalIssues=issues.filter(i=>i.severity==="Critical"&&i.status!=="Closed").length;
  const totalInvoiced=invoices.reduce((s,i)=>s+i.total,0);
  const totalPaid=invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.total,0);
  const totalOutstanding=invoices.filter(i=>["Sent","Approved","Overdue"].includes(i.status)).reduce((s,i)=>s+i.total,0);
  const totalOverdue=invoices.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.total,0);
  const totalExpenses=expenses.reduce((s,e)=>s+e.amount,0);
  const approvedExpenses=expenses.filter(e=>e.approved).reduce((s,e)=>s+e.amount,0);
  const pendingExpenses=expenses.filter(e=>!e.approved).reduce((s,e)=>s+e.amount,0);
  const totalVAT=invoices.reduce((s,i)=>s+i.vat,0);
  const totalRetention=invoices.reduce((s,i)=>s+i.retentionAmt,0);
  const cashFlow=totalPaid-approvedExpenses;
  const contractValue=280000000;
  const totalPmtMade=payments.reduce((s,p)=>s+p.amount,0);
  const phaseProgress=PHASES.map(ph=>{const pt=tasks.filter(t=>t.phase===ph);return{phase:ph,progress:pt.length?Math.round(pt.reduce((s,t)=>s+t.progress,0)/pt.length):0,count:pt.length,completed:pt.filter(t=>t.status==="Completed").length};});
  const filteredTasks=tasks.filter(t=>(fPhase==="All"||t.phase===fPhase)&&(fTrade==="All"||t.trade===fTrade)&&(fStatus==="All"||t.status===fStatus));

  const saveTask=()=>{const t={...newTask,id:Date.now(),cost:Number(newTask.cost),budgeted:Number(newTask.budgeted),progress:Number(newTask.progress)};setTasks(p=>[...p,t]);setNewTask({name:"",phase:"Foundation",trade:"Civil",status:"Not Started",priority:"Medium",progress:0,startDate:"",endDate:"",assignee:"",notes:"",cost:0,budgeted:0});setModal(null);notify("Task added");};
  const updateTask=()=>{setTasks(p=>p.map(t=>t.id===editingTask.id?{...editingTask,cost:Number(editingTask.cost),budgeted:Number(editingTask.budgeted),progress:Number(editingTask.progress)}:t));const entry={id:Date.now(),date:liveTime.toISOString().split("T")[0],time:liveTime.toTimeString().slice(0,5),type:"Update",task:editingTask.name,message:`Progress → ${editingTask.progress}%, Status: ${editingTask.status}`,author:"Site Manager"};setLogs(p=>[entry,...p]);setEditingTask(null);setModal(null);notify("Task updated — live feed refreshed");};
  const saveInv=()=>{const inv={...newInv,id:`INV-${String(invoices.length+1).padStart(3,"0")}`,amount:Number(newInv.amount),vat:Number(newInv.vat),total:Number(newInv.total),retentionAmt:Number(newInv.retentionAmt)};setInvoices(p=>[...p,inv]);setModal(null);notify("Invoice created");};
  const saveExp=()=>{const exp={...newExp,id:`EXP-${String(expenses.length+1).padStart(3,"0")}`,amount:Number(newExp.amount)};setExpenses(p=>[...p,exp]);setModal(null);notify("Expense recorded");};
  const savePmt=()=>{const pmt={...newPmt,id:`PMT-${String(payments.length+1).padStart(3,"0")}`,amount:Number(newPmt.amount)};setPayments(p=>[...p,pmt]);setInvoices(prev=>prev.map(inv=>inv.id===newPmt.invoice?{...inv,status:"Paid",paidDate:newPmt.date,method:newPmt.method,ref:newPmt.ref}:inv));setModal(null);notify("Payment recorded — invoice marked Paid");};
  const saveLog=()=>{setLogs(p=>[{...newLog,id:Date.now(),date:liveTime.toISOString().split("T")[0],time:liveTime.toTimeString().slice(0,5)},...p]);setNewLog({type:"Update",task:"",message:"",author:""});setModal(null);notify("Activity logged");};
  const saveIssue=()=>{setIssues(p=>[{...newIssue,id:Date.now(),date:liveTime.toISOString().split("T")[0]},...p]);setNewIssue({title:"",severity:"Medium",status:"Open",phase:"Foundation",assignee:"",description:""});setModal(null);notify("Issue logged","warning");};

  const TABS=[{id:"dashboard",label:"Dashboard",icon:"⬛"},{id:"tasks",label:"Tasks",icon:"📋"},{id:"phases",label:"Phases",icon:"🏗"},{id:"accounting",label:"Accounting",icon:"💼"},{id:"reports",label:"Reports",icon:"📊"},{id:"issues",label:"Issues",icon:"⚠️"},{id:"activity",label:"Activity",icon:"📝"}];

  const PBar=({pct,color,h=8})=>(<div style={{height:h,background:"#0f172a",borderRadius:h/2,overflow:"hidden"}}><div style={{width:`${Math.max(0,Math.min(100,pct))}%`,height:"100%",background:color||"linear-gradient(90deg,#f59e0b,#fbbf24)",borderRadius:h/2,transition:"width .7s ease"}}/></div>);
  const Bdg=({text,color})=>(<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:`${color}22`,color,border:`1px solid ${color}44`,whiteSpace:"nowrap"}}>{text}</span>);
  const ST=({children})=>(<div style={{fontSize:12,fontWeight:700,color:"#94a3b8",letterSpacing:"0.09em",marginBottom:16,textTransform:"uppercase"}}>{children}</div>);
  const G4=({children,cols="repeat(4,1fr)",gap=14})=>(<div style={{display:"grid",gridTemplateColumns:cols,gap}}>{children}</div>);
  const KCard=({l,v,s,color="#f59e0b",bar})=>(<div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:10,padding:16,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color}}/><div style={{fontSize:10,color:"#475569",letterSpacing:".1em",textTransform:"uppercase",marginTop:4}}>{l}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginTop:4,lineHeight:1.1}}>{v}</div><div style={{fontSize:11,color:"#475569",marginTop:4}}>{s}</div>{bar!==undefined&&<div style={{marginTop:8}}><PBar pct={bar} color={color} h={4}/></div>}</div>);

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",color:"#e2e8f0",fontFamily:"'DM Mono','Courier New',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        .hov:hover{background:#1e293b!important;cursor:pointer}
        .trow:hover{background:#1a2540!important;cursor:pointer}
        .btn{border:none;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px;font-family:inherit;transition:all .15s;letter-spacing:.04em}
        .by{background:#f59e0b;color:#0a0f1e}.by:hover{background:#fbbf24;transform:translateY(-1px)}
        .br{background:#ef4444;color:#fff}.br:hover{background:#f87171}
        .bg{background:#10b981;color:#0a0f1e}.bg:hover{background:#34d399}
        .bo{background:transparent;color:#94a3b8;border:1px solid #334155}.bo:hover{border-color:#f59e0b;color:#f59e0b}
        .modal{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
        .mbox{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px;width:580px;max-height:90vh;overflow-y:auto}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .atab{padding:8px 18px;border:none;border-bottom:2px solid transparent;background:transparent;color:#64748b;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.06em;transition:all .15s}
        .atab.on{color:#f59e0b;border-bottom-color:#f59e0b}.atab:hover{color:#e2e8f0}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th{padding:10px 14px;text-align:left;color:#64748b;font-weight:700;letter-spacing:.06em;background:#0f172a;white-space:nowrap}
        td{padding:10px 14px;border-bottom:1px solid #1e293b;vertical-align:middle}
        select option{background:#0f172a}input[type=range]{width:100%;accent-color:#f59e0b}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
      `}</style>

      {notif&&<div style={{position:"fixed",top:20,right:20,zIndex:999,background:notif.type==="warning"?"#78350f":"#064e3b",border:`1px solid ${notif.type==="warning"?"#f59e0b":"#10b981"}`,borderRadius:10,padding:"12px 20px",fontSize:13,color:"#fff",boxShadow:"0 8px 32px rgba(0,0,0,.5)",animation:"slideIn .3s ease"}}>{notif.type==="warning"?"⚠️":"✅"} {notif.msg}</div>}

      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"0 24px"}}>
        <div style={{maxWidth:1500,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏗</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,letterSpacing:".06em",color:"#fff"}}>SITEPULSE</div>
              <div style={{fontSize:10,color:"#475569",letterSpacing:".12em"}}>CONSTRUCTION MANAGEMENT SYSTEM — NAIROBI, KENYA</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"#475569",letterSpacing:".1em"}}>EAST AFRICA TIME</div>
              <div style={{fontSize:15,color:"#f59e0b",fontWeight:700}}>{liveTime.toLocaleTimeString("en-KE")}</div>
            </div>
            <div style={{width:1,height:30,background:"#1e293b"}}/>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div className="pulse" style={{width:8,height:8,borderRadius:"50%",background:"#10b981"}}/><span style={{fontSize:11,color:"#10b981",fontWeight:700}}>LIVE</span></div>
            {criticalIssues>0&&<div style={{background:"#7f1d1d",border:"1px solid #ef4444",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#fca5a5",display:"flex",alignItems:"center",gap:6}}><span className="pulse">⚠</span> {criticalIssues} CRITICAL</div>}
          </div>
        </div>
      </div>

      <div style={{background:"#111827",borderBottom:"1px solid #1e293b",padding:"10px 24px"}}>
        <div style={{maxWidth:1500,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
            <span><span style={{fontSize:11,color:"#475569"}}>PROJECT: </span><span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>HIGHRISE COMMERCIAL COMPLEX — NAIROBI CBD</span></span>
            <span><span style={{fontSize:11,color:"#475569"}}>CONTRACT: </span><span style={{fontSize:13,color:"#f59e0b",fontWeight:700}}>{ksh(contractValue)}</span></span>
            <span><span style={{fontSize:11,color:"#475569"}}>PM: </span><span style={{fontSize:13,color:"#94a3b8"}}>J. Kamau</span></span>
            <span><span style={{fontSize:11,color:"#475569"}}>CASHFLOW: </span><span style={{fontSize:13,color:cashFlow>=0?"#10b981":"#ef4444",fontWeight:700}}>{cashFlow>=0?"+":""}{ksh(cashFlow)}</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:11,color:"#475569"}}>OVERALL PROGRESS</span>
            <div style={{width:180,height:8,background:"#1e293b",borderRadius:4,overflow:"hidden"}}><div style={{width:`${overallPct}%`,height:"100%",background:"linear-gradient(90deg,#f59e0b,#10b981)",borderRadius:4,transition:"width .7s"}}/></div>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#f59e0b"}}>{overallPct}%</span>
          </div>
        </div>
      </div>

      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"0 24px"}}>
        <div style={{maxWidth:1500,margin:"0 auto",display:"flex",gap:2,overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.id} className="hov" onClick={()=>setTab(t.id)} style={{padding:"13px 18px",background:tab===t.id?"#1e293b":"transparent",color:tab===t.id?"#f59e0b":"#64748b",border:"none",borderBottom:tab===t.id?"2px solid #f59e0b":"2px solid transparent",cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",fontWeight:700,letterSpacing:".04em"}}>
              {t.icon} {t.label}
              {t.id==="issues"&&openIssues>0&&<span style={{background:"#ef4444",borderRadius:10,padding:"1px 6px",fontSize:10,color:"#fff"}}>{openIssues}</span>}
              {t.id==="accounting"&&totalOverdue>0&&<span style={{background:"#7f1d1d",borderRadius:10,padding:"1px 6px",fontSize:10,color:"#fca5a5"}}>!</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1500,margin:"0 auto",padding:24}}>

        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            <G4 cols="repeat(6,1fr)">
              <KCard l="Overall Progress" v={`${overallPct}%`} s={`${completedTasks}/${tasks.length} done`} color="linear-gradient(90deg,#f59e0b,#fbbf24)" bar={overallPct}/>
              <KCard l="Contract Value" v={ksh(contractValue)} s="Fixed Price" color="#3b82f6"/>
              <KCard l="Budget Used" v={`${budgetPct}%`} s={ksh(totalSpent)+" spent"} color={budgetPct>90?"#ef4444":"#10b981"} bar={budgetPct}/>
              <KCard l="Outstanding" v={ksh(totalOutstanding)} s="pending invoices" color="#8b5cf6"/>
              <KCard l="Cash Position" v={ksh(cashFlow)} s="paid minus expenses" color={cashFlow>=0?"#10b981":"#ef4444"}/>
              <KCard l="Open Issues" v={openIssues} s={`${criticalIssues} critical`} color={criticalIssues>0?"#ef4444":"#06b6d4"}/>
            </G4>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:20}}>
              <div style={CS}>
                <ST>Phase Progress Breakdown</ST>
                {phaseProgress.map(({phase,progress,count,completed})=>(
                  <div key={phase} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{phase} <span style={{fontSize:11,color:"#475569"}}>{completed}/{count}</span></span>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:progress===100?"#10b981":progress>0?"#f59e0b":"#475569"}}>{progress}%</span>
                    </div>
                    <PBar pct={progress} color={progress===100?"linear-gradient(90deg,#10b981,#34d399)":progress>0?"linear-gradient(90deg,#f59e0b,#fbbf24)":"#334155"}/>
                  </div>
                ))}
              </div>
              <div style={CS}>
                <ST>Status Distribution</ST>
                {STATUS_OPTIONS.map(s=>{const c=tasks.filter(t=>t.status===s).length;return(
                  <div key={s} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:SC[s]}}/><span style={{fontSize:11,color:"#94a3b8"}}>{s}</span></div><span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{c}</span></div>
                    <PBar pct={Math.round(c/tasks.length*100)} color={SC[s]} h={5}/>
                  </div>
                );})}
              </div>
              <div style={CS}>
                <ST>Accounting Snapshot (KSh)</ST>
                {[{l:"Total Invoiced",v:ksh(totalInvoiced),c:"#e2e8f0"},{l:"Total Paid",v:ksh(totalPaid),c:"#10b981"},{l:"Outstanding",v:ksh(totalOutstanding),c:"#f59e0b"},{l:"Overdue",v:ksh(totalOverdue),c:"#ef4444"},{l:"Total Expenses",v:ksh(totalExpenses),c:"#94a3b8"},{l:"VAT Collected",v:ksh(totalVAT),c:"#8b5cf6"},{l:"Retention Held",v:ksh(totalRetention),c:"#06b6d4"}].map(row=>(
                  <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #1e293b",fontSize:12}}>
                    <span style={{color:"#64748b"}}>{row.l}</span><span style={{fontWeight:700,color:row.c}}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={CS}>
                <ST>Live Activity Feed</ST>
                {logs.slice(0,5).map(log=>(
                  <div key={log.id} style={{display:"flex",gap:12,marginBottom:14,paddingBottom:14,borderBottom:"1px solid #1e293b"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:log.type==="Milestone"?"#10b981":log.type==="Issue"?"#ef4444":log.type==="Alert"?"#f59e0b":"#3b82f6",marginTop:4,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{fontSize:12,color:"#e2e8f0"}}>{log.message}</div><div style={{fontSize:11,color:"#475569",marginTop:3}}>{log.task} · {log.author} · {log.date}</div></div>
                    <Bdg text={log.type} color={log.type==="Milestone"?"#34d399":log.type==="Issue"?"#fca5a5":log.type==="Alert"?"#fcd34d":"#60a5fa"}/>
                  </div>
                ))}
                <button className="btn bo" onClick={()=>setTab("activity")} style={{width:"100%",marginTop:4}}>VIEW ALL ACTIVITY →</button>
              </div>
              <div style={CS}>
                <ST>Budget vs Actual by Phase</ST>
                {PHASES.map(phase=>{const pt=tasks.filter(t=>t.phase===phase);const sp=pt.reduce((s,t)=>s+t.cost,0);const bud=pt.reduce((s,t)=>s+t.budgeted,0);if(!bud)return null;const over=sp>bud;return(<div key={phase} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}><span style={{color:"#94a3b8"}}>{phase}</span><span style={{color:over?"#ef4444":"#64748b"}}>{ksh(sp)} / {ksh(bud)}</span></div><PBar pct={Math.min(Math.round(sp/bud*100),100)} color={over?"linear-gradient(90deg,#ef4444,#f87171)":"linear-gradient(90deg,#3b82f6,#60a5fa)"} h={7}/></div>);})}
              </div>
            </div>
            {totalOverdue>0&&(<div style={{...CS,borderColor:"#7f1d1d",background:"#160a0a"}}><div style={{fontSize:12,fontWeight:700,color:"#fca5a5",letterSpacing:".08em",marginBottom:12}}>⚠ OVERDUE INVOICES — IMMEDIATE ACTION REQUIRED</div><div style={{display:"flex",flexWrap:"wrap",gap:10}}>{invoices.filter(i=>i.status==="Overdue").map(inv=>(<div key={inv.id} style={{background:"#1c0505",border:"1px solid #7f1d1d",borderRadius:8,padding:"10px 14px"}}><div style={{fontSize:13,fontWeight:700,color:"#fca5a5"}}>{inv.id} — {inv.vendor}</div><div style={{fontSize:12,color:"#ef4444",marginTop:2}}>{kshFull(inv.total)} · Due {inv.dueDate}</div></div>))}</div></div>)}
          </div>
        )}

        {tab==="tasks"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                {[["Phase",fPhase,setFPhase,["All",...PHASES]],["Trade",fTrade,setFTrade,["All",...TRADES]],["Status",fStatus,setFStatus,["All",...STATUS_OPTIONS]]].map(([l,v,s,opts])=>(<select key={l} value={v} onChange={e=>s(e.target.value)} style={{...IS,width:"auto",minWidth:130}}>{opts.map(o=><option key={o}>{o}</option>)}</select>))}
                <span style={{fontSize:11,color:"#475569"}}>{filteredTasks.length} tasks</span>
              </div>
              <button className="btn by" onClick={()=>setModal("task")}>+ ADD TASK</button>
            </div>
            <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}>
              <table>
                <thead><tr>{["TASK","PHASE","TRADE","STATUS","PRIORITY","PROGRESS","DATES","ASSIGNEE","BUDGET (KSH)",""].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>{filteredTasks.map(task=>(
                  <>
                    <tr key={task.id} className="trow" onClick={()=>setExpandedTask(expandedTask===task.id?null:task.id)} style={{background:expandedTask===task.id?"#1a2540":"transparent"}}>
                      <td style={{color:"#e2e8f0",fontWeight:600,maxWidth:200}}>{task.name}</td>
                      <td style={{color:"#94a3b8"}}>{task.phase}</td><td style={{color:"#94a3b8"}}>{task.trade}</td>
                      <td><Bdg text={task.status} color={SC[task.status]}/></td>
                      <td><Bdg text={task.priority} color={PC[task.priority]}/></td>
                      <td style={{minWidth:130}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:"#0f172a",borderRadius:3,overflow:"hidden"}}><div style={{width:`${task.progress}%`,height:"100%",background:task.progress===100?"#10b981":task.status==="Delayed"?"#ef4444":"#f59e0b",borderRadius:3}}/></div><span style={{color:"#e2e8f0",fontWeight:700,minWidth:32}}>{task.progress}%</span></div></td>
                      <td style={{fontSize:11,color:"#475569",lineHeight:1.6}}>{task.startDate}<br/>{task.endDate}</td>
                      <td style={{color:"#94a3b8"}}>{task.assignee}</td>
                      <td><div style={{fontSize:11,color:task.cost>task.budgeted?"#ef4444":"#10b981",fontWeight:700}}>{ksh(task.cost)}</div><div style={{fontSize:11,color:"#475569"}}>/ {ksh(task.budgeted)}</div></td>
                      <td><button className="btn bo" onClick={e=>{e.stopPropagation();setEditingTask({...task});setModal("editTask");}} style={{fontSize:11,padding:"4px 10px"}}>EDIT</button></td>
                    </tr>
                    {expandedTask===task.id&&(<tr key={`exp-${task.id}`} style={{background:"#111827"}}><td colSpan={10} style={{padding:"14px 20px"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16}}><div><span style={LS}>Notes</span><p style={{fontSize:12,color:"#94a3b8"}}>{task.notes||"—"}</p></div><div><span style={LS}>Cost Variance</span><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:task.cost>task.budgeted?"#ef4444":"#10b981"}}>{task.cost>task.budgeted?"+":""}{ksh(task.cost-task.budgeted)}</p></div><div><span style={LS}>Spend Rate</span><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#f59e0b"}}>{task.budgeted?Math.round(task.cost/task.budgeted*100):0}%</p></div><div><span style={LS}>Health</span><p style={{fontSize:12,color:"#94a3b8"}}>{task.status==="Completed"?"✅ Complete":task.status==="Delayed"?"🔴 At risk":task.progress>60?"🟡 On track":"🔵 Early stage"}</p></div></div></td></tr>)}
                  </>
                ))}</tbody>
              </table>
            </div></div>
          </div>
        )}

        {tab==="phases"&&(
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {PHASES.map((phase,pi)=>{
              const pt=tasks.filter(t=>t.phase===phase);const avg=pt.length?Math.round(pt.reduce((s,t)=>s+t.progress,0)/pt.length):0;const sp=pt.reduce((s,t)=>s+t.cost,0);const bud=pt.reduce((s,t)=>s+t.budgeted,0);const active=pt.some(t=>t.status==="In Progress");
              return(<div key={phase} style={{...CS,borderColor:active?"#f59e0b44":"#334155"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:10,background:avg===100?"#064e3b":active?"#78350f":"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`1px solid ${avg===100?"#10b981":active?"#f59e0b":"#334155"}`}}>{["🪨","🏗","⚡","🎨","🔑"][pi]}</div>
                    <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#fff"}}>PHASE {pi+1}: {phase.toUpperCase()}</div><div style={{fontSize:11,color:"#475569"}}>{pt.filter(t=>t.status==="Completed").length}/{pt.length} tasks · {active?"🟡 ACTIVE":avg===100?"🟢 COMPLETE":"⚪ PENDING"}</div></div>
                  </div>
                  <div style={{display:"flex",gap:24,alignItems:"center"}}><div><div style={{fontSize:10,color:"#475569"}}>SPENT / BUDGET</div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{ksh(sp)} / {ksh(bud)}</div></div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:800,color:avg===100?"#10b981":avg>0?"#f59e0b":"#475569",lineHeight:1}}>{avg}%</div></div>
                </div>
                <PBar pct={avg} color={avg===100?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#f59e0b,#fbbf24)"} h={8}/>
                <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:14}}>{pt.map(task=>(<div key={task.id} style={{flex:"1 1 260px",background:"#0f172a",border:`1px solid ${SC[task.status]}44`,borderRadius:8,padding:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#e2e8f0",fontWeight:600,flex:1}}>{task.name}</span><span style={{fontSize:11,color:SC[task.status],marginLeft:8}}>{task.progress}%</span></div><PBar pct={task.progress} color={SC[task.status]} h={4}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#475569",marginTop:6}}><span>{task.assignee}</span><span style={{color:SC[task.status]}}>{task.status}</span></div></div>))}</div>
              </div>);
            })}
          </div>
        )}

        {tab==="accounting"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{display:"flex",gap:0,borderBottom:"1px solid #334155",flexWrap:"wrap"}}>
              {[["overview","📊 Overview"],["invoices","🧾 Invoices"],["expenses","💳 Expenses"],["payments","💸 Payments"],["retention","🔐 Retention"],["vat","📋 VAT Ledger"]].map(([id,label])=>(<button key={id} className={`atab${accTab===id?" on":""}`} onClick={()=>setAccTab(id)}>{label}</button>))}
            </div>

            {accTab==="overview"&&(<div style={{display:"flex",flexDirection:"column",gap:20}}>
              <G4><KCard l="Contract Value" v={ksh(contractValue)} s="Fixed Price" color="#f59e0b"/><KCard l="Total Invoiced" v={ksh(totalInvoiced)} s={`${invoices.length} invoices`} color="#3b82f6"/><KCard l="Total Paid" v={ksh(totalPaid)} s={`${payments.length} payments`} color="#10b981"/><KCard l="Outstanding" v={ksh(totalOutstanding)} s="pending payment" color="#8b5cf6"/><KCard l="Total Expenses" v={ksh(totalExpenses)} s={`${expenses.length} entries`} color="#94a3b8"/><KCard l="Approved Expenses" v={ksh(approvedExpenses)} s="verified" color="#10b981"/><KCard l="Pending Approval" v={ksh(pendingExpenses)} s="needs review" color="#f59e0b"/><KCard l="Cash Position" v={ksh(cashFlow)} s="paid minus expenses" color={cashFlow>=0?"#10b981":"#ef4444"}/></G4>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <div style={CS}><ST>P&L Summary — Project to Date</ST>{[{l:"Contract Revenue (invoiced)",v:totalInvoiced,c:"#3b82f6"},{l:"Less: VAT Output (16%)",v:-totalVAT,c:"#8b5cf6"},{l:"Net Revenue",v:totalInvoiced-totalVAT,c:"#e2e8f0",bold:true},{l:"Less: Direct Expenses",v:-approvedExpenses,c:"#ef4444"},{l:"Less: Retention Held",v:-totalRetention,c:"#f59e0b"},{l:"Gross Operating Margin",v:totalInvoiced-totalVAT-approvedExpenses-totalRetention,c:totalInvoiced-totalVAT-approvedExpenses-totalRetention>=0?"#10b981":"#ef4444",bold:true}].map(row=>(<div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #1e293b",fontSize:12}}><span style={{color:row.bold?"#e2e8f0":"#64748b",fontWeight:row.bold?700:400}}>{row.l}</span><span style={{color:row.c,fontWeight:700}}>{kshFull(row.v)}</span></div>))}</div>
                <div style={CS}><ST>Expense Breakdown by Category</ST>{EXPENSE_CATS.map(cat=>{const total=expenses.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0);if(!total)return null;return(<div key={cat} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}><span style={{color:"#94a3b8"}}>{cat}</span><span style={{color:"#e2e8f0",fontWeight:700}}>{ksh(total)}</span></div><PBar pct={Math.round(total/totalExpenses*100)} color="#3b82f6" h={5}/></div>);})}</div>
              </div>
            </div>)}

            {accTab==="invoices"&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{[["All",invoices.length],["Paid",invoices.filter(i=>i.status==="Paid").length],["Outstanding",invoices.filter(i=>["Sent","Approved"].includes(i.status)).length],["Overdue",invoices.filter(i=>i.status==="Overdue").length]].map(([l,c])=>(<div key={l} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:7,padding:"7px 14px",fontSize:12}}><span style={{color:"#64748b"}}>{l}: </span><span style={{color:"#f59e0b",fontWeight:700}}>{c}</span></div>))}</div>
                <button className="btn by" onClick={()=>setModal("invoice")}>+ NEW INVOICE</button>
              </div>
              <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table><thead><tr>{["INV #","VENDOR","PHASE","DESCRIPTION","NET (KSH)","VAT 16%","GROSS TOTAL","STATUS","DUE DATE","PAID DATE","METHOD","RETENTION"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{invoices.map(inv=>(<tr key={inv.id} className="trow"><td style={{color:"#f59e0b",fontWeight:700}}>{inv.id}</td><td style={{color:"#e2e8f0"}}>{inv.vendor}</td><td style={{color:"#94a3b8"}}>{inv.phase}</td><td style={{color:"#94a3b8",maxWidth:180}}>{inv.description}</td><td style={{color:"#e2e8f0",fontWeight:600}}>{kshFull(inv.amount)}</td><td style={{color:"#8b5cf6"}}>{kshFull(inv.vat)}</td><td style={{color:"#fff",fontWeight:700}}>{kshFull(inv.total)}</td><td><Bdg text={inv.status} color={IC[inv.status]}/></td><td style={{color:inv.status==="Overdue"?"#ef4444":"#94a3b8"}}>{inv.dueDate}</td><td style={{color:"#10b981"}}>{inv.paidDate||"—"}</td><td style={{color:"#64748b",fontSize:11}}>{inv.method||"—"}</td><td style={{color:"#06b6d4"}}>{ksh(inv.retentionAmt)} ({inv.retentionPct}%)</td></tr>))}</tbody></table></div></div>
            </div>)}

            {accTab==="expenses"&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div style={{fontSize:12,color:"#64748b"}}>Total: <span style={{color:"#f59e0b",fontWeight:700}}>{kshFull(totalExpenses)}</span> · Approved: <span style={{color:"#10b981",fontWeight:700}}>{kshFull(approvedExpenses)}</span> · Pending: <span style={{color:"#f59e0b",fontWeight:700}}>{kshFull(pendingExpenses)}</span></div>
                <button className="btn by" onClick={()=>setModal("expense")}>+ RECORD EXPENSE</button>
              </div>
              <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table><thead><tr>{["EXP #","DESCRIPTION","CATEGORY","VENDOR","PHASE","AMOUNT (KSH)","DATE","RECEIPT","APPROVED",""].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{expenses.map(exp=>(<tr key={exp.id} className="trow"><td style={{color:"#f59e0b",fontWeight:700}}>{exp.id}</td><td style={{color:"#e2e8f0"}}>{exp.description}</td><td><Bdg text={exp.category} color="#3b82f6"/></td><td style={{color:"#94a3b8"}}>{exp.vendor}</td><td style={{color:"#94a3b8"}}>{exp.phase}</td><td style={{color:"#fff",fontWeight:700}}>{kshFull(exp.amount)}</td><td style={{color:"#64748b"}}>{exp.date}</td><td style={{color:"#475569",fontSize:11}}>{exp.receipt||"—"}</td><td>{exp.approved?<Bdg text="✓ Approved" color="#10b981"/>:<Bdg text="⏳ Pending" color="#f59e0b"/>}</td><td>{!exp.approved&&<button className="btn bg" onClick={()=>{setExpenses(p=>p.map(e=>e.id===exp.id?{...e,approved:true}:e));notify("Expense approved");}} style={{fontSize:11,padding:"4px 10px"}}>APPROVE</button>}</td></tr>))}</tbody></table></div></div>
            </div>)}

            {accTab==="payments"&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:12,color:"#64748b"}}>Total Disbursed: <span style={{color:"#10b981",fontWeight:700}}>{kshFull(totalPmtMade)}</span></div><button className="btn by" onClick={()=>setModal("payment")}>+ RECORD PAYMENT</button></div>
              <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table><thead><tr>{["PMT #","INVOICE REF","VENDOR","AMOUNT (KSH)","METHOD","DATE","REFERENCE","NOTES"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{payments.map(pmt=>(<tr key={pmt.id} className="trow"><td style={{color:"#10b981",fontWeight:700}}>{pmt.id}</td><td style={{color:"#f59e0b"}}>{pmt.invoice}</td><td style={{color:"#e2e8f0"}}>{pmt.vendor}</td><td style={{color:"#fff",fontWeight:700}}>{kshFull(pmt.amount)}</td><td><Bdg text={pmt.method} color="#3b82f6"/></td><td style={{color:"#94a3b8"}}>{pmt.date}</td><td style={{color:"#475569",fontSize:11}}>{pmt.ref||"—"}</td><td style={{color:"#64748b"}}>{pmt.notes}</td></tr>))}</tbody></table></div></div>
            </div>)}

            {accTab==="retention"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
              <G4 cols="repeat(3,1fr)"><KCard l="Total Retention Held" v={kshFull(totalRetention)} s="5% per contract" color="#06b6d4"/><KCard l="Contracts with Retention" v={invoices.filter(i=>i.retentionAmt>0).length} s="active clauses" color="#f59e0b"/><KCard l="DLP Release Due" v="On Completion" s="12 months after PC" color="#8b5cf6"/></G4>
              <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table><thead><tr>{["INVOICE","VENDOR","CONTRACT VALUE","RETENTION %","RETENTION AMT (KSH)","INV STATUS","RELEASE STATUS"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{invoices.filter(i=>i.retentionAmt>0).map(inv=>(<tr key={inv.id} className="trow"><td style={{color:"#f59e0b",fontWeight:700}}>{inv.id}</td><td style={{color:"#e2e8f0"}}>{inv.vendor}</td><td style={{color:"#e2e8f0"}}>{kshFull(inv.amount)}</td><td style={{color:"#06b6d4",fontWeight:700}}>{inv.retentionPct}%</td><td style={{color:"#06b6d4",fontWeight:700}}>{kshFull(inv.retentionAmt)}</td><td><Bdg text={inv.status} color={IC[inv.status]}/></td><td><Bdg text={inv.status==="Paid"?"Under DLP":"Not Yet Due"} color={inv.status==="Paid"?"#f59e0b":"#64748b"}/></td></tr>))}</tbody></table></div></div>
              <div style={CS}><ST>Retention Policy Note</ST><p style={{fontSize:13,color:"#64748b",lineHeight:1.7}}>Retention monies are held at <strong style={{color:"#06b6d4"}}>5%</strong> per NCA standard conditions. Half (2.5%) released on Practical Completion; remainder after <strong style={{color:"#f59e0b"}}>12-month DLP</strong>. All figures exclude VAT.</p></div>
            </div>)}

            {accTab==="vat"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
              <G4><KCard l="VAT Rate (Kenya)" v="16%" s="Standard Rate" color="#f59e0b"/><KCard l="VAT on All Invoices" v={kshFull(totalVAT)} s="output tax" color="#8b5cf6"/><KCard l="VAT on Paid Invoices" v={kshFull(invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.vat,0))} s="settled" color="#10b981"/><KCard l="VAT on Outstanding" v={kshFull(invoices.filter(i=>["Sent","Approved","Overdue"].includes(i.status)).reduce((s,i)=>s+i.vat,0))} s="pending" color="#ef4444"/></G4>
              <div style={{...CS,padding:0,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table><thead><tr>{["INVOICE","VENDOR","NET AMOUNT (KSH)","VAT @ 16%","GROSS TOTAL","STATUS","TAX PERIOD"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{invoices.map(inv=>(<tr key={inv.id} className="trow"><td style={{color:"#f59e0b",fontWeight:700}}>{inv.id}</td><td style={{color:"#e2e8f0"}}>{inv.vendor}</td><td style={{color:"#94a3b8"}}>{kshFull(inv.amount)}</td><td style={{color:"#8b5cf6",fontWeight:700}}>{kshFull(inv.vat)}</td><td style={{color:"#fff",fontWeight:700}}>{kshFull(inv.total)}</td><td><Bdg text={inv.status} color={IC[inv.status]}/></td><td style={{color:"#64748b",fontSize:11}}>{inv.issueDate?inv.issueDate.slice(0,7):"—"}</td></tr>))}<tr style={{background:"#0f172a",borderTop:"2px solid #334155"}}><td colSpan={2} style={{color:"#94a3b8",fontWeight:700,padding:"12px 14px"}}>TOTALS</td><td style={{color:"#94a3b8",fontWeight:700}}>{kshFull(invoices.reduce((s,i)=>s+i.amount,0))}</td><td style={{color:"#8b5cf6",fontWeight:800}}>{kshFull(totalVAT)}</td><td style={{color:"#fff",fontWeight:800}}>{kshFull(totalInvoiced)}</td><td colSpan={2}/></tr></tbody></table></div></div>
            </div>)}
          </div>
        )}

        {tab==="reports"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
              <div style={CS}><ST>Trade Performance Matrix</ST>{TRADES.map(trade=>{const tt=tasks.filter(t=>t.trade===trade);if(!tt.length)return null;const avg=Math.round(tt.reduce((s,t)=>s+t.progress,0)/tt.length);const sp=tt.reduce((s,t)=>s+t.cost,0);const bud=tt.reduce((s,t)=>s+t.budgeted,0);const ov=sp>bud;return(<div key={trade} style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,padding:"10px 0",borderBottom:"1px solid #1e293b"}}><div style={{width:90,fontSize:12,color:"#94a3b8",fontWeight:700}}>{trade}</div><div style={{flex:1,height:8,background:"#0f172a",borderRadius:4,overflow:"hidden"}}><div style={{width:`${avg}%`,height:"100%",background:avg===100?"#10b981":"#3b82f6",borderRadius:4}}/></div><div style={{width:46,textAlign:"right",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{avg}%</div><div style={{width:200,fontSize:11,color:"#64748b",textAlign:"right"}}>{ksh(sp)} / {ksh(bud)}</div><div style={{width:90,textAlign:"right",fontSize:12,fontWeight:700,color:ov?"#ef4444":"#10b981"}}>{ov?"+":""}{ksh(sp-bud)}</div></div>);})}</div>
              <div style={CS}><ST>Schedule Health</ST>{[["On Schedule",tasks.filter(t=>!["Delayed","On Hold"].includes(t.status)).length,"#10b981"],["Delayed",tasks.filter(t=>t.status==="Delayed").length,"#ef4444"],["On Hold",tasks.filter(t=>t.status==="On Hold").length,"#f59e0b"],["Not Started",tasks.filter(t=>t.status==="Not Started").length,"#475569"]].map(([l,c,col])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:`${col}11`,border:`1px solid ${col}33`,borderRadius:8,marginBottom:8}}><span style={{fontSize:12,color:"#94a3b8"}}>{l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:col}}>{c}</span></div>))}</div>
            </div>
            <div style={CS}><ST>Full Project Summary Report</ST><G4>{[{l:"Contract Value",v:ksh(contractValue),s:"Fixed Price"},{l:"Total Tasks",v:tasks.length,s:`${completedTasks} completed`},{l:"Overall Progress",v:`${overallPct}%`,s:"All phases"},{l:"Budget Consumed",v:`${budgetPct}%`,s:ksh(totalSpent)},{l:"Phases Complete",v:phaseProgress.filter(p=>p.progress===100).length,s:`of ${PHASES.length}`},{l:"Total Invoiced",v:ksh(totalInvoiced),s:`${invoices.length} invoices`},{l:"Total Paid",v:ksh(totalPaid),s:`${payments.length} payments`},{l:"Cash Flow",v:ksh(cashFlow),s:"net position"},{l:"Active Issues",v:openIssues,s:`${criticalIssues} critical`},{l:"Total Expenses",v:ksh(totalExpenses),s:`${expenses.length} entries`},{l:"VAT Liability",v:ksh(totalVAT),s:"@16% on invoices"},{l:"Retention Held",v:ksh(totalRetention),s:"5% standard"}].map(s=>(<div key={s.l} style={{background:"#0f172a",borderRadius:8,padding:"14px 16px"}}><div style={{fontSize:10,color:"#475569",letterSpacing:".08em",textTransform:"uppercase"}}>{s.l}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginTop:4}}>{s.v}</div><div style={{fontSize:11,color:"#475569"}}>{s.s}</div></div>))}</G4></div>
          </div>
        )}

        {tab==="issues"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{[["All",issues.length],["Open",issues.filter(i=>i.status==="Open").length],["Critical",issues.filter(i=>i.severity==="Critical").length],["Closed",issues.filter(i=>i.status==="Closed").length]].map(([l,c])=>(<div key={l} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:7,padding:"7px 14px",fontSize:12}}><span style={{color:"#64748b"}}>{l}: </span><span style={{color:"#f59e0b",fontWeight:700}}>{c}</span></div>))}</div>
              <button className="btn br" onClick={()=>setModal("issue")}>+ LOG ISSUE</button>
            </div>
            {issues.map(issue=>(<div key={issue.id} style={{...CS,borderColor:issue.severity==="Critical"&&issue.status!=="Closed"?"#ef444444":"#334155"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{issue.title}</span><Bdg text={issue.severity} color={PC[issue.severity]}/></div><p style={{fontSize:12,color:"#64748b",marginBottom:10}}>{issue.description}</p><div style={{display:"flex",gap:20,fontSize:11,color:"#475569",flexWrap:"wrap"}}><span>📋 {issue.phase}</span><span>👤 {issue.assignee}</span><span>📅 {issue.date}</span></div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}><Bdg text={issue.status} color={issue.status==="Closed"?"#10b981":issue.status==="Open"?"#ef4444":"#f59e0b"}/>{issue.status!=="Closed"&&<button className="btn bg" onClick={()=>{setIssues(p=>p.map(i=>i.id===issue.id?{...i,status:"Closed"}:i));notify("Issue closed");}} style={{fontSize:11,padding:"4px 10px"}}>CLOSE ✓</button>}</div></div></div>))}
          </div>
        )}

        {tab==="activity"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#64748b"}}>{logs.length} records</span><button className="btn by" onClick={()=>setModal("log")}>+ LOG ACTIVITY</button></div>
            <div style={CS}>{logs.map((log,i)=>(<div key={log.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:i<logs.length-1?"1px solid #1e293b":"none"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{width:11,height:11,borderRadius:"50%",background:log.type==="Milestone"?"#10b981":log.type==="Issue"?"#ef4444":log.type==="Alert"?"#f59e0b":"#3b82f6",flexShrink:0}}/>{i<logs.length-1&&<div style={{width:1,flex:1,background:"#1e293b"}}/>}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:4}}><div style={{display:"flex",gap:10,alignItems:"center"}}><Bdg text={log.type} color={log.type==="Milestone"?"#34d399":log.type==="Issue"?"#fca5a5":log.type==="Alert"?"#fcd34d":"#60a5fa"}/><span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{log.task}</span></div><span style={{fontSize:11,color:"#475569"}}>{log.date} · {log.time}</span></div><p style={{fontSize:12,color:"#94a3b8"}}>{log.message}</p><div style={{fontSize:11,color:"#475569",marginTop:3}}>By {log.author}</div></div></div>))}</div>
          </div>
        )}
      </div>

      {modal==="task"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginBottom:20}}>ADD NEW TASK</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={{gridColumn:"span 2"}}><label style={LS}>Task Name</label><input style={IS} value={newTask.name} onChange={e=>setNewTask(p=>({...p,name:e.target.value}))} placeholder="e.g. Waterproofing — Basement Slab"/></div>{[["Phase","phase",PHASES],["Trade","trade",TRADES],["Status","status",STATUS_OPTIONS],["Priority","priority",PRIORITY]].map(([l,k,opts])=>(<div key={k}><label style={LS}>{l}</label><select style={IS} value={newTask[k]} onChange={e=>setNewTask(p=>({...p,[k]:e.target.value}))}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>))}<div style={{gridColumn:"span 2"}}><label style={LS}>Progress: {newTask.progress}%</label><input type="range" min={0} max={100} value={newTask.progress} onChange={e=>setNewTask(p=>({...p,progress:e.target.value}))}/></div><div><label style={LS}>Assignee</label><input style={IS} value={newTask.assignee} onChange={e=>setNewTask(p=>({...p,assignee:e.target.value}))}/></div><div/><div><label style={LS}>Start Date</label><input type="date" style={IS} value={newTask.startDate} onChange={e=>setNewTask(p=>({...p,startDate:e.target.value}))}/></div><div><label style={LS}>End Date</label><input type="date" style={IS} value={newTask.endDate} onChange={e=>setNewTask(p=>({...p,endDate:e.target.value}))}/></div><div><label style={LS}>Budgeted (KSh)</label><input type="number" style={IS} value={newTask.budgeted} onChange={e=>setNewTask(p=>({...p,budgeted:e.target.value}))}/></div><div><label style={LS}>Spent (KSh)</label><input type="number" style={IS} value={newTask.cost} onChange={e=>setNewTask(p=>({...p,cost:e.target.value}))}/></div><div style={{gridColumn:"span 2"}}><label style={LS}>Notes</label><textarea style={{...IS,height:70,resize:"none"}} value={newTask.notes} onChange={e=>setNewTask(p=>({...p,notes:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn by" onClick={saveTask} disabled={!newTask.name}>ADD TASK</button></div></div></div>}

      {modal==="editTask"&&editingTask&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginBottom:6}}>EDIT TASK</div><div style={{fontSize:12,color:"#64748b",marginBottom:20}}>{editingTask.name}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["Status","status",STATUS_OPTIONS],["Priority","priority",PRIORITY]].map(([l,k,opts])=>(<div key={k}><label style={LS}>{l}</label><select style={IS} value={editingTask[k]} onChange={e=>setEditingTask(p=>({...p,[k]:e.target.value}))}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>))}<div style={{gridColumn:"span 2"}}><label style={LS}>Progress: {editingTask.progress}%</label><input type="range" min={0} max={100} value={editingTask.progress} onChange={e=>setEditingTask(p=>({...p,progress:Number(e.target.value)}))}/></div><div><label style={LS}>Spent (KSh)</label><input type="number" style={IS} value={editingTask.cost} onChange={e=>setEditingTask(p=>({...p,cost:e.target.value}))}/></div><div><label style={LS}>Budgeted (KSh)</label><input type="number" style={IS} value={editingTask.budgeted} onChange={e=>setEditingTask(p=>({...p,budgeted:e.target.value}))}/></div><div style={{gridColumn:"span 2"}}><label style={LS}>Notes</label><textarea style={{...IS,height:80,resize:"none"}} value={editingTask.notes} onChange={e=>setEditingTask(p=>({...p,notes:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn by" onClick={updateTask}>SAVE & PUSH LIVE</button></div></div></div>}

      {modal==="invoice"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginBottom:20}}>CREATE INVOICE</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={{gridColumn:"span 2"}}><label style={LS}>Vendor / Contractor</label><input style={IS} value={newInv.vendor} onChange={e=>setNewInv(p=>({...p,vendor:e.target.value}))}/></div><div style={{gridColumn:"span 2"}}><label style={LS}>Description</label><input style={IS} value={newInv.description} onChange={e=>setNewInv(p=>({...p,description:e.target.value}))}/></div>{[["Phase","phase",PHASES],["Trade","trade",TRADES],["Status","status",INVOICE_STATUS],["Payment Method","method",PAYMENT_METHODS]].map(([l,k,opts])=>(<div key={k}><label style={LS}>{l}</label><select style={IS} value={newInv[k]} onChange={e=>setNewInv(p=>({...p,[k]:e.target.value}))}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>))}<div><label style={LS}>Net Amount (KSh)</label><input type="number" style={IS} value={newInv.amount} onChange={e=>{const a=Number(e.target.value);const v=Math.round(a*VAT_RATE);setNewInv(p=>({...p,amount:a,vat:v,total:a+v}));}}/></div><div><label style={LS}>VAT @ 16% (auto)</label><input type="number" style={{...IS,opacity:.6}} value={newInv.vat} readOnly/></div><div><label style={LS}>Gross Total (auto)</label><input type="number" style={{...IS,opacity:.6}} value={newInv.total} readOnly/></div><div><label style={LS}>Retention %</label><input type="number" style={IS} value={newInv.retentionPct} onChange={e=>{const r=Number(e.target.value);setNewInv(p=>({...p,retentionPct:r,retentionAmt:Math.round(Number(p.amount)*r/100)}));}}/></div><div><label style={LS}>Issue Date</label><input type="date" style={IS} value={newInv.issueDate} onChange={e=>setNewInv(p=>({...p,issueDate:e.target.value}))}/></div><div><label style={LS}>Due Date</label><input type="date" style={IS} value={newInv.dueDate} onChange={e=>setNewInv(p=>({...p,dueDate:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn by" onClick={saveInv} disabled={!newInv.vendor}>CREATE INVOICE</button></div></div></div>}

      {modal==="expense"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginBottom:20}}>RECORD EXPENSE</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={{gridColumn:"span 2"}}><label style={LS}>Description</label><input style={IS} value={newExp.description} onChange={e=>setNewExp(p=>({...p,description:e.target.value}))}/></div><div><label style={LS}>Category</label><select style={IS} value={newExp.category} onChange={e=>setNewExp(p=>({...p,category:e.target.value}))}>{EXPENSE_CATS.map(o=><option key={o}>{o}</option>)}</select></div><div><label style={LS}>Phase</label><select style={IS} value={newExp.phase} onChange={e=>setNewExp(p=>({...p,phase:e.target.value}))}>{PHASES.map(o=><option key={o}>{o}</option>)}</select></div><div><label style={LS}>Vendor / Supplier</label><input style={IS} value={newExp.vendor} onChange={e=>setNewExp(p=>({...p,vendor:e.target.value}))}/></div><div><label style={LS}>Amount (KSh)</label><input type="number" style={IS} value={newExp.amount} onChange={e=>setNewExp(p=>({...p,amount:e.target.value}))}/></div><div><label style={LS}>Date</label><input type="date" style={IS} value={newExp.date} onChange={e=>setNewExp(p=>({...p,date:e.target.value}))}/></div><div><label style={LS}>Receipt Ref</label><input style={IS} value={newExp.receipt} onChange={e=>setNewExp(p=>({...p,receipt:e.target.value}))} placeholder="e.g. RCP-011"/></div><div style={{gridColumn:"span 2",display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="approv" checked={newExp.approved} onChange={e=>setNewExp(p=>({...p,approved:e.target.checked}))} style={{width:16,height:16,accentColor:"#10b981"}}/><label htmlFor="approv" style={{fontSize:13,color:"#94a3b8",cursor:"pointer"}}>Mark as Approved</label></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn by" onClick={saveExp} disabled={!newExp.description}>RECORD</button></div></div></div>}

      {modal==="payment"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#10b981",marginBottom:20}}>RECORD PAYMENT</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Invoice</label><select style={IS} value={newPmt.invoice} onChange={e=>{const inv=invoices.find(i=>i.id===e.target.value);setNewPmt(p=>({...p,invoice:e.target.value,vendor:inv?.vendor||"",amount:inv?.total||0}));}}><option value="">-- Select Invoice --</option>{invoices.filter(i=>i.status!=="Paid").map(i=><option key={i.id} value={i.id}>{i.id} — {i.vendor}</option>)}</select></div><div><label style={LS}>Vendor</label><input style={IS} value={newPmt.vendor} onChange={e=>setNewPmt(p=>({...p,vendor:e.target.value}))}/></div><div><label style={LS}>Amount (KSh)</label><input type="number" style={IS} value={newPmt.amount} onChange={e=>setNewPmt(p=>({...p,amount:e.target.value}))}/></div><div><label style={LS}>Payment Method</label><select style={IS} value={newPmt.method} onChange={e=>setNewPmt(p=>({...p,method:e.target.value}))}>{PAYMENT_METHODS.map(o=><option key={o}>{o}</option>)}</select></div><div><label style={LS}>Payment Date</label><input type="date" style={IS} value={newPmt.date} onChange={e=>setNewPmt(p=>({...p,date:e.target.value}))}/></div><div><label style={LS}>Transaction Ref</label><input style={IS} value={newPmt.ref} onChange={e=>setNewPmt(p=>({...p,ref:e.target.value}))} placeholder="e.g. RTGS/2026/007"/></div><div style={{gridColumn:"span 2"}}><label style={LS}>Notes</label><textarea style={{...IS,height:60,resize:"none"}} value={newPmt.notes} onChange={e=>setNewPmt(p=>({...p,notes:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn bg" onClick={savePmt} disabled={!newPmt.invoice||!newPmt.amount}>CONFIRM PAYMENT</button></div></div></div>}

      {modal==="log"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#f59e0b",marginBottom:20}}>LOG ACTIVITY</div><div style={{display:"flex",flexDirection:"column",gap:12}}><div><label style={LS}>Type</label><select style={IS} value={newLog.type} onChange={e=>setNewLog(p=>({...p,type:e.target.value}))}>{["Update","Issue","Milestone","Alert"].map(o=><option key={o}>{o}</option>)}</select></div><div><label style={LS}>Related Task</label><select style={IS} value={newLog.task} onChange={e=>setNewLog(p=>({...p,task:e.target.value}))}><option value="">-- Select --</option>{tasks.map(t=><option key={t.id}>{t.name}</option>)}</select></div><div><label style={LS}>Message</label><textarea style={{...IS,height:90,resize:"none"}} value={newLog.message} onChange={e=>setNewLog(p=>({...p,message:e.target.value}))} placeholder="Describe the update..."/></div><div><label style={LS}>Author</label><input style={IS} value={newLog.author} onChange={e=>setNewLog(p=>({...p,author:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn by" onClick={saveLog} disabled={!newLog.message||!newLog.author}>LOG</button></div></div></div>}

      {modal==="issue"&&<div className="modal" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#ef4444",marginBottom:20}}>LOG ISSUE</div><div style={{display:"flex",flexDirection:"column",gap:12}}><div><label style={LS}>Issue Title</label><input style={IS} value={newIssue.title} onChange={e=>setNewIssue(p=>({...p,title:e.target.value}))}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Severity</label><select style={IS} value={newIssue.severity} onChange={e=>setNewIssue(p=>({...p,severity:e.target.value}))}>{PRIORITY.map(o=><option key={o}>{o}</option>)}</select></div><div><label style={LS}>Phase</label><select style={IS} value={newIssue.phase} onChange={e=>setNewIssue(p=>({...p,phase:e.target.value}))}>{PHASES.map(o=><option key={o}>{o}</option>)}</select></div></div><div><label style={LS}>Assignee</label><input style={IS} value={newIssue.assignee} onChange={e=>setNewIssue(p=>({...p,assignee:e.target.value}))}/></div><div><label style={LS}>Description</label><textarea style={{...IS,height:90,resize:"none"}} value={newIssue.description} onChange={e=>setNewIssue(p=>({...p,description:e.target.value}))}/></div></div><div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}><button className="btn bo" onClick={()=>setModal(null)}>CANCEL</button><button className="btn br" onClick={saveIssue} disabled={!newIssue.title}>LOG ISSUE</button></div></div></div>}
    </div>
  );
}
```

---

## Folder structure on GitHub should look like this:
```
your-repo/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    └── App.jsx
