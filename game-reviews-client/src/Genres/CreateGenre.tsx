import { Link, useHistory } from "react-router-dom";
import GenreForm from "./GenreForm";
import { genreCreationDTO } from "./genres.model";
import axios from "axios";
import { urlGenres } from "../endpoints";
import notify from "../Utilities/ToastErrors";



export default function CreateGenre() {
    const history = useHistory();

    async function create(genre: genreCreationDTO) {
        try {
            await axios.post(urlGenres, genre)
                .then(() => {
                    history.push('/genres');
                    notify({ type: "success", message: ["Created succesfully"] });
                }).catch((error) => {
                    notify({
                        type: "error",
                        message: error.response.data
                    });
                });
        } catch (error) { // in case of network error
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }

    }
    return (<div className="container">
        <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Create Genre </h1>
        <GenreForm
            model={{ name: '' }}
            onSubmit={async value => {
                await create(value);
            }} />
    </div>)
}