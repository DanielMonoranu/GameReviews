import { Field, useFormikContext } from 'formik';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillField(props: quillFieldProps) {
    const { values } = useFormikContext<any>()
    const [text, setText] = useState(props.default ?? ' <p> &nbsp;</p>');

    const handleChange = (value: string) => {
        setText(value);
        values[props.field] = value;
    }

    return (

        <div className='mb-3 form-quill'>
            <div>
                <label htmlFor={props.field}> {props.displayName}</label>
                <Field name={props.field} id={props.field} >
                    {() => (<ReactQuill placeholder={props.placeholder} value={text} onChange={handleChange}  ></ReactQuill>)}
                </Field>
            </div>

        </div>
    )
}
interface quillFieldProps {
    displayName: string;
    field: string;
    default?: string;
    placeholder?: string;
}
QuillField.defaultProps = {
    placeholder: "Write the description of the game"
}
export interface multipleSelectModel {
    key: number;
    value: string;
} 