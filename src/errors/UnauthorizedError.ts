import { HttpError } from "./HttpError";


export class UnauthorizedError extends HttpError{
    constructor(){
        super(401, "The incoming token has expired")
    }
}