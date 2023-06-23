import { Form, Formik, FormikHelpers } from "formik";
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
import { getClaims, logout, saveToken } from "../Auth/JWTHandler";
import CustomConfirm from "../Utilities/CustomConfirm";

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
        const formData = convertCredentialsToFormData(credentials);
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

    const deleteAccount = async (credentials: changeCredentialsDTO) => {
        await axios.delete(`${urlAccounts}`, { data: { email: getUserEmail(), password: credentials.oldPassword } })
            .then(() => {
                logout();
                update([]);
                notify({
                    type: "success",
                    message: ['Your account has been deleted']
                });
                history.push("/");
            }).catch((error) => {
                notify({
                    type: "error",
                    message: [error.response.data]
                });
            });
    }

    return (<>
        <div className="container">
            <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Change your credentials</h1>
            <Formik initialValues={{ oldPassword: '', newEmail: '', newPassword: '', oldEmail: '' }}
                onSubmit={(values, actions) => { }}
                validationSchema={Yup.object({
                    oldPassword: Yup.string().required("This field is required"),
                    newEmail: Yup.string().email("The value must be a valid email"),
                })}
            >
                {(formikProps) => (
                    <Form>
                        <h4 style={{ color: "#7A82FF" }}>Your Email:{getUserEmail()}</h4>
                        <TextField field="oldPassword" labelName="You need to re-enter your password:" type='password' />
                        <TextField field="newEmail" labelName="New email:" />
                        <TextField field="newPassword" labelName="New password:" />
                        <h5>Your profile photo:</h5>
                        <br />
                        <img src={getProfilePicture()} alt="profile" style={{ width: '70px', height: '70px' }} />
                        <ImageField displayName="Choose another photo" field="NewProfilePicture" />
                        <br />
                        <button disabled={!formikProps.isValid || formikProps.values.oldPassword === ""} className="btn btn-primary" style={{ backgroundColor: "#7A82FF", border: "#7A82FF" }}
                            onClick={() => CustomConfirm(() =>
                                changeCredentials(formikProps.values),
                                `Do you wish to update your account?`, `Yes`)}
                        >Confirm</button>

                        <Link className="btn btn-secondary" to="/" style={{ backgroundColor: "grey", border: "grey" }}>Cancel</Link>
                        <button className="btn btn-secondary" disabled={!formikProps.isValid || formikProps.values.oldPassword === ""} style={{ marginLeft: '15px', backgroundColor: "#DC3545", border: "#DC3545" }}
                            onClick={() => CustomConfirm(() =>
                                deleteAccount(formikProps.values),
                                `Do you wish to delete your account?`, `Yes`)}
                        >Delete account</button>
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

