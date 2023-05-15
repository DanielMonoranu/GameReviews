import { Form, Formik, FormikHelpers } from "formik";
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import TextField from '../Forms/TextField';
import { platformCreationDTO } from "./platforms.model";

export default function PlaformForm(props: platformFormProps) {
    return (
        <Formik initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({ name: Yup.string().required("This field is required").firstLetterUpercase() })}
        >
            {(formikProps) => (
                <Form>
                    <TextField field="name" labelName="Name"></TextField>
                    <button disabled={formikProps.isSubmitting} type="submit" className="btn btn-primary" >Save Changes</button>
                    <Link className="btn btn-secondary" to="/genres"  >Cancel</Link>
                </Form>
            )}
        </Formik>
    )
}

interface platformFormProps {
    model: platformCreationDTO;
    onSubmit(values: platformCreationDTO, action: FormikHelpers<platformCreationDTO>): void;
}