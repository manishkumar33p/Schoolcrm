# NISS Technology CRM — Firebase Setup (Hindi)

## पहले Firebase Console में

1. `schoolcrm-856fa` प्रोजेक्ट खोलें।
2. Authentication → Sign-in method → Email/Password को Enable करें।
3. Firestore Database → Create database करें।
4. Cloud Functions deploy करने के लिए Firebase अगर billing/Blaze plan मांगे तो उसे enable करें।

## अपने कंप्यूटर पर

Project folder में terminal खोलें:

```bash
npm install
npm start
```

Firebase CLI install/login और backend deploy:

```bash
npm install -g firebase-tools
firebase login
firebase use schoolcrm-856fa
npm install --prefix functions
firebase deploy --only firestore:rules,functions
```

## सबसे पहला NISS Platform Admin बनाना जरूरी है

1. Firebase Console → Authentication → Users → Add user में अपना NISS owner email और मजबूत password बनाएं।
2. बने हुए user का UID copy करें।
3. Firebase Project Settings → Service Accounts से Admin SDK service-account JSON डाउनलोड करें। इसे किसी के साथ share न करें और GitHub पर upload न करें।
4. Windows PowerShell में:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\secure\service-account.json"
node functions/scripts/set-platform-admin.js AUTH_UID_HERE
```

`AUTH_UID_HERE` की जगह Authentication वाला UID डालें। अब ऐप में NISS owner email/password से login करें।

## स्कूल और सभी user accounts बनाना

- Platform Admin → School workspaces → Create school workspace.
- स्कूल का नाम, owner का नाम/email, फोन, plan और payment भरें। Temporary password खुद डाल सकते हैं या खाली छोड़ सकते हैं—सिस्टम बना देगा।
- स्क्रीन पर School ID (`NISS-XXXXXX`), email और temporary password आएगा। इन्हें स्कूल owner को सुरक्षित तरीके से दें।
- Owner School ID या email से login करेगा। पहली login पर नया password बनाना अनिवार्य है।
- School Admin → Students / Parents / Teachers में record बनाते समय email डालें। सिस्टम Firebase Authentication में उस role का login बनाएगा और temporary password दिखाएगा। Principal account Teachers section में Account role = Principal चुनकर बनाया जा सकता है।
- Teacher, Parent, Student और Principal सभी पहली login पर अपना नया password सेट करेंगे।

## डमी डेटा

इस build में पहले से भरे हुए students, parents, fees, staff, notices और Greenwood demo school हटा दिए गए हैं। नया स्कूल खाली dashboard से शुरू करेगा। जो रिकॉर्ड स्कूल बनाएगा वही उसके Firestore workspace में सेव होगा।

## जरूरी सुरक्षा

- किसी भी user का password Firestore में सेव नहीं होता; Firebase Authentication संभालता है।
- हर स्कूल का data `schools/{schoolId}/...` के अंदर अलग रहता है।
- Firestore rules और Cloud Functions deploy किए बिना account creation या secure database operations काम नहीं करेंगे।
- यह Firebase-integrated foundation है। Payment gateway, SMS/WhatsApp notifications, detailed exam/report-card workflows, payroll, transport/library modules और parent-child linking को live commercial use से पहले अलग से पूरा और test करना होगा।
