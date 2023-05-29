import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ReviewCreationDTO, ReviewDTO } from "../Reviews/reviews.model";
import axios, { AxiosResponse } from "axios";
import { urlGames, urlRatings, urlReviews } from "../endpoints";
import Review from "../Reviews/Review";
import notify from "../Utilities/ToastErrors";
import { RatingDTO } from "../Ratings/ratings.model";
import QuillReview from "../Utilities/QuillReview";
import Ratings from "../Ratings/Ratings";
import AuthenticationContext from "../Auth/AuthenticationContext";

export default function ReviewIndex() {
    const history = useHistory();
    const { id }: any = useParams();
    const [userReviews, setUserReviews] = useState<ReviewDTO[]>()
    const [criticReviews, setCriticReviews] = useState<ReviewDTO[]>()

    const [userRatings, setUserRatings] = useState<RatingDTO[]>()
    const [criticRatings, setCriticRatings] = useState<RatingDTO[]>()

    const [userScore, setUserScore] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);

    const loadDataRatings = async () => {
        const tempUserRatings: RatingDTO[] = [];
        const tempCriticRatings: RatingDTO[] = [];

        await axios.get(`${urlRatings}/${id}`).then((response: AxiosResponse<RatingDTO[]>) => {
            response.data.forEach((rating, index) => {
                if (rating.user.type === "User") {
                    tempUserRatings.push(rating);
                }
                if (rating.user.type === "Critic") {
                    tempCriticRatings.push(rating);
                }
            });
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
            setUserScore(response.data.userScore);
            if (response.data.userScore === 0) {
                setHasRated(true);
            }

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

    const postReviews = async (text: string) => {
        if (text === '') {
            text = "Empty comment"
        }
        if (userScore === 0) {
            notify({
                type: "error",
                message: ["You need to rate the game"]
            });
            return;
        }
        const reviewToPost: ReviewCreationDTO = {
            gameId: id,
            reviewText: text,

        }
        await axios.post(`${urlReviews}`, reviewToPost)
            .then(() => {
                return axios.post(`${urlRatings}`, { gameId: id, score: userScore });
            })
            .then(() => {
                history.go(0);
                notify({ type: "success", message: ["Created successfully"] });
            })
            .catch(() => {
                notify({
                    type: "error",
                    message: ["Network error"]
                });
            });
    }

    return (
        <>
            < div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <h1>Critics Reviews</h1>
                <h1>Users Reviews</h1>
            </div>

            < div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <Review reviews={criticReviews} isParent={true} ratings={criticRatings} />
                {/* <div>   <h1>------------------</h1> </div> */}
                <Review reviews={userReviews} isParent={true} ratings={userRatings} userScore={userScore} />
            </div >

            {hasRated !== false &&
                <div>
                    <h2>Write your review:</h2>
                    <QuillReview readonly={false} parentReview={true} placeholder="Write your review"
                        onEnter={(value) => {
                            postReviews(value)
                        }} />

                    <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={userScore} />
                </div>
            }
        </>

    )
}