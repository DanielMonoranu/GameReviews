import { useState } from "react";
import ReactQuill from "react-quill";

export default function QuillReview(props: QuillReviewProps) {
    const [text, setText] = useState('');

    const handleChange = (value: string) => {
        setText(value);
    };
    const modules = { //for reactQuill
        toolbar: false,
    }

    return (
        <div>
            <ReactQuill
                value={props.text ? props.text : text}
                onChange={handleChange}
                placeholder={"Write your comment"}
                readOnly={props.readonly}
                modules={props.readonly ? modules : {}}
            />
            {props.readonly !== true && <button className="btn btn-info m-1"
                onClick={() =>
                    props.onEnter && props.onEnter(text)
                }    >Post</button>}
            {props.parentReview === true && <button className="btn btn-danger m-1" onClick={() => { setText('') }} >x</button>}


        </div >
    );
};

interface QuillReviewProps {
    onEnter?: (value: string) => void;
    placeholder?: string;
    readonly?: boolean;
    text?: string;
    parentReview?: boolean;
}