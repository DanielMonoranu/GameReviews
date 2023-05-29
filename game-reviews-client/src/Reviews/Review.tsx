import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { urlRatings, urlReviews } from "../endpoints"
import { ReviewCreationDTO, ReviewDTO } from "./reviews.model"
import QuillReview from '../Utilities/QuillReview'
import { useHistory, useParams } from 'react-router-dom'
import notify from '../Utilities/ToastErrors'
import { RatingDTO } from '../Ratings/ratings.model';
import Ratings from '../Ratings/Ratings';
import AuthenticationContext from '../Auth/AuthenticationContext';

export default function Review(props: ReviewProps) {
    const { id }: any = useParams();
    const history = useHistory();
    const [selectedReviewsId, setSelectedReviewsId] = useState<number[]>([0]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showCommentsReview, setShowCommentsReview] = useState<number[]>([0]);
    const [userScore, setUserScore] = useState<number>(props.userScore);

    const [canEdit, setCanEdit] = useState<boolean>(false);

    const { update, claims } = useContext(AuthenticationContext);

    const getUserEmail = (): string => {
        return claims.filter(claim => claim.name === 'email')[0]?.value;

    }

    useEffect(() => {
        setUserScore(props.userScore);
    }, [props.userScore])

    //!! pentru poze o sa mai testez sa varific daca merge
    const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{}]
    ];

    // const handleChange = (value: number) => {
    //     // console.log(value);
    //     axios.post(`${urlRatings}`, { gameId: id, score: value }).then((response) => {
    //         //console.log(response);
    //         notify({ type: "success", message: [`You rated it ${value}`] });
    //     }).catch((error) => {
    //         notify({
    //             type: "error",
    //             message: error.response.data
    //         });
    //     });
    //     /////////////!!!!!!!!!!!trebuie modificari
    // }

    const postReviews = async (text: string, review?: ReviewDTO) => {
        // console.log(text);
        // console.log(userScore);
        //  console.log(review!);

        if (text === '') {
            text = "Empty comment"
        }

        const reviewToPost: ReviewCreationDTO = {
            gameId: id,
            reviewText: text,
            parentReviewId: review?.id
        }
        // await axios.post(`${urlReviews}`, reviewToPost).then((response) => {
        //     console.log(response.data)
        //     notify({ type: "success", message: ["Created succesfully"] });
        //     history.go(0);  ///////////////////////asta ceva context
        //     ///trebuie tratat aici raspunsul
        //     return axios.post(`${urlRatings}`, { gameId: id, score: userScore });
        // }).then(axios.post(`${urlRatings}`, { gameId: id, score: userScore }))


        //     .catch((error) => {
        //         notify({
        //             type: "error",
        //             message: ["You need to be logged in to post a review"]
        //         });
        //     });

        await axios.post(`${urlReviews}`, reviewToPost)
            .then((response) => {
                console.log(response.data);
                notify({ type: "success", message: ["Created successfully"] });
                history.go(0); // Refresh the page (assuming history is defined correctly)

                // Return the next request to continue the chain
                return axios.post(`${urlRatings}`, { gameId: id, score: userScore });
            })
            .then((response) => {
                // Handle the response of the second request
                console.log(response.data);
                // Add any further processing or notifications here
            })
            .catch((error) => {
                notify({
                    type: "error",
                    message: ["You need to be logged in to post a review"]
                });
            });


    }
    const editReviews = async (text: string, review?: ReviewDTO) => {

        console.log(text)
        console.log(review)

        if (text === '') {
            text = "Empty comment"
        }

        const reviewToPost: ReviewCreationDTO = {
            gameId: props.reviews ? props.reviews[0].gameId : 0,
            reviewText: text,
            parentReviewId: review?.id
        }
        await axios.post(`${urlReviews}`, reviewToPost).then((response) => {
            console.log(response.data)
            notify({ type: "success", message: ["Created succesfully"] });
            history.go(0);
            ///trebuie tratat aici raspunsul
        }).catch((error) => {
            notify({
                type: "error",
                message: ["You need to be logged in to post a review"]
            });
        });
    }
    const deleteReviews = async (text: string, review?: ReviewDTO) => {

        console.log(text)
        console.log(review)

        if (text === '') {
            text = "Empty comment"
        }

        const reviewToPost: ReviewCreationDTO = {
            gameId: props.reviews ? props.reviews[0].gameId : 0,
            reviewText: text,
            parentReviewId: review?.id
        }
        await axios.post(`${urlReviews}`, reviewToPost).then((response) => {
            console.log(response.data)
            notify({ type: "success", message: ["Created succesfully"] });
            history.go(0);
            ///trebuie tratat aici raspunsul
        }).catch((error) => {
            notify({
                type: "error",
                message: ["You need to be logged in to post a review"]
            });
        });
    }



    return <>
        <div >
            {props.reviews?.map((review, index) =>
            (<div
                style={{ border: '1px solid black', padding: '10px' }} key={review.id}>

                <QuillReview readonly={true} text={review.reviewText === '' ? "Empty comment" : review.reviewText} />

                <div>Info: {review.user.type} {review.user.email}   <img src={review.user.profilePicture} alt="profile"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }} /></div>

                <button className="btn btn-primary m-3" onClick={() => {
                    setSelectedReviewsId([...selectedReviewsId, review.id]);
                }}>Add comment</button>


                {getUserEmail() === review.user.email && <button className="btn btn-danger m-3" onClick={(value) => { setCanEdit(true) }
                }>Edit</button>}
                {getUserEmail() === review.user.email && <button className="btn btn-danger m-3" onClick={() => { }
                }>Delete</button>}
                {getUserEmail() === review.user.email && canEdit && <>
                    < QuillReview text={review.reviewText} onEnter={(value) => {
                        postReviews(value, review);
                    }} />
                    <div>
                        <button className="btn btn-danger m-1" onClick={() => {
                            setCanEdit(false)
                        }}>Cancel</button>
                    </div>
                    {review.parentReviewId === null && <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={props.userScore} />}


                </>}

                {selectedReviewsId.includes(review.id) && <div className="m-3">

                    <QuillReview placeholder='Write your comment' onEnter={(value) => {
                        postReviews(value, review);
                    }} />

                    <button className="btn btn-danger m-1" onClick={() => {
                        setSelectedReviewsId(selectedReviewsId.filter((id) => id !== review.id));
                    }}>Cancel</button>
                </div>}


                {review.childReviews && review.childReviews.length > 0 &&
                    <div>
                        <button style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: '0'
                        }}
                            onClick={() => {
                                {
                                    if (showComments === true) {
                                        setShowCommentsReview(showCommentsReview.filter((id) => id !== review.id));
                                    }
                                    setShowComments(!showComments);
                                    if (showComments === false) {
                                        setShowCommentsReview([...showCommentsReview, review.id]);
                                    }
                                }
                            }}>
                            <ArrowDropDownCircleIcon />
                            {/* <ArrowCircleUpIcon />   de modificat aici */}
                        </button>

                        {showCommentsReview.includes(review.id) && <div>
                            <Review reviews={review.childReviews} />
                        </div>}
                    </div>}
                {props.ratings && <>
                    <h2>{props.ratings?.find(rating => rating.user.email === review.user.email)?.score}</h2>
                    <Ratings maxValue={10} selectedValue={props.ratings?.find(rating => rating.user.email === review.user.email)?.score!}
                        readonly={true} />
                </>}
            </div>

            ))}
        </div >


        {
            props.hasReviewField && props.userScore === 0 &&
            <>
                <h2>Write your review</h2>
                <QuillReview readonly={false} parentReview={true} placeholder="Write your review"
                    onEnter={(value) => {
                        postReviews(value)
                        //console.log(props.ratings);
                    }} />
                <h2>Your rating:</h2>
                <h2>{props.userScore}</h2>

                <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={props.userScore} />
            </>
        }
    </>

}

interface ReviewProps {
    reviews?: ReviewDTO[];
    isParent?: boolean;
    hasReviewField?: boolean;
    ratings?: RatingDTO[];
    userScore: number;
}
Review.defaultProps = {
    userScore: 0
}

