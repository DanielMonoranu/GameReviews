import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { urlGames } from "../endpoints";
import { Link, useParams } from "react-router-dom";
import { gameDTO } from "../Games/games.model";
import Loading from "../Utilities/Loading";
import ReactQuill from "react-quill";
import { platform } from "os";
import TwitchLink from "../Utilities/TwitchLink";

export default function GameFeatures() {
    const { id }: any = useParams();
    const [game, setGame] = useState<gameDTO>();
    useEffect(() => {
        axios.get(`${urlGames}/${id}`)
            .then((response: AxiosResponse<gameDTO>) => {
                response.data.releaseDate = new Date(response.data.releaseDate);
                setGame(response.data);
            })

    }, [id]) ///!

    const modules = { //for reactQuill
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
        game ? <div>
            <h2>{game.name} ({game.releaseDate.getFullYear()})</h2>
            {game.genres?.map(genre => <Link style={{ marginRight: '5px' }} className="btn btn-primary btn-sm rounded-pill" key={genre.id}
                to={`/games/filter?genreId=${genre.id}`}
            >{genre.name}</Link>)} | {game.releaseDate.toDateString()}

            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <span style={{ display: 'inline-block', marginRight: '1rem' }}>
                    <img src={game.poster} style={{ width: '225px', height: '315px' }} alt="poster" />
                </span>
                {game.trailer ? <div>
                    <iframe title="youtube-trailer"
                        width={560}
                        height={315}
                        src={createVideoFromURL(game.trailer)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen

                    ></iframe>
                </div> : null}
            </div>



            {game.description ? <div style={{ marginTop: '1rem' }} >
                <h3>Description</h3>
                <div>
                    <ReactQuill readOnly={true} modules={modules} value={game.description} ></ReactQuill>
                </div>
            </div> : null}

            {game.multiplayer ? <div>Has Multiplayer</div> : <div>No multiplayer </div>}

            {game.developers ? <div>
                <h3>Developer</h3>
                {game.developers.map((developer) => <Link
                    className="btn btn-primary btn-sm rounded-pill" key={developer.id} to={`/games/filter?developerId=${developer.id}`}>{developer.name} </Link>)}
            </div> : null
            }
            {game.platforms ? <div>
                <h3>Platforms</h3>
                {game.platforms.map(platform => <Link style={{ marginRight: '5px' }} className="btn btn-primary btn-sm rounded-pill"
                    key={platform.id}
                    to={`/games/filter?platformId=${platform.id}`}
                >{platform.name}</Link>)}</div> : null}

            <TwitchLink gameName={game.name} />
        </div> : <Loading />
    );
}


