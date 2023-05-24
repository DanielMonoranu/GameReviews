import { Form, Formik, FormikHelpers } from 'formik';
import { userCredentials } from './auth.models';
import * as Yup from 'yup';
import TextField from '../Forms/TextField';
import { Link } from 'react-router-dom';

export default function AutthenticationForm(props: authenticationFormProps) {
    return (
        <Formik initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({
                email: Yup.string().email("The value must be a valid email").required("This field is required"),
                password: Yup.string().required("This field is required")
            })}
        >
            {formikProps => (
                <Form>
                    <TextField field={'email'} labelName={'Email'} />
                    <TextField field={'password'} labelName={'Password'} type='password' />

                    <button type="submit" className="btn btn-primary">Submit</button>
                    {/* add disabled to button! */}
                    <Link className='btn btn-secondary' to='/'>Cancel</Link>
                </Form>
            )}
        </Formik>
    )

}

interface authenticationFormProps {
    model: userCredentials;
    onSubmit(values: userCredentials, actions: FormikHelpers<userCredentials>): void;
}