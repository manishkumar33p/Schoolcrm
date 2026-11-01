import React, { useEffect, useState } from 'react';
import { Building2, Plus, Copy, CheckCircle2 } from 'lucide-react';
import './tenants.css';
import {createSchool} from '../data/firestore';

// This screen is deliberately browser-only. It does not import Firebase or call
// createSchool / Cloud Functions, so workspace creation cannot produce a CORS error.
const STORAGE_KEY = 'niss_schoolcrm_demo_schools';
const emptyForm = {
  schoolName: '', ownerName: '', email: '', phone: '',
  plan: 'Annual', amountReceived: '', temporaryPassword: ''
};
const readSchools = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
// const makeId = () => `${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export default function Tenants() {
  const [show, setShow] = useState(false);
  const [created, setCreated] = useState(null);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setSchools(readSchools());
  }, []);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const submit = async event => {
    event.preventDefault(); setError('');
    const schoolName=form.schoolName.trim(),ownerName=form.ownerName.trim(),email=form.email.trim().toLowerCase();
    const temporaryPassword=form.temporaryPassword.trim()||`Niss@${Math.random().toString(36).slice(2,8)}A1`;
    if(!schoolName||!ownerName||!email){setError('Please enter school name, owner name and email address.');return;}
    if(temporaryPassword.length<8){setError('Temporary password must contain at least 8 characters.');return;}
    try{const school=await createSchool({...form,schoolName,ownerName,email,temporaryPassword});const next=readSchools();setSchools(next);setCreated({...school,temporaryPassword});setForm(emptyForm);setShow(false);window.dispatchEvent(new CustomEvent('crm-toast',{detail:'School and owner login created in this browser.'}));}
    catch(err){setError(err.message||'Could not create school workspace.');}
  };

  const copy = async value => {
    try {
      await navigator.clipboard.writeText(value);
      window.dispatchEvent(new CustomEvent('crm-toast', { detail: 'Login details copied.' }));
    } catch {
      window.dispatchEvent(new CustomEvent('crm-toast', { detail: 'Clipboard permission was not available.' }));
    }
  };

  return (
    <div className="tenant-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">NISS TECHNOLOGY · PLATFORM CONTROL</div>
          <h1>School workspaces</h1>
          <p>Create schools and their Principal login accounts. Each school has a separate data space.</p>
        </div>
        <button className="btn-primary" onClick={() => { setCreated(null); setError(''); setShow(true); }}>
          <Plus size={16}/> Create school workspace
        </button>
      </div>

      <section className="panel tenant-list">
        <div className="panel-title">
          <div>
            <h3>Multi-school platform</h3>
            <p>Workspace details are saved only in this browser. No Firebase or cloud request is made.</p>
          </div>
        </div>
        {schools.length ? (
          <div className="table-scroll">
            <table>
              <thead><tr><th>SCHOOL</th><th>SCHOOL ID</th><th>OWNER</th><th>PLAN</th><th>PAYMENT</th><th>STATUS</th></tr></thead>
              <tbody>{schools.map(school => (
                <tr key={school.id}>
                  <td><b>{school.schoolName}</b><small className="subline">{school.ownerEmail}</small></td>
                  <td><b>{school.code}</b></td>
                  <td>{school.ownerName}</td>
                  <td>{school.plan}</td>
                  <td>₹{Number(school.amountReceived || 0).toLocaleString('en-IN')}</td>
                  <td><span className="pill active">{school.status || 'Active'}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="tenant-empty">
            <Building2 size={30}/><b>No school workspaces yet</b>
            <span>Create your first school workspace to begin. Nothing is pre-filled.</span>
          </div>
        )}
      </section>

      {created && (
        <section className="tenant-success">
          <div className="success-icon"><CheckCircle2/></div>
          <div>
            <h3>School workspace and Principal login created successfully</h3>
            <p>Share these login credentials with the Principal. The account is saved locally in this browser.</p>
            <div className="credential-grid">
              <label>School ID<strong>{created.code}</strong></label>
              <label>Login email<strong>{created.ownerEmail}</strong></label>
              <label>Temporary password<strong>{created.temporaryPassword}</strong></label>
            </div>
            <button className="btn-light" onClick={() => copy(`School ID: ${created.code}\nEmail: ${created.ownerEmail}\nTemporary password: ${created.temporaryPassword}`)}>
              <Copy size={14}/> Copy login details
            </button>
          </div>
        </section>
      )}

      {show && (
        <div className="overlay">
          <form className="dialog" onSubmit={submit}>
            <div className="dialog-head">
              <div><h3>Create school workspace</h3><p>Register school details and save them on this browser.</p></div>
              <button type="button" className="icon-btn" onClick={() => setShow(false)}>×</button>
            </div>
            <div className="form-grid">
              <label>School name<input required value={form.schoolName} onChange={e => update('schoolName', e.target.value)} placeholder="School name"/></label>
              <label>Owner / principal name<input required value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Full name"/></label>
              <label>Email address<input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="owner@school.com"/></label>
              <label>Phone number<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Mobile number"/></label>
              <label>Subscription plan<select value={form.plan} onChange={e => update('plan', e.target.value)}><option>Monthly</option><option>Quarterly</option><option>Annual</option><option>Lifetime</option></select></label>
              <label>Payment received (₹)<input type="number" min="0" value={form.amountReceived} onChange={e => update('amountReceived', e.target.value)} placeholder="0"/></label>
              <label className="wide">Temporary password<input type="text" minLength="8" value={form.temporaryPassword} onChange={e => update('temporaryPassword', e.target.value)} placeholder="Leave blank to generate automatically"/><small>At least 8 characters. For demo reference only; it is not saved.</small></label>
              {error && <div className="login-error wide">{error}</div>}
            </div>
            <div className="dialog-actions">
              <button type="button" className="btn-light" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn-primary">Save workspace in this browser</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
