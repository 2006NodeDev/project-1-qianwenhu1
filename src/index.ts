import express , {Request, Response, NextFunction }from 'express'
import {BadRequestError} from './errors/BadRequestError'
import {sessionMiddleware} from './middleware/session-middleware'
import {userRouter} from './routers/user-router'
import {reimbursementRouter} from './routers/reimbursement-router'
import { getUserByUsernameAndPassword } from './daos/user-dao'

const app = express()   //app represents entire empress application
app.use(express.json()) //convert request body to js object

app.use(sessionMiddleware)

app.use('/users',userRouter) //redirect to userRouter
app.use('/reimbursements',reimbursementRouter)//redirect to reimbursementRouter

app.post('/login', async (req: Request, res:Response, next:NextFunction)=>{
    let username = req.body.username
    let password = req.body.password
    if(!username || !password){
        throw new BadRequestError()
    } else {
        try{
            let user = await getUserByUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        }catch(e){
            next(e)
        }
    }
})

app.use((err, req, res, next)=>{
    if (err.statusCode)
        res.status(err.statusCode).send(err.message)
    res.status(500).send('Internal server problem')
})

app.listen(2008, ()=>{
    console.log('Server is running')
})