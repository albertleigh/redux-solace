import {ActionHandlerParams} from "../GlobalTypes";
import * as asyncs from './async';

export const createAndConnectSessionHandler = (params:ActionHandlerParams) =>{
    const { action } = params;
    asyncs.createAndConnectSession(action).catch(e=>{
        // eat the exception
    })
}

export const disconnectAndRemoveOneSessionHandler = (params:ActionHandlerParams) =>{
    const { action } = params;
    asyncs.disconnectAndRemoveOneSession(action).catch(e=>{
        // eat the exception
    })
}

export const closeAndRemoveAllSessionsHandler = (params:ActionHandlerParams) =>{
    const { action } = params;
    asyncs.closeAndRemoveAllSessions(action).catch(e=>{
        // eat the exception
    })
}

export const sendCacheRequestOfOneSessionHandler = (params:ActionHandlerParams) =>{
    const { action } = params;
    asyncs.sendCacheRequestOfOneSession(action).catch(e=>{
        // eat the exception
    })
}