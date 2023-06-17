import { Form, Formik } from "formik";
import ImageField from "../Forms/ImageField";
import { Link, useHistory } from "react-router-dom";
import TextField from "../Forms/TextField";
import { useContext } from "react";
import AuthenticationContext from "../Auth/AuthenticationContext";
import * as Yup from 'yup';
import { convertCredentialsToFormData } from "../Utilities/ConvertDataToForm";
import axios from "axios";
import notify from "../Utilities/ToastErrors";
import { urlAccounts } from "../endpoints";
import { getClaims, saveToken } from "../Auth/JWTHandler";

export default function ChangeCredentialsIndex() {
    const { update, claims } = useContext(AuthenticationContext);
    const history = useHistory();
    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;
    }
    const getProfilePicture = (): string => {
        if (claims.filter(claim => claim.name === 'profilePicture')[0]?.value) {
            return claims.filter(claim => claim.name === 'profilePicture')[0]?.value;
        }
        else {
            return 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
        }
    }

    const changeCredentials = async (credentials: changeCredentialsDTO) => {
        credentials.oldEmail = getUserEmail();
        console.log(credentials)

        const formData = convertCredentialsToFormData(credentials);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        await axios({ method: "post", url: `${urlAccounts}/changeCredentials`, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                saveToken(response.data);
                update(getClaims());
                history.push("/");
                notify({
                    type: "success",
                    message: ['Your credentials have been changed']
                });
            }).catch((error) => {
                notify({
                    type: "error",
                    message: [error.response.data]
                });
            });



    }

    return (<>
        <div>
            <h1>Change your credentials</h1>
            <Formik initialValues={{ oldPassword: '', newEmail: '', newPassword: '', oldEmail: '' }}
                onSubmit={(values, actions) => {
                    changeCredentials(values);
                }}
                validationSchema={Yup.object({
                    oldPassword: Yup.string().required("This field is required"),
                    newEmail: Yup.string().email("The value must be a valid email"),
                })}
            >
                {(formikProps) => (
                    <Form>
                        <div>You need to re-enter your password</div>
                        <TextField field="oldPassword" labelName="" type='password' />
                        <div>Your Email:{getUserEmail()}</div>
                        <TextField field="newEmail" labelName="New email" />
                        <TextField field="newPassword" labelName="New password" />
                        <div>Your profile photo:</div>
                        <img src={getProfilePicture()} alt="profile" style={{ width: '70px', height: '70px', }} />

                        <ImageField displayName="Choose another photo" field="NewProfilePicture" />
                        <button type="submit" className="btn btn-primary" >Send</button>
                        <Link className="btn btn-secondary" to="/genres"  >Cancel</Link>
                    </Form>
                )}
            </Formik>
        </div >
    </>)
}

export interface changeCredentialsDTO {
    oldEmail: string;
    oldPassword: string;
    newEmail?: string;
    newPassword?: string;
    NewProfilePicture?: File;

}

