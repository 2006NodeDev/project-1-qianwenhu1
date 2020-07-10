import express, {Request, Response, NextFunction} from 'express'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
//import {UnauthorizedError} from '../errors/UnauthorizedError'
import { getAllUsers, getUserById, SetUser } from '../daos/user-dao'
import { Role } from '../models/Role'
//import { Role } from '../models/Role'

export let userRouter = express.Router()


userRouter.get('/', authorizationMiddleware(['finance-manager']), async (req: Request, res: Response, next: NextFunction) => {
    try {
            let allUsers = await getAllUsers()
            res.json(allUsers)
        } catch (e) {
            next(e)
        }
})

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let {id} = req.params
    if(!isNaN(+id)){
        if (req.session.user.userId !== +id && req.session.user.role.role !== 'finance-manager'){
            res.status(401).send('The incoming token has expired')
        }
        else{
            try{
                let user = await getUserById(+id)
                res.json(user)
            }catch(e){
                next(e)
            }      
        }
    }
    
})

userRouter.patch('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    
    let {userId, username, password, firstName, lastName, email, role} = req.body
    if(userId){
        let newUser: (string|number|undefined|Role)[] = [userId, username, password, firstName, lastName, email, role&&role.roleId]
        console.log(newUser);
        
        try{            
            let modifiedUser = await SetUser(newUser)
            res.json(modifiedUser)
        }catch(e){
            next(e)
        }
    
    }
    else{
        res.status(400).send('Invalid userId')
    }
})
