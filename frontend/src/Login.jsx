// frontend/src/Login.jsx
import React, {useState} from 'react';
export default function Login({onLoggedIn}){
  const [f,setF]=useState({email:'',password:''});
  const submit=async e=>{ e.preventDefault();
    const res=await fetch('http://localhost:4000/api/auth/login',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(f)
    });
    const d=await res.json();
    if(d.token){ localStorage.setItem('token', d.token); onLoggedIn?.(d.user) }
    else alert(d.msg||'Login failed');
  };
  return (<form onSubmit={submit}>
    <h3>Login</h3>
    <input placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
    <input type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
    <button>Login</button>
  </form>);
}
