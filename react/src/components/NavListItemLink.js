import React from 'react';
import { Link } from 'react-router-dom';

const NavListItemLink = (props) => {
  const isActive = this.context.router.route.location.pathname === this.props.to;
  const className = isActive ? props.activeClassName : '';
  // const isActive = this.context.router.isActive(this.props.to, true);
  // const className = isActive ? 'active' : '';

  return (
    <li className={className}>
      <Link to={props.to} />
    </li>
  );
};

// NavListItemLink.contextTypes = {
//   router: React.PropTypes.object,
// };

export default NavListItemLink;
