import axios from 'axios';

var hostname = window.location.pathname;

class wheelService {

    async getServer() {

        const pathname = await window.location.pathname.substr(1).split('/');

        const subdomain = await pathname[0];

        const hostname = await window.location.hostname;

        if (hostname == 'appy.bet') {

            this.config_url = 'https://config.appy.bet/api';

            if (subdomain === 'pg88') {
                this.api_url = 'https://ap0.appy.bet/api';
            } else if (subdomain === 'pgslots') {
                this.api_url = 'https://ap1.appy.bet/api';
            } else if (subdomain === 'ambme') {
                this.api_url = 'https://ap2.appy.bet/api';
            }

            // await axios
            //     .post('https://config.appy.bet/api/brand', {
            //         subdomain: subdomain
            //     })
            //     .then((response) => {
            //         this.api_url = 'https://' + response.data.data.server_subdomain + '.appy.bet/api';
            //         return response.data;
            //     }, (error) => {
            //         return error;
            //     });

        } else {

            this.api_url = 'https://bot.fast-x.app/api';

            this.config_url = 'https://config.fast-x.app/api';

        }

    }

    async config(data) {
        await this.getServer();
        const result = await axios.post(this.api_url + 'wheel', {
            customer_id: data
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }).then((response) => {
            return response.data;
        }, (error) => {
            return error;
        });
        return result;
    }

    async reward(data) {
        await this.getServer();
        const result = await axios.post(this.api_url + 'wheel/store', {
            customer_id: data.customer_id,
            wheel_slot_config_id: data.wheel_slot_config_id
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }).then((response) => {
            return response.data;
        }, (error) => {
            return error;
        });
        return result;
    }

}

export default new wheelService();