# NISS Technology — Multi-School Management System (Browser Demo)

This is a React 18 + Create React App project. The current build runs in **Browser Local Storage** and does not require Firebase, a backend, or cloud credentials.

## Run on Windows / Mac

1. Install Node.js (LTS).
2. Extract this ZIP.
3. Open Command Prompt / Terminal inside the extracted project folder (the folder containing `package.json`).
4. Run:

```bash
npm install
npm start
```

5. Open `http://localhost:3000`.

## Super Admin demo login

- Email: `admin@niss.local`
- Password: `Niss@1234`

You can also use **Quick enter as Super Admin** on the login screen.

## Main workflow

1. Sign in as NISS Super Admin.
2. Open **School workspaces → Create school workspace**.
3. Create a school and share the displayed School ID, owner email and temporary password with its Principal.
4. Sign out. Sign in with the Principal's email (or School ID) and password.
5. From the school dashboard, add Students, Teachers & Staff, Parents, Classes, Admissions, Fees, Attendance and Timetable records.
6. When adding a Teacher, Parent or Student, enter their email. The system creates a local login and displays the temporary password.
7. Sign out and test the new role using its email and temporary password.

## Roles

- **NISS Platform Admin:** creates and views all school workspaces.
- **Principal:** manages records inside their school.
- **Teacher:** sees the assigned class/section in their portal and attendance screen.
- **Parent:** sees a linked child when the parent's email is added to the student's Parent email field, or when the Parent record is linked by matching student name.
- **Student:** sees their own student record when the account email matches the Student email.

## Data separation and storage

Each school's records are stored under a different Local Storage key containing that school's unique ID. The app filters school records using the signed-in profile. The Super Admin's school list is stored separately.

**Important limitations:** Local Storage is only a browser demo store. Data is available only in the same browser profile on the same device; clearing browser/site data can delete it. Local Storage is not secure authentication and is not suitable for real student records or commercial production. Passwords are stored locally for this demo. A production release needs a secure backend, real authentication, server-side role checks, backups and privacy controls.

## Browser data reset

Use the browser's site-data controls only if you intentionally want to erase this demo. There is no automatic cloud backup or sync.

## Project structure

- `src/dashboard` — school dashboard
- `src/tenants` — NISS school workspace management
- `src/students`, `src/admissions`, `src/attendance`, `src/fees` — school operations
- `src/teacher`, `src/parents`, `src/portals` — role portals and user records
- `src/classes`, `src/timetable`, `src/workspace`, `src/reports`, `src/settings` — academic and administration modules
- `src/data/firestore.js` — local browser data adapter (legacy filename retained to avoid breaking imports)

The existing React project structure and styling have been retained. Firebase setup files from the earlier project are retained as reference only; the app does not call Firebase.
