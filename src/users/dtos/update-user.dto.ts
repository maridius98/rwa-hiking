export class UpdateUserDto {
    email?: string;
    password?: string;
    username?: string;
    name?: string;
    bio?: string;
    type?: string;
    link?: string;
    isGuide?: boolean;
    trainings?: Number;
    birthDate?: Date;
    gender?: string;
}