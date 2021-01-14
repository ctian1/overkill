import React, { useState } from 'react';
import ValorantClientAPI from '../util/ValorantClientAPI';
import './Login.css';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('NA');
  // console.log(`rendering ${username} ${password} ${region}`);

  // const [set]

  async function handleSubmit() {
    console.log(await ValorantClientAPI.login(username, password, region));
  }

  return (
    <div className="login-container">
      <div className="field">
        <label htmlFor="inputUsername" className="label">
          Username
          <input type="text" className="input" onChange={(e) => setUsername(e.currentTarget.value)} id="inputUsername" />

        </label>
      </div>

      <div className="field">
        <label htmlFor="inputPassword" className="label">
          Password
          <input type="password" className="input" onChange={(e) => setPassword(e.currentTarget.value)} id="inputPassword" />
        </label>
      </div>

      <label htmlFor="inputRegion" className="label">
        Region
        <div className="select">
          <select id="inputRegion" onChange={(e) => setRegion(e.currentTarget.value)}>
            <option>NA</option>
            <option>EU</option>
            <option>AP</option>
            <option>KR</option>
          </select>
        </div>
      </label>

      <div className="control">
        <button type="submit" onClick={handleSubmit} className="button is-primary">Login</button>
      </div>
    </div>
  );
}

export default Login;
