import { Pool } from 'pg'

//build a connection pool to our database
export const connectionPool:Pool = new Pool({
    host: process.env['LB_HOST'], //ip of database
    user: process.env['LB_USER'], 
    password: process.env['LB_PASSWORD'],
    database: process.env['LB_DATABASE'],
    port:5432,
    max:5 //max number of connection
})