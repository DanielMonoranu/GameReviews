import { useHistory, useParams } from "react-router-dom";
import PlatformForm from "./PlatformForm";
import { useEffect, useState } from "react";
import { platformCreationDTO } from "./platforms.model";
import axios, { AxiosResponse } from "axios";
import { urlPlatforms } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import Loading from "../Utilities/Loading";

export default function EditPlatform() {
    const { id }: any = useParams();
    const history = useHistory();
    const [platform, setPlatform] = useState<platformCreationDTO>();

    useEffect(() => {
        axios.get(`${urlPlatforms}/${id}`)
            .then((response: AxiosResponse<platformCreationDTO>) => {
                setPlatform(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }, [id])

    async function edit(platformToEdit: platformCreationDTO) {
        try {
            await axios.put(`${urlPlatforms}/${id}`, platformToEdit).then(() => {
                notify({ message: ["Edited successfully"], type: "success" });
                history.push("/platforms");
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
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Edit Platform</h1>
            {platform ? <PlatformForm
                model={platform}
                onSubmit={async value => {
                    await edit(value);
                }} /> : <Loading />}
        </div>
    )
}