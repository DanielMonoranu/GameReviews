import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";
import { urlGames } from "../endpoints";

export default function SteamLink(props: SteamLinkProps) {
    const [steamGameInfo, setSteamGameInfo] = useState<steamGameInfo>()
    const steamGameInfoDefault: steamGameInfo = {
        gameId: "",
        price: "",
        noGame: false,
    }
    useEffect(() => {
        try {
            axios.get(`${urlGames}/GetSteamGameInfo`, { params: { "gameName": props.gameName } })
                .then(response => {
                    if (response.data.gameId == "NoGame") {
                        steamGameInfoDefault.noGame = true;
                        setSteamGameInfo(steamGameInfoDefault);
                    }
                    else { setSteamGameInfo(response.data); }
                })

        } catch (error) { steamGameInfoDefault.noGame = true }
    }, [])

    return (<>
        {steamGameInfo?.noGame ? <span  >< h4  > Game not found on Steam </h4 > </span> : < >
            <h4>  The game is available on Steam and </h4>
            <h4> costs <span style={{ color: "#7A82FF" }} > {steamGameInfo?.price}</span> <button className="btn btn-info" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", color: "white" }}
                onClick={() => window.open(`https://store.steampowered.com/app/${steamGameInfo?.gameId}`)}>Buy Game</button></h4>
        </ >}
    </>)
}

interface steamGameInfo {
    gameId: string;
    price: string;
    noGame?: boolean;
}
interface SteamLinkProps {
    gameName: string;
}
