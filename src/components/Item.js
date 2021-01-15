import React from 'react';
import PropTypes from 'prop-types';
import './Item.css';
import ValorantAPI from '../util/ValorantAPI';

function Item(props) {
  const { id } = props;
  return (
    <div className="column item card">
      <div className="item card-image">
        <img className="skin-icon" src={`https://media.valorant-api.com/weaponskinlevels/${id}/displayicon.png`} alt="weapon skin" />
      </div>
      <div className="item card-content">
        <p className="item price">
          {ValorantAPI.prices[id]}
          {' VP'}
        </p>
        <p className="item title is-5">{ValorantAPI.names[id]}</p>
      </div>
    </div>
  );
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Item;
