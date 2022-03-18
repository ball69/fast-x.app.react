import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import imgInvite from '../../_assets/app-assets/images/illustration/marketing.png';
import clipboard from '../../_helpers/clipboard';
import { Link } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import NotificationManager from 'react-notifications/lib/NotificationManager';

class Invite extends Component {

    constructor(props) {
        super(props);

        this.brand = this.props.match.params.brand;

        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            promotionInvite: '',
            totalBonus: '',
            customerInvites: '',
            btnBonus: false,
            url: '',
        }

        this.hideModal = this.hideModal.bind(this);

        this.calBonusDeposit = this.calBonusDeposit.bind(this);
        this.calBonusLoss = this.calBonusLoss.bind(this);
        this.calBonusTurnOver = this.calBonusTurnOver.bind(this);

        this.calDeposit = this.calDeposit.bind(this);
        this.calLoss = this.calLoss.bind(this);
        this.calTurnOver = this.calTurnOver.bind(this);

        this.calTotalBonus = this.calTotalBonus.bind(this);

        this.handleSubmitBonus = this.handleSubmitBonus.bind(this);

    }

    async componentWillMount() {

        await brandService.getUrl(this.state.user.id)
            .then((response) => {
                this.setState({
                    url: response.data
                });
                console.log(this.state.url);
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            });

    }

    componentDidMount() {
        brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                    return;
                } else {
                    this.setState({
                        brand: response.data
                    })
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                this.setState({
                                    modal: true
                                });
                            }
                            this.setState({
                                user: response.data,
                            });
                        }, (err) => {
                            console.log(err);
                        });
                    brandService.getPromotion(this.state.user.id)
                        .then((response) => {
                            const promotionInvite = response.data.filter(promotion => promotion.type_promotion == 5)[0];
                            this.setState({
                                promotions: response.data,
                                promotionInvite: (promotionInvite.status == 1) ? promotionInvite : '',
                            })
                        }, (error) => {
                            console.log(error);
                        })
                    brandService.invite(this.state.user.id)
                        .then((response) => {
                            this.setState({
                                customerInvites: response.data.data.customer_invites
                            });
                            if (this.state.promotionInvite) {
                                this.calTotalBonus(response.data.data.customer_invites);
                            }
                            this.setState({
                                loading: false
                            });
                        }, (error) => {
                            console.log(error);
                        })
                }
            }, (error) => {
                console.log(error);
                this.setState({
                    loading: false
                })
            })
    }

    handleSubmitBonus(e) {
        e.preventDefault();
        this.setState({
            btnBonus: true,
        });
        brandService.inviteStore(this.state.user.id, this.state.promotionInvite.id, this.state.totalBonus)
            .then((response) => {
                console.log(response);
                this.setState({
                    btnBonus: false,
                });
                // console.log(response);
                if (response.data.status == true) {
                    window.location.reload();
                } else {
                    NotificationManager.warning(response.data.msg, 'ลองใหม่');
                }
            }, (error) => {
                console.log(error);
                this.setState({
                    btnBonus: false,
                });
            }).catch((error) => {
                console.log(error);
                this.setState({
                    btnBonus: false,
                });
            })
    }

    calTotalBonus(customer_invites) {
        let total_bonus = 0;
        customer_invites.map((customer_invite) => {
            if (this.state.promotionInvite.type_promotion_invite == 1) {
                total_bonus += parseFloat(this.calBonusDeposit(customer_invite));
            } else if (this.state.promotionInvite.type_promotion_invite == 2) {
                total_bonus += parseFloat(this.calBonusTurnOver(customer_invite));
            } else if (this.state.promotionInvite.type_promotion_invite == 3) {
                total_bonus += parseFloat(this.calBonusLoss(customer_invite));
            }
        });
        this.setState({
            totalBonus: total_bonus.toFixed(2),
        });
    }

    calDeposit(customer_invite) {
        var bonus = customer_invite.deposit_first ? customer_invite.deposit_first.amount : 0;
        return bonus;
    }

    calTurnOver(customer_invite) {
        var bonus = 0;
        if (this.state.brand.game_id == 1) {
            bonus = (customer_invite.bet_detail_invites[0]) ? customer_invite.bet_detail_invites[0].total_turn_over : 0;
        } else {
            bonus = (customer_invite.bet_invites[0]) ? customer_invite.bet_invites[0].total_turn_over - customer_invite.bet_invites[0].total_turn_over_received : 0;
        }
        return bonus;
    }

    calLoss(customer_invite) {
        var bonus = 0;
        if (this.state.brand.game_id == 1) {
            bonus = (customer_invite.bet_detail_invites[0]) ? customer_invite.bet_detail_invites[0].total_win_loss : 0;
        } else {
            bonus = (customer_invite.bet_invites[0]) ? customer_invite.bet_invites[0].total_win_loss : 0;
        }
        return bonus;
    }

    calBonusDeposit(customer_invite) {
        var bonus = 0;
        var deposit = customer_invite.deposit_first ? customer_invite.deposit_first.amount : 0;
        bonus = (deposit * this.state.promotionInvite.cost) / 100;
        if (bonus > this.state.promotionInvite.max) {
            bonus = this.state.promotionInvite.max;
        }
        return bonus;
    }

    calBonusTurnOver(customer_invite) {
        var bonus = 0;
        if (this.state.brand.game_id == 1) {
            const turn_over = (customer_invite.bet_detail_invites[0]) ? customer_invite.bet_detail_invites[0].total_turn_over : 0;
            bonus = (turn_over * this.state.promotionInvite.cost) / 100;
            if (bonus > this.state.promotionInvite.max) {
                bonus = this.state.promotionInvite.max;
            }
        } else {
            const turn_over = (customer_invite.bet_invites[0]) ? customer_invite.bet_invites[0].total_turn_over - customer_invite.bet_invites[0].total_turn_over_received : 0;
            bonus = (turn_over * this.state.promotionInvite.cost) / 100;
            if (bonus > this.state.promotionInvite.max) {
                bonus = this.state.promotionInvite.max;
            }
        }
        return bonus;
    }

    calBonusLoss(customer_invite) {
        var bonus = 0;
        if (this.state.brand.game_id == 1) {
            const win_loss = (customer_invite.bet_detail_invites[0]) ? customer_invite.bet_detail_invites[0].total_win_loss : 0;

            if (win_loss < 0) {
                bonus = (win_loss * this.state.promotionInvite.cost) / 100;
                if (Math.abs(bonus) > (this.state.promotionInvite.max)) {
                    bonus = this.state.promotionInvite.max;
                }
            }
        } else {
            const win_loss = (customer_invite.bet_invites[0]) ? customer_invite.bet_invites[0].total_win_loss : 0;
            if (win_loss < 0) {
                bonus = (win_loss * this.state.promotionInvite.cost) / 100;
                if (Math.abs(bonus) > this.state.promotionInvite.max) {
                    bonus = this.state.promotionInvite.max;
                }
            }
        }
        return Math.abs(bonus);
    }

    stringToDate = (string) => {
        var date = new Date(string);
        var test = date.toLocaleString("th-TH");
        return test;
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
                                                <h2 className='text-warning'>
                                                    <i className="fad fa-users-class"></i>
                                                    &nbsp;
                                                    ระบบแนะนำเพื่อน</h2>
                                                <hr />
                                                {(this.state.promotionInvite)
                                                    ?
                                                    <div>
                                                        <h4 className="text-center">{this.state.promotionInvite.name}</h4>
                                                        <div className="content-body">
                                                            <img
                                                                src={imgInvite}
                                                                width="350"
                                                                className="img-fluid img-center"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 mx-auto">
                                                                <div className="input-group">
                                                                    <input type="text" className="form-control form-control form-auto" defaultValue={this.state.user.invite_url} readOnly />
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-auto waves-effect" type="button" onClick={() => clipboard(this.state.user.invite_url)}>
                                                                            <i className="fa fa-clipboard"></i> คัดลอก
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div className="row">

                                                            <div className="col-lg-6 mx-auto">
                                                                <button className="btn btn-lg btn-auto btn-block text-dark"
                                                                    disabled={this.state.totalBonus == 0 || this.state.btnBonus}
                                                                    onClick={this.handleSubmitBonus}>
                                                                    <p className="mt-1">{this.state.totalBonus}</p>
                                                                    <span>{this.state.btnBonus ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span> : <i className="fad fa-hand-holding-usd"></i>} คลิกเพื่อรับโบนัส</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <h4> <i className="fad fa-list mr-1"></i> รายชื่อเพื่อนของคุณ</h4>
                                                                <div className="card card-normal">
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            {
                                                                                (this.state.customerInvites.map((customer_invite) => {
                                                                                    return (
                                                                                        <div className="col-6">
                                                                                            <div className="employee-task d-flex justify-content-between align-items-center pb-3">
                                                                                                <div className="media">
                                                                                                    <div className="media-body my-auto">
                                                                                                        <h6 className="">
                                                                                                            {" "}
                                                                                                            <i className="fad fa-user mr-1"></i> {customer_invite.username}
                                                                                                        </h6>{" "}
                                                                                                        <small className="d-block">{customer_invite.name}</small>
                                                                                                        {(() => {
                                                                                                            if (this.state.promotionInvite.type_promotion_invite === 1) {
                                                                                                                return (
                                                                                                                    <div>
                                                                                                                        <small>ยอดฝากแรก :&nbsp;
                                                                                                                            <span className={"text-" + (this.calDeposit(customer_invite) > 0 ? 'success' : 'danger')}>
                                                                                                                                <CurrencyFormat value={this.calDeposit(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                        <small className="d-block">โบนัสที่ได้ :&nbsp;
                                                                                                                            <span className="text-success">
                                                                                                                                <CurrencyFormat value={this.calBonusDeposit(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            } else if (this.state.promotionInvite.type_promotion_invite === 2) {
                                                                                                                return (
                                                                                                                    <div>
                                                                                                                        <small>เทิร์นโอเวอร์ :&nbsp;
                                                                                                                            <span className={"text-" + (this.calTurnOver(customer_invite) > 0 ? 'success' : 'danger')}>
                                                                                                                                <CurrencyFormat value={this.calTurnOver(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                        <small className="d-block">โบนัสที่ได้ :&nbsp;
                                                                                                                            <span className="text-success">
                                                                                                                                <CurrencyFormat value={this.calBonusTurnOver(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            } else if (this.state.promotionInvite.type_promotion_invite === 3) {
                                                                                                                return (
                                                                                                                    <div>
                                                                                                                        <small>ยอดเสีย :&nbsp;
                                                                                                                            <span className={"text-" + (this.calLoss(customer_invite) > 0 ? 'success' : 'danger')}>
                                                                                                                                <CurrencyFormat value={this.calLoss(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                        <small className="d-block">โบนัสที่ได้ :&nbsp;
                                                                                                                            <span className="text-success">
                                                                                                                                <CurrencyFormat value={this.calBonusLoss(customer_invite)} displayType={'text'} thousandSeparator={true} />
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }

                                                                                                            return null;
                                                                                                        })()}
                                                                                                        <small className="d-block">ออนไลน์ล่าสุด : </small>
                                                                                                        <small className="text-white mr-75 d-block">
                                                                                                            {
                                                                                                                (customer_invite.last_login)
                                                                                                                    ?
                                                                                                                    <div className="text-muted">
                                                                                                                        {this.stringToDate(customer_invite.last_login)}
                                                                                                                    </div>
                                                                                                                    :
                                                                                                                    '-'

                                                                                                            }
                                                                                                        </small>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <br />
                                                                                        </div>
                                                                                    )
                                                                                }))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="text-center">
                                                        <h2 className="text-center">ขณะนี้ระบบแนะนำเพื่อนยังไม่เปิดให้ใช้บริการ กรุณารออัพเดทจากระบบนะคะ</h2>
                                                        <br />
                                                        <Link to={`/${this.brand}/member`} className="text-center">กลับหน้าแรก</Link>
                                                    </div>
                                                }
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

export default Invite;
