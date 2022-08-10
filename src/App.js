import React, { Component } from 'react';
import { connect } from 'react-redux';

import { history } from './_helpers';

import { Router, Route, Switch } from 'react-router-dom';

import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import NotFound from './Components/NotFound';
import Home from './Components/Member/Home';
import Deposit from './Components/Member/Deposit';
import Withdraw from './Components/Member/Withdraw';
import Promotion from './Components/Member/Promotion';
import History from './Components/Member/History';
import Invite from './Components/Member/Invite';
import Profile from './Components/Member/Profile';
import SpinWheel from './Components/Member/SpinWheel';

import PrivateRoute from './_helpers/private-route';
import Brand from './Components/Brand';
import { NotificationContainer } from 'react-notifications';

import './App.css';
import 'react-notifications/lib/notifications.css';
import RegisterSuccess from './Components/Auth/RegisterSuccess';
import LoginService from './Components/Auth/LoginService';
import Slot from './Components/Member/Slot';

class App extends Component {



    render() {

        console.log(window.location.hostname);

        return (
            <Router history={history}>
                <div>

                    <NotificationContainer />
                    <Switch>
                        <Route exact path="/" component={NotFound}></Route>
                        <Route
                            path="/:brand"
                            render={(data) => (
                                <Route>
                                    <Route path={``} subdomain={data.match.params} component={Brand} exact />
                                    <Route path={`/:brand/login`} component={Login} exact />
                                    <Route path={`/:brand/register`} component={Register} exact />
                                    <Route path={`/:brand/register/invite/:invite_id`} component={Register} exact />
                                    <Route path={`/:brand/login/service`} component={LoginService} exact />
                                    <PrivateRoute path={`/:brand/register/success`} subdomain={data.match.params} component={RegisterSuccess} exact />
                                    <PrivateRoute path={`/:brand/member`} subdomain={data.match.params} component={Home} exact />
                                    <PrivateRoute path={`/:brand/member/deposit`} subdomain={data.match.params} component={Deposit} exact />
                                    <PrivateRoute path={`/:brand/member/withdraw`} subdomain={data.match.params} component={Withdraw} exact />
                                    <PrivateRoute path={`/:brand/member/history`} subdomain={data.match.params} component={History} exact />
                                    <PrivateRoute path={`/:brand/member/invite`} subdomain={data.match.params} component={Invite} exact />
                                    <PrivateRoute path={`/:brand/member/profile`} subdomain={data.match.params} component={Profile} exact />
                                    <PrivateRoute path={`/:brand/member/promotion`} subdomain={data.match.params} component={Promotion} exact />
                                    <PrivateRoute path={`/:brand/member/spinwheel`} subdomain={data.match.params} component={SpinWheel} exact />
                                    <PrivateRoute path={`/:brand/member/slot/:type_game`} subdomain={data.match.params} component={Slot} exact />
                                </Route>
                            )}
                        />
                        <Route component={NotFound} />
                    </Switch>
                </div >
            </Router >
        );
    }
}

function mapStateToProps(state) {
    return {
        alert: state.alert
    };
}


export default connect(mapStateToProps)(App);
