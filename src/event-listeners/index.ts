import {EventEmitter} from 'events'
//EventEmitter holds event listeners and to send event triggers to those listeners
//emit(): emit an event
//Listeners that listen to this event gets triggered
export const expressEventEmitter = new EventEmitter()

//definitions for custom events
export const customUserBirthdayExpressEvents = {
    CUR_USER: 'CUR_USER'
}

export const customOriginalUserExpressEvents = {
    ORIGINAL_USER: 'ORIGINAL_USER'
}