import { useHistory, useParams } from "react-router-dom";
import DeveloperForm from "./DeveloperForm";
import { useEffect, useState } from "react";
import { developerCreationDTO } from "./developers.model";
import axios, { AxiosResponse } from "axios";
import { urlDevelopers } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import Loading from "../Utilities/Loading";

export default function EditDeveloper() {
    const { id }: any = useParams();
    const history = useHistory();
    const [developer, setDeveloper] = useState<developerCreationDTO>();

    useEffect(() => {
        axios.get(`${urlDevelopers}/${id}`)
            .then((response: AxiosResponse<developerCreationDTO>) => {
                setDeveloper(response.data);
            }).catch(() => {
                notify({
                    type: "error",
                    message: ["Network Error"]
                });
            });
    }, [id])

    async function edit(developerToEdit: developerCreationDTO) {
        try {
            await axios.put(`${urlDevelopers}/${id}`, developerToEdit).then(() => {
                notify({ message: ["Edited successfully"], type: "success" });
                history.push("/developers");
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
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Edit Developer </h1>
            {developer ? <DeveloperForm
                model={developer}
                onSubmit={async value => {
                    await edit(value);
                }} /> : <Loading />}
        </div>
    )
}