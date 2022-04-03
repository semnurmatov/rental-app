export interface BearerTokenResponse{
    readonly token_type: 'Bearer';
    readonly access_token: string;
}