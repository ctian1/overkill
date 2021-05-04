import React, { useState } from 'react';
import PropTypes from 'prop-types';

function RiotIDText(props) {
  const { children: riotID, className } = props;

  const [showTagLine, setShowTagLine] = useState(false);

  return (
    <span
      onMouseEnter={() => setShowTagLine(true)}
      onMouseLeave={() => setShowTagLine(false)}
      className={className}
    >
      {showTagLine ? riotID : riotID.substring(0, riotID.indexOf('#'))}
    </span>
  );
}

RiotIDText.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

RiotIDText.defaultProps = {
  className: '',
};

export default RiotIDText;
