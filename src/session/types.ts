import { BaseRequestPayload, BaseResponsePayload } from '../base/BasePayload';

import { ISessionContextConfig, ISolaceContextPayload, SessionContext } from '../utils/SolaceContext';

export interface ICreateAndConnectSessionPayload extends BaseRequestPayload{
    hostUrl:string,
    vpn:string,
    username:string,
    sessionCache:string,
    pass:string,
    config?:ISessionContextConfig,
}
export interface ICreateAndConnectSessionResPayload extends BaseResponsePayload{
    result?: SessionContext,
}


export interface IDisconnectAndRemoveOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
}
export interface IDisconnectAndRemoveOneSessionResPayload extends BaseResponsePayload{
    result?:number,
}


export interface ICloseAndRemoveAllSessionsPayload extends BaseRequestPayload{

}
export interface ICloseAndRemoveAllSessionsResPayload extends BaseResponsePayload{
    result?:number,
}


export interface ISendCacheRequestOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    topicName:string,
    requestId:number,
    cb?:Function,
    userObj?:any
}
export interface ISendCacheRequestOfOneSessionResPayload extends BaseResponsePayload{
    iArguments?:IArguments,
}

export interface ISolaceContextChangedEventPayload extends ISolaceContextPayload {

}