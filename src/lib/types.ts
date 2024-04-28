export type FormStatusMessages = {
    idle: string,
    loading: string,
    success: string,
    error: string,
    errorNetwork: string
};

export type FormStatus = keyof FormStatusMessages;

export type UserLSType = {
    userId: string,
    userName: string,
    userEmail: string
}