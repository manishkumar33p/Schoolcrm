const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const crypto = require('crypto');
initializeApp();
const auth=getAuth(), db=getFirestore();
const region='asia-south1';
const randomPassword=()=>`Niss@${crypto.randomBytes(5).toString('hex')}A1`;
const clean=s=>String(s||'').trim();
const requirePlatform=ctx=>{if(!ctx.auth||ctx.auth.token.platformAdmin!==true)throw new HttpsError('permission-denied','Only the NISS Platform Admin can perform this action.');};
const requireSchoolManager=(ctx,schoolId)=>{if(!ctx.auth)throw new HttpsError('unauthenticated','Please sign in.');const t=ctx.auth.token;if(t.schoolId!==schoolId||!['School Admin','Principal'].includes(t.role))throw new HttpsError('permission-denied','You are not allowed to create accounts for this school.');};
exports.createSchool=onCall({region},async request=>{
 requirePlatform(request);
 const d=request.data||{};const schoolName=clean(d.schoolName),ownerName=clean(d.ownerName),email=clean(d.email).toLowerCase();
 if(!schoolName||!ownerName||!email)throw new HttpsError('invalid-argument','School name, owner name and email are required.');
 const temporaryPassword=clean(d.temporaryPassword)||randomPassword();if(temporaryPassword.length<8)throw new HttpsError('invalid-argument','Temporary password must be at least 8 characters.');
 const code=`NISS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
 let user;
 try{user=await auth.createUser({email,displayName:ownerName,password:temporaryPassword,disabled:false})}catch(e){throw new HttpsError('already-exists',e.message||'This email is already registered.')}
 const schoolRef=db.collection('schools').doc();
 try{
  await schoolRef.set({schoolId:schoolRef.id,code,schoolName,ownerName,ownerEmail:email,phone:clean(d.phone),plan:clean(d.plan)||'Annual',amountReceived:Number(d.amountReceived||0),status:'Active',createdAt:FieldValue.serverTimestamp(),createdBy:request.auth.uid});
  await db.collection('users').doc(user.uid).set({uid:user.uid,name:ownerName,email,phone:clean(d.phone),role:'School Admin',schoolId:schoolRef.id,schoolName,active:true,mustChangePassword:true,createdAt:FieldValue.serverTimestamp()});
  await auth.setCustomUserClaims(user.uid,{role:'School Admin',schoolId:schoolRef.id});
  return {schoolId:schoolRef.id,code,schoolName,ownerEmail:email,temporaryPassword};
 }catch(e){await auth.deleteUser(user.uid).catch(()=>{});await schoolRef.delete().catch(()=>{});throw new HttpsError('internal','Could not finish creating school workspace: '+e.message)}
});
exports.createSchoolUser=onCall({region},async request=>{
 const d=request.data||{},schoolId=clean(d.schoolId),role=clean(d.role),name=clean(d.name),email=clean(d.email).toLowerCase();
 requireSchoolManager(request,schoolId);
 if(!['Principal','Teacher','Parent','Student'].includes(role))throw new HttpsError('invalid-argument','Unsupported account role.');
 if(!name||!email)throw new HttpsError('invalid-argument','Name and email are required.');
 const temporaryPassword=clean(d.temporaryPassword)||randomPassword();if(temporaryPassword.length<8)throw new HttpsError('invalid-argument','Temporary password must be at least 8 characters.');
 const schoolSnap=await db.collection('schools').doc(schoolId).get();if(!schoolSnap.exists)throw new HttpsError('not-found','School workspace not found.');
 let user;try{user=await auth.createUser({email,displayName:name,password:temporaryPassword})}catch(e){throw new HttpsError('already-exists',e.message||'Email already exists.')}
 try{const schoolName=schoolSnap.data().schoolName;await db.collection('users').doc(user.uid).set({uid:user.uid,name,email,phone:clean(d.phone),role,schoolId,schoolName,active:true,mustChangePassword:true,createdAt:FieldValue.serverTimestamp()});await auth.setCustomUserClaims(user.uid,{role,schoolId});return{uid:user.uid,email,role,temporaryPassword};}
 catch(e){await auth.deleteUser(user.uid).catch(()=>{});throw new HttpsError('internal','Could not create user profile: '+e.message)}
});
exports.resolveSchoolCode=onCall({region},async request=>{
 const code=clean(request.data?.code).toUpperCase();if(!/^NISS-[A-Z0-9]{6}$/.test(code))throw new HttpsError('invalid-argument','Enter a valid School ID.');
 const snap=await db.collection('schools').where('code','==',code).limit(1).get();if(snap.empty)throw new HttpsError('not-found','School ID not found.');
 const school=snap.docs[0].data();return{ownerEmail:school.ownerEmail,schoolId:school.schoolId,schoolName:school.schoolName};
});
