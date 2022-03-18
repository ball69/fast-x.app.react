import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';

class Example extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
        }
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        brandService.checkBrand(this.brand)
            .then((response) => {
                // console.log(response);
                this.setState({
                    brand: response.data,
                })
                this.setState({
                    loading: false
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
                    })
            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            })
    }

    hideModal = () => {
        this.setState({ modal: false });
    };

    render() {
        return (
            <div>
                <Modal show={this.state.modal} onHide={this.hideModal}>
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
                </Modal>
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
                                                <h2>Example</h2>
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

export default Example;
