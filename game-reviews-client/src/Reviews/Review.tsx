import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
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
import { ref } from 'yup';
import { RefreshContext } from '../Utilities/RefreshContext';

export default function Review(props: ReviewProps) {
    const refreshPage = useContext(RefreshContext) //!!

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

    const getUserRole = (): string => {
        return claims.filter(claim => claim.name === 'role')[0]?.value;
    }

    useEffect(() => {
        setUserScore(props.userScore);
    }, [props.userScore])

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
                refreshPage();
                notify({ type: "success", message: ["Comment created"] });
            })
            .catch(() => {
                notify({
                    type: "error",
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
                refreshPage();

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
            refreshPage();
        }).catch((error) => {
            notify({
                type: "error",
                message: ["Network error"]
            });
        });
    }


    return < >
        <div >
            {props.reviews?.map((review, index) =>
            (<div style={{
                border: '1.5px solid black',
                marginBottom: '20px',
                padding: '10px',
                width: props.maxWidth,
                borderRadius: '10px',
             //   <img src={`data:image/jpeg;base64,${game.poster}`} 
            }} key={review.id}>
                <img src={`data:image/jpeg;base64,${review.user.profilePicture}`} alt="profile"
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginBottom: '6px' }} /> {review.user.email} &nbsp;

                {props.ratings && <>
                    <Ratings maxValue={10} selectedValue={props.ratings?.find(rating => rating.user.email === review.user.email)?.score!}
                        readonly={true} />
                </>}

                <QuillReview readonly={true} text={review.reviewText === '' ? "Empty" : review.reviewText} />

                <div style={{ marginTop: '10px' }}>
                    {getUserRole() !== "admin" && <button className="btn btn-primary mr-2 " style={{ backgroundColor: "#7A82FF", border: "#7A82FF" }} onClick={() => {
                        setSelectedReviewsId([...selectedReviewsId, review.id]);
                    }}>Add comment</button>}

                    {getUserEmail() === review.user.email && <button className="btn btn-warning ms-2 " onClick={() => { setCanEdit(true) }}>Edit</button>}

                    {getUserEmail() === review.user.email && <button className="btn btn-danger ms-2 " onClick={() => {
                        CustomConfirm(() =>
                            deleteReviews(review))
                    }}>Delete</button>}
                </div>

                {/* FOR COMMENTS */}
                {selectedReviewsId.includes(review.id) && <div style={{ marginTop: '15px' }} >
                    <QuillReview placeholder='Write your comment' onEnter={(value) => {
                        postComments(value, review);
                        setSelectedReviewsId(selectedReviewsId.filter((id) => id !== review.id));
                    }}
                        onCancel={() => {
                            setSelectedReviewsId(selectedReviewsId.filter((id) => id !== review.id));
                        }}
                    />

                </div>}

                {review.childReviews && review.childReviews.length > 0 &&
                    <div style={{ marginTop: '10px' }}>

                        <button style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer", display: 'flex', alignItems: 'center',
                            marginTop: '10px'
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
                            {showComments === false && <ExpandCircleDownIcon style={{ color: "#7A82FF" }} />}
                            {showComments === true && <ExpandCircleDownIcon style={{ color: "#7A82FF", transform: 'scaleY(-1)' }} />}

                            <span style={{ fontWeight: 'bold', fontSize: '20px', marginLeft: '5px' }}>  Read Comments</span>
                        </button>
                        {showCommentsReview.includes(review.id) && <div>
                            <Review reviews={review.childReviews} />
                        </div>}
                    </div>}

                {/* FOR EDIT */}
                {canEdit && getUserEmail() === review.user.email && <>
                    < QuillReview text={review.reviewText} onEnter={(value) => {
                        editReviews(value, review);
                        setCanEdit(false);
                    }}
                        onCancel={() => { setCanEdit(false) }} />
                    {review.parentReviewId === null && <Ratings maxValue={10} onChange={(value) => setUserScore(value)} selectedValue={props.userScore} />}
                </>}









            </div>

            ))}
        </div >
    </ >

}

interface ReviewProps {
    reviews?: ReviewDTO[];
    isParent?: boolean;
    ratings?: RatingDTO[];
    userScore: number;
    maxWidth?: string;
}
Review.defaultProps = {
    userScore: 0
}

