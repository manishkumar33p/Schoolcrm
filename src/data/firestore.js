// Local-first data layer. All school records and demo accounts stay in this browser.
export const DEMO_MODE = true;
const USERS='niss_schoolcrm_users_v2', SCHOOLS='niss_schoolcrm_demo_schools', SESSION='niss_schoolcrm_session';
const safe=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const emit=()=>window.dispatchEvent(new CustomEvent('crm-data-changed'));
const makeId=p=>`${p}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
const initialAdmin={uid:'niss-platform-admin',name:'NISS Super Admin',email:'admin@niss.local',password:'Niss@1234',role:'Platform Admin',schoolId:'',schoolName:'NISS TECHNOLOGY',active:true,mustChangePassword:false};
const users=()=>{let list=safe(USERS,[]);if(!list.some(u=>u.uid===initialAdmin.uid)){list=[initialAdmin,...list];save(USERS,list)}return list};
export function getCurrentSession(){const uid=safe(SESSION,null)?.uid;return users().find(u=>u.uid===uid)||null}
export function setCurrentSession(user){if(user)save(SESSION,{uid:user.uid});else localStorage.removeItem(SESSION)}
export async function signInLocal(identity,password){const value=identity.trim().toLowerCase();let list=users();let user=list.find(u=>u.email?.toLowerCase()===value||u.username?.toLowerCase()===value);if(!user&&/^niss-/i.test(identity)){const school=safe(SCHOOLS,[]).find(s=>s.code.toLowerCase()===value);if(school)user=list.find(u=>u.uid===school.ownerUid)}if(!user||user.password!==password||user.active===false)throw new Error('Incorrect login ID or password, or account is inactive.');setCurrentSession(user);return user}
export async function listRecords(schoolId,collectionName){if(!schoolId)return[];return safe(`niss_schoolcrm_${schoolId}_${collectionName}`,[]).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))}
export async function addRecord(schoolId,collectionName,data){if(!schoolId)throw new Error('School workspace not selected.');const k=`niss_schoolcrm_${schoolId}_${collectionName}`,rows=safe(k,[]);const saved={...data,id:makeId(collectionName.slice(0,3).toUpperCase()),schoolId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};save(k,[saved,...rows]);emit();return saved}
export async function removeRecord(schoolId,collectionName,id){const k=`niss_schoolcrm_${schoolId}_${collectionName}`;save(k,safe(k,[]).filter(r=>r.id!==id));emit()}
export async function editRecord(schoolId,collectionName,id,data){const k=`niss_schoolcrm_${schoolId}_${collectionName}`;save(k,safe(k,[]).map(r=>r.id===id?{...r,...data,updatedAt:new Date().toISOString()}:r));emit()}
export async function createSchool(data){const schools=safe(SCHOOLS,[]);const id=makeId('SCH'),schoolId=`school-${id.toLowerCase()}`,code=`NISS-${id.slice(4)}`,uid=makeId('OWNER');const school={id,schoolId,code,schoolName:data.schoolName,ownerName:data.ownerName,ownerEmail:data.email.toLowerCase(),ownerUid:uid,phone:data.phone||'',plan:data.plan||'Annual',amountReceived:Number(data.amountReceived||0),status:'Active',createdAt:new Date().toISOString()};const password=data.temporaryPassword||`Niss@${Math.random().toString(36).slice(2,8)}A1`;save(SCHOOLS,[school,...schools]);save(USERS,[{uid,name:school.ownerName,email:school.ownerEmail,password,role:'Principal',schoolId,schoolName:school.schoolName,active:true,mustChangePassword:true},...users()]);return{...school,temporaryPassword:password}}
export async function createAccount(data){const list=users();if(list.some(u=>u.email?.toLowerCase()===data.email.toLowerCase()))throw new Error('This email already has an account.');const user={uid:makeId('USR'),name:data.name,email:data.email.toLowerCase(),password:data.temporaryPassword||`Niss@${Math.random().toString(36).slice(2,8)}A1`,role:data.role,schoolId:data.schoolId,schoolName:data.schoolName||getCurrentSession()?.schoolName||'',active:true,mustChangePassword:true};save(USERS,[user,...list]);return{uid:user.uid,temporaryPassword:user.password}}
export async function getProfile(uid){return users().find(u=>u.uid===uid)||getCurrentSession()}
export const findSchoolCode=async code=>safe(SCHOOLS,[]).find(s=>s.code.toLowerCase()===code.toLowerCase())||null;
export const getDemoProfile=()=>initialAdmin;
export const getSchoolUsers=schoolId=>users().filter(u=>u.schoolId===schoolId);
export const updateUser=(uid,changes)=>save(USERS,users().map(u=>u.uid===uid?{...u,...changes}:u));
