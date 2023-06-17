import { useContext } from "react";
import AuthenticationContext from "../Auth/AuthenticationContext";
import { Form, Formik } from "formik";
import ReactQuill from "react-quill";
import QuillField from "../Forms/QuillField";
import ImageField from "../Forms/ImageField";
import { Link, useHistory } from "react-router-dom";
import QuillReview from "../Utilities/QuillReview";
import { convertEmailToFormData, convertGameToFormData } from "../Utilities/ConvertDataToForm";
import axios from "axios";
import notify from "../Utilities/ToastErrors";
import { urlAccounts } from "../endpoints";

export default function BecomeCritic() {
    const { update, claims } = useContext(AuthenticationContext);
    const history = useHistory();
    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;
    }

    const sendEmail = async (email: emailDTO) => {

        email.email = getUserEmail();
        const formData = convertEmailToFormData(email);
        await axios({ method: "post", url: `${urlAccounts}/sendEmail`, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                history.push("/");
                notify({
                    type: "success",
                    message: [response.data]
                });
            }).catch((error) => {
                notify({
                    type: "error",
                    message: [error.response.data]
                });
            });
    }

    return (<>
        <h2>If you want to become a critic please fill this form</h2>
        <div>Please state who you are and why would you be a critic for our website. You can send links to your publication and additionaly, an image to confirm your identity </div>
        {/* <div>email: {getUserEmail()}</div> */}
        <div>

            <Formik initialValues={{ text: '', email: '' }}
                onSubmit={(values, actions) => {
                    sendEmail(values);
                }}>
                {(formikProps) => (
                    <Form>
                        <QuillField displayName="" field="text" placeholder="Please describe yourself" />
                        <ImageField displayName="" field="image" />
                        <button type="submit" className="btn btn-primary" >Send</button>
                        <Link className="btn btn-secondary" to="/genres"  >Cancel</Link>
                    </Form>
                )}
            </Formik>
        </div>
    </>)
}


export interface emailDTO {
    text: string;
    image?: File;
    email: string;
}

