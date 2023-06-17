import { useContext, useEffect, useState } from "react";
import { ReviewDTO } from "./reviews.model";
import axios, { AxiosResponse } from "axios";
import { urlReviews } from "../endpoints";
import { RatingDTO } from "../Ratings/ratings.model";
import notify from "../Utilities/ToastErrors";
import Review from "./Review";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import Pagination from "../Utilities/Pagination";
import { RefreshContext, ReviewSecondContext } from "../Utilities/RefreshContext";


export default function CriticReview(props: GameReviewProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [userReviews, setUserReviews] = useState<ReviewDTO[]>()

    const refreshAgain = useContext(ReviewSecondContext)


    useEffect(() => {
        loadReviews();
    }, [currentPage, recordsPerPage, props.refreshState])

    const loadReviews = async () => {
        await axios.get(`${urlReviews}/Critic/${props.gameId}`, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } }).then((response: AxiosResponse<ReviewDTO[]>) => {
            const totalAmountOfRecords = parseInt(response.headers['totalamountofrecords'], 10);
            setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
            setUserReviews(response.data);

        }).catch(() => {
            notify({
                type: "error",
                message: ["Network Error"]
            });
        });
    }

    return <RefreshContext.Provider value={() => {
        loadReviews();
        refreshAgain();
    }}>

        <div>
            <Review reviews={userReviews} isParent={true} ratings={props.criticRatings} userScore={props.userScore} />
            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)} />
        </div>
    </RefreshContext.Provider>


}
interface GameReviewProps {
    criticRatings?: RatingDTO[];
    gameId: number;
    userScore: number;
    refreshState?: boolean;
}
CriticReview.defaultProps = {
    userScore: 0
}
