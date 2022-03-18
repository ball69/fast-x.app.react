import authService from '../_services/auth.service';
// import { alertActions } from './alert.action';
// import { history } from '../_helpers';

function login(username, password) {
    return dispatch => {
        authService.login(username, password)
        // .then(
        //     (response) => {
        //         dispatch({ type: 'USERS_LOGIN_SUCCESS', response });
        //         history.push('/');
        //     },
        //     error => {
        //         dispatch({ type: 'USERS_LOGIN_FAILURE', error });
        //         dispatch(alertActions.error(error));
        //     }
        // );
    };
}

function register(data) {
    return dispatch => {
        authService.register(data)
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
    }
}

function logout() {
    authService.logout();
    return { type: 'USERS_LOGOUT' };
}

export const authActions = {
    login,
    register,
    logout
};