import { Link } from "react-router-dom";
import { gameDTO } from "./games.model";
import css from './SingleGame.module.css';
import CustomConfirm from "../Utilities/CustomConfirm";
import axios from "axios";
import { useContext } from "react";
import { urlGames } from "../endpoints";
import Authorized from "../Auth/Authorized";
import { RefreshContext } from "../Utilities/RefreshContext";

export default function SingleGame(props: gameDTO) {
    const buildLink = () => `/games/${props.id}`

    const customRefresh = useContext(RefreshContext) //!!

    const deleteGame = () => {
        axios.delete(`${urlGames}/${props.id}`).then(() => {
            customRefresh();
        });
    }

    return (
        <div className={css.div}>
            <Link to={buildLink()}>
                <img alt="Poster" src={props.poster} />
            </Link>
            <p>
                <Link to={buildLink()}>
                    {props.name}
                </Link>
            </p>
            <Authorized
                role="admin"
                authorized={<>
                    <div >
                        <Link style={{ marginRight: '0.5rem' }}
                            className="btn btn-info"
                            to={`/games/edit/${props.id}`}>
                            Edit</Link>
                        <button className="btn btn-danger"
                            onClick={() => CustomConfirm(() => deleteGame())}
                        >Delete</button>
                    </div>
                </>
                } />
        </div>
    )
}