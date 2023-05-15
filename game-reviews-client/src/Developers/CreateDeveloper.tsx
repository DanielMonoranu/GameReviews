import { Link, useHistory } from "react-router-dom";
import DeveloperForm from "./DeveloperForm";
import { developerCreationDTO } from "./developers.model";
import axios from "axios";
import { urlDevelopers, urlGames } from "../endpoints";
import notify from "../Utilities/ToastErrors";

export default function CreateDeveloper() {
    const history = useHistory();

    async function create(developer: developerCreationDTO) {
        try {
            await axios.post(urlDevelopers, developer)
                .then(() => {
                    history.push('/developers');
                    notify({ type: "success", message: ["Created succesfully"] });
                }).catch((error) => {
                    notify({
                        type: "error",
                        message: error.response.data
                    });
                });
        } catch (error) {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        }

    }
    return (<>
        <h3>Create Developer</h3>
        <DeveloperForm
            model={{ name: '' }}
            onSubmit={async value => {
                await create(value);
            }} />

    </>)
}