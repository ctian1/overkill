import React, {
  useEffect, useState, useRef, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import Item from './Item';
import Loader from './Loader';
import './Store.css';

function Store(props) {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [, setBundle] = useState(null);
  const [items, setItems] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [storeUpdateMarker, updateStore] = useReducer((n) => n + 1, 0);
  const refreshTime = useRef(null);
  const timer = useRef(null);

  document.refreshTime = refreshTime;
  document.setLoading = setLoading;

  useEffect(() => {
    const key = `${user.region}#${user.username}`;

    function currentTime() {
      return new Date().getTime() / 1000;
    }

    function updateTimeLeft() {
      const newTimeLeft = refreshTime.current - currentTime();
      if (newTimeLeft <= 0) {
        clearInterval(timer.current);
        timer.current = null;
        setTimeout(updateStore, 500);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }

    function parseData(data) {
      setBundle({
        id: data.FeaturedBundle.Bundle.ID,
        items: data.FeaturedBundle.Items,
      });
      setItems(data.SkinsPanelLayout.SingleItemOffers);
      const secondsLeft = data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
      refreshTime.current = Math.floor(currentTime() + secondsLeft);

      updateTimeLeft();

      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }

      timer.current = setInterval(updateTimeLeft, 1000);
    }

    setLoading(true);
    setBundle(null);
    setItems(null);
    async function getShop() {
      const authHeaders = {
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlementsToken,
      };

      const res = await ValorantAPI.request(key, 'GET', ValorantAPI.url('storefront', user.region, user.userId), authHeaders);
      parseData(res.data);
      setLoading(false);
    }
    getShop();
    return () => {
      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, [user, storeUpdateMarker]);

  function parseTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  return (
    <div>
      { loading
        ? (
          <div className="store column item card">
            <div className="item card-content">
              <Loader className="is-centered" />
            </div>
          </div>
        )
        : (
          <div>
            <div className="store time-left">
              {parseTime(timeLeft)}
            </div>
            {/* <div><img src={`https://media.valorant-api.com/bundles/${bundle.id}/displayicon.png`} /></div> */}
            <div className="columns">
              {items.map((item) => <Item key={item} id={item} />)}
            </div>

          </div>
        )}
    </div>
  );
}

Store.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    idToken: PropTypes.string.isRequired,
    expiresIn: PropTypes.number.isRequired,
    entitlementsToken: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Store;
