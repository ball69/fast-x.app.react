import React, { Component } from 'react';
import authService from '../../_services/auth.service';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';

export default class LoginService extends Component {

    constructor(props) {
        super(props);
        const brandCode = props.match.params.brand;
        const query = new URLSearchParams(props.location.search);
        const token = query.get('token');
        this.state = {
            brand: props.match.params.brand,
            loading: true,
            token: token,
        }
    }

    async componentDidMount() {
        const checkToken = await authService.check(this.state.token)
            .then((response) => {
                return response;
            }, (error) => {
                return error;
            });

        const { data } = checkToken;

        const LoginService = await authService.login(data.username, data.password_generate, data.telephone, data.brand_id, 0)
            .then((response) => {
                this.props.history.push(`/${this.state.brand}/member`)
            }, (error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                {
                    (this.state.loading)
                        ?
                        <Loading></Loading>
                        :
                        <h2>Login Service</h2>
                }
            </div>
        )
    }
}
