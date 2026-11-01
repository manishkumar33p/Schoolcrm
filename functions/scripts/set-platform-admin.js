// Run locally with a Firebase Admin service-account JSON file. Never upload this key to GitHub.
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const uid = process.argv[2];
if (!uid) throw new Error('Usage: node functions/scripts/set-platform-admin.js FIREBASE_AUTH_UID');
admin.initializeApp({credential:admin.credential.cert(serviceAccount)});
(async()=>{await admin.auth().setCustomUserClaims(uid,{platformAdmin:true,role:'Platform Admin'});await admin.firestore().collection('users').doc(uid).set({uid,role:'Platform Admin',name:'NISS Platform Admin',schoolId:null,schoolName:'NISS Technology',active:true,mustChangePassword:false},{merge:true});console.log('Platform Admin access assigned to',uid);process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
