import React from 'react';
import { withRouter } from 'react-router-dom';

export default function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {
    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.isLoggedIn) {
        const redirect = this.props.location.pathname + this.props.location.search;
        this.props.history.push(`/signin?redirect=${redirect}`);
      }
    }

    render() {
      return this.props.isLoggedIn
        ? <Component { ...this.props } />
        : null;
    }
  }

  return withRouter(AuthenticatedComponent);
}
