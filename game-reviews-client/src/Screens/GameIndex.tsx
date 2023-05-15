import { Link } from "react-router-dom";
import TwitchLink from "../Utilities/TwitchLink";
import SteamLink from "../Utilities/SteamLink";

export default function GameIndex() {
    return (
        <>
            <Link className="btn btn-primary" to="games/create">Create Game</Link>
            <div>
            </div>
        </>
    )
}