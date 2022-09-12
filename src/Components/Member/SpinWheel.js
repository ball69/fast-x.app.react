import React, { useEffect, useState } from "react";
import brandService from '../../_services/brand.service';
import wheelService from '../../_services/wheel.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import imgStartButton from '../../_assets/images/wheelbt-01.png';
import imgStartButton2 from '../../_assets/images/wheelbt-02.png';
import YouTube from 'react-youtube';
import { NotificationManager } from 'react-notifications';

const Example = (props) => {
    const [loading, setLoading] = useState(true);
    const [brand, setBrand] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [url, setUrl] = useState('');
    const brandName = props.match.params.brand;
    const user = JSON.parse(localStorage.getItem('user'));
    const [spinSlot, setSpinSlot] = useState(['loading...', 'loading...', 'loading...', 'loading...', 'loading...', 'loading...', 'loading...', 'loading...']);
    const spinning = selectedItem !== null ? 'spinning' : '';
    const wheelVars = { '--nb-item': spinSlot.length, '--selected-item': selectedItem };
    const [wheelAmount, setWheelAmount] = useState(0);
    const [videoId, setVideoId] = useState(null);
    const [wheelResult, setWheelResult] = useState(null);
    const [amountCondition, setAmountCondition] = useState(0);
    const [wheelScore, setWheelScore] = useState(0);
    const [wheelStatus, setWheelStatus] = useState(false);
    const [scorePercent, setScorePercent] = useState(0);
    const [scorePercentString, setScorePercentString] = useState(0);
    const [modalReward, setModalReward] = useState(false);
    const [rewardString, setRewardString] = useState('');
    const [customerWheels, setCustomerWheels] = useState([]);
    const [timeHour, setTimeHour] = useState('');
    const [timeHourStatus, setTimeHourStatus] = useState('');
    const [wheelTimeHour, setWheelTimeHour] = useState('');
    const [promotionLast, setPromotionLast] = useState('');
    const [credit, setCredit] = useState('');
    const [spinReward, setSpinReward] = useState('');
    const youtubeOptions = {
        height: '1080',
        width: '970',
        playerVars: {
            controls: 0,
            autohide: 0,
            rel: 0,
            loop: 1,
            playsinline: 1,
            showinfo: 0,
            disabledkb: 1,
            cc_load_policy: 0,
            playsinline: 0,
        },
    };
    const [modalYoutube, setModalYoutue] = useState(false);
    let [timeSkip, setTimeSkip] = useState('');
    const [pauseVideo, setPauseVideo] = useState(0);
    const [bindMouse, setBindMouse] = useState(false);
    var timeSkipInterval;

    const startSpin = async () => {
        if (selectedItem === null) {
            let selected;
            await spinSlot.map((item, index) => {
                if (wheelResult === item[0]) {
                    selected = index;
                }
            });
            await setSelectedItem(selected);
            await setWheelAmount(wheelAmount - 1);
            await setWheelStatus(false);
            await setTimeout(async () => {
                await setWheelScore(0);
                await setScorePercent(0);
                await setScorePercentString(0);
                await setModalReward(true);
                await setRewardString(spinSlot[selected][1]);
                await setSpinReward(spinSlot[selected][0]);
                await getReward(spinSlot[selected][0]);
            }, 1500);
        } else {
            await setSelectedItem(null);
        }
    };

    function clodeModalYoutube() {

        setModalYoutue(false);

    }

    function youtubeStateChange(event) {
        setBindMouse(true);
        if (event.data === 1) {
            timeSkipInterval = setInterval((e) => {
                if (timeSkip === 0) {
                    setTimeSkip(0);
                    setPauseVideo(1);
                    setModalYoutue(false);
                    setBindMouse(false);
                } else {
                    setTimeSkip(timeSkip--);
                }
            }, 1500);

            // window.location.reload(true);
        }
        if (event.data === 0) {
            var youtueElement = document.querySelector('#youtue-iframe');
            youtueElement.parentNode.removeChild(youtueElement);
            setTimeSkip(0);
            setPauseVideo(1);
            setModalYoutue(false);
            setBindMouse(false);
            // window.location.reload(true);
        }
    }

    useEffect(async () => {
        await brandService.checkBrand(brandName)
            .then((response) => {
                setBrand(response.data);
            }, () => {
            });
        await brandService.getUrl(user.id)
            .then((response) => {
                setUrl(response.data);
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            });
        await brandService.credit(user.id)
            .then((response) => {
                if (response.data) {
                    const credit = (response.data.credit) ? parseFloat(response.data.credit).toFixed(2) : 0.00;
                    setCredit(response.data.credit);
                    setPromotionLast(response.data.promotion_last);
                }
            }, (error) => {
                this.setState({
                    loadingCredit: false
                });
            });

        await wheelService.config(user.id)
            .then((response) => {
                if (response.wheel.status == 1) {
                    installSpinWheel(response);
                    setCustomerWheels(response.customer_wheels);
                    setTimeHour(response.time_hour);
                    setTimeHourStatus(response.time_hour_status);
                    if (response.wheel.type_condition == 1) {
                        setModalYoutue(true);
                    }
                    setLoading(false);
                } else {
                    alert('ระบบวงล้อกำลังจะเปิดให้บริการเร็วๆ นี้');
                    props.history.push(`/${props.match.params.brand}/member`);
                }
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    const installSpinWheel = (data) => {

        let percent = data.wheel_score / data.wheel.amount_condition * 100;

        let percentString = (data.wheel_score / data.wheel.amount_condition * 100) + '%';

        setWheelAmount(data.wheel_amount);

        if (data.wheel_amount > 1) {
            setWheelAmount(1);
        }

        if (data.wheel_amount > 0) {
            setWheelStatus(true);
        }

        setWheelTimeHour(data.wheel.time_hour);

        setAmountCondition(data.wheel.amount_condition);

        setWheelScore(data.wheel_score);

        setVideoId(data.wheel.code_youtube);

        setWheelResult(data.result);

        setTimeSkip(data.wheel.time_youtube);

        setScorePercent(percent);

        setScorePercentString(percentString);

        let spinSlot = [];

        if (data.wheel.slot_amount == 8) {

            data.wheel.wheel_slot_eights.forEach((v, k) => {
                // console.log(v);
                if (v.type == 0) {
                    spinSlot.push([v.id, v.promotion.name]);
                } else if (v.type == 1) {
                    spinSlot.push([v.id, v.credit + ' $']);
                } else if (v.type == 2) {
                    spinSlot.push([v.id, v.promotion_other]);
                }
            })

        } else if (data.wheel.slot_amount == 10) {

            data.wheel.wheel_slot_tens.forEach((v, k) => {
                // console.log(v);
                if (v.type == 0) {
                    spinSlot.push([v.id, v.promotion.name]);
                } else if (v.type == 1) {
                    spinSlot.push([v.id, v.credit + ' $']);
                } else if (v.type == 2) {
                    spinSlot.push([v.id, v.promotion_other]);
                }
            })

        }

        setSpinSlot(spinSlot);

    }

    const closeRewardModal = () => {
        setModalReward(false);
    }

    const stringToDate = (string) => {
        var date = new Date(string);
        var test = date.toLocaleString("th-TH");
        return test;
    }

    const getReward = (reward) => {
        wheelService.reward({
            customer_id: user.id,
            wheel_slot_config_id: reward
        }).then((response) => {
            if (response.status === 500) {
                NotificationManager.warning(response.message, '');
                // window.location.reload(true);
            } else {
                NotificationManager.info(response.message, '');
                // window.location.reload(true);
            }
        }, (error) => {
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });;
    }

    const currencyFormat = (num) => {
        return '$ ' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className="bg-spin-wheel">
            {
                (loading == true)
                    ?
                    <Loading></Loading>
                    :
                    <div>
                        <Modal show={modalReward} data-toggle="modal" data-backdrop="static" data-keyboard="false">
                            <Modal.Body className="bg-white" style={{ borderRadius: '12px' }}>
                                <h1 className="text-center pb-3 pt-3">
                                    <i className="fad fa-glass-cheers text-dark fa-3x"></i>
                                </h1>
                                <h3 className="text-center text-dark pt-2 pb-2">ขอแสดงความยินดี</h3>
                                <h3 className="text-center text-dark pt-2 pb-2">Username: {user.username}</h3>
                                <h3 className="text-dark text-center pt-2 pb-4"> คุณได้
                                    "<span >{rewardString}</span>"
                                </h3>
                                <button className="btn btn-success btn-lg btn-block" onClick={() => window.location.reload(true)}>ตกลง</button>
                            </Modal.Body>
                        </Modal>
                        <Modal show={modalYoutube} data-toggle="modal" data-backdrop="static" data-keyboard="false">
                            <Modal.Body className="bg-white" style={{
                                pointerEvents: bindMouse ? 'none' : 'all'
                            }}>
                                <div id="youtue-iframe">
                                    <div className="embed-responsive embed-responsive-1by1">
                                        <YouTube videoId={videoId} className='youtube-player' opts={youtubeOptions} onStateChange={youtubeStateChange} />
                                    </div>
                                    <span className='text-dark'>ข้ามใน <span>{timeSkip}</span> </span>
                                </div>
                            </Modal.Body>
                        </Modal>
                        <div className="row">
                            <div className="col-lg-2 col-md-10">
                                <Navbar props={props} brand={brand}></Navbar>
                            </div>
                            <div className="col-lg-10 col-md-10">
                                <div className="app-content content">
                                    <div className="content-wrapper">
                                        <div className="clearfix" />
                                        <div className="content-body">
                                            <h2 className='text-warning'> <i className="fad fa-dharmachakra"></i> วงล้อเสี่ยงโชค</h2>
                                            <hr className='bg-warning' />
                                            <div className='row'>
                                                <div className='col-lg-4 col-xs-12'>
                                                    <span className='spin-bar text-warning text-right mb-5'> จำนวนสปินที่หมนุได้ {wheelAmount} ครั้ง</span>
                                                    <div className='pt-4'>
                                                        <div className="wheel-container">
                                                            <div className={`wheel ${spinning}`} style={wheelVars}>
                                                                {spinSlot.map((item, index) => (
                                                                    <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
                                                                        <p>
                                                                            {item[1]}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="progress mt-4">
                                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: scorePercentString }} aria-valuenow={(wheelScore / amountCondition) * 100} aria-valuemin="0" aria-valuemax="100">
                                                            <span className='text-dark'>{scorePercent} %</span></div>
                                                    </div>
                                                    <span className='pull-right text-warning'>ยอดเติมเงิน {(wheelScore)} / {(amountCondition)}</span>
                                                    <div class="clearfix"></div>
                                                    {(wheelAmount > 0 && wheelStatus === true && timeHourStatus == 1 && !promotionLast && credit < 5) ?
                                                        <img src={imgStartButton} width="100" className='img-center mt-4 mb-3' onClick={() => startSpin()} alt="" style={{ cursor: 'pointer' }} />

                                                        :
                                                        <img src={imgStartButton2} width="100" className='img-center mt-4 mb-3' alt="" />
                                                    }
                                                    {(timeHourStatus == 0) ?
                                                        <p className="text-center text-warning"> <i class="fad fa-info-circle"></i> {timeHour}</p>
                                                        :
                                                        <div></div>
                                                    }
                                                    {(promotionLast) ?
                                                        <p className="text-center text-warning"> <i class="fad fa-info-circle"></i> ติดโปรโมชั่น "{promotionLast.promotion.name}"</p>
                                                        :
                                                        <div></div>
                                                    }
                                                    {(credit > 5) ?
                                                        <p className="text-center text-warning"> <i class="fad fa-info-circle"></i> เครดิตต้องน้อยกว่า 5 เครดิต</p>
                                                        :
                                                        <div></div>
                                                    }

                                                </div>
                                                <div className='col-lg-7 pt-4 pb-4'>
                                                    <div className='col-lg-12'>

                                                        <h3 className='text-info'> <i className="fad fa-history"></i> ประวัติการหมุนวงล้อของคุณ</h3>
                                                        <hr />

                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th width="100">วันที่หมุน</th>
                                                                    <th>รางวัล</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {customerWheels.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{stringToDate(item.created_at)}</td>
                                                                        <td>
                                                                            {(() => {
                                                                                if (item.wheel_slot_config_type == 0) {
                                                                                    return (
                                                                                        <span>{item.promotion.name}</span>
                                                                                    )
                                                                                } else if (item.wheel_slot_config_type == 1) {
                                                                                    return (
                                                                                        <span>{item.credit} $</span>
                                                                                    )
                                                                                } else if (item.wheel_slot_config_type == 2) {
                                                                                    return (
                                                                                        <span>{item.other}</span>
                                                                                    )
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                    <div className='col-lg-12'>

                                                        <h3 className='text-warning'> <i className='fad fa-info-circle'></i> เงื่อนไขในการหมุนวงล้อ</h3>
                                                        <hr />
                                                        <ul>
                                                            <li className='text-warning'>จำนวนยอดเติมเงิน ถึงกำหนดที่ ระบบกำหนดไว้ {currencyFormat(amountCondition)}</li>
                                                            <li className='text-warning'>ต้องมีเครดิตน้อยกว่า 5 เครดิต</li>
                                                            <li className='text-warning'>ไม่ติดโปรโมชั่นใดๆ</li>
                                                            <li className='text-warning'>หมุนได้ทุกๆ {wheelTimeHour} ชั่วโมง</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Footer props={props} brand={brand} url={url}></Footer>
                    </div>
            }
        </div >
    );
}

export default Example;
