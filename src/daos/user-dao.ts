import {User} from "../models/User";
import {PoolClient} from 'pg';
import { connectionPool } from ".";
import { BadRequestError } from "../errors/BadRequestError";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";
import { Role } from "../models/Role";

export async function getUserByUsernameAndPassword(username:string, password: string):Promise<User>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, u.role_id, "role"
                                        from reimbursement.users u, reimbursement.roles r 
                                        where u.role_id = r.role_id and username = $1 and "password" = $2; `, [username, password])
        if (results.rowCount === 0){
            throw new BadRequestError()
        }
        return UserDTOtoUserConvertor(results.rows[0])
    }catch(e){
        if (e.statusCode === 400){
            throw new BadRequestError()
        }
        console.log(e);
        throw new Error('Error Occured') 
    }finally{
        client&&client.release()
    }
    
}


export async function getAllUsers():Promise<User[]>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, u.role_id, "role"
                                            from reimbursement.users u, reimbursement.roles r 
                                            where u.role_id = r.role_id`)
        return results.rows.map(UserDTOtoUserConvertor);
    } catch (e) {
        console.log(e)
        throw new Error('Error Occured')
    } finally {
        client && client.release()
    }
}


export async function getUserById(id:number):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, u.role_id, "role"
                                        from reimbursement.users u, reimbursement.roles r 
                                        where u.role_id = r.role_id and user_id = $1; `, [id])
        if (results.rowCount === 0 ){
            throw new Error("User not found")
        }
        return UserDTOtoUserConvertor(results.rows[0])
    }catch(e){
        if (e.message ==="User not found")
            throw new Error("User not found")
        console.log(e)
        throw new Error("Error Occured")
    }finally{
        client&&client.release()
    }
}

export async function SetUser(newUser:(string|number|undefined|Role)[]):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')//start a transaction
        if (newUser[1]){
            await client.query(`UPDATE reimbursement.users SET username = $1 WHERE user_id = $2;`,[newUser[1], newUser[0]])
        }
        if (newUser[2]){
            await client.query(`UPDATE reimbursement.users SET "password" = $1 WHERE user_id = $2;`,[newUser[2], newUser[0]])
        }
        if (newUser[3]){
            await client.query(`UPDATE reimbursement.users SET first_name = $1 WHERE user_id = $2;`,[newUser[3], newUser[0]])
        }
        if (newUser[4]){
            await client.query(`UPDATE reimbursement.users SET last_name = $1 WHERE user_id = $2;`,[newUser[4], newUser[0]])
        }
        if (newUser[5]){
            await client.query(`UPDATE reimbursement.users SET email = $1 WHERE user_id = $2;`,[newUser[5], newUser[0]])
        }
        console.log(`role id is ${newUser[6]}`);
        
        if (newUser[6]){
            await client.query(`UPDATE reimbursement.users SET role_id = $1 WHERE user_id = $2;`, [newUser[6], newUser[0]])
        }
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, u.role_id, "role"
                                        from reimbursement.users u, reimbursement.roles r 
                                        where u.role_id = r.role_id and user_id = $1; `, [newUser[0]])

        await client.query('COMMIT;')//ends transaction
        if(results.rows[0] === 0){
            throw new Error("User not found")
        }
        return UserDTOtoUserConvertor(results.rows[0])
    }catch(e){
        client && client.query('ROLLBACK;')
        throw new Error("Error Occured")
    }finally{
        client&&client.release()
    }
}
