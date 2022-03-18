import React, { Component } from 'react';

class Loading extends Component {
    render() {
        return (
            <div>
                <div className="app-content content ">
                    <div className="content-wrapper">
                        <div className="content-body">
                            <div className="auth-wrapper auth-v1 px-2">
                                <div className="auth-inner py-2">
                                    <div className="text-center">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;
