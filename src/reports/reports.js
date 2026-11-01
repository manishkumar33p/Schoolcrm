import React from 'react';
import ModulePage from '../components/ModulePage';
export default function Page(){return <ModulePage title='Reports & Analytics' subtitle='Exportable summaries for admissions, attendance, fees and operations.' storage='expenses' columns={[{key:'title',label:'REPORT / ITEM'},{key:'category',label:'CATEGORY'},{key:'amount',label:'AMOUNT'},{key:'date',label:'DATE'}]} fields={[{name:'title',label:'Report / expense title',type:'text'},{name:'category',label:'Category',type:'text'},{name:'amount',label:'Amount',type:'number'},{name:'date',label:'Date',type:'date'}]} />}
