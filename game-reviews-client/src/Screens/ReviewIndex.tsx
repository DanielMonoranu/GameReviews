import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReviewDTO } from "../Reviews/reviews.model";
import axios, { AxiosResponse } from "axios";
import { urlGames, urlRatings, urlReviews } from "../endpoints";
import Review from "../Reviews/Review";
import notify from "../Utilities/ToastErrors";
import { RatingDTO } from "../Ratings/ratings.model";

export default function ReviewIndex() {
    const { id }: any = useParams();
    const [userReviews, setUserReviews] = useState<ReviewDTO[]>()
    const [criticReviews, setCriticReviews] = useState<ReviewDTO[]>()

    const [userRatings, setUserRatings] = useState<RatingDTO[]>()
    const [criticRatings, setCriticRatings] = useState<RatingDTO[]>()
    const [userScore, setUserScore] = useState<number>(0);
    const [userType, setuserType] = useState<string>("NotLoggedIn");

    const loadDataRatings = async () => {
        const tempUserRatings: RatingDTO[] = [];
        const tempCriticRatings: RatingDTO[] = [];
        await axios.get(`${urlRatings}/${id}`).then((response: AxiosResponse<RatingDTO[]>) => {
            //console.log(response.data)
            response.data.forEach((rating, index) => {
                if (rating.user.type === "User") {
                    tempUserRatings.push(rating);
                }
                if (rating.user.type === "Critic") {
                    tempCriticRatings.push(rating);
                }
            });
            //console.log(tempUserReviews)
            setUserRatings(tempUserRatings)
            setCriticRatings(tempCriticRatings)
        }).catch(() => {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        });
    }

    const loadDataReviews = async () => {
        const tempUserReviews: ReviewDTO[] = [];
        const tempCriticReviews: ReviewDTO[] = [];
        await axios.get(`${urlReviews}/${id}`).then((response: AxiosResponse<ReviewDTO[]>) => {
            response.data.forEach((review, index) => {
                if (review.user.type === "User") {
                    tempUserReviews.push(review);
                }
                if (review.user.type === "Critic") {
                    tempCriticReviews.push(review);
                }
            });
            //console.log(tempUserReviews)
            setUserReviews(tempUserReviews)
            setCriticReviews(tempCriticReviews)
        }).catch(() => {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        });
    }

    const loadGameData = async () => {
        await axios.get(`${urlGames}/${id}`).then((response) => {
            console.log(response.data)
            setUserScore(response.data.userScore);
            setuserType(response.data.userType);

        }).catch(() => {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        });
    }
    useEffect(() => {
        loadDataReviews();
        loadDataRatings();
        loadGameData();
    }, [])

    // onMouseOver={props.readonly !== true ? () => { handleMouseOver(index + 1) } : undefined
    return (
        < div >
            <h1>Critics Reviews</h1>
            <Review reviews={criticReviews} isParent={true} ratings={criticRatings} hasReviewField={userType === "Critic" ? true : false} />
            <div>
                <h1>------------------</h1>
            </div>
            <h1>Users Reviews</h1>
            <Review reviews={userReviews} isParent={true} hasReviewField={userType === "User" ? true : false} ratings={userRatings} userScore={userScore} />
        </div >
    )

}