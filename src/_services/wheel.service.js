import axios from 'axios';

var hostname = window.location.pathname;

// console.log(hostname);

// console.log(hostname.indexOf('fast-x'));

// let API_URL = 'https://bot.fast-x.app/api/';

// if (hostname.indexOf('fast-x') > -1) {

const API_URL = 'https://bot.fast-x.app/api/';

// const API_URL = 'http://bot.fast-x.localhost/api/';

// const API_URL = 'https://bot.casinoauto.app/api/';

// }

class wheelService {

    async config(data) {
        const result = await axios.post(API_URL + 'wheel', {
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
        console.log(data);
        const result = await axios.post(API_URL + 'wheel/store', {
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