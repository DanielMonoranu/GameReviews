import axios, { AxiosResponse } from "axios";
import { ReviewDTO } from "./reviews.model";
import { urlReviews } from "../endpoints";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import notify from "../Utilities/ToastErrors";
import Review from "./Review";
import RecordsPerPageSelect from "../Utilities/RecordsPerPageSelect";
import Pagination from "../Utilities/Pagination";
import { RatingDTO } from "../Ratings/ratings.model";
import AuthenticationContext from "../Auth/AuthenticationContext";
import cevaContext from "../Utilities/anotherContext";
import { RefreshContext, ReviewSecondContext } from "../Utilities/RefreshContext";
import { createContext } from "vm";

export default function UserReview(props: UserReviewProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [userReviews, setUserReviews] = useState<ReviewDTO[]>()

    const refreshAgain = useContext(ReviewSecondContext)

    useEffect(() => {
        loadReviews();
    }, [currentPage, recordsPerPage, props.refreshState])

    const loadReviews = async () => {
        await axios.get(`${urlReviews}/User/${props.gameId}`, { params: { Page: currentPage, RecordsPerPage: recordsPerPage } }).then((response: AxiosResponse<ReviewDTO[]>) => {
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

    return (<RefreshContext.Provider value={() => {
        loadReviews();
        refreshAgain();

    }}>
        <div>
            <RecordsPerPageSelect onChangeRecords={amountOfRecords => {
                setCurrentPage(1);
                setRecordsPerPage(amountOfRecords);
            }} />

            <Review reviews={userReviews} isParent={true} ratings={props.userRatings} userScore={props.userScore} maxWidth="630px" />

            <Pagination currentPage={currentPage} totalPages={totalAmountOfPages}
                onPageChange={newCurrentPage => setCurrentPage(newCurrentPage)} />
        </div>
        <>
        </>
    </RefreshContext.Provider >
    )
}

interface UserReviewProps {
    userRatings?: RatingDTO[];
    gameId: number;
    userScore: number;
    refreshState?: boolean;
}
UserReview.defaultProps = {
    userScore: 0
}