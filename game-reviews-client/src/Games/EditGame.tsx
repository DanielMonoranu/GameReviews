import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { developerDTO } from "../Developers/developers.model";
import { genreDTO } from "../Genres/genres.model";
import { platformDTO } from "../Platforms/platforms.model";
import { convertGameToFormData } from "../Utilities/ConvertDataToForm";
import Loading from "../Utilities/Loading";
import { urlGames } from "../endpoints";
import GameForm from "./GameForm";
import { gameCreationDTO, gameToEditDTO } from "./games.model";
import notify from "../Utilities/ToastErrors";


export default function EditGame() {
    const history = useHistory();
    const { id }: any = useParams();
    const [game, setGame] = useState<gameCreationDTO>();
    const [gameToEdit, setGameToEdit] = useState<gameToEditDTO>();

    useEffect(() => {
        axios.get(`${urlGames}/GetGameToEdit/${id}`)
            .then((response: AxiosResponse<gameToEditDTO>) => {
                const gameModel: gameCreationDTO = {
                    name: response.data.game.name,
                    multiplayer: response.data.game.multiplayer,
                    trailer: response.data.game.trailer,
                    posterURL: response.data.game.poster,
                    description: response.data.game.description,
                    releaseDate: new Date(response.data.game.releaseDate),
                };
                setGame(gameModel);
                setGameToEdit(response.data);
            }).catch((error) => {
                notify({
                    type: "error",
                    message: error.response.data
                });
            });
    }, [id]);

    async function editGame(gameToEdit: gameCreationDTO) {
        try {
            const formData = convertGameToFormData(gameToEdit);
            await axios({
                method: 'put',
                url: `${urlGames}/${id}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(() => {
                notify({ message: ["Edited successfully"], type: "success" });
                history.push(`/games/${id}`);
            }).catch((error) => {
                notify({
                    type: "error",
                    message: error.response.data
                });
            });
        }
        catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }
    }
    return (
        <>
            <h3>Edit Game</h3>
            {game && gameToEdit ? <GameForm
                model={game}
                selectedGenres={gameToEdit.selectedGenres}
                allGenres={gameToEdit.allGenres}

                selectedDevelopers={gameToEdit.selectedDevelopers}
                allDevelopers={gameToEdit.allDevelopers}

                selectedPlatforms={gameToEdit.selectedPlatforms}
                allPlaforms={gameToEdit.allPlatforms}
                onSubmit={async values => {
                    // console.log(values)
                    await editGame(values);
                }} /> : <Loading />}
        </>
    )
}