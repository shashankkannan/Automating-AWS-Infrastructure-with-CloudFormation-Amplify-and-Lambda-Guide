// SignUp.js
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [user, setUser] = useState(null);

  async function handleSignUp(event) {
    event.preventDefault();
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log(user);
      setUser(user);
    } catch (error) {
      console.error('Error signing up: ', error);
      alert(error.message);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    try {
      await Auth.confirmSignUp(user.username, verificationCode);
      console.log('User confirmed!');
      alert('User confirmed!');
      // Optionally, redirect the user or update the UI
    } catch (error) {
      console.error('Error verifying user: ', error);
      alert(error.message);
    }
  }

  if (user) {
    return (
      <form onSubmit={handleVerify}>
        <input type="text" placeholder="Verification Code" onChange={(e) => setVerificationCode(e.target.value)} required />
        <button type="submit">Verify</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required minLength={8} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required type="email" />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
