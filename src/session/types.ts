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

}
export interface IDisconnectAndRemoveOneSessionResPayload extends BaseResponsePayload{

}


export interface ICloseAndRemoveAllSessionsPayload extends BaseRequestPayload{

}
export interface ICloseAndRemoveAllSessionsResPayload extends BaseResponsePayload{

}


export interface ISendCacheRequestOfOneSessionPayload extends BaseRequestPayload{

}
export interface ISendCacheRequestOfOneSessionResPayload extends BaseResponsePayload{

}

export interface ISolaceContextChangedEventPayload extends ISolaceContextPayload {

}