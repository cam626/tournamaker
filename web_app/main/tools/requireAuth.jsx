import React from 'react';
import { withRouter } from 'react-router-dom';

export default function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {
    constructor(props){
      super(props);
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.isLoggedIn) {
        const location = this.props.location;
        const redirect = location.pathname + location.search;
        this.props.history.push(`/signin?redirect=${redirect}`);
        //error message on sign in page
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
