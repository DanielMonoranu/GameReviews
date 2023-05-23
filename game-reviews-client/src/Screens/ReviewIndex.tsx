import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReviewDTO } from "../Reviews/reviews.model";
import axios, { AxiosResponse } from "axios";
import { urlReviews } from "../endpoints";
import Review from "../Reviews/Review";
import notify from "../Utilities/ToastErrors";

export default function ReviewIndex() {
    const { id }: any = useParams();
    const [review, setReview] = useState<ReviewDTO[]>()

    const loadData = async () => {
        await axios.get(`${urlReviews}/${id}`).then((response: AxiosResponse<ReviewDTO[]>) => {
            setReview(response.data)
        }).catch(() => {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        });
    }

    useEffect(() => {
        loadData();
    }, [])
    return (
        < div >
            <Review reviews={review} isParent={true} />
        </div >
    )

}