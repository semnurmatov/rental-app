import { BearerTokenResponse } from "./BearerTokenResponse";

export interface UserRegister{
    readonly userId: string;
    readonly token: BearerTokenResponse;
}