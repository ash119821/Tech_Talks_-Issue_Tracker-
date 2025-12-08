// frontend/src/App.js
import React, {useState} from 'react';
import Register from './Register';
import Login from './Login';

function App(){
  const [user,setUser] = useState(null);
  return (
    <div style={{padding:20}}>
      {!user ? <>
        <Login onLoggedIn={setUser} />
        <hr/>
        <Register />
      </> : <div>Welcome {user.name} ({user.email})</div>}
    </div>
  );
}
export default App;

