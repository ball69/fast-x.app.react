import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import NotificationManager from 'react-notifications/lib/NotificationManager';

class Withdraw extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            profile: '',
            promotionLast: '',
            amount_withdraw: 0.00,
            url: '',
        }
        this.hideModal = this.hideModal.bind(this);
        this.handleAmountWithdraw = this.handleAmountWithdraw.bind(this);
        this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
    }

    async componentWillMount() {

        await brandService.getUrl(this.state.user.id)
            .then((response) => {
                this.setState({
                    url: response.data
                });
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            });

    }

    async componentDidMount() {
        await brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                } else {
                    this.setState({
                        brand: response.data,
                    })
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            this.setState({
                                loading: false,
                                profile: response.data
                            });
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                // this.setState({
                                //     modal: true,
                                // });
                            }
                        }, (err) => {
                            console.log(err);
                        })
                }
            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            });

        await
            brandService.credit(this.state.user.id)
                .then((response) => {
                    if (response.data) {
                        var today = new Date();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        const credit = (response.data.credit) ? parseFloat(response.data.credit).toFixed(2) : 0.00;
                        this.setState({
                            credit: credit,
                            creditLastUpdate: date + ' ' + time,
                            promotionLast: response.data.promotion_last,
                        })
                        this.setState({
                            loadingCredit: false
                        });
                    }
                }, (error) => {
                    // console.log(error);
                    this.setState({
                        loadingCredit: false
                    });
                })

    }

    handleWithdrawSubmit(e) {
        e.preventDefault();
        const credit = parseFloat(this.state.profile.credit);
        const turn_over_cost = (this.state.promotionLast && this.state.promotionLast.promotion.type_turn_over == 1) ? parseFloat(this.calBonusTurnOver(this.state.promotionLast)) : 0;
        if (this.state.amount_withdraw <= 0) {
            NotificationManager.error('กรุณาระบุจำนวนเงินที่มากกว่า 0', 'คำเตือน', 2000);
            return;
        }
        if (credit < turn_over_cost) {
            NotificationManager.error('คุณยังทำเทิร์นไม่ถึงกรุณาทำเทิร์นให้ครบ ' + (new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 2 }).format(turn_over_cost)), 'คำเตือน', 2000);
            return;
        }
        brandService.withdraw(this.state.user.id, this.state.amount_withdraw)
            .then(response => {
                console.log(response);
                if (response.data.code == 400) {
                    NotificationManager.warning(response.data.msg, 'คำเตือน', 3000);
                } else {
                    NotificationManager.success(response.data.msg, '', 3000);
                }
            }, (error) => {
                console.log(error);
            });
    }

    handleAmountWithdraw(e) {
        this.setState({
            amount_withdraw: e.target.value
        });
    }

    calBonusTurnOver(userPromotion) {
        let result = 0;
        if (userPromotion.promotion) {
            result = (parseFloat(userPromotion.amount) + parseFloat(userPromotion.bonus)) * parseFloat(userPromotion.promotion.turn_over);
        }
        return result.toFixed(2);
    }

    hideModal = () => {
        this.setState({ modal: false });
    };

    render() {
        return (
            <div>
                {/* <Modal show={this.state.modal} onHide={this.hideModal}>
                    <Modal.Header closeButton className="btn-auto-line">
                        <Modal.Title className="text-white"> <i className="fab fa-line "></i> เชื่อมต่อไอดีไลน์</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-white">
                        <a href={`https://line.tbf.bet/connect/${this.brand}`} variant="secondary" className="btn btn-auto-line btn-block btn-lg">

                            <span className="text-center d-block">เพื่อรับการแจ้งเตือน และ สิทธิ์ประโยชน์มากมาย แบบ VIP</span>
                            <i className="fad fa-bell-on fa-5x mr-1 mb-5 mt-5" ></i>
                            <span className="text-center d-block mb-3">ไอดีเข้าเกมส์: {this.state.user.username}</span>
                            <span className="mb-5">
                                คลิกเพื่อเชื่อมต่อ</span>
                        </a>
                    </Modal.Body>
                </Modal> */}
                {
                    (this.state.loading)
                        ?
                        <Loading></Loading>
                        :
                        <div>
                            <div className="row">
                                <div className="col-lg-2 col-md-10">
                                    <Navbar props={this.props} brand={this.state.brand}></Navbar>
                                </div>
                                <div className="col-lg-10 col-md-10">
                                    <div className="app-content content">
                                        <div className="content-wrapper">
                                            <div className="clearfix" />
                                            <div className="content-body">
                                                <form onSubmit={this.handleWithdrawSubmit}>
                                                    <h2 className='text-warning'> <i className="fad fa-credit-card"></i> ถอนเงิน</h2>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <h4>1. ตรวจสอบบัญชีธนาคารของคุณ</h4>
                                                            <hr />
                                                            <div className="card card-normal" style={{
                                                                background: this.state.profile.bank.bg_color,
                                                                color: this.state.profile.bank.font_color,
                                                            }}>
                                                                <div className="card-body">
                                                                    <img
                                                                        src={
                                                                            this.state.profile.bank.logo === undefined
                                                                                ? ""
                                                                                : "https://bot.tbf.bet/" + this.state.profile.bank.logo
                                                                        }
                                                                        alt=""
                                                                        width="30"
                                                                    />{" "}
                                                                    <b>
                                                                        {this.state.profile.bank.name} ชื่อ: {this.state.profile.name} เลขที่บัญชี: {" "}
                                                                        {this.state.profile.bank_account}
                                                                    </b>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="pull-right">

                                                            </div>
                                                            <h4>2. ตรวจสอบเครดิต & โปรโมชั่น</h4>
                                                            <hr />
                                                            <div className="card bg-info card-normal">
                                                                <div className="card-body">
                                                                    <h4 className="text-white mb-0"><b> <i className="fad fa-dollar-sign"></i> เครดิตของคุณ: </b> </h4>
                                                                    <hr className="hr-white" />
                                                                    <h4><CurrencyFormat value={this.state.credit} displayType={'text'} thousandSeparator={true} /> credit</h4>
                                                                </div>
                                                            </div>
                                                            {
                                                                (this.state.promotionLast)
                                                                    ?
                                                                    <div className="card card-normal bg-danger">
                                                                        <div className="card-body">
                                                                            <h4>
                                                                                <i className="fad fa-exclamation-triangle"></i> คุณมีโปรโมชั่นที่ต้องทำให้สำเร็จ
                                                                            </h4>
                                                                            <hr className="hr-red" />
                                                                            <h5 className="text-overflow">
                                                                                {this.state.promotionLast.promotion.name}
                                                                            </h5>
                                                                            {(this.state.promotionLast.turn_over > 0 && (this.state.promotionLast.type_turn_over != 3)) ?
                                                                                <h5 className="mb-0">ยอดเงินที่ต้องทำ: <CurrencyFormat value={this.calBonusTurnOver(this.state.promotionLast)} displayType={'text'} thousandSeparator={true} /></h5>
                                                                                :
                                                                                <h5 className="">ยอดเงินที่ต้องทำ: <CurrencyFormat value={this.state.credit} displayType={'text'} thousandSeparator={true} /> / <CurrencyFormat value={this.calBonusTurnOver(this.state.promotionLast)} displayType={'text'} thousandSeparator={true} /></h5>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            }

                                                        </div>
                                                        <div className="col-lg-12">
                                                            <h4>3. ถอนเงิน</h4>
                                                            <hr />
                                                            <div className="col-lg-6 mx-auto">
                                                                <div className="p-4 mt-1 mb-4" style={{ borderRadius: "5px" }}>
                                                                    <h5 >ระบุจำนวนเงินที่ต้องการถอน</h5>
                                                                    <CurrencyFormat thousandSeparator={true}
                                                                        className="form-control form-control-lg form-auto form-currency"
                                                                        inputmode="numeric"
                                                                        placeholder="0.00"
                                                                        onChange={this.handleAmountWithdraw}
                                                                        decimalScale={2}
                                                                        required />
                                                                    <button className="btn btn-auto mt-2 btn-block btn-lg">
                                                                        <i className="fad fa-check mr-1"></i>
                                                                        ถอนเงิน
                                                                    </button>
                                                                    <small className="text-white mb-0">ถอนขั้นต่ำ {this.state.brand.withdraw_min}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Footer props={this.props} brand={this.state.brand} url={this.state.url}></Footer>
                        </div>
                }
            </div>
        );
    }
}

export default Withdraw;
