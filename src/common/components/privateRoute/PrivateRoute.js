//GLOBAL imports
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
//LOCAL imports
import { AuthService } from '../../../api/';

const defaultRedirectPath = '/horizonweb';
class PrivateRoute extends Component {
  render() {
    const { component, path, itemKey } = this.props;
    const hasPermission = AuthService.canAccess(itemKey);

    if (hasPermission) {
      return <Route path={path} component={component} />;
    } else {
      return <Redirect to={defaultRedirectPath} />;
    }
  }
}

export default PrivateRoute;