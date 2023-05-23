import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import axios from "axios"
import { useEffect, useState } from "react"
import { urlReviews } from "../endpoints"
import { ReviewCreationDTO, ReviewDTO } from "./reviews.model"
import QuillReview from '../Utilities/QuillReview'
import { useHistory, useParams } from 'react-router-dom'
import notify from '../Utilities/ToastErrors'
export default function Review(props: ReviewProps) {
    const history = useHistory();
    const [selectedReviewsId, setSelectedReviewsId] = useState<number[]>([0]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showCommentsReview, setShowCommentsReview] = useState<number[]>([0]);
    const { id }: any = useParams();



    //!! pentru poze o sa mai testez sa varific daca merge
    const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{}]
    ];

    const postReviews = async (text: string, review?: ReviewDTO) => {
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
                message: ["Network Error"]
            });
        });
    }

    return <>
        <div >
            {props.reviews?.map((review) =>
            (<div
                style={{ border: '1px solid black', padding: '10px' }} key={review.id}>

                <QuillReview readonly={true} text={review.reviewText === '' ? "Empty comment" : review.reviewText} />

                <button className="btn btn-primary m-3" onClick={() => {
                    setSelectedReviewsId([...selectedReviewsId, review.id]);
                }} >Add comment</button>

                {selectedReviewsId.includes(review.id) && <div className="m-3">

                    <QuillReview onEnter={(value) => {
                        postReviews(value, review);
                    }
                    } />

                    <button className="btn btn-danger m-1" onClick={() => {
                        setSelectedReviewsId(selectedReviewsId.filter((id) => id !== review.id))
                    }} >Cancel</button>
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
                                        setShowCommentsReview(showCommentsReview.filter((id) => id !== review.id))
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

                        {showCommentsReview.includes(review.id) && < div >
                            <Review reviews={review.childReviews} />
                        </div>}
                    </div>
                }
            </div>
            ))}
        </div >

        {props.isParent &&
            <>
                <h2>Write your review</h2>
                <QuillReview readonly={false} parentReview={true} placeholder="Write your review" onEnter={(value) => { console.log(value); postReviews(value) }} />
            </>}
    </>

}

interface ReviewProps {
    reviews?: ReviewDTO[];
    isParent?: boolean;
}

