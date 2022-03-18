import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Loading from '../Loading';

import InputMask from 'react-input-mask';
import { NotificationManager } from 'react-notifications';

import brandService from '../../_services/brand.service';
import authService from '../../_services/auth.service';


class Login extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            brand: '',
            loading: true,
            hiddenPassword: true,
            username: '',
            telephone: '',
            password: '',
            typeLogin: 1,
            btnLogin: false,

        }

        // value
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleTelephoneChange = this.handleTelephoneChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);

        // method
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);

        this.togglePassword = this.togglePassword.bind(this);

    }
    togglePassword() {
        this.setState({
            hiddenPassword: !this.state.hiddenPassword
        })
    }

    handlePasswordChange(e) { this.setState({ password: e.target.value }) }
    handleUsernameChange(e) {
        this.setState({
            username: e.target.value,
        });
    }
    handleTelephoneChange(e) { this.setState({ telephone: e.target.value }) }

    componentDidMount() {
        const { brand } = this.props.match.params;
        brandService.checkBrand(brand)
            .then(response => {
                // console.log(response);
                this.setState(() => {
                    return { brand: response.data };
                });
                this.setState({
                    loading: false,
                })
            }, (err) => {
                alert(err);
            });
        // console.log(this.state)
    }

    async handleSubmitLogin(e) {

        e.preventDefault();

        this.setState({
            btnLogin: true
        });

        const { username, password, telephone, brand, typeLogin } = this.state;


        await authService.login(username, password, telephone, brand.id, typeLogin)
            .then((response) => {
                if (!response.message) {
                    this.setState({
                        btnLogin: false
                    });
                    this.props.history.push(`/${this.brand}/member`);
                    return response
                } else {
                    NotificationManager.warning('ชื่อผู้ใชงานหรือรหัสผ่านไม่ถูกต้อง', 'ขออภัยค่ะ');
                    this.setState({
                        btnLogin: false
                    });
                }
            }, (error) => {
                console.log(error);
            }).catch(error => {
                this.setState({
                    btnLogin: false
                });
                return error
            });

    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                {
                    (loading)
                        ?
                        <Loading></Loading>
                        :
                        <div>
                            <div className="app-content content " >
                                <div className="content-wrapper">
                                    <div className="content-body">
                                        <div className="auth-wrapper auth-v1 px-2">
                                            <div className="auth-inner py-2">
                                                <form onSubmit={this.handleSubmitLogin}>
                                                    <div className="card card-auto-1">
                                                        <div className="card-body">
                                                            <img src={`${this.state.brand.logo_url}`} className="img-fluid img-center mb-5 pb-3" width="300" alt="" />
                                                            <div className="text-center mb-2">
                                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <button type="button" className={"btn btn-" + (this.state.typeLogin === 1 ? "auto" : "auto-secondary")}
                                                                        onClick={() => this.setState({ typeLogin: 1 })}>เบอร์โทรศัพท์</button>
                                                                    <button type="button" className={"btn btn-" + (this.state.typeLogin === 2 ? "auto" : "auto-secondary")}
                                                                        onClick={() => this.setState({ typeLogin: 2 })}>ไอดีเข้าเล่นเกมส์</button>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="clearfix"></div>
                                                            <span className="pull-right">&nbsp;
                                                                <a href={`https://line.me/R/ti/p/~@${this.state.brand.line_id}`}  > <i className="fab fa-line"></i> ติดต่อพนักงาน</a>&nbsp;</span>
                                                            {(this.state.typeLogin === 1)
                                                                ?
                                                                <div className="form-group">
                                                                    <p>เบอร์โทรศัพท์</p>
                                                                    <InputMask type="tel"
                                                                        value={this.state.telephone}
                                                                        onChange={this.handleTelephoneChange}
                                                                        mask="999-9999999"
                                                                        className="form-control form-control-lg form-auto"
                                                                        placeholder="เบอร์โทรศัพท์"
                                                                        required />

                                                                </div>

                                                                :
                                                                <div className="form-group">
                                                                    <p>ไอดีเกมส์</p>
                                                                    <input type="tet"
                                                                        defaultValue={this.state.username}
                                                                        onChange={this.handleUsernameChange}
                                                                        className="form-control form-control-lg form-auto"
                                                                        placeholder={`${this.state.brand.agent_prefix} ตามด้วยเบอร์โทรศัพท์ 6 ตัวท้าย`}
                                                                        required />

                                                                </div>
                                                            }
                                                            <div className="form-group">
                                                                <p>รหัสผ่าน</p>
                                                                <div className="input-group form-password-toggle mb-2">
                                                                    <input type={this.state.hiddenPassword ? 'password' : 'text'} value={this.state.password} onChange={this.handlePasswordChange} className="form-control form-control-lg form-auto" placeholder="รหัสผ่าน" minLength="6" required />
                                                                    <div className="input-group-append" onClick={this.togglePassword}>
                                                                        <span className="input-group-text cursor-pointer">
                                                                            <i className={this.state.hiddenPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="form-group">
                                                                <button className="btn btn-block btn-lg btn-auto" type="submit" disabled={this.state.btnLogin}>
                                                                    {this.state.btnLogin ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : ''}
                                                                    <span className="label">
                                                                        เข้าสู่ระบบ
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <p className="pull-right">ยังไม่เป็นสมาชิก ? <Link to={`/${this.brand}/register`}  >สมัครสมาชิก</Link>&nbsp;</p>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>

        );
    }
}

export default Login;

