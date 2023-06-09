import { useHistory, useParams } from "react-router-dom";
import GenreForm from "./GenreForm";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { genreCreationDTO, genreDTO } from "./genres.model";
import Loading from "../Utilities/Loading";
import { urlGenres } from "../endpoints";
import notify from "../Utilities/ToastErrors";


export default function EditGenre() {
    const { id }: any = useParams();
    const history = useHistory();
    const [genre, setGenre] = useState<genreCreationDTO>();

    useEffect(() => {
        axios.get(`${urlGenres}/${id}`)
            .then((response: AxiosResponse<genreCreationDTO>) => {
                setGenre(response.data);
            }).catch((error) => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }, [id])

    async function edit(genreToEdit: genreCreationDTO) {
        try {
            await axios.put(`${urlGenres}/${id}`, genreToEdit).then(() => {
                notify({ message: ["Edited successfully"], type: "success" });
                history.push("/genres");
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
        <div className="container">
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Edit Genre </h1>
            {genre ? <GenreForm
                model={genre}
                onSubmit={async value => {
                    await edit(value);
                }} /> : <Loading />}


        </div>

    )
}