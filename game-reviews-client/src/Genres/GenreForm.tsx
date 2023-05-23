import { Form, Formik, FormikHelpers } from "formik";
import { Link } from 'react-router-dom';
import TextField from '../Forms/TextField';
import { genreCreationDTO } from './genres.model';

export default function GenreForm(props: genreFormProps) {
    return (
        <Formik initialValues={props.model}
            onSubmit={props.onSubmit}
        //  validationSchema={Yup.object({ name: Yup.string().required("This field is required").firstLetterUpercase().matches(/^[a-zA-Z\s]*$/, "Only letters are allowed for this field").max(50, "Maximum length is 50 characters") })}
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

interface genreFormProps {
    model: genreCreationDTO;
    onSubmit(values: genreCreationDTO, action: FormikHelpers<genreCreationDTO>): void; //returns void
}