import { userCreationDTO } from "../Auth/auth.models";
import { gameCreationDTO } from "../Games/games.model";



function formatDate(date: Date) {
    date = new Date(date);
    const format = new Intl.DateTimeFormat("en", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const [{ value: month }, ,
        { value: day }, ,
        { value: year }, ,]
        = format.formatToParts(date);
    return `${year}-${month}-${day}`;
}


export function convertGameToFormData(game: gameCreationDTO) {
    const formData = new FormData();
    formData.append('name', game.name);
    if (game.description) {
        formData.append('description', game.description);
    }
    else {
        formData.append('description', ' ');
    }
    formData.append('trailer', game.trailer);
    formData.append('multiplayer', String(game.multiplayer));
    formData.append('ReleaseDate', formatDate(game.releaseDate));
    if (game.poster) {
        formData.append('poster', game.poster);
    }
    formData.append('genresIDs', JSON.stringify(game.genresIDs));
    formData.append('developerID', JSON.stringify(game.developerID));
    formData.append('platformsIDs', JSON.stringify(game.platformsIDs));
    return formData;
}

export function convertAuthToFormData(user: userCreationDTO) {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('password', user.password);
    if (user.profilePicture) {
        formData.append('profilePicture', user.profilePicture);
    }
    return formData;
}