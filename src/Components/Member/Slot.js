import React from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';

function Slot(props) {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [credit, setCredit] = useState(user.credit);
    const [gameLists, setGameLists] = useState([]);
    const [brand, setBrand] = useState();
    const [selectGame, setSelectGame] = useState('');
    const [linkStart, setLinkStart] = useState('');
    const [btnStartGame, setBtnStartGame] = useState(false);
    const history = useHistory();

    useEffect(async () => {
        console.log(props);
        await getBrand();
        await refreshCredit();
        await getGameList();
        setLoading(false);
    }, []);

    const getBrand = async () => {
        await brandService.checkBrand(props.match.params.brand)
            .then((response) => {
                setBrand(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const refreshCredit = async () => {
        await brandService.credit(user.id)
            .then((response) => {
                if (response.data) {
                    setCredit(response.data.credit);
                }
            }, (error) => {
                console.log(error);
            });
    }

    const getGameList = async () => {
        console.log(props.match);
        const type_game = props.match.params.type_game;
        await brandService.getGameList(user.id, type_game)
            .then((response) => {
                setGameLists(response.data);
            }, (error) => {
                console.log(error);
            });
    }

    const handleSelectGame = async (key, game, type_game) => {
        setBtnStartGame(true);
        setSelectGame(key);
        await brandService.startGame(user.id, game)
            .then((response) => {
                window.location.href = response.data.uri;
                // setBtnStartGame(false);
            }, (error) => {
                console.log(error);
                setBtnStartGame(false);
            })
    }

    return <div>
        {
            (loading)
                ?
                <Loading></Loading>
                :
                <div>
                    <div className='container mt-3' style={{ paddingBottom: '50px' }}>
                        {gameLists.map((gameList, key) => {
                            return (
                                <section id="ecommerce-products" className="grid-view row " key={key}>
                                    {gameList.games.map((game, key) => {
                                        return (
                                            <div className="col-4 col-lg-4 mb-2" key={key} >
                                                <div className="">

                                                    <div className={"card-image " + (key === selectGame ? 'shadow' : '')}>
                                                        <img src={game.image.horizontal} className="img-fluid img-center" />
                                                    </div>
                                                    <p className="card-game-text">{game.gameName}</p>
                                                    <button className='btn btn-sm btn-auto btn-block' onClick={() => handleSelectGame(key, game)} disabled={btnStartGame}>
                                                        {
                                                            (key === selectGame) ?
                                                                <span>
                                                                    {btnStartGame ?
                                                                        <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" ></span> : ''}
                                                                </span>
                                                                :
                                                                <span className="label">
                                                                    เริ่มเกมส์
                                                                </span>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </section>
                            )
                        })}
                    </div>
                    <div className='footer-game'>
                        <img src={brand.logo_url} className='img-fluid' width="70" alt="" />
                        <div className='footer-game-text'>
                            <p className='mb-0'>Username: {user.username}</p>
                            <p className='mb-0'>Credit: {credit}</p>
                        </div>
                    </div>
                </div>

        }
    </div >;
}

export default Slot;
