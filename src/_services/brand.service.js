import axios from 'axios';

var hostname = window.location.pathname;

// console.log(hostname);

// console.log(hostname.indexOf('fast-x'));

// let API_URL = 'https://bot.fast-x.app/api/';

const API_URL = 'https://bot.fast-x.app/api/';

// const API_URL = 'http://bot.fast-x.localhost/api/';

// const API_URL = 'https://bot.casinoauto.app/api/';

// }o

class brandService {

    constructor() {
        this.token = localStorage.getItem('token');
    }

    async checkBrand(subdomain) {
        const result = await axios
            .post(API_URL + 'check/brand', {
                subdomain: subdomain
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            })
        return result;
    }
    async getUrl(customer_id) {
        const result = await axios
            .post(API_URL + 'url', {
                customer_id: customer_id
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            });

        return result;
    }
    async getBank() {
        const result = await axios
            .get(API_URL + 'get/bank')
            .then((response) => {
                return response.data
            }, (error) => {
                return error
            });
        return result
    }
    async checkPhone(brand_id, telephone) {
        const result = await axios
            .post(API_URL + 'check/phone', {
                brand_id: brand_id,
                telephone: telephone
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            })
        return result;
    }
    async checkBank(brand_id, bank_account) {
        const result = await axios
            .post(API_URL + 'check/bank', {
                brand_id: brand_id,
                bank_account: bank_account
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            });
        return result;
    }
    async getPromotion(customer_id) {
        const result = await axios
            .post(API_URL + 'get/promotion',
                {
                    customer_id: customer_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            });
        return result;
    }
    async getGameList(user_id, type_game) {
        const result = await axios
            .get(API_URL + 'game-list/' + user_id + '/' + type_game, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), } })
            .then((response) => {
                return response.data
            }, (error) => {
                return error
            });
        return result
    }
    async startGame(user_id, game) {
        const result = await axios.post(API_URL + 'start-game', {
            user_id: user_id,
            game_id: game.id,
            provider: game.provider,
        }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), } })
            .then((response) => {
                return response.data
            }, (error) => {
                return error;
            });
        return result
    }
    async credit(customer_id) {
        const result = await axios
            .post(API_URL + 'credit',
                {
                    customer_id: customer_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error;
            })
        return result;
    }
    async updatePromotion(customer_id, promotion_id) {
        const result = await axios
            .post(API_URL + 'promotion/update',
                {
                    customer_id: customer_id,
                    promotion_id: promotion_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }).then((response) => {
                    return response.data;
                }, (error) => {
                    return error;
                })
        return result;
    }
    async selectPromotion(customer_id, promotion_id) {
        const result = await axios
            .post(API_URL + 'promotion/select',
                {
                    customer_id: customer_id,
                    promotion_id: promotion_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }).then((response) => {
                    return response.data;
                }, (error) => {
                    return error;
                })
        return result;
    }
    async profile(customer_id) {
        const result = await axios
            .post(API_URL + 'profile',
                {
                    customer_id: customer_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }).then((response) => {
                    return response.data;
                }, (error) => {
                    return error;
                })
        return result;
    }
    async withdraw(customer_id, number) {
        var result = '';
        await axios
            .post(
                API_URL + 'withdraw',
                {
                    customer_id: customer_id,
                    amount: number,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            )
            .then((res) => {
                result = res;
            })
            .catch((err) => {
                result = '401';
            });
        return result;
    }
    async history(customer_id) {
        var result = await axios.post(API_URL + 'history', {
            customer_id: customer_id
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((result) => {
                return result
            })
            .catch((error) => {
                return error
            })
        return result;
    }
    async invite(customer_id) {
        var result = await axios.post(API_URL + 'invite', {
            customer_id: customer_id
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((result) => {
                return result;
            }, (error) => {
                return error;
            })
            .catch((error) => {
                return error;
            })

        return result;
    }
    async inviteStore(customer_id, promotion_id, amount) {
        var result = await axios.post(API_URL + 'invite/store', {
            customer_id: customer_id,
            promotion_id: promotion_id,
            amount: amount
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((result) => {
                return result;
            }, (error) => {
                return error;
            })
            .catch((error) => {
                return error;
            })

        return result;
    }

    async freeCredit(customer_id, code) {

        const result = await axios
            .post(API_URL + 'promotion/credit-free',
                {
                    customer_id: customer_id,
                    code: code
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }).then((response) => {
                    return response.data;
                }, (error) => {
                    return error;
                })
        return result;
    }

}

export default new brandService();