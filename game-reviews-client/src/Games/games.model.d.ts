
export interface gameCreationDTO {
    name: string;
    trailer: string
    poster?: File;
    posterURL?: string;
    releaseDate: Date;
    description?: string;
    genresIDs?: number[];
    developerID?: number;
    platformsIDs?: number[];
    multiplayer: boolean;
}

export interface gameDTO {
    id: number;
    name: string;
    poster:string;
    trailer: string;
    releaseDate: Date;
    multiplayer: boolean;
    description?: string;
    genres: genreDTO[];
    developers: developerDTO[];
    platforms: platformDTO[];
    userScore: number;
    averageScoreCritics: number;
    averageScoreUsers: number;
    userScoreCount: number;
    criticScoreCount: number;
}
export interface landingPageDTO {
    releasedGames?: gameDTO[];
    upcomingGames?: gameDTO[];
}
export interface gameAttribuesDTO {
    genres: genreDTO[];
    platforms: platformDTO[];
    developers: developerDTO[];
}
export interface gameToEditDTO {
    game: gameDTO;
    selectedGenres: genreDTO[];
    allGenres: genreDTO[];
    selectedPlatforms: platformDTO[];
    allPlatforms: platformDTO[];
    selectedDevelopers: developerDTO[];
    allDevelopers: developerDTO[];
}