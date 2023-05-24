import axios from "axios";
import AutthenticationForm from "./AuthenticationForm";
import { authenticationResponse, userCredentials } from "./auth.models";
import { urlAccounts } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import { getClaims, saveToken } from "./HandleJWT";
import AuthenticationContext from "./AuthenticationContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

export default function LoginUser() {
    const { update } = useContext(AuthenticationContext);
    const history = useHistory();
    const login = async (userCredentials: userCredentials) => {
        try {
            await axios.post<authenticationResponse>(`${urlAccounts}/login`, userCredentials)
                .then((response) => {
                    saveToken(response.data);
                    update(getClaims());
                    history.push("/");
                    //console.log(response.data);
                    //trebe ceva aici
                }
                ).catch((error) => {
                    notify({
                        type: "error",
                        message: [error.response.data]
                    });

                }
                );
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
            <h1>Login</h1>
            <AutthenticationForm model={{ email: '', password: "" }}
                onSubmit={async values => await login(values)} />
        </>
    )
}
