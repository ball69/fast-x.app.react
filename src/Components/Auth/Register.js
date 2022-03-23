import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import brandService from '../../_services/brand.service';
import InputMask from 'react-input-mask';
import Loading from '../Loading';

import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import authService from '../../_services/auth.service';

class Register extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            brand: '',
            banks: [],
            // register: {
            bran_id: '',
            invite_id: 0,
            telephone: '',
            bank_id: '',
            bank_account: '',
            fname: '',
            lname: '',
            password: '',
            from_type: '',
            from_type_remark: '',
            // },
            hiddenPassword: false,
            loading: true,
            stepRegister: 'mobile',
            btnTelephone: false,
            btnForm: false,
            btnBankAccount: false,
            game_id: 0,
            inviteId: this.props.match.params.invite_id ? this.props.match.params.invite_id : 0
        }

        this.handleTelephoneChange = this.handleTelephoneChange.bind(this);
        this.handleBankChange = this.handleBankChange.bind(this);
        this.handleBankAccountChange = this.handleBankAccountChange.bind(this);
        this.handleFnameChange = this.handleFnameChange.bind(this);
        this.handleLnameChange = this.handleLnameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLineIdChange = this.handleLineIdChange.bind(this);
        this.handleFromTypeChange = this.handleFromTypeChange.bind(this);
        this.handleFromTypeRemarkChange = this.handleFromTypeRemarkChange.bind(this);

        this.handleSubmitTelephone = this.handleSubmitTelephone.bind(this);
        this.handleSubmitBankAccount = this.handleSubmitBankAccount.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);

        this.togglePassword = this.togglePassword.bind(this);
    }

    componentDidMount() {
        const { brand } = this.props.match.params;
        brandService.checkBrand(brand)
            .then(response => {
                this.setState(() => {
                    return { brand: response.data };
                });
                this.setState({
                    brand_id: response.data.id,
                });
                this.setState({ loading: false });
            }, (err) => {
                alert(err);
            });

        brandService.getBank(brand)
            .then(response => {
                this.setState(() => {
                    return { banks: response.data };
                });
                this.setState({ loading: false });
            }, (err) => {
                alert(err);
            });
        console.log(this.state.brand);
    }

    togglePassword() {
        this.setState({
            hiddenPassword: !this.state.hiddenPassword
        })
    }

    handleTelephoneChange(e) { this.setState({ telephone: e.target.value }) }
    handleBankChange(e) { this.setState({ bank_id: e.target.value }) }
    handleBankAccountChange(e) { this.setState({ bank_account: e.target.value }) }
    handleFnameChange(e) { this.setState({ fname: e.target.value }) }
    handleLnameChange(e) { this.setState({ lname: e.target.value }) }
    handlePasswordChange(e) { this.setState({ password: e.target.value }) }
    handleLineIdChange(e) { this.setState({ line_id: e.target.value }) }
    handleFromTypeChange(e) { this.setState({ from_type: e.target.value }) }
    handleFromTypeRemarkChange(e) { this.setState({ from_type_remark: e.target.value }) }

    handleSubmitTelephone(e) {

        e.preventDefault();

        this.setState({
            btnTelephone: true
        });

        let telephone = this.state.telephone.replace(/_/g, '');

        telephone = telephone.replace(/-/g, '');

        if (telephone.length < 10) {
            NotificationManager.warning('กรุณาระบุเบอร์โทรศัพท์', 'ขออภัยค่ะ');

            this.setState({
                btnTelephone: false
            });
            return;
        }

        brandService.checkPhone(this.state.brand.id, this.state.telephone)
            .then((response) => {
                if (response.status === false) {
                    NotificationManager.error('เบอร์โทรศัพท์นี้มีในระบบแล้ว', 'ขออภัยค่ะ');

                    this.setState({
                        btnTelephone: false
                    });
                } else {
                    this.setState({
                        stepRegister: 'bank_account'
                    });
                    this.setState({
                        btnTelephone: false
                    });
                }
            }, (error) => {
                NotificationManager.warning(error, 'ขออภัยค่ะ');
                this.setState({
                    btnTelephone: false
                });
            });

    }

    handleSubmitBankAccount(e) {

        e.preventDefault();

        this.setState({
            btnBankAccount: true
        });

        let bank_account = this.state.bank_account.replace(/_/g, '');
        bank_account = bank_account.replace(/-/g, '');

        if (bank_account.length < 10) {
            NotificationManager.warning('กรุณาระบุเลขที่บัญชีธนาคารให้ครบ', 'ขออภัยค่ะ');

            this.setState({
                btnBankAccount: false
            });
            return;
        }

        if (this.state.bank_id === '') {
            NotificationManager.warning('กรุณาระบุธนาคาร', 'ขออภัยค่ะ');

            this.setState({
                btnBankAccount: false
            });
            return;
        }

        brandService.checkBank(this.state.brand.id, this.state.bank_account)
            .then((response) => {
                if (response.status === false) {
                    NotificationManager.error('เลขที่บัญชีธนาคารนี้มีในระบบแล้ว', 'ขออภัยค่ะ');

                    this.setState({
                        btnBankAccount: false
                    });
                } else {
                    this.setState({
                        stepRegister: 'detail'
                    });

                    this.setState({
                        btnBankAccount: false
                    });
                }
            }, (error) => {
                NotificationManager.warning(error, 'ขออภัยค่ะ');
            });

        console.log(this.state);

    }

    handleRegisterSubmit(e) {

        this.setState({
            btnForm: true,

        });

        e.preventDefault();
        if (this.state.password.length < 6) {
            NotificationManager.warning('ระบุรหัสผ่าน 6 ตัวขึ้นไป', 'ขออภัยค่ะ');
            this.setState({
                btnForm: false,
            });
            return;
        }

        if (this.state.from_type === '') {
            NotificationManager.warning('ระบุรหัสผ่าน 6 ตัวขึ้นไป', 'ขออภัยค่ะ');
            this.setState({
                btnForm: false,
            });
            return;
        }

        authService.register({
            brand_id: this.state.brand_id,
            invite_id: this.state.inviteId,
            telephone: this.state.telephone,
            bank_id: this.state.bank_id,
            bank_account: this.state.bank_account,
            fname: this.state.fname,
            lname: this.state.lname,
            password: this.state.password,
            line_id: this.state.line_id,
            from_type: this.state.from_type,
            from_type_remark: this.state.from_type_remark
        })
            .then((response) => {

                console.log(response);

                if (response.status === true) {

                    const { username, password, telephone, brand } = this.state;

                    authService.login(username, password, telephone, brand.id, 1)
                        .then((response) => {
                            if (response) {
                                this.setState({
                                    btnLogin: false
                                });
                                this.props.history.push(`/${this.brand}/register/success`);
                            } else {
                                NotificationManager.warning('ชื่อผู้ใชงานหรือรหัสผ่านผิดพลาด', 'ขออภัยค่ะ');
                                this.setState({
                                    btnLogin: false
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                            this.setState({
                                btnLogin: false
                            });
                        })

                } else {

                    NotificationManager.warning(response.message, 'ขออภัยค่ะ');

                    this.setState({
                        btnLogin: false
                    });

                }

            }, (error) => {
                alert(error);
            })

    }

    renderForm() {
        if (this.state.stepRegister === 'mobile') {
            return (
                <form onSubmit={this.handleSubmitTelephone}>
                    <div className="form-group">
                        <p>เบอร์โทรศัพท์ <span className="text-danger">*</span></p>
                        <InputMask type="tel" mask="999-9999999" className="form-control form-control-lg form-auto" placeholder="เบอร์โทรศัพท์" value={this.state.telephone} onChange={this.handleTelephoneChange} required />
                        <p id="passwordHelpBlock" className="text-warning pull-right mt-2 mb-2">
                            <i className="fa fa-info"></i> ใช้ในกรณีเติมทรูมันนี่
                        </p>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block btn-lg btn-auto" type="submit" disabled={this.state.btnTelephone}>
                            {this.state.btnTelephone ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : ''}
                            <span className="label">
                                ถัดไป
                            </span>
                        </button>
                    </div>
                </form>
            );
        } else if (this.state.stepRegister === 'bank_account') {
            return (
                <form onSubmit={this.handleSubmitBankAccount}>
                    <div className="form-group">
                        <p>ธนาคาร <span className="text-danger">*</span></p>
                        <select className="form-control form-control-lg form-auto" required onChange={this.handleBankChange}>
                            <option value="">เลือกธนาคาร</option>
                            {this.state.banks.filter(bank => bank.id !== 0 && bank.id !== 8 && bank.id !== 7).map((bank, key) => <option value={`${bank.id}` + ':' + `${bank.code}`} key={key}>{bank.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <p>เลขที่บัญชีธนาาคาร <span className="text-danger">*</span></p>
                        <InputMask type="tel" mask="999999999999999" className="form-control form-control-lg form-auto" placeholder="เลขบัญชีธนาคาร"
                            value={this.state.bank_account} onChange={this.handleBankAccountChange} required />
                    </div>
                    <div className="form-group">
                        <p>ชื่อจริง <span className="text-danger">*</span></p>
                        <input type="text" className="form-control form-control-lg form-auto" placeholder="ชื่อจริง" value={this.state.fname}
                            onChange={this.handleFnameChange} required />
                    </div>
                    <div className="form-group">
                        <p>นามสกุล <span className="text-danger">*</span></p>
                        <input type="text" className="form-control form-control-lg form-auto" placeholder="นามสกุล" value={this.state.lname}
                            onChange={this.handleLnameChange} required />
                    </div>
                    <p className="text-warning pull-right mt-2 mb-2">
                        <i className="fa fa-info"></i> ชือที่ใช้ เปิดบัญชีธนาคาร ต้องตรงกัน
                    </p>
                    <div className="form-group">
                        <button className="btn btn-block btn-lg btn-auto" type="submit" disabled={this.state.btnBankAccount}>
                            {this.state.btnBankAccount ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : ''}
                            <span className="label">
                                ถัดไป
                            </span>
                        </button>
                    </div>
                </form >
            );
        } else if (this.state.stepRegister === 'detail') {
            return (
                <form onSubmit={this.handleRegisterSubmit}>
                    <div className="form-group">
                        {(this.state.brand.game_id != 2) ?
                            <p>รหัสผ่าน
                                <span className="text-danger"> * ระบุรหัสผ่าน 6 ตัวขึ้นไป</span>
                                <div className="input-group form-password-toggle mb-2">
                                    <input type={this.state.hiddenPassword ? 'password' : 'text'} value={this.state.password} onChange={this.handlePasswordChange} className="form-control form-control-lg form-auto" placeholder="รหัสผ่าน 6 ตัวขึ้นไป" minLength="6" required />
                                    <div className="input-group-append" onClick={this.togglePassword}>
                                        <span className="input-group-text cursor-pointer">
                                            <i className={this.state.hiddenPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                            </p>
                            :
                            <p>รหัสผ่าน
                                <span className="text-danger"> * กรุณาระบุตัวอักษร(a-z,A-Z) และ ตัวเลข(0-9)</span>
                                <div className="input-group form-password-toggle mb-2">
                                    <input type={this.state.hiddenPassword ? 'password' : 'text'} value={this.state.password} onChange={this.handlePasswordChange} className="form-control form-control-lg form-auto" placeholder="รหัสผ่าน เช่น Aa123123" minLength="6" required />
                                    <div className="input-group-append" onClick={this.togglePassword}>
                                        <span className="input-group-text cursor-pointer">
                                            <i className={this.state.hiddenPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                            </p>
                        }
                    </div>
                    <div className="form-group">
                        <p>ไลนไอดี <span className="text-danger">*</span></p>
                        <input type="text" className="form-control form-control-lg form-auto" value={this.state.line_id} onChange={this.handleLineIdChange} placeholder="ไลน์ไอดี" required />
                    </div>
                    <div className="form-group">
                        <p>ช่องทางการรู้จักเรา <span className="text-danger">*</span></p>
                        <select className="form-control form-control-lg form-auto" onChange={this.handleFromTypeChange} required>
                            <option disabled selected value="">
                                เลือกช่องทาง
                            </option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">Youtube</option>
                            <option value="google">Google</option>
                            <option value="line">LINE</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">Tiktok</option>
                            <option value="sms">SMS</option>
                            <option value="เพื่อน">คนรู้จักแนะนำ</option>
                            <option value="ads">โฆษณา</option>
                            <option value="etcs.">
                                อื่นๆ (โปรดระบุด้านล่าง)
                            </option>
                        </select>
                    </div>
                    <div className="form-group">
                        <p>เพิ่มเติม</p>
                        <input type="text" className="form-control form-control-lg form-auto" placeholder="เพิ่มเติม" value={this.state.from_type_remark} onChange={this.handleFromTypeRemarkChange} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block btn-lg btn-auto" type="submit" disabled={this.state.btnForm}>
                            {this.state.btnForm ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : ''}
                            <span className="label">
                                ถัดไป
                            </span>
                        </button>
                    </div>
                </form >
            )
        }
    }

    render() {
        let { loading } = this.state;
        return (
            <div>
                {
                    (loading)
                        ?

                        <Loading></Loading>

                        :

                        <div>
                            <div className="app-content content ">
                                <div className="content-wrapper">
                                    <div className="content-body">
                                        <div className="auth-wrapper auth-v1 px-2">
                                            <div className="auth-inner py-2">
                                                <div className="card card-auto-1">
                                                    <div className="card-body">
                                                        <img src={`${this.state.brand.logo_url}`} className="img-fluid img-center mb-5 rounded" width="300" alt="" />
                                                        {/* formStep */}
                                                        <div className="row pt-3">
                                                            <div className="col-4 text-center ">
                                                                <button type="button" className={"btn btn-icon-auto btn-" + (this.state.stepRegister === "mobile" && 1 == 1 ? 'auto' : 'default') + " mb-1"}>
                                                                    <i className="fa fa-phone"></i>
                                                                </button>
                                                                <p>เบอร์โทรศัพท์</p>
                                                            </div>
                                                            <div className="col-4 text-center">
                                                                <button type="button" className={"btn btn-icon-auto btn-" + (this.state.stepRegister === "bank_account" ? 'auto' : 'default') + " mb-1"}>
                                                                    <i className="fa fa-university"></i>
                                                                </button>
                                                                <p>บัญชีธนาคาร</p>
                                                            </div>
                                                            <div className="col-4 text-center">
                                                                <button type="button" className={"btn btn-icon-auto btn-" + (this.state.stepRegister === "detail" ? 'auto' : 'default') + " mb-1"}>
                                                                    <i className="fa fa-user"></i>
                                                                </button>
                                                                <p>ข้อมูลทั่วไป</p>
                                                            </div>
                                                        </div>
                                                        {/* formStep */}
                                                        <br />
                                                        {/* formRegister */}
                                                        {this.renderForm()}
                                                        {/* formRegister */}
                                                        <br />
                                                    </div>
                                                    {
                                                        (this.state.inviteId == 0)
                                                            ?
                                                            <div className="card-footer">
                                                                <p className="text-center">ต้องการเข้าสู่ระบบใช่มั้ย ? <Link to={`/${this.brand}/login`}  >เข้าสู่ระบบ</Link>&nbsp;</p>
                                                            </div>
                                                            :
                                                            ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state,
    }
}

export default connect(mapStateToProps)(Register);

