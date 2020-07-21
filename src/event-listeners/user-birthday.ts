//all of the event listeners for the new user event

import { expressEventEmitter, customUserBirthdayExpressEvents } from ".";
import { User } from "../models/User";
import { userTopic } from "../messaging";

//custom event listener that will fire when user login
expressEventEmitter.on(customUserBirthdayExpressEvents.CUR_USER, (curUser:User)=>{
    //send to pub sub
    //setImmediate allow us to send async
    setImmediate(async ()=>{
        try{
            await userTopic.publishJSON(curUser) //message id
        }catch(e){
            console.log(e)
        }
    })
})