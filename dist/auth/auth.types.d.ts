export interface AuthTokenPayload {
    sub: string;
    companyId: string;
    email: string;
}
export interface AuthenticatedRequestUser extends AuthTokenPayload {
    id: string;
}
