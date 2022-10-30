import axios from 'axios/';

var hostname = window.location.pathname;

class wheelService {

    async getServer() {

        const pathname = await window.location.pathname.substr(1).split('/');

        const subdomain = await pathname[0];

        const hostname = await window.location.hostname;

        if (hostname == 'appy.bet') {

            this.config_url = 'https://config.appy.bet/api';

            if (subdomain === 'pgslots') {
                this.api_url = 'https://ap1.appy.bet/api';
            } else if (subdomain === 'betflix168') {
                this.api_url = 'https://ap2.appy.bet/api';
            } else if (subdomain === 'bfauto88') {
                this.api_url = 'https://ap3.appy.bet/api';
            } else if (subdomain === 'bflm') {
                this.api_url = 'https://ap4.appy.bet/api';
            } else if (subdomain === 'bfasia') {
                this.api_url = 'https://ap5.appy.bet/api';
            } else if (subdomain === 'pg599') {
                this.api_url = 'https://ap6.appy.bet/api';
            } else {
                this.api_url = 'https://ap0.appy.bet/api';
            }

        } else if (hostname == 'localhost') {

            this.config_url = 'https://config.appy.bet/api';

            this.api_url = 'https://ap0.appy.bet/api';

        } else if (hostname == 'fast-x') {

            this.config_url = 'https://config.fast-x.app/api';

            this.api_url = 'https://bot.fast-x.app/api';

        }

    }

    async config(data) {
        await this.getServer();
        const result = await axios.post(this.api_url + '/wheel', {
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
        const result = await axios.post(this.api_url + '/wheel/store', {
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