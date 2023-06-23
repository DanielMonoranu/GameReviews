import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import GamesList from "../Games/GamesList";
import { landingPageDTO } from "../Games/games.model";
import { RefreshContext } from "../Utilities/RefreshContext";
import { urlGames } from "../endpoints";
import notify from "../Utilities/ToastErrors";

export default function LandingPage() {
    const [games, setGames] = useState<landingPageDTO>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await axios.get(`${urlGames}/GetFrontPageGames`).then((response: AxiosResponse<landingPageDTO>) => {
            setGames(response.data);
        }).catch((error) => {
            notify({
                type: "error",
                message: ["Network Error"]
            });

        });


    }

    return (<RefreshContext.Provider value={() => loadData()}>


        <div style={{
            backgroundImage: "url(https://gamereviewsapi.blob.core.windows.net/gameresources/bggg.jpg)",
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '320px', display: 'flex', alignItems: 'center'
        }}>


            <div style={{ margin: 'auto', textAlign: 'center' }}>

                <h1 className="display-1 text-center"
                    style={{ color: 'wheat', fontFamily: 'Helvetica', fontWeight: "bold", cursor: "default" }}>
                    <img src="https://gamereviewsapi.blob.core.windows.net/gameresources/SRBej.png" style={{ width: '100px', height: '100px' }}></img>&nbsp;STARRY REVIEWS  </h1>

            </div>


        </div>

        <div className="container">
            <h2 style={{ marginTop: '10px', marginBottom: '10px' }}> New Releases</h2>
            <GamesList games={games.releasedGames} />
        </div>
        <div className="container">
            <h2 style={{ marginTop: '10px', marginBottom: '10px' }}>Upcoming Releases</h2>
            <GamesList games={games.upcomingGames} />
        </div>
    </RefreshContext.Provider >)
}
