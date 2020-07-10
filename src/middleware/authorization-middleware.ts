import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export function authorizationMiddleware(roles:string[]){
    return (req:Request, res:Response, next:NextFunction) => {
        let notFound = true
        for(const role of roles){
            if(req.session.user.role.role === role){
                notFound = false
                next()
            }
        }
        if(notFound){
            throw new UnauthorizedError()
        }
    }
}