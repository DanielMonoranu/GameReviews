import { userCreationDTO } from "../Auth/auth.models";
import { gameCreationDTO } from "../Games/games.model";
import { emailDTO } from "../Screens/BecomeCriticIndex";
import { changeCredentialsDTO } from "../Screens/ChangeCredentialsIndex";



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

export function convertEmailToFormData(email: emailDTO) {
    const formData = new FormData();
    formData.append('email', email.email);
    formData.append('text', email.text);
    if (email.image) {
        formData.append('image', email.image)
    }
    return formData;
}


export function convertCredentialsToFormData(credentials: changeCredentialsDTO) {
    const formData = new FormData();
    formData.append('oldEmail', credentials.oldEmail);
    formData.append('oldPassword', credentials.oldPassword);
    if (credentials.newEmail) {
        formData.append('newEmail', credentials.newEmail);
    }
    if (credentials.newPassword) {
        formData.append('newPassword', credentials.newPassword);
    }
    if (credentials.NewProfilePicture) {
        formData.append('newProfilePicture', credentials.NewProfilePicture);
    }
    return formData;
}