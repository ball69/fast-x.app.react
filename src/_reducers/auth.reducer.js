let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : { loggedIn: false };

export function auth(state = initialState, action) {
    switch (action.type) {
        case 'USERS_LOGIN_SUCCESS':
            return {
                loggedIn: true,
                user: action.user
            }
        case 'USERS_REGISTER_SUCCESS':
            return {
                loggedIn: true,
                user: action.user
            }
        default:
            return state;
    }
}