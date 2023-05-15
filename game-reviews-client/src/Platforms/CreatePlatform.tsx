import { Link, useHistory } from "react-router-dom";
import PlatformForm from "./PlatformForm";
import { platformCreationDTO } from "./platforms.model";
import axios from "axios";
import { urlDevelopers, urlPlatforms } from "../endpoints";
import notify from "../Utilities/ToastErrors";


export default function CreatePlatform() {
    const history = useHistory();

    async function create(platform: platformCreationDTO) {
        try {
            await axios.post(urlPlatforms, platform)
                .then(() => {
                    history.push('/platforms');
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
        <h3>Create a Platform</h3>
        <PlatformForm
            model={{ name: '' }}
            onSubmit={async value => {
                await create(value);
            }} />

    </>)
}