export interface ReviewDTO {
    id: number;
    reviewText: string;
    parentReviewId?: number;
    gameId: number;
    childReviews?: Review[];
    user: userDTO;
}

export interface ReviewCreationDTO {
    reviewText: string;
    parentReviewId?: number;
    gameId: number;
}