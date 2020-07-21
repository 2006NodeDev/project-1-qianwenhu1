import { expressEventEmitter, customOriginalUserExpressEvents } from ".";
import { User } from "../models/User";
import { userTopic } from "../messaging";

//custom event listener that will fire when user login
expressEventEmitter.on(customOriginalUserExpressEvents.ORIGINAL_USER, (originalUser:User)=>{
    //send to pub sub
    //setImmediate allow us to send async
    setImmediate(async ()=>{
        try{
            await userTopic.publishJSON(originalUser) //message id
        }catch(e){
            console.log(e)
        }
    })
})