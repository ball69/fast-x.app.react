import React, { Component } from 'react';
import { connect } from 'react-redux';
import brandService from '../_services/brand.service';
import { history } from '../_helpers';

class Brand extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            brand: ''
        }

        // console.log(props);
    }

    componentWillMount() {
        const { brand } = this.props.match.params;
        brandService.checkBrand(brand)
            .then(response => {
                if (response.data) {
                    // console.log(this.props);
                    this.setState(() => {
                        return { brand: response.data };
                    })
                } else {
                    history.push('/')
                }
            }, (err) => {
                alert(err);
            });
    }

    render() {
        return (
            <div>

            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        brand: state.brand.brand,
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(Brand);
