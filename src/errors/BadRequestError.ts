import {HttpError} from './HttpError'

export class BadRequestError extends HttpError{
    constructor(){
        super(400, 'Invalid Credentials')
    }
}