// SignIn.js
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn(event) {
    event.preventDefault();
    try {
      const user = await Auth.signIn(username, password);
      console.log(user);
      // Optionally, redirect the user or update the UI
    } catch (error) {
      console.error('Error signing in: ', error);
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSignIn}>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
