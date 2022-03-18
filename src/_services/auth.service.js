import axios from 'axios';

var hostname = window.location.pathname;

// console.log(hostname);

// console.log(hostname.indexOf('fast-x'));

// let API_URL = 'https://bot.fast-x.app/api/auth/';

// if (hostname.indexOf('fast-x') > -1) {

// const API_URL = 'https://bot.tbf.bet/api/';

const API_URL = 'https://bot.fast-x.app/api/';

// const API_URL = 'http://bot.fast-x.localhost/api/';

// const API_URL = 'https://bot.casinoauto.app/api/';

// }

class authService {
    async register(data) {
        const result = await axios
            .post(API_URL + 'auth/register', data)
            .then((response) => {
                return response;
            }, (error) => {
                return error;
            })
        return result;
    }
    async check(token) {
        const result = await axios
            .post(
                API_URL + "check",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });

        return result;
    }
    async login(username, password, telephone, brand_id, typeLogin) {
        var result = await axios
            .post(API_URL + "auth/login", {
                username: username,
                password: password,
                telephone: telephone,
                brand_id: brand_id,
                type_login: typeLogin
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                return response;
            })
            .catch((err) => {
                return err;
            });
        return result;
    }
}

export default new authService();