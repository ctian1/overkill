import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import './Login.css';

function Login(props) {
  const { setUser } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('NA');
  const [submitting, setSubmitting] = useState(false);
  // console.log(`rendering ${username} ${password} ${region}`);

  // const [set]

  async function handleSubmit() {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const user = await ValorantAPI.login(username, password, region);
    console.log('setting user', user);
    setUser(user);
    setSubmitting(false);
  }

  return (
    <div className="login-container">
      <div className="field">
        <label htmlFor="inputUsername" className="label">
          Username
          <input type="text" className="input" value={username} onChange={(e) => setUsername(e.currentTarget.value)} id="inputUsername" />

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

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
