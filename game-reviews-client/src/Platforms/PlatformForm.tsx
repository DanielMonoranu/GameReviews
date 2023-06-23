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
                    <button disabled={formikProps.values.name === '' || !formikProps.isValid} type="submit" className="btn btn-primary" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", marginBottom: '20px' }}  >Save Changes</button>
                    <Link className="btn btn-secondary" to="/genres" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545", marginBottom: '20px' }} >Cancel</Link>
                </Form>
            )}
        </Formik>
    )
}

interface platformFormProps {
    model: platformCreationDTO;
    onSubmit(values: platformCreationDTO, action: FormikHelpers<platformCreationDTO>): void;
}