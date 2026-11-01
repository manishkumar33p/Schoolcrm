export const uid = (prefix = 'REC') => `${prefix}-${Date.now().toString(36).toUpperCase()}`;
export const money = value => '₹' + Number(value || 0).toLocaleString('en-IN');
export const classes = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];
export const sections = ['A', 'B', 'C', 'D'];
// Intentionally empty: each school's records are created by that school in Firestore.
export const defaults = {
  students: [], staff: [], fees: [], admissions: [], attendance: {}, parents: [],
  classes: [], timetable: [], notices: [], messages: [], expenses: [],
  settings: { schoolName: '', academicYear: '', address: '', phone: '' }
};
export const read = (key, fallback = []) => fallback;
export const write = (key, value) => value;
export const init = () => {};
