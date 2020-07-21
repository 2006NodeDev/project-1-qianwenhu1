import express, {Request, Response, NextFunction} from 'express'
import { updateUser} from '../daos/sql/user-dao'
import { User } from '../models/User'
import { getUserByIDService, createUserService } from '../services/user-service'

export let userRouter = express.Router()


userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let {id} = req.params
    if(!isNaN(+id)){
        if (req.session.user.userId !== +id){
            res.status(401).send('The incoming token has expired')
        }
        else{
            try{
                let user = await getUserByIDService(+id)
                res.json(user)
            }catch(e){
                next(e)
            }      
        }
    }
    
})


userRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    
    let {userId, username, password, firstName, lastName, email, monthOfBirth, dateOfBirth, yearOfBirth, image} = req.body
    let invalidAttempt = 0
    if(userId){
        let currUser: User = {userId, username, password, firstName, lastName, email, monthOfBirth, dateOfBirth, yearOfBirth, image, invalidAttempt}
        try{            
            let modifiedUser = await updateUser(currUser)
            res.json(modifiedUser)
        }catch(e){
            next(e)
        }
    
    }
    else{
        res.status(400).send('Invalid userId')
    }
})


userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    
    let {userId, username, password, firstName, lastName, email, monthOfBirth, dateOfBirth, yearOfBirth, image} = req.body
    let invalidAttempt = 0
    if(!userId){
        let newUser: User = {userId, username, password, firstName, lastName, email, monthOfBirth, dateOfBirth, yearOfBirth, image, invalidAttempt}
        try{            
            let newlyCreatedUser = await createUserService(newUser)
            res.json(newlyCreatedUser)
        }catch(e){
            next(e)
        }
    
    }
    else{
        res.status(400).send('Invalid userId')
    }
})