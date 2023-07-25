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
    const [criticScore, setCriticScore] = useState<number>(0);
    const [usersScore, setUsersScore] = useState<number>(0);
    const [gameName, setGameName] = useState<string>('');

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
            setGameName(response.data.name);
            setUsersScore(response.data.averageScoreUsers);
            setCriticScore(response.data.averageScoreCritics);
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
            <h1 style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold", color: "#7A82FF" }}  >{gameName}  </h1>
            < div className="container" style={{ display: 'flex', justifyContent: 'space-around' }} >
                <h1 style={{ marginTop: '15px', marginBottom: '10px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Critics Reviews &nbsp;
                    <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Score: &nbsp;
                        {criticScore >= 0 ? < span  >
                            {criticScore.toFixed(2)}  </span> : <span>Not yet rated</span>}</h1>
                </h1>

                <h1 style={{ marginTop: '15px', marginBottom: '10px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Users Reviews &nbsp;
                    <h1 style={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Helvetica', fontWeight: "bold" }}  >Score: &nbsp;
                        {usersScore >= 0 ? < span  >
                            {usersScore.toFixed(2)}  </span> : <span>Not yet rated</span>}</h1>
                </h1>
            </div>

            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <CriticReview criticRatings={criticRatings} gameId={id} userScore={userScore} refreshState={refreshState} />
                <UserReview userRatings={userRatings} gameId={id} userScore={userScore} refreshState={refreshState} />
            </div>

            {
                ifAdmin() !== true && hasRated === false &&
                <div className="container" style={{ width: 'auto', }}>
                    <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>Write your review:</h2>

                    <QuillReview readonly={false} parentReview={true} placeholder="Write your review"
                        onEnter={(value) => {
                            postReviews(value);
                        }}
                    />
                    <div style={{ marginBottom: '40px', marginTop: "10px", display: 'flex' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Score:  &nbsp; </span> <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={userScore} />
                    </div>

                </div>
            }

        </ReviewSecondContext.Provider > : <Loading />)
}