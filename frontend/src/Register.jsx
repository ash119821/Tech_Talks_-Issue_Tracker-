// frontend/src/Register.jsx
import React, { useState } from 'react';

export default function Register() {
  const [f, setF] = useState({ username: '', email: '', password: '' });

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f)
    });
    const d = await res.json();
    alert(d.msg || JSON.stringify(d));
  };

  return (
    <form onSubmit={submit}>
      <h3>Register</h3>

      <input
        placeholder="Username"
        value={f.username}
        onChange={e => setF({ ...f, username: e.target.value })}
      />

      <input
        placeholder="Email"
        value={f.email}
        onChange={e => setF({ ...f, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={f.password}
        onChange={e => setF({ ...f, password: e.target.value })}
      />

      <button>Register</button>
    </form>
  );
}
