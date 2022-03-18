import React, { Component } from 'react';
import Loading from '../Loading';

class RegisterSuccess extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            brand: '',
            loading: true,
            user: JSON.parse(localStorage.getItem('user'))
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                {
                    (loading)
                        ?
                        <Loading></Loading>
                        :
                        <div>
                            <div className="app-content content">
                                <div className="content-wrapper">
                                    <div className="content-body">
                                        <div className="auth-wrapper auth-v1 px-2">
                                            <div className="auth-inner py-2">
                                                <div className="card card-auto-2">
                                                    <div className="card-body ">
                                                        <h2 className="text-center"> ✅ สมัครสมาชิกสำเร็จ</h2>
                                                        <br />
                                                        <p className="text-center">คุณ {this.state.user.name}</p>
                                                        <br />
                                                        <p className="text-center"> ไอดีเข้าเล่นเกมส์: {this.state.user.username}</p>
                                                        <p className="text-center">รหัสผ่าน: {this.state.user.password_generate}</p>
                                                        <br />
                                                        <button className="btn btn-block btn-lg btn-auto-2" onClick={(e) => this.props.history.push(`/${this.brand}/member`)}>
                                                            🚪 เข้าสู่ระบบ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                }
            </div>
        );
    }
}

export default RegisterSuccess;
