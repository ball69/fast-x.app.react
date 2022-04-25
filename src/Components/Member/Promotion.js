import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';

class Promotion extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            promotions: '',
            promotionLast: '',
            profile: '',
            buttonPromotionLoad: 0,
            url: '',
        }
        this.segments = [
            'better luck next time',
            'won 70',
            'won 10',
            'better luck next time',
            'won 2',
            'won uber pass',
            'better luck next time',
            'won a voucher'
        ]
        this.segColors = [
            '#EE4040',
            '#F0CF50',
            '#815CD1',
            '#3DA5E0',
            '#34A24F',
            '#F9AA1F',
            '#EC3F3F',
            '#FF9000'
        ]
        this.hideModal = this.hideModal.bind(this);
        this.onFinished = this.onFinished.bind(this);
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
                        brand: response.data,
                        // promotions: response.data.promotions,
                    });
                    brandService.getPromotion(this.state.user.id)
                        .then((response) => {
                            console.log(response);
                            this.setState({
                                promotions: response.data
                            })
                        }, (error) => {
                            console.log(error);
                        });
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            this.setState({
                                profile: response.data
                            });
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                this.setState({
                                    modal: true
                                });
                            }
                        }, (err) => {
                            console.log(err);
                        });
                    brandService.credit(this.state.user.id)
                        .then((response) => {
                            if (response.data) {
                                this.setState({
                                    promotionLast: response.data.promotion_last,
                                })
                            }
                        }, (error) => {
                            console.log(error);
                        })
                    this.setState({
                        loading: false
                    })
                }
            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            })
    }

    onFinished(winner) {
        console.log(winner);
    }

    updatePromotion(e, promotion_id) {
        this.setState({
            buttonPromotionLoad: promotion_id
        })
        brandService.selectPromotion(this.state.user.id, promotion_id)
            .then((response) => {
                if (response.status == 'success') {
                    NotificationManager.success(response.msg, 'เลือกโปรโมชั่นสำเร็จ');
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
                            });
                            window.location.reload(true);
                        }, (error) => {
                            console.log(error);
                        });

                    this.setState({
                        buttonPromotionLoad: 0
                    });
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
                                                <div>
                                                    {/* <WheelComponent
                                                        segments={this.segments}
                                                        segColors={this.segColors}
                                                        winningSegment='won 10'
                                                        onFinished={(winner) => this.onFinished(winner)}
                                                        primaryColor='black'
                                                        contrastColor='white'
                                                        buttonText='Spin'
                                                        isOnlyOnce={false}
                                                        size={290}
                                                        upDuration={100}
                                                        downDuration={1000}
                                                        fontFamily='Arial'
                                                    /> */}
                                                </div>
                                                {
                                                    (this.state.promotions.length > 0)
                                                        ?
                                                        <div className="">
                                                            {/* <div className="pull-right">
                                                                <button type="button" onClick={() => this.updatePromotion(0)} className="btn btn-auto pull-right btn-3">
                                                                    <i className="fad fa-ban mr-1"></i>
                                                                    ไม่รับโบนัส </button>
                                                            </div> */}
                                                            <h2 className='text-warning'> <i className="fad fa-gift-card"></i> โปรโมชั่น</h2>
                                                            <hr />
                                                            <div className="row">
                                                                {this.state.promotions.filter(promotion => promotion.status != 0).map((promotion, key) => {
                                                                    return (
                                                                        <div className="col-lg-3 mb-5" key={key}>
                                                                            <div className="box-promotion">
                                                                                <img src={`${promotion.img_url}`}
                                                                                    className="img-fluid img-center" alt="" />
                                                                                <p className="pt-2 text-center">{promotion.name}</p>
                                                                                {
                                                                                    ([1, 2, 3].includes(promotion.type_promotion) && promotion.active == 1)
                                                                                        ?
                                                                                        <button type="button"
                                                                                            onClick={(e) => this.updatePromotion(e, promotion.id)}
                                                                                            className="btn btn-auto btn-lg btn-block pull-right btn-3"
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

                                    </div>
                                </div>
                            </div>
                            <Footer props={this.props} brand={this.state.brand} url={this.state.url}></Footer>
                        </div >
                }
            </div>
        );
    }
}

export default Promotion;
