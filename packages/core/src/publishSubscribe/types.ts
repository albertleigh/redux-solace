import { BaseRequestPayload, BaseResponsePayload } from '../base/BasePayload';

export interface IPublishOneTxtMsgToOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    topicName:string,
    msgText:string,
    userDataStr?:string,
    userPropertyMap?:any,
}
export interface IPublishOneTxtMsgToOneSessionResPayload extends BaseResponsePayload{
}

export interface ISubscribeOneTopicOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    topicName:string,
    timeout?:number,
}
export interface ISubscribeOneTopicOfOneSessionResPayload extends BaseResponsePayload{
}

export interface IUnsubscribeOneTopicOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    topicName:string,
    timeout?:number,
}
export interface IUnsubscribeOneTopicOfOneSessionResPayload extends BaseResponsePayload{
}
