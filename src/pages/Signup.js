import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

export default ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, setUser } = useContext(UserContext);
  console.log('User: ', user);

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:1337/auth/local/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            email,
            password: password,
          }),
        }
      );
      const data = await response.json();

      console.log('Data: ', data);

      if (data.message) {
        setError(data.message[0].messages[0].message);
        return;
      }

      setUser(data);
    } catch (err) {
      console.log('Error: ', err.message);
      setError('Something went wrong', err);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={(e) => {
            setError('');
            setEmail(e.target.value);
          }}
        />
        <input
          type='password'
          value={password}
          onChange={(e) => {
            setError('');
            setPassword(e.target.value);
          }}
        />
        <button>Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};
