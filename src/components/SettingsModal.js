/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './SettingsModal.css';
import useTheme from '../util/useTheme';

function SettingsModal(props) {
  const { open, toggle } = props;
  const [theme, setTheme] = useTheme();

  const handleEsc = useCallback((event) => {
    if (event.keyCode === 27) {
      toggle();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEsc, false);

    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, []);

  return (
    <div className={open ? 'settings modal is-active' : 'settings modal'}>
      <div className="modal-background" onClick={toggle} />
      <div className="modal-content">
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Settings</p>
            <button type="button" onClick={toggle} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <div>
              <label htmlFor="inputTheme" className="label">
                Theme
                <div id="inputTheme" className="select">
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </label>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button type="button" onClick={toggle} className="button is-dark">Done</button>
          </footer>
        </div>
      </div>
    </div>
  );
}

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default SettingsModal;
