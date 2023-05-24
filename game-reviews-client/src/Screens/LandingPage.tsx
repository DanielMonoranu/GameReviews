import { IncomingMessage } from "http";
import { useEffect, useState } from "react";
import { gameDTO, landingPageDTO, } from "../Games/games.model"
import GamesList from "../Games/GamesList"
import SingleGame from "../Games/SingleGame"
import axios, { AxiosResponse } from "axios";
import { urlGames } from "../endpoints";
import RefreshContext from "../Utilities/RefreshContext";
import Authorized from "../Auth/Authorized";

export default function LandingPage() {
    const [games, setGames] = useState<landingPageDTO>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get(`${urlGames}/GetFrontPageGames`).then((response: AxiosResponse<landingPageDTO>) => {
            setGames(response.data);
        })
    }
    return (<RefreshContext.Provider value={() => loadData()}>

        <Authorized authorized={<>You are authorized</>}
            notAuthorized={<>You are not authorized</>}
            role='admin'  //aici pun ce rol am nevoie
        />


        <div>
            Released:
        </div>
        <GamesList games={games.releasedGames} />
        <div>
            To be released:
        </div>
        <GamesList games={games.upcomingGames} />
    </RefreshContext.Provider >)
}
