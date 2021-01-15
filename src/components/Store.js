import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import Item from './Item';
import './Store.css';

function Store(props) {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [items, setItems] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const key = `${user.region}#${user.username}`;

    function subtractTime() {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current);
          timer.current = null;
        }
        return prev - 1;
      });
    }

    function parseData(data) {
      setBundle({
        id: data.FeaturedBundle.Bundle.ID,
        items: data.FeaturedBundle.Items,
      });
      setItems(data.SkinsPanelLayout.SingleItemOffers);
      setTimeLeft(data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);

      timer.current = setInterval(subtractTime, 1000);
    }

    async function getShop() {
      const authHeaders = {
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlementsToken,
      };

      const res = await ValorantAPI.request(key, 'GET', ValorantAPI.url('storefront', user.region, user.userId), authHeaders);
      console.log('loaded shop', res.data);
      parseData(res.data);
      setLoading(false);
    }
    getShop();
    return () => {
      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, []);

  function parseTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  return (
    <div>
      { loading ? <div>Loading</div>
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
