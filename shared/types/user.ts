export type User = {
    id:string;
    timezone:string;
    username:string;
}

export type UserPreferences = {
    range:[number,number];
    textSize:number;
}