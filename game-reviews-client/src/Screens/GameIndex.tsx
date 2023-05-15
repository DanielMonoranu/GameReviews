import { Link } from "react-router-dom";
import TwitchLink from "../Utilities/TwitchLink";

export default function GameIndex() {
    return (
        <>
            <Link className="btn btn-primary" to="games/create">Create Game</Link>
            <div>
                <TwitchLink gameName={"Metal Gear Solid"} />
            </div>
        </>
    )
}