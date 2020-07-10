import express, {Request, Response, NextFunction} from 'express'
import { Reimbursement } from '../models/Reimbursement'
import { submitReimbursement, getReimbursementsByStatus, getReimbursementsByUser, UpdateReimbursement } from '../daos/reimbursement-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export let reimbursementRouter = express.Router()

reimbursementRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
    let {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = req.body
    
    if(reimbursementId === 0){
        let submitDate:any =  dateSubmitted;
        if(!dateSubmitted){
            submitDate =  BigInt(Date.now())
        }
        if(!dateResolved){
            dateResolved = BigInt(0)   //default date resovled
        }
        if(!resolver){
            resolver = 2       //default resolver
        }
        if(!status){
            status = 2         //pending
        }
        let newReimbursment: Reimbursement = {reimbursementId, author, amount, dateSubmitted: submitDate, dateResolved, description, resolver, status, type}
        newReimbursment.resolver = resolver || null
        newReimbursment.type = type || null
        
        try{
            let submittedReimbursement = await submitReimbursement(newReimbursment)
            res.status(201)
            res.json(submittedReimbursement)
        }catch(e){
            next(e)
        }
    }
    else{
        res.status(400).send("Bad request, reimbursement id shoud be 0")
    }
})


reimbursementRouter.get('/status/:statusId', authorizationMiddleware(['finance-manager']), async (req: Request, res: Response, next: NextFunction) => {
    let {statusId} = req.params
    if(!isNaN(+statusId)){
        try{
            let reimbursement = await getReimbursementsByStatus(+statusId)
            res.json(reimbursement)
        }catch(e){
            next(e)
        }      
        
    }
    
})


reimbursementRouter.get('/author/userId/:userId', async (req: Request, res: Response, next: NextFunction) => {
    let {userId} = req.params
    if(!isNaN(+userId)){
        if (req.session.user.userId !== +userId && req.session.user.role.role !== 'finance-manager'){
            res.status(401).send('The incoming token has expired')
        }
        else{
            try{
                let reimbursement = await getReimbursementsByUser(+userId)
                res.json(reimbursement)
            }catch(e){
                next(e)
            }  
        }

    }
    
})


reimbursementRouter.patch('/', authorizationMiddleware(['finance-manager']), async (req: Request, res: Response, next: NextFunction) => { 
    let {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = req.body
    if(reimbursementId){
        let newReimbursement:(string|number|undefined)[] = [reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type]
        try{
            let modifiedReimbursement = await UpdateReimbursement(newReimbursement)
            res.json(modifiedReimbursement)
        }catch(e){
            next(e)
        }
    }
    else{
        res.status(400).send('Invalid reimbursementId')
    }
})

