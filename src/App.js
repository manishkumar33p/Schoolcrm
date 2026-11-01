import React,{useEffect,useState} from 'react';
import {CheckCircle2,Database,ShieldCheck} from 'lucide-react';
import {DEMO_MODE,getCurrentSession,setCurrentSession} from './data/firestore';
import './styles.css';import Login from './login/login';import FirstLoginPassword from './login/FirstLoginPassword';
import Sidebar from './components/Sidebar';import Header from './components/Header';import Dashboard from './dashboard/dashboard';
import Students from './students/students';import Admissions from './admissions/admissions';import Attendance from './attendance/attendance';import Fees from './fees/fees';import Teachers from './teacher/teacher';import Parents from './parents/parents';import Classes from './classes/classes';import Timetable from './timetable/timetable';import Workspace from './workspace/workspace';import Reports from './reports/reports';import Settings from './settings/settings';import Tenants from './tenants/tenants';import RolePortal from './portals/RolePortal';
export default function App(){
 const [user,setUser]=useState(()=>getCurrentSession()),[ready]=useState(true),[page,setPage]=useState('Dashboard'),[open,setOpen]=useState(false),[toast,setToast]=useState('');
 useEffect(()=>{const fn=e=>{setToast(e.detail);window.setTimeout(()=>setToast(''),2600)};window.addEventListener('crm-toast',fn);return()=>window.removeEventListener('crm-toast',fn)},[]);
 const login=u=>{setCurrentSession(u);setUser(u);setPage(u.role==='Platform Admin'?'School workspaces':'Dashboard')};
 const completePassword=u=>{setCurrentSession(u);setUser(u)};
 const logout=()=>{setCurrentSession(null);setUser(null);setPage('Dashboard')};
 const go=p=>setPage(p);
 if(!ready)return <div className="login-screen"><div className="login-card">Loading workspace…</div></div>;
 if(!user)return <Login onLogin={login}/>;
 if(user.mustChangePassword)return <FirstLoginPassword user={user} onComplete={completePassword} onLogout={logout}/>;
 const role=user.role;let allowed=[];
 if(role==='Platform Admin')allowed=['Dashboard','School workspaces','Students','Admissions','Attendance','Fees','Teachers','Parents','Classes','Timetable','Workspace','Reports','Settings'];
 else if(role==='Teacher')allowed=['Dashboard','Attendance','Timetable','Workspace'];
 else if(role==='Parent'||role==='Student')allowed=['Dashboard','Workspace'];
 else if(role==='Principal')allowed=['Dashboard','Students','Admissions','Attendance','Fees','Teachers','Parents','Classes','Timetable','Workspace','Reports','Settings'];
 else allowed=['Dashboard','Students','Admissions','Attendance','Fees','Teachers','Parents','Classes','Timetable','Workspace','Reports','Settings'];
 const portal=['Teacher','Parent','Student'].includes(role);
 const pages={'School workspaces':<Tenants/>,'Dashboard':portal?<RolePortal user={user} role={role} go={go}/>:<Dashboard go={go}/>,Students:<Students/>,Admissions:<Admissions/>,Attendance:<Attendance/>,Fees:<Fees/>,Teachers:<Teachers/>,Parents:<Parents/>,Classes:<Classes/>,Timetable:<Timetable/>,Workspace:<Workspace/>,Reports:<Reports/>,Settings:<Settings/>};
 const pageTitle=allowed.includes(page)?page:allowed[0];
 return <div className="app-shell"><Sidebar page={pageTitle} go={go} user={user} logout={logout} open={open} setOpen={setOpen}/><main className="main-area"><Header page={pageTitle} user={user} onMenu={()=>setOpen(true)} notify={m=>{setToast(m);window.setTimeout(()=>setToast(''),2400)}}/>{DEMO_MODE&&<div className="demo-ribbon"><span><Database size={15}/> BROWSER LOCAL MODE</span><span><ShieldCheck size={14}/> School data is separated on this browser</span></div>}<div className="page-content">{pages[pageTitle]||pages[allowed[0]]}<footer>© 2026 NISS Technology · Multi-School Management System <span>All demo records stay in this browser</span></footer></div></main>{toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}</div>}</div>
}
