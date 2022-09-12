import React from 'react'
import brandService from '../../_services/brand.service';
import { NotificationManager } from 'react-notifications';

export default function InviteList({ customer_promotion_invite, selectCustomerBonus, setModal }) {

    const receiveCustomerBonus = (customer_promotion_invite_id) => {
        setModal(false);
        brandService.receiveCustomerBonus(customer_promotion_invite.id)
            .then(response => {
                if (response.status == 200) {
                    NotificationManager.success(response.msg, '', 1000);
                } else {
                    NotificationManager.warning(response.msg, '', 1000);
                }
            }).catch(error => {
                console.log(error);
            })
    }

    return (
        <React.Fragment >
            <a className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => receiveCustomerBonus(customer_promotion_invite.id)}>
                <div className="flex-column">

                    <h5> {customer_promotion_invite.customer.name}</h5>
                    <p className='mb-0'><small>ยอดฝากแรก: {customer_promotion_invite.amount} เครดิต
                    </small></p>
                </div>
                <div className='pull-right'>
                    <button className='btn btn-primary' >
                        <i className="fas fa-donate text-dark"></i>
                    </button>
                </div>
            </a>
        </React.Fragment>
    )

}
