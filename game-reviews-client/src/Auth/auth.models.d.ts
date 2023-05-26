export interface claim {
    name: string;
    value: string;
}

export interface userCredentialsDTO {
    email: string;
    password: string;
    profilePictureURL?: string;
}
export interface userCreationDTO {
    email: string;
    password: string;
    profilePicture?: File;
}


export interface authenticationResponseDTO {
    token: string;
    expirationDate: Date;
}

export interface userDTO {
    id: string;
    email: string;
    profilePicture: string
}