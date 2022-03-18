import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import clipboard from '../../_helpers/clipboard';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            profile: '',
            url: '',
        }
        this.hideModal = this.hideModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
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
                    // console.log(response);
                    this.setState({
                        brand: response.data,
                    })
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            // console.log(response.data);
                            this.setState({
                                profile: response.data,
                            })
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                this.setState({
                                    modal: true,
                                });
                            }
                            this.setState({
                                loading: false
                            })
                        }, (err) => {
                            console.log(err);
                        })
                }
            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            })
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

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.props.history.push(`/${this.brand}/login`);
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
                                                <h2 className='text-warning'> <i className="fad fa-id-card"></i> ข้อมูลลูกค้า</h2>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <div class="card card-auto-1">
                                                            <div className="card-body">

                                                                <h4>
                                                                    <i className="fad fa-user"></i> โปรไฟล์
                                                                </h4>
                                                                <hr />
                                                                <p> <b>ชื่อ/สกุล: </b> {this.state.profile.name}</p>
                                                                <p> <b>เบอร์โทรศัพท์: </b> {this.state.profile.telephone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-md-4">
                                                        <div className="card bg-info">
                                                            <div className="card-body">
                                                                <h4 className=""> <i className="fad fa-gamepad"></i> ไอดีเข้าเล่นเกมส์</h4>
                                                                <hr className="hr-white" />
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="card" style={{
                                                            background: this.state.profile.bank.bg_color,
                                                            color: this.state.profile.bank.font_color,
                                                        }}>
                                                            <div className="card-body">
                                                                <h2 className="card-title">บัญชีธนาคาร</h2>
                                                                <hr style={{ borderColor: this.state.profile.bank.font_color }} />
                                                                <img
                                                                    src={
                                                                        this.state.profile.bank.logo === undefined
                                                                            ? ""
                                                                            : "https://bot.tbf.bet/" + this.state.profile.bank.logo
                                                                    }
                                                                    alt=""
                                                                    width="60"
                                                                />{" "}
                                                                <p className="mt-2">
                                                                    {this.state.profile.bank.name} ชื่อ: {this.state.profile.name} เลขที่บัญชี: {" "}
                                                                    {this.state.profile.bank_account}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <a href={`https://line.me/R/ti/p/~@${this.state.brand.line_id}`} className="btn btn-auto btn-block btn-lg ">
                                                            <i className="fab fa-line mr-2" />
                                                            แจ้งเปลี่ยนเลขบัญชีธนาคาร / ลืมรหัสผ่าน
                                                        </a>
                                                        <a onClick={this.handleLogout} className="btn btn-danger btn-block btn-lg ">
                                                            <i className="fad fa-power-off mr-2"></i>
                                                            ออกจากระบบ
                                                        </a>
                                                    </div>
                                                </div>
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

export default Profile;
