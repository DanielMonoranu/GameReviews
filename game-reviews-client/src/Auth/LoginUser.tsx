import axios from "axios";
import AutthenticationForm from "./AuthenticationForm";
import { authenticationResponseDTO, userCredentialsDTO } from "./auth.models";
import { urlAccounts } from "../endpoints";
import notify from "../Utilities/ToastErrors";
import { getClaims, saveToken } from "./JWTHandler";
import AuthenticationContext from "./AuthenticationContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

export default function LoginUser() {
    const { update } = useContext(AuthenticationContext);
    const history = useHistory();
    const login = async (userCredentials: userCredentialsDTO) => {
        try {
            await axios.post<authenticationResponseDTO>(`${urlAccounts}/login`, userCredentials)
                .then((response) => {
                    saveToken(response.data);
                    update(getClaims());
                    history.push("/");
                }).catch((error) => {
                    notify({
                        type: "error",
                        message: [error.response.data]
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
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Login </h1>
            <AutthenticationForm model={{ email: '', password: "" }}
                onSubmit={async values => await login(values)} />
        </div>
    )
}
