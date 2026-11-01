# Browser Demo — हिंदी में शुरू करें

## चलाने का तरीका

1. ZIP Extract करें।
2. Extract किए हुए folder में Command Prompt खोलें (जहाँ `package.json` है)।
3. ये commands चलाएँ:

```bash
npm install
npm start
```

4. Browser में `http://localhost:3000` खोलें।

## NISS Super Admin Login

- Email: `admin@niss.local`
- Password: `Niss@1234`

Login page पर **Quick enter as Super Admin** भी दबा सकते हैं।

## स्कूल बनाने का तरीका

1. Super Admin से login करें।
2. **School workspaces → Create school workspace** खोलें।
3. School name, Principal name, email और बाकी जानकारी भरें।
4. Save करने के बाद School ID, email और temporary password मिलेगा।
5. Logout करके Principal के email या School ID से login करें।
6. Principal अपने स्कूल में Students, Teachers, Parents, Classes, Fees, Attendance और Timetable manage कर सकता है।
7. Teacher, Parent और Student जोड़ते समय उनका email जरूर भरें। Login credentials स्क्रीन पर मिलेंगे।

## जरूरी बातें

- यह React project है, Vite नहीं।
- अभी Firebase की जरूरत नहीं है। डेटा इसी browser के Local Storage में सेव होता है।
- हर स्कूल के records अलग Local Storage key में रखे जाते हैं।
- Browser का site data/cache clear करने पर demo data मिट सकता है।
- Local Storage demo के लिए है; असली बच्चों का निजी डेटा या live commercial use के लिए सुरक्षित नहीं है। Production के लिए secure backend और proper authentication जरूरी होंगे।
