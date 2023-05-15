import { useEffect, useState } from "react";
import { developerDTO } from "../Developers/developers.model";
import { genreDTO } from "../Genres/genres.model";
import { platformDTO } from "../Platforms/platforms.model";
import GameForm from "./GameForm";
import axios, { AxiosResponse } from "axios";
import { urlGames } from "../endpoints";
import { gameAttribuesDTO, gameCreationDTO } from "./games.model";
import Loading from "../Utilities/Loading";
import notify from "../Utilities/ToastErrors";
import { convertGameToFormData, } from "../Utilities/ConvertDataToForm";
import { useHistory } from "react-router-dom";

export default function CreateGame() {
    const history = useHistory();
    const [genres, setGenres] = useState<genreDTO[]>([]);
    const [developers, setDevelopers] = useState<developerDTO[]>([]);
    const [platforms, setPlatforms] = useState<platformDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${urlGames}/GetAllGamesAttributes`)
            .then((response: AxiosResponse<gameAttribuesDTO>) => {
                setGenres(response.data.genres);
                setDevelopers(response.data.developers);
                setPlatforms(response.data.platforms);
                setLoading(false);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });

    }, [])

    async function createGame(game: gameCreationDTO) {
        const formData = convertGameToFormData(game);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        await axios({
            method: "post",
            url: urlGames,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((gamePosted) => {

            history.push(`/games/${gamePosted.data}`);
            notify({ type: "success", message: ["Created succesfully"] });
        }).catch((error) => {
            notify({
                type: "error",
                message: error.response.data
            });
        });
    }

    return (<>
        <h3>Create Game</h3>
        {loading ? <Loading /> :
            <GameForm
                model={{ name: '', releaseDate: new Date(), trailer: '', multiplayer: false }}
                selectedGenres={[]}
                allGenres={genres}
                allDevelopers={developers}
                allPlaforms={platforms}
                selectedPlatforms={[]}
                selectedDevelopers={[]}
                onSubmit={async values => {
                    await createGame(values);
                }} />}
    </>)
}