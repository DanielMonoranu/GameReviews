import { Form, Formik, FormikHelpers } from "formik";
import { Link } from 'react-router-dom';
import TextField from '../Forms/TextField';
import { genreCreationDTO } from './genres.model';
import * as Yup from 'yup';
export default function GenreForm(props: genreFormProps) {
    return (
        <Formik initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({ name: Yup.string().required("This field is required").firstLetterUpercase().matches(/^[a-zA-Z\s]*$/, "Only letters are allowed for this field").max(50, "Maximum length is 50 characters") })}
        >
            {(formikProps) => (
                <Form>
                    <TextField field="name" labelName="Name"></TextField>

                    <button disabled={formikProps.values.name === '' || !formikProps.isValid} type="submit" className="btn btn-primary" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", marginBottom: '20px' }}  >Save Changes</button>
                    <Link className="btn btn-secondary" to="/genres" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545", marginBottom: '20px' }}  >Cancel</Link>
                </Form>
            )}
        </Formik>
    )
}

interface genreFormProps {
    model: genreCreationDTO;
    onSubmit(values: genreCreationDTO, action: FormikHelpers<genreCreationDTO>): void; //returns void
}