import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.props.match.params.brand;
        this.pathname = this.props.props.location.pathname;
        this.url = this.props.url;
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            url: '',
        }
    }

    componentDidMount() {
        // brandService.getUrl(this.state.user.id)
        //     .then((response) => {
        //         this.setState({
        //             url: response.data
        //         })
        //     }, (error) => {
        //         console.log(error);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
    }

    render() {
        return (
            <div>

                <div className="bottombar-mobile d-lg-none">
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link className="nav-link" to={`/${this.brand}/member`}> <i className="fad fa-home" /> <span>หน้าแรก </span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link " to={`/${this.brand}/member/deposit`}> <i className="fad fa-hand-holding-usd" /><span>เติมเงิน</span></Link>
                        </li>
                        <li className="nav-item middle-item">
                            <a href={this.url} className="nav-link btn-auto">
                                <i className="fad fa-gamepad-alt" />
                            </a>
                            <span className="text-auto">เข้าเล่นเกม</span>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link " to={`/${this.brand}/member/withdraw`}>  <i className="fad fa-credit-card" /><span>ถอนเงิน</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link " to={`/${this.brand}/member/profile`}> <i className="fad fa-user" /> <span>โปรไฟล์ฉัน</span></Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Footer;
