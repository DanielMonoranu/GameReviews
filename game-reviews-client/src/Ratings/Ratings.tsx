import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import './Ratings.css'
import AuthenticationContext from "../Auth/AuthenticationContext";
import Swal from "sweetalert2";
import { read } from "fs";

export default function Ratings(props: ratingProps) {
    const [maxValueArray, setMaxValueArray] = useState<number[]>([])
    const [selectedValue, setSelectedValue] = useState(props.selectedValue);
    const { claims } = useContext(AuthenticationContext);

    useEffect(() => {
        setMaxValueArray(Array(props.maxValue).fill(0));
        setSelectedValue(props.selectedValue)
    }, [props.maxValue, props.selectedValue])

    const handleMouseOver = (score: number) => {
        setSelectedValue(score);
    }

    const handleClick = (score: number) => {
        const userIsLogged = claims?.length > 0;
        if (!userIsLogged) {
            Swal.fire({ title: 'Error', text: 'You must be logged in to vote', icon: 'error' });
            //sau toast
            return;
        }
        setSelectedValue(score);
        props.onChange!(score);
    }

    return (
        < >
            {/* <h1>{selectedValue}</h1> */}
            {maxValueArray.map((value, index) =>
                <FontAwesomeIcon icon="star" key={index}
                    className={`fa-lg pointer ${selectedValue! >= index + 1 ? 'checked' : ''
                        } ${index < 4
                            ? 'red'
                            : index >= 4 && index <= 6
                                ? 'yellow'
                                : index >= 7 && index <= 9
                                    ? 'green'
                                    : ''
                        }`}
                    onMouseOver={props.readonly !== true ? () => { handleMouseOver(index + 1) } : undefined
                    }
                    onClick={props.readonly !== true ? () => handleClick(index + 1) : undefined}
                />
            )}
            <span>{selectedValue}</span>
        </ >
    )
}
interface ratingProps {
    maxValue: number;
    selectedValue?: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
}