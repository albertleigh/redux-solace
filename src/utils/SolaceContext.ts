import uuid from 'uuid/v4';

let totalSessionCreatedSeq = 0;

export interface ISessionContextConfig {
    [key:number]:any,
    [key:string]:any,
}

export interface ISessionContextEventHooks {
    [key:number]:any,
    [key:string]:any,
}

export interface ISessionContextConsumerDict {
    [key:number]:any,
    [key:string]:any,
}

export class SessionContext{

    id:string;
    name:string;
    session:any;
    sessionCacheName:string;
    cacheSession:any;
    eventHooks:ISessionContextEventHooks;
    config:ISessionContextConfig;
    subscribedTopics:string[];
    consumerDict:ISessionContextConsumerDict;
    createdAt:Date;

    constructor(session:any,sessionId:string,sessionCache:string,eventHooks:ISessionContextEventHooks,config:ISessionContextConfig){
        this.id = sessionId;
        this.name = `Session-${totalSessionCreatedSeq}`;
        this.session = session;
        this.sessionCacheName = sessionCache;
        this.cacheSession = null;
        this.eventHooks = eventHooks;
        this.config = config;
        this.subscribedTopics = [];
        this.consumerDict = {};
        this.createdAt = new Date();
    }

}

export interface ISolaceContextPayload {
    total:number,
    defaultSessionId:string,
    sessionContexts:Array<{
        id:string,
        name:string,
        subscribedTopics:string[],
        config:ISessionContextConfig,
        queueNamesConsumed:string[],
        sessionCacheName:string,
        createdAt:Date,
    }>
}

export default class SolaceContext{

    solace:any;

    total:number = 0;
    sessionContextDict:{[key:string]:SessionContext} = {};
    defaultSessionId:string = null;

    solaceSessionEventCodes:number[];
    messageConsumerEventCodes:string[];


    constructor(solace:any) {

        const factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProperties.version10;
        solace.SolclientFactory.init(factoryProps);

        this.solace = solace;

        // at least 19 events needed to be registered
        this.solaceSessionEventCodes = [
            solace.SessionEventCode.ACKNOWLEDGED_MESSAGE,
            solace.SessionEventCode.CAN_ACCEPT_DATA,
            solace.SessionEventCode.CONNECT_FAILED_ERROR,
            solace.SessionEventCode.DISCONNECTED,
            solace.SessionEventCode.DOWN_ERROR,
            solace.SessionEventCode.GUARANTEED_MESSAGE_PUBLISHER_DOWN,
            // most important event
            solace.SessionEventCode.MESSAGE,
            solace.SessionEventCode.PROPERTY_UPDATE_ERROR,
            solace.SessionEventCode.PROPERTY_UPDATE_OK,
            solace.SessionEventCode.RECONNECTED_NOTICE,
            solace.SessionEventCode.RECONNECTING_NOTICE,
            solace.SessionEventCode.REJECTED_MESSAGE_ERROR,
            solace.SessionEventCode.REPUBLISHING_UNACKED_MESSAGES,
            solace.SessionEventCode.SUBSCRIPTION_ERROR,
            solace.SessionEventCode.SUBSCRIPTION_OK,
            solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_ERROR,
            solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_OK,
            solace.SessionEventCode.UP_NOTICE,
            solace.SessionEventCode.VIRTUALROUTER_NAME_CHANGED,
        ];

        this.messageConsumerEventCodes = [
            solace.MessageConsumerEventName.ACTIVE,
            solace.MessageConsumerEventName.CONNECT_FAILED_ERROR,
            solace.MessageConsumerEventName.DISPOSED,
            solace.MessageConsumerEventName.DOWN,
            solace.MessageConsumerEventName.DOWN_ERROR,
            solace.MessageConsumerEventName.GM_DISABLED,
            solace.MessageConsumerEventName.INACTIVE,
            // solace.MessageConsumerEventName.MESSAGE,
            solace.MessageConsumerEventName.UP,
        ];
    }

    hasDefaultSession = ():boolean=>(this.defaultSessionId != null);

    private _addSession = (session:any,sessionCache:string,eventHooks:ISessionContextEventHooks,config:ISessionContextConfig):string=>{
        let id = uuid();
        while(!!this.sessionContextDict[id]){id = uuid()}
        this.sessionContextDict[id] = new SessionContext(session,id,sessionCache,eventHooks,config);
        this.defaultSessionId = this.defaultSessionId===null?id:this.defaultSessionId;
        this.total++;
        totalSessionCreatedSeq++;
        return id;
    }

    getSession = (id:string):(any|null)=>{
        if (!!this.sessionContextDict[id]){
            return this.sessionContextDict[id].session;
        }else{
            return null;
        }
    }

    getDefaultSession = ():(any|null)=>{
        if (!!this.defaultSessionId && !!this.sessionContextDict[this.defaultSessionId]){
            return this.sessionContextDict[this.defaultSessionId].session;
        }else{
            return null;
        }
    }

    removeSession = (id:string):number => {
        if (!!this.sessionContextDict[id]){
            delete this.sessionContextDict[id];
            if (id === this.defaultSessionId){
                const sessionIds = Object.keys(this.sessionContextDict);
                this.defaultSessionId = sessionIds.length>0?sessionIds[0]:null;
            }
            this.total--;
            return 1;
        }else{
            return 0;
        }
    }

    getContextPayload = ():ISolaceContextPayload=>({
        total:this.total,
        defaultSessionId:this.defaultSessionId,
        sessionContexts:Object.keys(this.sessionContextDict)
            .sort((a,b)=>{
                const nameA = a.toUpperCase();
                const nameB = b.toUpperCase();

                if (nameA<nameB){
                    return -1;
                }

                if (nameA>nameB){
                    return 1;
                }

                return 0;
            })
            .map((sessionId:string)=>({
                id:this.sessionContextDict[sessionId].id,
                name:this.sessionContextDict[sessionId].name,
                subscribedTopics:this.sessionContextDict[sessionId].subscribedTopics.slice(),
                config:this.sessionContextDict[sessionId].config,
                queueNamesConsumed:Object.keys(this.sessionContextDict[sessionId].consumerDict),
                sessionCacheName:this.sessionContextDict[sessionId].sessionCacheName,
                createdAt:this.sessionContextDict[sessionId].createdAt,
            }))
    })

    // session management session




}


































