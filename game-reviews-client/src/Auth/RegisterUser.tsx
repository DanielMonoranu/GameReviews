import axios from "axios"
import { authenticationResponseDTO, userCredentialsDTO } from "./auth.models"
import { urlAccounts } from "../endpoints"
import AutthenticationForm from "./AuthenticationForm";
import { FormikHelpers } from "formik";
import notify from "../Utilities/ToastErrors";
import { getClaims, saveToken } from "./JWTHandler";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import { useHistory } from "react-router-dom";
import { convertAuthToFormData } from "../Utilities/ConvertDataToForm";

export default function RegisterUser() {
    const { update } = useContext(AuthenticationContext);
    const history = useHistory();



    const registerUser = async (userCredentials: userCredentialsDTO) => {
        try {
            const formData = convertAuthToFormData(userCredentials);
            await axios({ method: "post", url: `${urlAccounts}/create`, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {

                    saveToken(response.data);
                    update(getClaims());
                    history.push("/");
                    notify({
                        type: "success",
                        message: ["User created succesfully"]
                    });
                }).catch((error) => {
                    notify({
                        type: "error",
                        message: [error.response.data[0].description]
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
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Register </h1>
            <AutthenticationForm model={{ email: '', password: '' }} onSubmit={async values => await registerUser(values)} isRegister={true} />
        </div>
    )
}
