import { Form, Formik, FormikHelpers } from 'formik';
import { userCreationDTO, userCredentialsDTO } from './auth.models';
import * as Yup from 'yup';
import TextField from '../Forms/TextField';
import { Link } from 'react-router-dom';
import ImageField from '../Forms/ImageField';

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
                    {props.isRegister && <ImageField field={'profilePicture'} displayName={'Profile Picture'} />}
                    <button type="submit" className="btn btn-primary " style={{ backgroundColor: "#7A82FF", border: "#7A82FF" }} >Submit</button>

                    <Link className='btn btn-secondary' to='/' style={{ backgroundColor: "grey", border: "grey", }} >Cancel</Link>

                </Form>
            )
            }
        </Formik >
    )

}

interface authenticationFormProps {
    model: userCreationDTO | userCredentialsDTO;
    onSubmit(values: userCreationDTO | userCredentialsDTO, actions: FormikHelpers<userCreationDTO | userCredentialsDTO>): void;
    isRegister?: boolean;
}