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

        } catch (error) {
            steamGameInfoDefault.noGame = true
        }

    }, [])

    return (<>
        {steamGameInfo?.noGame ? <div>Game not found on Steam</div> : <div>
            <div>
                <button className="btn btn-info" onClick={() => window.open(`https://store.steampowered.com/app/${steamGameInfo?.gameId}`)}>Steam Link</button>
            </div>
            <div>
                {steamGameInfo?.price}
            </div></div>}

    </>
    )
}

interface steamGameInfo {
    gameId: string;
    price: string;
    noGame?: boolean;
}
interface SteamLinkProps {
    gameName: string;
}
