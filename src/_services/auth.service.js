import axios from 'axios';

class authService {

    async getServer() {

        const pathname = await window.location.pathname.substr(1).split('/');

        const subdomain = await pathname[0];

        const hostname = await window.location.hostname;

        if (hostname == 'appy.bet') {

            this.config_url = 'https://config.appy.bet/api';

            if (subdomain === 'pgslots') {
                this.api_url = 'https://ap1.appy.bet/api';
            } else if (subdomain === 'ambme') {
                this.api_url = 'https://ap2.appy.bet/api';
            } else {
                this.api_url = 'https://ap0.appy.bet/api';
            }

        } else if (hostname == 'localhost') {

            this.config_url = 'https://config.appy.bet/api';

            this.api_url = 'https://ap0.appy.bet/api';

        } else if (hostname == 'fast-x.app') {

            this.config_url = 'https://config.fast-x.app/api';

            this.api_url = 'https://bot.fast-x.app/api';

        }

    }

    async register(data, api_url) {

        await this.getServer();
        const result = await axios
            .post(this.api_url + '/auth/register', data)
            .then((response) => {
                return response;
            }, (error) => {
                return error;
            })
        return result;
    }
    async check(token, api_url) {
        await this.getServer();
        const result = await axios
            .post(
                this.api_url + "check",
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
    async login(username, password, telephone, brand_id, typeLogin, api_url) {
        await this.getServer();
        var result = await axios
            .post(this.api_url + "/auth/login", {
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