import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage, FormikProvider, FormikHelpers } from "formik";
import TextField from '../Forms/TextField';
import { Link } from 'react-router-dom';
import DateField from '../Forms/DateField';
import ImageField from '../Forms/ImageField';
import { developerCreationDTO } from './developers.model';

export default function DeveloperForm(props: developerFormProps) {
    return (
        <Formik initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({ name: Yup.string().required("This field is required").firstLetterUpercase() })}
        >
            {(formikProps) => (
                <Form>
                    <TextField field="name" labelName="Name"></TextField>
                    <button disabled={formikProps.isSubmitting} type="submit" className="btn btn-primary" >Save Changes</button>
                    <Link className="btn btn-secondary" to="/developers"  >Cancel</Link>
                </Form>
            )}

        </Formik>
    )
}

interface developerFormProps {
    model: developerCreationDTO;
    onSubmit(values: developerCreationDTO, action: FormikHelpers<developerCreationDTO>): void;
}