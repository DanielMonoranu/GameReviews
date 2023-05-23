import { Link } from "react-router-dom";
import TwitchLink from "../Utilities/TwitchLink";
import SteamLink from "../Utilities/SteamLink";
import Review from "../Reviews/Review";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewDTO } from "../Reviews/reviews.model";
import { urlReviews } from "../endpoints";

export default function GameIndex() {
    const [review, setReview] = useState<ReviewDTO[]>()

    useEffect(() => {

        axios.get(`${urlReviews}/1029`).then((response) => {

            // console.log(response.data)
            setReview(response.data)

        })
    }, [])

    return (
        <>
            {/* <Link className="btn btn-primary" to="games/create">Create Game</Link> */}
            <div >
                <Review reviews={review} isParent={true} />
            </div>
        </>
    )
}