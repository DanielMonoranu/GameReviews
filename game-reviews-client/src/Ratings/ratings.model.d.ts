import { userDTO } from "../Auth/auth.models";

export interface RatingDTO {
    id: number,
    score: number,
    gameId: number,
    user: userDTO
}