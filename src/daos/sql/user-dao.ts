import {User} from "../../models/User";
import {PoolClient, QueryResult} from 'pg';
import { connectionPool } from ".";
import { BadRequestError } from "../../errors/BadRequestError";
import { UserDTOtoUserConvertor } from "../../utils/UserDTO-to-User-convertor";
import { expressEventEmitter, customOriginalUserExpressEvents } from "../../event-listeners";

export async function getUserByUsernameAndPassword(username:string, password: string):Promise<User>{
    let client:PoolClient;
    try{
        
        client = await connectionPool.connect()
        
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, month_of_birth, date_of_birth, year_of_birth, image
                                        from revpro2.users
                                        where username = $1 and "password" = $2; `, [username, password])
        if (results.rowCount === 0){
            await client.query('BEGIN;')//start a transaction
            //Update wrongAttempt if username is valid and the password is wrong 
            let validUsername:QueryResult = await client.query(`select user_id, username, "password", first_name, last_name, email, month_of_birth, date_of_birth, year_of_birth, image, invalid_attempt
                                                            from revpro2.users 
                                                            where username = $1; `, [username])
            if(validUsername.rows[0]!==0){                                        
                                                                
                let user = UserDTOtoUserConvertor(validUsername.rows[0])                                        

                let updatedWrongAttempt = user.invalidAttempt+1 
                //console.log("wrong attempt : "+updatedWrongAttempt);
                
                await client.query(`UPDATE revpro2.users SET "invalid_attempt" = $1 WHERE username = $2;`,[updatedWrongAttempt, username])
                //return original user   
                let originalDBUser:QueryResult = await client.query(`select *
                                                                from revpro2.users
                                                                where username = $1 `, [username])     
                let originalUser = UserDTOtoUserConvertor(originalDBUser.rows[0])  
                //check for wrongAttempt, if it reaches 3
                if (updatedWrongAttempt >2){
                    //expressEventEmitter.emit
                    expressEventEmitter.emit(customOriginalUserExpressEvents.ORIGINAL_USER, originalUser)
                }                                                                                    
            }
            await client.query('COMMIT;')//ends transaction
            
            throw new BadRequestError()
        }
        else{
            let updatedWrongAttempt = 0
            await client.query(`UPDATE revpro2.users SET "invalid_attempt" = $1 WHERE username = $2;`,[updatedWrongAttempt, username])
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


export async function getUserById(id:number):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`select user_id, username, "password", first_name, last_name, email, month_of_birth, date_of_birth, year_of_birth, image
                                        from revpro2.users
                                        where user_id = $1; `, [id])
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


export async function updateUser(currUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')//start a transaction
        if (currUser.username){
            await client.query(`UPDATE revpro2.users SET username = $1 WHERE user_id = $2;`,[currUser.username, currUser.userId])
        }
        if (currUser.password){
            await client.query(`UPDATE revpro2.users SET "password" = $1 WHERE user_id = $2;`,[currUser.password, currUser.userId])
        }
        if (currUser.firstName){
            await client.query(`UPDATE revpro2.users SET first_name = $1 WHERE user_id = $2;`,[currUser.firstName, currUser.userId])
        }
        if (currUser.lastName){
            await client.query(`UPDATE revpro2.users SET last_name = $1 WHERE user_id = $2;`,[currUser.lastName, currUser.userId])
        }
        if (currUser.email){
            await client.query(`UPDATE revpro2.users SET email = $1 WHERE user_id = $2;`,[currUser.email, currUser.userId])
        }
        if (currUser.monthOfBirth){
            await client.query(`UPDATE revpro2.users SET month_of_birth = $1 WHERE user_id = $2;`,[currUser.monthOfBirth, currUser.userId])
        }
        if (currUser.dateOfBirth){
            await client.query(`UPDATE revpro2.users SET date_of_birth = $1 WHERE user_id = $2;`,[currUser.dateOfBirth, currUser.userId])
        }
        if (currUser.yearOfBirth){
            await client.query(`UPDATE revpro2.users SET year_of_birth = $1 WHERE user_id = $2;`,[currUser.yearOfBirth, currUser.userId])
        }
        if (currUser.image){
            await client.query(`UPDATE revpro2.users SET image = $1 WHERE user_id = $2;`,[currUser.image, currUser.userId])
        }

        let results = await client.query(`select *
                                        from revpro2.users
                                        where user_id = $1; `, [currUser.userId])

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



export async function createUser(newUser: User): Promise<User>{
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        console.log(newUser)
        let results:QueryResult = await client.query(`insert into revpro2.users("username", "password", "first_name", "last_name", "email", "month_of_birth", "date_of_birth", "year_of_birth", image, invalid_attempt)
                                                values($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) returning "user_id"`, 
                                                [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, newUser.monthOfBirth, newUser.dateOfBirth, newUser.yearOfBirth, newUser.image, newUser.invalidAttempt])

        let rId = results.rows[0].user_id
        let finalResult:QueryResult = await client.query(`select username, "password", first_name, last_name, email, month_of_birth, date_of_birth, year_of_birth, image
                                                        from revpro2.users 
                                                        where user_id = $1; `, [rId])
        await client.query('COMMIT;')
        return UserDTOtoUserConvertor(finalResult.rows[0])
    } catch(e){
        client && client.query('ROLLBACK;')
        console.log(e)
        throw new Error("Error Occured")
    } finally{
        client && client.release()
    }
}
