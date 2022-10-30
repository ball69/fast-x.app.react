import axios from 'axios';

class brandService {

    async getServer() {

        const pathname = await window.location.pathname.substr(1).split('/');

        const subdomain = await pathname[0];

        const hostname = await window.location.hostname;

        console.log(hostname);

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

            this.api_url = 'https://ap1.appy.bet/api';

        } else if (hostname == 'fast-x') {

            this.config_url = 'https://config.fast-x.app/api';

            this.api_url = 'https://bot.fast-x.app/api';

        }

    }

    async checkBrand(subdomain) {
        await this.getServer();
        const result = await axios
            .post(this.config_url + "/brand", {
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/url', {
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
        await this.getServer();
        const result = await axios
            .get(this.api_url + '/get/bank')
            .then((response) => {
                return response.data
            }, (error) => {
                return error
            });
        return result
    }
    async getBankAccount(brand_id) {
        await this.getServer();
        const result = await axios
            .get(this.api_url + '/get/bank-account/' + brand_id)
            .then((response) => {
                return response.data
            }, (error) => {
                return error
            });
        return result
    }
    async checkPhone(brand_id, telephone) {
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/check/phone', {
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/check/bank', {
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/get/promotion',
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
        await this.getServer();
        const result = await axios
            .get(this.api_url + '/game-list/' + user_id + '/' + type_game, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), } })
            .then((response) => {
                return response.data
            }, (error) => {
                return error
            });
        return result
    }
    async startGame(user_id, game) {
        await this.getServer();
        const result = await axios.post(this.api_url + '/start-game', {
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/credit',
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/promotion/update',
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/promotion/select',
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
        await this.getServer();
        const result = await axios
            .post(this.api_url + '/profile',
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
        await this.getServer();
        var result = '';
        await axios
            .post(
                this.api_url + '/withdraw',
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
        await this.getServer();
        var result = await axios.post(this.api_url + '/history', {
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
        await this.getServer();
        var result = await axios.post(this.api_url + '/invite', {
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
        await this.getServer();
        var result = await axios.post(this.api_url + '/invite/store', {
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

        await this.getServer();
        const result = await axios
            .post(this.api_url + '/promotion/credit-free',
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

    async getBrandInvitePromotion(brand_id) {

        await this.getServer();
        const result = await axios
            .get(this.api_url + '/brand/invite/' + brand_id, {
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

    async getCustomerInvite(customer_id) {

        await this.getServer();
        const result = await axios
            .get(this.api_url + '/brand/invite/customer/' + customer_id, {
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

    async getCustomerBonus(customer_id) {

        await this.getServer();
        const result = await axios
            .get(this.api_url + '/brand/invite/customer/bonus/' + customer_id, {
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

    async receiveCustomerBonus(customer_promotion_invite_id) {

        await this.getServer();
        const result = await axios
            .post(this.api_url + '/brand/invite/customer/bonus/', {
                customer_promotion_invite_id: customer_promotion_invite_id
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

export default new brandService();