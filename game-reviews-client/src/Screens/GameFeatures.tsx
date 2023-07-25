import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Link, useParams } from "react-router-dom";
import AuthenticationContext from "../Auth/AuthenticationContext";
import { gameDTO } from "../Games/games.model";
import Loading from "../Utilities/Loading";
import SteamLink from "../Utilities/SteamLink";
import notify from "../Utilities/ToastErrors";
import TwitchLink from "../Utilities/TwitchLink";
import { urlGames } from "../endpoints";

export default function GameFeatures() {
    const { id }: any = useParams();
    const [game, setGame] = useState<gameDTO>();
    const { claims } = useContext(AuthenticationContext);
    const userIsLogged = claims?.length > 0;

    const star = 'https://gamereviewsapi.blob.core.windows.net/gameresources/stea.png'
    const blackhole = 'https://gamereviewsapi.blob.core.windows.net/gameresources/gaura.png'

    useEffect(() => {
        axios.get(`${urlGames}/${id}`)
            .then((response: AxiosResponse<gameDTO>) => {
                response.data.releaseDate = new Date(response.data.releaseDate);
                setGame(response.data);
            }).catch((error) => {
                notify({
                    type: "error",
                    message: ["No game found"]
                });
            });
    }, [id])

    const modules = {
        toolbar: false
    }

    function createVideoFromURL(trailer: string): string {
        if (!trailer) { return '' }


        let videoId = trailer.split('v=')[1];
        try {
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            return `https://www.youtube.com/embed/${videoId}`
        }
        catch {
            return ''
        }
    }

    return (


        game ? <div className="container"  >

            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >{game.name}  </h1>

            {game.genres?.map(genre => <Link style={{ marginRight: '5px', backgroundColor: "#7A82FF", border: "#7A82FF" }} className="btn btn-primary rounded-pill" key={genre.id}
                to={`/games/filter?genreId=${genre.id}`}
            >{genre.name}</Link>)}  | Release Date: {game.releaseDate.toDateString()}

            {userIsLogged && game.userScore > 0 ? <> | Your score: {game.userScore}</> : null}


            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <span style={{ display: 'inline-block', marginRight: '30px', }}>
                    <img src={game.poster} style={{ width: '225px', height: '315px', borderRadius: '10px' }} alt="poster" />
                </span>
                {game.trailer ? <div>
                    <iframe title="youtube-trailer"
                        width={560}
                        height={315}
                        src={createVideoFromURL(game.trailer)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '10px', marginRight: '30px', }}
                    ></iframe>

                </div> : null}
                <div style={{
                    marginLeft: '1rem', backgroundColor: 'beige', borderRadius: '10px', width: '225px', height: '315px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'

                }}>   {
                        game.releaseDate >= new Date() ? < >

                            <span  > The game is </span><span  >not released yet. </span>
                            <br /> <br />
                            <span  > Come back on </span>
                            <span style={{ color: "#7A82FF" }} >   {game.releaseDate.toLocaleDateString()} </span>
                        </ > :
                            game.averageScoreCritics === -1 && game.averageScoreUsers === -1 ?
                                < >
                                    <span  > The game has </span><span  > not been reviewed. </span>
                                    <br /> <br />
                                    <span  > Be the first one</span>
                                    <span  >   to rate it below! </span>
                                </ >
                                :
                                game.averageScoreCritics === -1 ? <>
                                    {game.averageScoreUsers <= 5 ?
                                        <>
                                            <span> The game is a black hole</span>
                                            <img src={blackhole} style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                            <span>with a rating of </span>
                                            <h1>{game.averageScoreUsers.toFixed(2)}</h1>
                                            <span> from {game.userScoreCount} user{game.userScoreCount > 1 && 's'}</span></> :
                                        <>
                                            <span> from{game.userScoreCount} users</span>
                                            <span> The game is a certified star</span>
                                            <img src={star} style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                            <span>with a rating of </span>
                                            <h1>{game.averageScoreUsers.toFixed(2)}</h1>
                                            <span> from {game.userScoreCount} user{game.userScoreCount > 1 && 's'}</span></>
                                    }
                                </> :
                                    game.averageScoreUsers === -1 ? <>
                                        {game.averageScoreCritics <= 5 ?
                                            <>
                                                <span> The game is a black hole</span>
                                                <img src={blackhole} style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                                <span>with a rating of </span>
                                                <h1>{game.averageScoreCritics.toFixed(2)}</h1>
                                                <span> from {game.criticScoreCount} critic{game.criticScoreCount > 1 && 's'}</span></> :

                                            <>
                                                <span> The game is a certified star</span>
                                                <img src={star}
                                                    style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                                <span>with a rating of </span>
                                                <h1>{game.averageScoreCritics.toFixed(2)}</h1>
                                                <span> from {game.criticScoreCount} critic{game.criticScoreCount > 1 && 's'}</span></>
                                        }
                                    </> :
                                        <>
                                            {(game.averageScoreCritics + game.averageScoreUsers) / 2 <= 5 ?
                                                <>
                                                    <span> The game is a black hole  </span>
                                                    <img src={blackhole} style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                                    <span>with a rating of </span>
                                                    <h1>{((game.averageScoreCritics + game.averageScoreUsers) / 2).toFixed(2)}</h1>
                                                    <span> from {game.criticScoreCount} critic{game.criticScoreCount > 1 && 's'} and {game.userScoreCount} user{game.userScoreCount > 1 && 's'}</span>
                                                </> : <>
                                                    <span> The game is a certified star  </span>
                                                    <img src={star}
                                                        style={{ width: '100px', height: '100px', marginBottom: '15px', marginTop: '15px' }}></img>
                                                    <span>with a rating of </span>
                                                    <h1>{((game.averageScoreCritics + game.averageScoreUsers) / 2).toFixed(2)}</h1>
                                                    <span> from {game.criticScoreCount} critic{game.criticScoreCount > 1 && 's'} and {game.userScoreCount} user{game.userScoreCount > 1 && 's'}</span>
                                                </>}
                                        </>}
                </div>
            </div>

            {
                game.description ? <div style={{ marginTop: '1rem' }} >
                    <h3 style={{ marginBottom: '20px' }}>Description</h3>
                    <div  >
                        <ReactQuill value={game.description}
                            readOnly={true} modules={modules} style={{ backgroundColor: 'beige', height: '200px', overflowY: 'auto', width: '1100px' }}
                        ></ReactQuill>
                    </div>
                </div> : null
            }
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>

                <div  >
                    <Link className="btn btn-primary" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", marginBottom: '20px' }} to={`/reviews/${id}`}>Read reviews</Link>
                    {
                        game.developers ? <div  >
                            <h3 style={{ display: 'inline-block', }}>Developer </h3>
                            {game.developers.map((developer) => <Link
                                className="btn btn-primary rounded-pill " style={{ marginLeft: '15px', backgroundColor: "#7A82FF", border: "#7A82FF" }} key={developer.id} to={`/games/filter?developerId=${developer.id}`}>{developer.name} </Link>)}
                        </div > : null
                    }
                    {
                        game.platforms ? <div >
                            <h3 style={{ display: 'inline-block', marginTop: '20px', marginBottom: '20px' }}>Platforms </h3>
                            {game.platforms.map(platform => <Link style={{ marginLeft: '15px', backgroundColor: "#7A82FF", border: "#7A82FF" }} className="btn btn-primary rounded-pill"
                                key={platform.id}
                                to={`/games/filter?platformId=${platform.id}`}
                            >{platform.name}</Link>)}</div> : null
                    }
                    {game.multiplayer ? <h3 style={{ marginBottom: '20px' }}> Multiplayer</h3> : <></>}

                </div>
                {
                    game.releaseDate < new Date() ?
                        <div style={{ marginLeft: '450px' }}>
                            <TwitchLink gameName={game.name} />
                            <SteamLink gameName={game.name} />
                        </div>
                        : <></>
                }


            </div>



        </div > : <Loading />
    );
}


