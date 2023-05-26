import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import './Ratings.css'
import AuthenticationContext from "../Auth/AuthenticationContext";
import Swal from "sweetalert2";

export default function Ratings(props: ratingProps) {
    const [maxValueArray, setMaxValueArray] = useState<number[]>([])
    const [selectedValue, setSelectedValue] = useState(props.selectedValue);
    const { claims } = useContext(AuthenticationContext);

    useEffect(() => {
        setMaxValueArray(Array(props.maxValue).fill(0));
    }, [props.maxValue])

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
        props.onChange(score);
    }

    return (
        < >
            {maxValueArray.map((value, index) =>
                <FontAwesomeIcon icon="star" key={index}
                    className={`fa-lg pointer ${selectedValue >= index + 1 ? 'checked' : ''
                        } ${index < 4
                            ? 'red'
                            : index >= 4 && index <= 6
                                ? 'yellow'
                                : index >= 7 && index <= 9
                                    ? 'green'
                                    : ''
                        }`}
                    onMouseOver={() => handleMouseOver(index + 1)}
                    onClick={() => handleClick(index + 1)}
                />
            )}
            <span>{selectedValue}</span>
        </ >
    )
}
interface ratingProps {
    maxValue: number;
    selectedValue: number;
    onChange: (value: number) => void;
}