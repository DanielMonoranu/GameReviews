import { ErrorMessage, Field, useFormikContext } from "formik";
import { ChangeEvent, useState } from "react";

export default function ImageField(props: imageFieldProps) {
    const [imageBase64, setImageBase64] = useState('');
    const [imageURL, setImageURL] = useState(props.imageURL);
    const { values } = useFormikContext<any>();

    const handleOnChange = (eventsArgs: ChangeEvent<HTMLInputElement>) => {
        if (eventsArgs.currentTarget.files) {
            const file = eventsArgs.currentTarget.files[0];
            if (file) {
                convertToBase64(file).then((base64Representation: string) => setImageBase64(base64Representation))
                    .catch(error => console.error(error)); ///!! pus toaster
                values[props.field] = file;
                setImageURL('');  //!!!
            } else {
                setImageBase64('');
            }
        }
    }

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = (error) => reject(error);
        });
    }


    return (

        <div className="mb-3">
            <label>{props.displayName}</label>
            <div>
                <input type='file' accept=".jpg,.jpeg,.png"
                    onChange={handleOnChange} />
            </div>
            {imageBase64 ?
                <div>
                    <div style={{ marginTop: '10px' }}>
                        <img style={{ width: '450px' }}
                         src={imageBase64} 
                       //  src={`data:image/jpeg;base64,${imageBase64}`}
                         alt="selected"></img>
                    </div>
                </div> : null}
            {imageURL ?
                <div>
                    <div style={{ marginTop: '10px' }}>
                        <img style={{ width: '450px' }} 
                         //src={`data:image/jpeg;base64,${imageBase64}`}
                         src={imageURL} 
                         alt="selected"></img>
                    </div>
                </div> : null}
        </div>

    )
}
interface imageFieldProps {
    displayName: string;
    imageURL: string;
    field: string;
}
ImageField.defaultProps = {
    imageURL: ''
}