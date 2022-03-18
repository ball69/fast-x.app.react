import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
// import { Login } from '../Auth/Login';

class Auth extends Component {

    constructor(props) {
        super(props);
        // this.subdomain = this.props.match.params.subdomain;
    }

    componentWillMount() {
        this.subdomain = this.props.match.params.subdomain;
    }

    render() {
        return (
            <div>
                <h2>Auth</h2>
                {console.log(this.subdomain)}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        brand: state.brand
    }
}

export default connect(mapStateToProps)(Auth);
