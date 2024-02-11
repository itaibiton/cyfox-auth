export type UserCredentials = {
    email: string;
    uid: string;
    password: string;
    isOTP: boolean;
};

export type AuthForm = {
    userCredentials: UserCredentials;
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>;
};