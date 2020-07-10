import { PoolClient, QueryResult } from "pg";
import { Reimbursement } from "../models/Reimbursement";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConvertor } from "../utils/ReimbursementDTO-to-Reimbursement-convertor";



export async function submitReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement>{
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        await client.query('BEGIN;')//start a transaction
        
        let results:QueryResult = await client.query(`insert into reimbursement.reimbursements("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type")
                                                values($1,$2,$3,$4,$5,$6,$7,$8) returning "reimbursement_id"`, 
                                                [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, newReimbursement.dateResolved, newReimbursement.description, newReimbursement.resolver,newReimbursement.status, newReimbursement.type ])

        let rId = results.rows[0].reimbursement_id
        let finalResult:QueryResult = await client.query(`select "reimbursement_id", "author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type"
                                                        from reimbursement.reimbursements r
                                                        where reimbursement_id = $1; `, [rId])
        await client.query('COMMIT;')//ends transaction
        return ReimbursementDTOtoReimbursementConvertor(finalResult.rows[0])
    } catch(e){
        client && client.query('ROLLBACK;')
        console.log(e)
        throw new Error("Error Occured")
    } finally{
        client && client.release()
    }
}



export async function getReimbursementsByStatus(statusId: number): Promise<Reimbursement[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`select "reimbursement_id", "author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type"
                                        from reimbursement.reimbursements r
                                        where status = $1; `, [statusId])
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor)
    }catch(e){
        console.log(e)
        throw new Error("Error Occured")
    }finally{
        client && client.release()
    }
}


export async function getReimbursementsByUser(author: number): Promise<Reimbursement[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`select "reimbursement_id", "author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type"
                                        from reimbursement.reimbursements r
                                        where author = $1; `, [author])
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor)
    }catch(e){
        console.log(e)
        throw new Error("Error Occured")
    }finally{
        client && client.release()
    }
}

export async function UpdateReimbursement(newReimbursement:(string|number|undefined)[] ): Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query('BEGIN;')//start a transaction

        if (newReimbursement[7] === 1 || newReimbursement[7] === 3){
            let bignumber:bigint = BigInt(Date.now())
            await client.query(`UPDATE reimbursement.reimbursements SET status = $1 WHERE reimbursement_id = $2;`,[newReimbursement[7], newReimbursement[0]])
            await client.query(`UPDATE reimbursement.reimbursements SET date_resolved = $1 WHERE reimbursement_id = $2;`,[bignumber, newReimbursement[0]])

        }
        if (newReimbursement[1]){
            await client.query(`UPDATE reimbursement.reimbursements SET author = $1 WHERE reimbursement_id = $2;`,[newReimbursement[1], newReimbursement[0]])
        }
        if (newReimbursement[2]){
            await client.query(`UPDATE reimbursement.reimbursements SET amount = $1 WHERE reimbursement_id = $2;`,[newReimbursement[2], newReimbursement[0]])
        }
        if (newReimbursement[3]){
            await client.query(`UPDATE reimbursement.reimbursements SET date_submitted = $1 WHERE reimbursement_id = $2;`,[newReimbursement[3], newReimbursement[0]])
        }
        if (newReimbursement[4]){
            await client.query(`UPDATE reimbursement.reimbursements SET date_resolved = $1 WHERE reimbursement_id = $2;`,[newReimbursement[4], newReimbursement[0]])
        }
        if (newReimbursement[5]){
            await client.query(`UPDATE reimbursement.reimbursements SET description = $1 WHERE reimbursement_id = $2;`,[newReimbursement[5], newReimbursement[0]])
        }
        if (newReimbursement[6]){
            await client.query(`UPDATE reimbursement.reimbursements SET resolver = $1 WHERE reimbursement_id = $2;`,[newReimbursement[6], newReimbursement[0]])
        }
        if (newReimbursement[8]){
            await client.query(`UPDATE reimbursement.reimbursements SET type = $1 WHERE reimbursement_id = $2;`,[newReimbursement[8], newReimbursement[0]])
        }
        let results = await client.query(`select "reimbursement_id", "author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type"
                                        from reimbursement.reimbursements r
                                        where reimbursement_id = $1; `, [newReimbursement[0]])
        await client.query('COMMIT;')//ends transaction

        console.log();
        
        if(results.rows[0] === 0){
            throw new Error("User not found")
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    }catch(e){
        client && client.query('ROLLBACK;')
        console.log(e)
        throw new Error("Error Occured")
    }finally{
        client && client.release()
    }
}

