import axios, { AxiosResponse } from "axios";
import { RatingDTO } from "../Ratings/ratings.model";
import { urlGames, urlRatings, urlReviews } from "../endpoints";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import notify from "../Utilities/ToastErrors";
import AuthenticationContext from "../Auth/AuthenticationContext";
import { ReviewCreationDTO } from "../Reviews/reviews.model";
import CriticReview from "../Reviews/CriticReview";
import UserReview from "../Reviews/UserReview";
import QuillReview from "../Utilities/QuillReview";
import Ratings from "../Ratings/Ratings";
import { RefreshContext, ReviewSecondContext } from "../Utilities/RefreshContext";
import Loading from "../Utilities/Loading";

export default function ReviewsIndex() {
    const { update, claims } = useContext(AuthenticationContext);
    const { id }: any = useParams();
    const [userRatings, setUserRatings] = useState<RatingDTO[]>()
    const [criticRatings, setCriticRatings] = useState<RatingDTO[]>()
    const [userScore, setUserScore] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [refreshState, setRefreshState] = useState<boolean>(false);

    const getUserEmail = (): string => {

        return claims.filter(claim => claim.name === 'email')[0]?.value;
    }
    const ifAdmin = () => {
        return claims.findIndex(claim => claim.name === 'role' &&
            claim.value === 'admin') > -1;
    }


    useEffect(() => {
        loadDataRatings();
        loadGameData();
    }, [claims])

    const loadGameData = async () => {
        await axios.get(`${urlGames}/${id}`).then((response) => {
            setUserScore(response.data.userScore);
        }).catch(() => {
            notify({
                type: "error",
                message: ["No game found"]
            });
            setError(true);
        });
    }

    const loadDataRatings = async () => {
        const tempUserRatings: RatingDTO[] = [];
        const tempCriticRatings: RatingDTO[] = [];

        await axios.get(`${urlRatings}/${id}`).then((response: AxiosResponse<RatingDTO[]>) => {
            response.data.forEach((rating) => {
                if (rating.user.type === "User") {
                    tempUserRatings.push(rating);
                }
                else if (rating.user.type === "Critic") {
                    tempCriticRatings.push(rating);
                }
                if (rating.user.email === getUserEmail()) {
                    setHasRated(true);
                }
            });
            setUserRatings(tempUserRatings)
            setCriticRatings(tempCriticRatings)
        }).catch(() => {
            notify({
                type: "error",
                message: ["No ratings found"]
            });
            setError(true);
        });
    }

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
                notify({ type: "success", message: ["Created successfully"] });
                setRefreshState(true)
                setHasRated(true);
                loadDataRatings();
            })
            .catch(() => {
                notify({
                    type: "error",
                    message: ["Network error"]
                });
            });
    }

    return (error === false ?

        <ReviewSecondContext.Provider value={() => {
            loadDataRatings(); loadGameData(); setHasRated(false); setRefreshState(false);
        }}>
            < div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <h1>Critics Reviews</h1>
                <h1>Users Reviews</h1>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CriticReview criticRatings={criticRatings} gameId={id} userScore={userScore} refreshState={refreshState} />
                <UserReview userRatings={userRatings} gameId={id} userScore={userScore} refreshState={refreshState} />
            </div>

            {ifAdmin() !== true && hasRated === false &&
                <div>
                    <h2>Write your review:</h2>
                    <QuillReview readonly={false} parentReview={true} placeholder="Write your review"
                        onEnter={(value) => {
                            postReviews(value);

                        }} />
                    <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={userScore} />
                </div>
            }

        </ReviewSecondContext.Provider > : <Loading />)
}