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
import CustomConfirm from '../Utilities/CustomConfirm';

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



    const postComments = async (text: string, review?: ReviewDTO) => {
        if (text === '') {
            text = "Empty comment"
        }
        const reviewToPost: ReviewCreationDTO = {
            gameId: id,
            reviewText: text,
            parentReviewId: review?.id
        }
        await axios.post(`${urlReviews}`, reviewToPost)
            .then(() => {
                history.go(0);
                notify({ type: "success", message: ["Created successfully"] });
            })
            .catch(() => {
                notify({
                    type: "error",
                    // message: ["Network error"]
                    message: ["You need to be logged in to post a comment"]
                });
            });


    }
    const editReviews = async (text: string, review?: ReviewDTO) => {
        if (text === '') {
            text = "Empty comment"
        }
        const reviewToPut: ReviewCreationDTO = {
            gameId: id,
            reviewText: text,
        }
        await axios.put(`${urlReviews}/${review!.id}`, reviewToPut)
            .then(() => {
                return axios.post(`${urlRatings}`, { gameId: id, score: userScore });
            })
            .then(() => {
                notify({ type: "success", message: ["Edited successfully"] });
                history.go(0);
            })
            .catch((error) => {
                notify({
                    type: "error",
                    message: ["Network error"]
                });
            });


    }
    const deleteReviews = async (review: ReviewDTO) => {
        <h2>{props.ratings?.find(rating => rating.user.email === review.user.email)?.score}</h2>
        const ratingId = props.ratings?.find(rating => rating.user.email === review.user.email)?.id;

        await axios.delete(`${urlReviews}/${review!.id}`,).then((response) => {
            if (userScore !== 0) {
                return axios.delete(`${urlRatings}/${ratingId}`);
            }
        }).then(() => {
            notify({ type: "success", message: ["Deleted succesfully"] });
            history.go(0);
        }).catch((error) => {
            notify({
                type: "error",
                message: ["Network error"]
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


                {getUserEmail() === review.user.email && <button className="btn btn-danger m-3" onClick={() => { setCanEdit(true) }}>Edit</button>}

                {getUserEmail() === review.user.email && <button className="btn btn-danger m-3" onClick={() => { CustomConfirm(() => deleteReviews(review)) }}>Delete</button>}
                {getUserEmail() === review.user.email && canEdit && <>
                    < QuillReview text={review.reviewText} onEnter={(value) => {
                        editReviews(value, review);
                    }} />
                    <div>
                        <button className="btn btn-danger m-1" onClick={() => { setCanEdit(false) }}>Cancel</button>
                    </div>
                    {review.parentReviewId === null && <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={props.userScore} />}
                </>}

                {selectedReviewsId.includes(review.id) && <div className="m-3">

                    <QuillReview placeholder='Write your comment' onEnter={(value) => {
                        postComments(value, review);
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
    </>

}

interface ReviewProps {
    reviews?: ReviewDTO[];
    isParent?: boolean;
    ratings?: RatingDTO[];
    userScore: number;
}
Review.defaultProps = {
    userScore: 0
}

