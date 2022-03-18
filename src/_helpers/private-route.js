import { React } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, props, subdomain, ...rest }) => {

    let user = JSON.parse(localStorage.getItem('user'));

    let loggedIn = (user) ? true : false;

    return (
        <Route {...rest} render={props => (
            loggedIn ?
                <Component {...props} />
                : <Redirect to={`/${subdomain.brand}/login`} />
        )
        } />
    );
};

export default PrivateRoute;