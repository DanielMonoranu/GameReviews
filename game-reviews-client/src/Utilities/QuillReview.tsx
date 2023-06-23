import { useEffect, useState } from "react";
import ReactQuill from "react-quill";

export default function QuillReview(props: QuillReviewProps) {
    const [text, setText] = useState('');

    const handleChange = (value: string) => {
        setText(value);
    };
    const modules = { //for reactQuill
        toolbar: false,
    }

    useEffect(() => {
        setText(props.text ? props.text : '')
    }, [props.text])


    return (
        <div>
            <ReactQuill
                value={text}
                onChange={handleChange}
                placeholder={props.placeholder}
                readOnly={props.readonly}
                modules={props.readonly ? modules : {}}
                style={{ backgroundColor: "beige" }}
            />
            {props.readonly !== true &&
                <>
                    <button className="btn btn-primary m-1" style={{ backgroundColor: "#7A82FF", border: "#7A82FF" }}
                        onClick={() =>
                            props.onEnter && props.onEnter(text)
                        }    >Post</button>
                    <button className="btn btn-danger m-1" style={{ backgroundColor: "#DC3545", border: "#DC3545" }}
                        onClick={() => {
                            props.onCancel && props.onCancel()
                            setText('')
                        }
                        }    >Cancel</button>
                </>
            }
        </div >
    );
};

interface QuillReviewProps {
    onEnter?: (value: string) => void;
    placeholder?: string;
    readonly?: boolean;
    text?: string;
    parentReview?: boolean;
    isComment?: boolean;
    onCancel?: () => void;
}