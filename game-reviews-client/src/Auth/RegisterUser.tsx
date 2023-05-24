import axios from "axios"
import { authenticationResponse, userCredentials } from "./auth.models"
import { urlAccounts } from "../endpoints"
import AutthenticationForm from "./AuthenticationForm";
import { FormikHelpers } from "formik";
import notify from "../Utilities/ToastErrors";
import { getClaims, saveToken } from "./HandleJWT";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import { useHistory } from "react-router-dom";

export default function RegisterUser() {
    const { update } = useContext(AuthenticationContext);
    const history = useHistory();
    const registerUser = async (userCredentials: userCredentials) => {
        try {
            await axios.post<authenticationResponse>(`${urlAccounts}/create`, userCredentials).then((response) => {
                //console.log(response.data);
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
        <>
            <h3>Register</h3>
            <AutthenticationForm model={{ email: '', password: '' }} onSubmit={async values => await registerUser(values)} />
        </>
    )
}
