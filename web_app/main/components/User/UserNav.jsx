import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink, withRouter } from 'react-router-dom';

const UserNav = (props) => {
  return (
    <div>
      <Nav pills>
        <NavItem>
          <NavLink to='/user/dashboard' tag={RRNavLink}>Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to='/tournament/find' tag={RRNavLink}>Join a Tournament</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to='/tournament/create' tag={RRNavLink}>Create a Tournament</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to='/team/create' tag={RRNavLink}>Create a Team</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to='/user/displayname' tag={RRNavLink}>Update Your Display Name</NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}

export default withRouter(UserNav);