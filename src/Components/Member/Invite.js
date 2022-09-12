import React, { useState, useEffect } from 'react';
import imgInvite from '../../_assets/app-assets/images/illustration/marketing.png';
import clipboard from '../../_helpers/clipboard';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import Loading from '../Loading';
import brandService from '../../_services/brand.service';
import Moment from 'react-moment';
import { Modal } from 'react-bootstrap';
import InviteList from './InviteList';

export default function Invite(props) {
    const [loading, setLoading] = useState(true);
    const [brand, setBrand] = useState('');
    const [url, setUrl] = useState('');
    const [customerInvites, setCustomerInvites] = useState('');
    const [brandPromotionInvite, setBrandPromotionInvite] = useState();
    const brandName = props.match.params.brand;
    const user = JSON.parse(localStorage.getItem('user'));
    const [btnLogin, setBtnLogin] = useState(false);
    const [modal, setModal] = useState(false);
    const [customerPromotionInvites, setCustomerPromotionInvites] = useState();

    const selectCustomerBonus = () => {
        setBtnLogin(true);
        brandService.getCustomerBonus(user.id)
            .then(response => {
                setCustomerPromotionInvites(response.data);
                setBtnLogin(false);
                setModal(true);
            }).catch(error => {
                setBtnLogin(false);
            });
    }

    useEffect(async () => {
        await brandService.checkBrand(brandName)
            .then(response => {
                setBrand(response.data);
                brandService.getBrandInvitePromotion(response.data.id)
                    .then(response => {
                        if (!response.data) {
                            alert('แนะนำเพื่อนปิดปรับปรุง');
                            // console.log(props);
                            props.history.goBack();
                            return;
                        }
                        if (response.data.status == 0) {
                            alert('แนะนำเพื่อนปิดปรับปรุง');
                            // console.log(props);
                            props.history.goBack();
                            return;
                        }
                        setBrandPromotionInvite(response.data);
                    });
            });
        await brandService.getUrl(user.id)
            .then(response => {
                setUrl(response.data);
            });
        await brandService.getCustomerInvite(user.id)
            .then(response => {
                setCustomerInvites(response.data);
            })
        await setLoading(false);
    }, []);

    return (
        <React.Fragment>
            {(loading)
                ?
                <Loading />
                :
                <React.Fragment>
                    <Modal show={modal} onHide={() => setModal(false)}>
                        <Modal.Header closeButton className="">
                            <Modal.Title className="text-white"> <i class="fad fa-people-carry"></i> รับรางวัลแนะนำเพื่อน</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-white">
                            {(customerPromotionInvites) &&
                                <div className="row">
                                    <div className="col-12">
                                        <ul className="list-group">
                                            {(customerPromotionInvites.map((customer_promotion_invite, key) => {
                                                return (
                                                    <InviteList customer_promotion_invite={customer_promotion_invite} selectCustomerBonus={selectCustomerBonus} setModal={setModal} />
                                                )
                                            }))}
                                        </ul>
                                    </div>
                                </div>
                            }
                        </Modal.Body>
                    </Modal>
                    <div>
                        <div className="row">
                            <div className="col-lg-2 col-md-10">
                                <Navbar props={props} brand={brand}></Navbar>
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
                                            <div>
                                                <p>
                                                    เงื่อนไข: ยอดฝากแรกของเพื่อนเมื่อเพื่อนฝากขั้นต่ำ {brandPromotionInvite.amount_condition}&nbsp;
                                                    {(brandPromotionInvite.status_promotion_condition == 1) &&
                                                        <React.Fragment>
                                                            และต้องรับ {brandPromotionInvite.promotion_condition.name}
                                                        </React.Fragment>
                                                    }
                                                    &nbsp;คนที่ชวนจะได้ รับโบนัส&nbsp;
                                                    {(brandPromotionInvite.status_promotion_receive == 1) ?
                                                        <React.Fragment>
                                                            {(brandPromotionInvite.type_receive == 1)
                                                                ?
                                                                <React.Fragment>
                                                                    เครดิตจำนวน {brandPromotionInvite.amount_receive} สามารถถอนได้เลย
                                                                </React.Fragment>
                                                                :
                                                                <React.Fragment>
                                                                    {brandPromotionInvite.amount_receive} % ของยอดฝากแรก
                                                                </React.Fragment>
                                                            }
                                                            {(brandPromotionInvite.status_promotion_receive == 1) &&
                                                                <React.Fragment>
                                                                    และติดโปรโมชั่น {brandPromotionInvite.promotion_receive.name} จึงสามารถถอนเป็นเงินสดได้
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            {(brandPromotionInvite.type_receive == 1)
                                                                ?
                                                                <React.Fragment>
                                                                    เครดิตจำนวน {brandPromotionInvite.amount_receive} สามารถถอนได้เลย
                                                                </React.Fragment>
                                                                :
                                                                <React.Fragment>
                                                                    {brandPromotionInvite.amount_receive} % ของยอดฝากแรก
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                </p>
                                                <div className="content-body">
                                                    <img
                                                        src={imgInvite}
                                                        width="250"
                                                        className="img-fluid img-center"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6 mx-auto">
                                                        <div className="input-group">
                                                            <input type="text" className="form-control form-control form-auto" defaultValue={user.invite_url} readOnly />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-auto waves-effect" type="button" onClick={() => clipboard(user.invite_url)}>
                                                                    <i className="fa fa-clipboard"></i> คัดลอก
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-lg-6 mx-auto mt-2">
                                                        <button className='btn btn-auto btn-block' onClick={selectCustomerBonus} disabled={btnLogin}>
                                                            {btnLogin ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : <i className='fad fa-gift'></i>}&nbsp;
                                                            รับโบนัส
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h4>{brandPromotionInvite.name}</h4>
                                            <div className='pull-right'>
                                                {customerInvites.length} คน
                                            </div>
                                            <p> <i className='fad fa-user-friends'></i> เพื่อนของคุณทั้งหมด </p>
                                            <hr />
                                            {(customerInvites) &&
                                                <div className="row">
                                                    <div className="col-12 col-sm-8 col-lg-6">
                                                        <ul className="list-group">
                                                            {(customerInvites.map((customer_invite, key) => {
                                                                return (
                                                                    <React.Fragment key={key}>
                                                                        <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                                                            <div className="flex-column">
                                                                                <h5> {customer_invite.name}</h5>
                                                                                <p className='mb-0'><small>ออนไลน์ล่าสุด: &nbsp;

                                                                                    <Moment format="DD/MM/YYYY H:mm:s">
                                                                                        {customer_invite.last_login}
                                                                                    </Moment>&nbsp;(
                                                                                    <Moment fromNow>
                                                                                        {customer_invite.last_login}
                                                                                    </Moment>
                                                                                    )
                                                                                </small></p>
                                                                            </div>
                                                                        </a>
                                                                    </React.Fragment>
                                                                )
                                                            }))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Footer props={props} brand={brand} url={url}></Footer>
                    </div>
                </React.Fragment>
            }
        </React.Fragment >
    )
}
