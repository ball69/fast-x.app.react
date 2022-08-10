import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import clipboard from '../../_helpers/clipboard';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import CurrencyFormat from 'react-currency-format';

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

class Home extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            loadingCredit: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            credit: '',
            creditLastUpdate: '',
            promotionLast: '',
            promotionInvite: '',
            promotions: '',
            show: false,
            modalPromotion: false,
            url: '',
            profile: '',
            buttonPromotionLoad: 0,

            payloadCredit: '',
            freeCreditModal: false,
        }

        this.handleRefreshCredit = this.handleRefreshCredit.bind(this);
        this.handleFreeCreditChange = this.handleFreeCreditChange.bind(this);

        this.hideModalPromotion = this.hideModalPromotion.bind(this);

        this.freeCredit = this.freeCredit.bind(this);

        this.promotion = '';

    }

    freeCredit() {

        this.setState({
            freeCreditModal: false,
            payloadCredit: ''
        });

        brandService.freeCredit(this.state.user.id, this.state.payloadCredit)
            .then((response) => {

                if (response.status == 500) {
                    NotificationManager.warning(response.message, '');
                } else {
                    NotificationManager.info(response.message, '');
                }

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
                    });
                // }

                // this.setState({
                //     freeCreditModal: false,
                //     payloadCredit: ''
                // });

            }, (error) => {
                console.log(error);
            });
    };

    async componentWillMount() {

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
                        // promotionInvite: promotionInvite,
                    });

                }

            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            });

        await brandService.profile(this.state.user.id)
            .then((response) => {
                if (response.data) {
                    this.setState({
                        profile: response.data,
                    });
                    if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                        this.setState({
                            modal: true
                        });
                    }
                } else {
                    this.setState({
                        loadingCredit: false,
                    });
                }
            }, (err) => {
                console.log(err);
            })
        brandService.getPromotion(this.state.user.id)
            .then((response) => {
                if (this.state.profile.promotion_id != 0) {
                    this.setState({
                        modalPromotion: true,
                    });
                }
                const promotionInvite = response.data.filter(promotion => promotion.type_promotion == 5)[0];
                this.setState({
                    promotions: response.data,
                    promotionInvite: promotionInvite,
                })
            }, (error) => {
                console.log(error);
            });
        const refreshCredit = await this.handleRefreshCredit();
        await brandService.getUrl(this.state.user.id)
            .then((response) => {
                if (refreshCredit.promotion_last && refreshCredit.promotion_last.promotion.type_game != 0) {
                    this.setState({
                        url: 'member/slot/' + refreshCredit.promotion_last.promotion.type_game
                    });
                } else {
                    this.setState({
                        url: response.data
                    });
                }
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            });
        this.setState({
            loading: false
        });
    }

    async handleRefreshCredit() {
        var result = '';
        this.setState({
            loadingCredit: true
        });
        await brandService.credit(this.state.user.id)
            .then((response) => {
                if (response.data) {

                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const credit = (response.data.credit) ? parseFloat(response.data.credit).toFixed(2) : 0.00;

                    result = response.data;

                    this.setState({
                        credit: credit,
                        creditLastUpdate: date + ' ' + time,
                        promotionLast: response.data.promotion_last,
                    });

                    this.setState({
                        loadingCredit: false
                    });
                    // return Promise.resolve(response);

                }
            }, (error) => {
                result = Promise.reject(error.message);
                this.setState({
                    loadingCredit: false
                });
            });

        return result;

    }

    handleFreeCreditChange(e) {
        this.setState({
            payloadCredit: e.target.value,
        });
    }

    updatePromotion(e, promotion_id) {
        this.setState({
            buttonPromotionLoad: promotion_id
        })
        brandService.selectPromotion(this.state.user.id, promotion_id)
            .then((response) => {
                if (response.status == 'success') {
                    NotificationManager.success(response.msg, 'เลือกโปรโมชั่นสำเร็จ');
                    brandService.credit(this.state.user.id)
                        .then((response) => {
                            if (response.data) {
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                const credit = (response.data.credit) ? parseFloat(response.data.credit).toFixed(2) : 0.00;
                                if (response.data.promotion_last.promotion.type_game != 0) {
                                    this.setState({
                                        url: 'member/slot/' + response.data.promotion_last.promotion.type_game
                                    });
                                }
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
                        });
                    brandService.getPromotion(this.state.user.id)
                        .then((response) => {
                            if (this.state.profile.promotion_id != 0) {
                                this.setState({
                                    modalPromotion: true,
                                });
                            }
                            const promotionInvite = response.data.filter(promotion => promotion.type_promotion == 5)[0];
                            this.setState({
                                promotions: response.data,
                                promotionInvite: promotionInvite,
                            })
                        }, (error) => {
                            console.log(error);
                        });

                    this.setState({
                        buttonPromotionLoad: 0
                    })

                } else if (response.status == 'warning') {

                    NotificationManager.warning(response.msg, 'ผิดพลาด');


                    this.setState({
                        buttonPromotionLoad: 0
                    })

                } else if (response.status == 'error') {

                    NotificationManager.error(response.msg, 'ผิดพลาด');


                    this.setState({
                        buttonPromotionLoad: 0
                    })

                }

            }, (error) => {
                console.log(error);


                this.setState({
                    buttonPromotionLoad: 0
                })
            });
    }

    calBonusTurnOver(userPromotion) {
        let result = 0;
        if (userPromotion.promotion) {
            result = (parseFloat(userPromotion.amount) + parseFloat(userPromotion.bonus)) * parseFloat(userPromotion.promotion.turn_over);
        }
        return result.toFixed(2);
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    hideModalPromotion = () => {
        this.setState({ modalPromotion: false });
    };

    onOpenModal = () => {
        this.setState({ freeCreditModal: true });
    };

    onCloseModal = () => {
        this.setState({ freeCreditModal: false });
    };

    render() {
        return (
            <div>

                {/* Free Credit Modal */}
                <Modal open={this.state.freeCreditModal} onClose={this.onCloseModal} style={{ backgroundColor: "black" }}>
                    <div className="form-group">
                        <h2 className="text-white">กรอกรหัสเครดิด</h2>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="payloadCredit"
                            placeholder="กรอกรหัสเครดิด"
                            className="form-control"
                            value={this.state.payloadCredit}
                            onChange={this.handleFreeCreditChange}
                        />
                        <button className="btn btn-primary text-dark" onClick={this.freeCredit}>
                            ตกลง
                        </button>
                    </div>
                </Modal>
                {
                    (this.state.loading)
                        ?
                        <Loading />
                        :
                        <div className="row">
                            {/* <Modal /> */}
                            <div className="col-lg-2 col-md-10">
                                <Navbar props={this.props} brand={this.state.brand}></Navbar>
                            </div>
                            <div className="col-lg-10 col-md-12">
                                <div className="app-content content">
                                    <div className="content-wrapper">
                                        <div className="clearfix" />
                                        <div className="content-body">
                                            <div className="d-xs-none">
                                                <a href={this.state.url} target="_blank" className="btn btn-auto btn-lg pull-right">
                                                    <i className="fad fa-gamepad-alt mr-1"></i>
                                                    เข้าเล่นเกมส์
                                                </a>
                                                <h1 className="">ยินดีต้อนรับ คุณ {this.state.user.name}</h1>
                                            </div>
                                            <div className="">
                                                <img src={`${this.state.brand.logo_url}`} className="img-fluid d-lg-none pb-2" width={100} alt="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-lg-8 col-md-8">
                                                    <div className="card card-auto-2 pb-2">
                                                        <div className="card-body p-5">
                                                            <h2>เครดิตของคุณ
                                                                {(this.state.loadingCredit) ?
                                                                    <span className="ml-2" >
                                                                        <div className="spinner-border" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </span>
                                                                    :

                                                                    <span className="ml-2" onClick={this.handleRefreshCredit}><i className="fad fa-sync"></i></span>

                                                                }
                                                            </h2>
                                                            <div>
                                                                <h1 className="mb-75 mt-2 pt-50 ">

                                                                    <span className='ml-2 mr-2'>$</span>

                                                                    <CurrencyFormat value={this.state.credit} displayType={'text'} thousandSeparator={true} />

                                                                </h1>
                                                                <div className="pb-2">
                                                                    <button className="btn btn-success bg-success" onClick={this.onOpenModal}>
                                                                        รับเครดิตฟรี
                                                                    </button>
                                                                </div>

                                                            </div>
                                                            <p>อัพเดทล่าสุดเมื่อ: {this.state.creditLastUpdate}</p>
                                                        </div>
                                                        {
                                                            (this.state.promotionLast)
                                                                ?
                                                                <div>
                                                                    <div className="promotion">
                                                                        <h5 className="name mb-1">
                                                                            {this.state.promotionLast.promotion.name}
                                                                        </h5>
                                                                        {(this.state.promotionLast.turn_over > 0 && (this.state.promotionLast.type_turn_over != 3)) ?
                                                                            <h5 className="detail text-center mb-0">เทิร์นที่ต้องทำ: {this.calBonusTurnOver(this.state.promotionLast)}</h5>
                                                                            :
                                                                            <h5 className="detail text-center mb-0">ยอดเงินที่ต้องทำ: {this.state.credit} / {this.calBonusTurnOver(this.state.promotionLast)}</h5>
                                                                        }
                                                                    </div>

                                                                </div>
                                                                :
                                                                ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 mt-3">
                                                    <div className="card card-auto-3">
                                                        <div className="card-header">
                                                            <h2 className="card-title">ไอดีเข้าเล่นเกมส์</h2>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="card-text text-white">
                                                                <p><b> <i className="fad fa-user" /> {this.state.user.username}</b>
                                                                    <button type="button" onClick={() => clipboard(this.state.user.username)} className="btn btn-auto btn-sm pull-right"> <i className="fa fa-copy" /> คัดลอก </button></p>
                                                                <p><b> <i className="fad fa-key" /> {this.state.user.password_generate}</b>
                                                                    <button type="button" onClick={() => clipboard(this.state.user.password_generate)} className="btn btn-auto btn-sm pull-right"> <i className="fa fa-copy" /> คัดลอก </button></p>
                                                            </div>
                                                            {/* <div className="row d-xs-none mt-5">
                                                                <div className="col-lg-12">
                                                                    <a href={`https://line.tbf.bet/connect/${this.brand}`}
                                                                        className="btn btn-auto-line btn-block">
                                                                        <i className="fab fa-line" /> เชื่อมต่อไอดีไลน์ VIP
                                                                    </a>
                                                                </div>
                                                            </div> */}
                                                            {/* <div className="row d-lg-none mt-5">
                                                                <div className="col-lg-12">
                                                                    <button className="btn btn-auto btn-block"> <i className="fa fa-gamepad" /> รับเครดิคฟรี</button>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-5">
                                                    <Link to={`/${this.brand}/member/spinwheel`} className="btn btn-danger pt-4 img-center  bg-danger">
                                                        <i className="fad fa-dharmachakra fa-4x text-warning" />
                                                        <p className="text-center pt-2 text-warning">วงล้อเสี่ยงโชค</p>
                                                    </Link>
                                                </div>
                                                <div className="col-lg-12 d-lg-none">
                                                    <div className="row ml-0 mr-0">
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/deposit`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-hand-holding-usd" />
                                                            </Link>
                                                            <p className="text-center">เติมเงิน</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/withdraw`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-credit-card" />
                                                            </Link>
                                                            <p className="text-center">ถอนเงิน</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/history`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-list" />
                                                            </Link>
                                                            <p className="text-center">ประวัติ</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/promotion`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-gift" />
                                                            </Link>
                                                            <p className="text-center">โปรโมชั่น</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/invite`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-users-class" />
                                                            </Link>
                                                            <p className="text-center">ชวนเพื่อน</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/profile`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fad fa-id-card" />
                                                            </Link>
                                                            <p className="text-center">โปรไฟล์</p>
                                                        </div>
                                                        {/* <div className="col-3">
                                                            <a href={`https://line.tbf.bet/connect/${this.brand}`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fad fa-bell-on" />
                                                            </a>
                                                            <p className="text-center">แจ้งเตือน VIP</p>
                                                        </div> */}
                                                        <div className="col-3">
                                                            <a href={`https://line.me/R/ti/p/~@${this.state.brand.line_id}`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fab fa-line" />
                                                            </a>
                                                            <p className="text-center">แจ้งปัญหา</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col-lg-12 d-xs-none">
                                                    <hr />
                                                    <h2> <i className="fad fa-people-arrows"></i> ลิงค์แนะนำเพื่อน </h2>
                                                    <hr />
                                                    {/* {
                                                        (this.state.promotionInvite)
                                                            ? */}
                                                    <div>
                                                        {
                                                            (this.state.promotionInvite)
                                                                ?
                                                                <p className="text-center">
                                                                    {this.state.promotionInvite.name}
                                                                </p>
                                                                :
                                                                <p></p>
                                                        }
                                                        <div className="row">
                                                            <div className="col-lg-6 mx-auto">
                                                                <div className="input-group">
                                                                    <input type="text" className="form-control form-control form-auto" defaultValue={this.state.profile.invite_url} readOnly />
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-auto waves-effect" type="button" onClick={() => clipboard(this.state.profile.invite_url)}>
                                                                            <i className="fa fa-clipboard"></i> คัดลอก
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            (this.state.promotionInvite)
                                                                ?
                                                                <div className="row mt-2">
                                                                    <div className="col-lg-6 mx-auto">
                                                                        <Link to={`/${this.brand}/member/invite`} className="btn btn-auto btn-block btn-lg btn-wave-effects">
                                                                            <i className="fad fa-envelope-open-dollar mr-1"></i>
                                                                            รับโบนัส
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (this.state.promotions.length > 0)
                                                    ?
                                                    <div className="">
                                                        {/* <div className="pull-right">
                                                            <button type="button" onClick={(e) => this.updatePromotion(e, 0)} className="btn btn-auto pull-right btn-3">
                                                                <i className="fad fa-ban mr-1"></i>
                                                                ไม่รับโบนัส </button>
                                                        </div> */}
                                                        <h2> <i className="fad fa-gift-card"></i> โปรโมชั่น</h2>
                                                        <hr />
                                                        <div className="row">
                                                            {this.state.promotions.filter(promotion => promotion.status != 0).map((promotion, key) => {
                                                                return (
                                                                    <div className="col-lg-3 col-xs-6 mb-5" key={key}>
                                                                        <div className="box-promotion">
                                                                            <img src={`${promotion.img_url}`}
                                                                                className="img-fluid img-center" alt="" />
                                                                            <p className="pt-2 text-center">{promotion.name}</p>
                                                                            {
                                                                                ([1, 2, 3].includes(promotion.type_promotion) && promotion.active == 1)
                                                                                    ?
                                                                                    <button type="button"
                                                                                        onClick={(e) => this.updatePromotion(e, promotion.id)}
                                                                                        className="btn btn-auto btn-sm btn-block pull-right btn-3"
                                                                                        disabled={(this.state.buttonPromotionLoad == promotion.id) ? true : false}
                                                                                    >
                                                                                        {(this.state.buttonPromotionLoad == promotion.id)
                                                                                            ?
                                                                                            <div class="spinner-border text-dark" role="status">
                                                                                                <span class="sr-only">Loading...</span>
                                                                                            </div>
                                                                                            :
                                                                                            <span>
                                                                                                <i className="fa fa-hand-pointer" />&nbsp;
                                                                                                เลือกโปรโมชั่นนี้
                                                                                            </span>
                                                                                        }
                                                                                    </button>
                                                                                    :
                                                                                    ''
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                    </div>
                                    <Footer props={this.props} brand={this.state.brand} url={this.state.url}></Footer>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Home;
