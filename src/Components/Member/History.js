import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';

class History extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            customer_deposits: '',
            customer_withdraws: '',
            customer_promotion_costs: '',
            url: '',
        }
        this.hideModal = this.hideModal.bind(this);
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
                    })
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                this.setState({
                                    modal: true
                                });
                            }
                        }, (err) => {
                            console.log(err);
                        });
                }
            }, (error) => {
                console.log(error);
                this.setState({
                    loading: false
                })
            });
        brandService.history(this.state.user.id)
            .then((response) => {
                this.setState({
                    customer_deposits: Object.values(response.data.data.customer_deposits),
                    customer_withdraws: Object.values(response.data.data.customer_withdraws),
                    customer_promotion_costs: Object.values(response.data.data.promotion_costs)
                });
                this.setState({
                    loading: false
                })
            }, (error) => {
                this.setState({
                    loading: false
                })
            });
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
                                                <h2 className='text-warning'> <i className="fad fa-list"></i> ประวัติการทำธุรกรรม</h2>
                                                <hr />
                                                <div className="bg-normal p-3">
                                                    <h4 className="">ถอนเงิน</h4>
                                                    <hr />
                                                    {this.state.customer_withdraws.map((data, index) => (

                                                        <div key={index} className="col-lg-12">
                                                            {console.log(data)}
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item p-4">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-auto pr-0">
                                                                            <span className="text-danger">
                                                                                <i className="fa fa-arrow-up"></i>
                                                                            </span>
                                                                        </div>
                                                                        <div className="col align-self-center pr-0">
                                                                            <h6 className="small text-secondary cut-text">
                                                                                {/* โปรโมชั่น: {data[0].remark} */}
                                                                            </h6>
                                                                            <h6>ถอนเงิน</h6>
                                                                            <p className="small text-secondary">
                                                                                เวลา: {this.stringToDate(data.updated_at)}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <h6 className="text-danger">{data.amount}</h6>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="bg-normal p-3">
                                                    <h4 className="">เติมเงิน</h4>
                                                    <hr />
                                                    {this.state.customer_deposits.map((data, index) => (

                                                        <div key={index} className="col-lg-12">
                                                            {console.log(data)}
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item p-4">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-auto pr-0">
                                                                            <span className="text-success">
                                                                                <i className="fa fa-arrow-down"></i>
                                                                            </span>
                                                                        </div>
                                                                        <div className="col align-self-center pr-0">
                                                                            <h6 className="small text-secondary cut-text">
                                                                                {/* โปรโมชั่น: {data[0].remark} */}
                                                                            </h6>
                                                                            <h6>เติมเงิน</h6>
                                                                            <p className="small text-secondary">
                                                                                เวลา: {this.stringToDate(data.updated_at)}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <h6 className="text-success">{data.amount}</h6>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="bg-normal p-3">
                                                    <h4 className="">เครดิตฟรี</h4>
                                                    <hr />
                                                    {this.state.customer_promotion_costs.map((data, index) => (

                                                        <div key={index} className="col-lg-12">
                                                            {console.log(data)}
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item p-4">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-auto pr-0">
                                                                            <span className="text-white">
                                                                                <i className="fa fa-qrcode"></i>
                                                                            </span>
                                                                        </div>
                                                                        <div className="col align-self-center pr-0">
                                                                            <h6 className="small text-secondary cut-text">
                                                                                {/* โปรโมชั่น: {data[0].remark} */}
                                                                            </h6>
                                                                            <h6>{data.promotion.name}</h6>
                                                                            <p className="small text-secondary">
                                                                                เวลา: {this.stringToDate(data.updated_at)}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <h6 className="text-danger">{data.bonus}</h6>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <Footer props={this.props} brand={this.state.brand}></Footer>
                        </div>
                }
            </div>
        );
    }
}

export default History;
