import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import clipboard from '../../_helpers/clipboard';

class Deposit extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            modalPromotion: false,
            profile: '',
            promotionNow: '',
            promotions: [],
            radio: 2,
            url: '',
            bankAccountWebs: '',
        }
        this.hideModal = this.hideModal.bind(this);
        this.hideModalPromotion = this.hideModalPromotion.bind(this);
        this.handlePromotionChange = this.handlePromotionChange.bind(this)
    }

    handlePromotionChange(e) {
        const { target: { value } } = e;
        console.log(value);
        brandService.updatePromotion(this.state.user.id, value)
            .then((response) => {
                const promotion_name = (response.data) ? response.data.name : 'ไม่รับโบนัส';
                NotificationManager.success(promotion_name, 'เลือกโปรโมชั่นสำเร็จ')
            }, (error) => {
                console.log(error);
            });
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        await brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                    return;
                } else {
                    const promotions = (response.data) ? response.data.promotions : "";
                    this.setState({
                        brand: response.data,
                        // promotions: response.data.promotions
                    });
                    brandService.getPromotion(this.state.user.id)
                        .then((response) => {
                            if (this.state.profile.promotion_id != 0) {
                                this.setState({
                                    modalPromotion: true,
                                });
                            }
                            this.setState({
                                promotions: response.data
                            })
                        }, (error) => {
                            console.log(error);
                        })
                    brandService.getBankAccount(this.state.user.brand_id)
                        .then(response => {
                            this.setState({
                                bankAccountWebs: response.data
                            });
                        }, (error) => {
                            console.log(error);
                        });
                }
            }, (error) => {
                console.log(error);
                this.setState({
                    loading: false
                });
            })
        await brandService.profile(this.state.user.id)
            .then((response) => {
                this.setState({
                    profile: response.data,
                    promotionNow: response.data,
                });
                // if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                //     // this.setState({
                //     //     modal: true
                //     // });
                //     this.setState({
                //         loading: false
                //     });
                // }
            }, (err) => {
                console.log(err);
            });
        this.setState({
            loading: false
        });
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

    hideModal = () => {
        this.setState({ modal: false });
    };

    hideModalPromotion = () => {
        this.setState({ modalPromotion: false });
    };

    render() {

        const { profile } = this.state;
        return (
            <div>
                {/* <Modal show={this.state.modal} onHide={this.hideModal}>
                    <Modal.Header closeButton className="btn-auto-line">
                        <Modal.Title className="text-white"> <i className="fab fa-line "></i> เชื่อมต่อไอดีไลน์</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-white">
                        <Link href={`https://line.tbf.bet/connect/${this.brand}`} variant="secondary" className="btn btn-auto-line btn-block btn-lg">

                            <span className="text-center d-block">เพื่อรับการแจ้งเตือน และ สิทธิ์ประโยชน์มากมาย แบบ VIP</span>
                            <i className="fad fa-bell-on fa-5x mr-1 mb-5 mt-5" ></i>
                            <span className="text-center d-block mb-3">ไอดีเข้าเกมส์: {this.state.user.username}</span>
                            <span className="mb-5">
                                คลิกเพื่อเชื่อมต่อ</span>
                        </Link>
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
                                {/* <Modal show={this.state.modalPromotion} onHide={this.hideModalPromotion}>
                                    <Modal.Header closeButton className="btn-warning">
                                        <Modal.Title className="text-white"> <i className="fad fa-tags"></i> โปรโมชั่นที่คุณเลือก</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="bg-white text-dark">
                                        {
                                            (this.state.profile.promotion)
                                                ?
                                                <div className="mb-0">
                                                    <p className="">{this.state.profile.promotion.name}</p>
                                                    <p className="">เติมขั้นต่ำ: {this.state.profile.promotion.min} บาท</p>
                                                </div>
                                                :
                                                <div></div>
                                        }
                                    </Modal.Body>
                                </Modal> */}
                                <div className="col-lg-10 col-md-10">
                                    <div className="app-content content">
                                        <div className="content-wrapper">
                                            <div className="clearfix" />
                                            <div className="content-body">
                                                <h2 className='text-warning'> <i className="fad fa-hand-holding-usd"></i> เติมเงิน</h2>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="card bg-warning">
                                                            <div className="card-body">
                                                                <h5 className="text-dark">
                                                                    <i className="fa fa-file-alt pr-1"></i>
                                                                    <b>คำเตือน โปรดอ่านก่อนเริ่มใช้งาน!!</b>
                                                                </h5>
                                                                <hr className="hr-red" />
                                                                <p className="text-dark">
                                                                    1. ระบบของเราเป็นระบบอัตโนมัติ
                                                                    โปรดตรวจสอบข้อมูลให้ถี่ถ้วนก่อนเริ่มใช้งาน
                                                                </p>
                                                                <p className="text-dark">
                                                                    2. หากชื่อของบัญชีธนาคารที่ท่านสมัครไม่ตรงกับชื่อบัญชีที่ใช้
                                                                    เงินของท่านอาจจะไม่เข้่าสู่ระบบ
                                                                </p>
                                                                <p className="text-dark">
                                                                    3. หากตรวจสอบแล้วข้อมูลของท่านไม่ถูกต้อง
                                                                    โปรดแจ้งทีมงานให้ทราบก่อนเริ่มทำรายการ
                                                                </p>
                                                                <p className="text-dark mt-2">
                                                                    <b>บัญชีธนาคารของคุณ</b>
                                                                </p>
                                                                <p className="text-dark">
                                                                    {
                                                                        (profile)
                                                                            ?
                                                                            <div>

                                                                                <img
                                                                                    src={
                                                                                        profile.bank.logo === undefined
                                                                                            ? ""
                                                                                            : "https://a90.appy.bet/" + profile.bank.logo
                                                                                    }
                                                                                    alt=""
                                                                                    width="30"
                                                                                />{" "}
                                                                                <b>
                                                                                    {profile.bank.name} ชื่อ: {profile.name} เลขที่บัญชี:{" "}
                                                                                    {profile.bank_account}
                                                                                </b>
                                                                            </div>
                                                                            :
                                                                            ''
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="card bg-danger card-normal">
                                                            <div className="card-body">
                                                                <h5 className="text-white">
                                                                    <i className="fa fa-exclamation-triangle pr-1"></i>
                                                                    <b>คำเตือน กรณีรับโปรโมชั่น!!</b>
                                                                </h5>
                                                                <hr className="hr-white" />
                                                                <p className="text-white font-bold"><b>กรณที่ลูกค้ารับโปรโมชั่นอยู่ แล้วลูกค้าโอนเงินมาเพิ่ม ทางเราจะดึงโบนัสที่ลูกค้าได้คืนทันที</b></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    (this.state.brand.type_deposit == 1)
                                                        ?
                                                        <div className="row">
                                                            {/* <div className="col-lg-12">
                                                                <h4>1. เลือกโปรโมชั่นก่อนโอนเงิน</h4>
                                                                <hr />
                                                                <div className="form-group">
                                                                    <select className="form-control form-control-lg form-auto" id="basicSelect" onChange={this.handlePromotionChange} disabled={(this.state.profile.promotion_id != 0) ? true : false}>
                                                                        <option value="0">ไม่รับโบนัส</option>
                                                                        {this.state.promotions.filter(promotion => promotion.status == 1).map((promotion) =>
                                                                        (
                                                                            ([1, 2, 3].includes(promotion.type_promotion) && this.state.profile.promotion_id != promotion.id && this.state.promotionNow == null)
                                                                                ?
                                                                                <option value={promotion.id} selected={promotion.id === this.state.promotionNow.id}>{promotion.name}</option>
                                                                                :
                                                                                ''
                                                                        )
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                            <div className="col-lg-12">
                                                                <h4>1. โอนเงินเข้าบัญชีธนาคาร</h4>
                                                                <hr />
                                                                <div className="row">
                                                                    {this.state.bankAccountWebs.map((bank, index) => (
                                                                        (
                                                                            [0, 1, 6, 8, 9, 11].includes(bank.type)
                                                                                ?
                                                                                <div key={index} className="col-lg-2 col-6">
                                                                                    <div
                                                                                        className="card"
                                                                                        style={{
                                                                                            background: bank.bank.bg_color,
                                                                                            color: bank.bank.font_color,
                                                                                            borderRadius: "5",
                                                                                        }}
                                                                                    >
                                                                                        <div className="card-body">
                                                                                            <img
                                                                                                src={"https://a90.appy.bet/" + bank.bank.logo}
                                                                                                className="img-fluid img-center mb-5"
                                                                                                width="60"
                                                                                                alt=""
                                                                                            />
                                                                                            <h6
                                                                                                className="mt-1"
                                                                                                style={{
                                                                                                    color: bank.bank.font_color,
                                                                                                }}
                                                                                            >
                                                                                                {bank.bank.name}
                                                                                            </h6>
                                                                                            <h4
                                                                                                className="mt-3 mb-3"
                                                                                                style={{
                                                                                                    color: bank.bank.font_color,
                                                                                                    fontSize: '20px',
                                                                                                }}
                                                                                            >
                                                                                                {bank.account}
                                                                                            </h4>
                                                                                            <p className="mb-5">{bank.name}</p>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-auto btn-sm mt-2 btn-block mx-auto rounded text-dark"
                                                                                                value={bank.account}
                                                                                                onClick={(e) => clipboard(e.target.value)}
                                                                                            >
                                                                                                <i className="fa fa-copy"></i> คัดลอก
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                ''
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <h4>2. เครดิตจะเข้าอัตโนมัติภายใน 30 วินาที</h4>
                                                                <hr />
                                                            </div>

                                                            <div className="col-lg-12">
                                                                <h4>3. กรณีรับโปรโมชั่น</h4>
                                                                <hr />
                                                                <Link to={`/${this.brand}/member/promotion`} type="button" className="btn btn-auto btn-block btn-lg">

                                                                    <i className="fad fa-tag mr-2"></i>
                                                                    เลือกโปรโมชั่น
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <h4> <i className="fad fa-exclamation-triangle pr-1"></i> ขณะนี้ระบบธนาคาร SCB มีปัญหากรุณาโอนเงินมาที่ธนาคาร</h4>
                                                                <hr />
                                                                <div className="row">
                                                                    {this.state.bankAccountWebs.map((bank, index) => (
                                                                        (
                                                                            [2, 9, 8].includes(bank.type)
                                                                                ?
                                                                                <div key={index} className="col-lg-2 col-6">
                                                                                    <div
                                                                                        className="card"
                                                                                        style={{
                                                                                            background: bank.bank.bg_color,
                                                                                            color: bank.bank.font_color,
                                                                                            borderRadius: "5",
                                                                                        }}
                                                                                    >
                                                                                        <div className="card-body">
                                                                                            <img
                                                                                                src={"https://a90.appy.bet/" + bank.bank.logo}
                                                                                                className="img-fluid img-center mb-5"
                                                                                                width="60"
                                                                                                alt=""
                                                                                            />
                                                                                            <h6
                                                                                                className="mt-1"
                                                                                                style={{
                                                                                                    color: bank.bank.font_color,
                                                                                                }}
                                                                                            >
                                                                                                {bank.bank.name}
                                                                                            </h6>
                                                                                            <h4
                                                                                                className="mt-1"
                                                                                                style={{
                                                                                                    color: bank.bank.font_color,
                                                                                                }}
                                                                                            >
                                                                                                {bank.account}
                                                                                            </h4>
                                                                                            <p className="mb-5">{bank.name}</p>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-auto btn-sm mt-2 btn-block mx-auto rounded text-dark"
                                                                                                value={bank.account}
                                                                                                onClick={(e) => clipboard(e.target.value)}
                                                                                            >
                                                                                                <i className="fa fa-copy"></i> คัดลอก
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                ''
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="col-lg-12">
                                                                <h4 className="text-center">โอนเสร็จแล้วรบกวนแจ้งสลิป</h4>
                                                                <hr />
                                                                <a href={`https://line.me/R/ti/p/~@${this.state.brand.line_id}`} className="text-center img-center">คลิกที่นี่เพื่อแจ้งสลิปการโอนเงิน</a>
                                                            </div>
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



export default Deposit;
