export type UserCredentials = {
    email: string;
    password: string;
    isOTP: boolean;
    uid: string,
    secret: {
        secret: string,
        qrCode: string
    };
};

export type AuthForm = {
    userCredentials: UserCredentials;
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>;
};