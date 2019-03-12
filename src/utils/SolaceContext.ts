import uuid from 'uuid/v4';

let totalSessionCreatedSeq = 0;

export interface ISessionContextConfig {
    usePerMsgAck?:boolean,
}

export interface ISessionContextEventHooks {
    [key:number]:Array<(event:any)=>void>,
    [key:string]:Array<(event:any)=>void>,
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

    private _generateOneEventHookOfOnesessionHandler = (sessionId:string,eventCode:(string|number)):((sessionEvent:any)=>void) =>{
        return(sessionEvent)=>{
            if (this.sessionContextDict[sessionId].eventHooks[eventCode]){
                this.sessionContextDict[sessionId].eventHooks[eventCode].forEach(
                    (oneFun)=>{
                        oneFun(sessionEvent);
                    }
                )
            }
        }
    }

    createAndConnectSession = (hosturl:string,username:string,pass:string,vpn:string,sessionCache:string,eventHooks:ISessionContextEventHooks={},config:ISessionContextConfig={}):SessionContext=>{
        let oneSession;
        let sessionProperty;

        if (!eventHooks[this.solace.SessionEventCode.DISCONNECTED]){
            eventHooks[this.solace.SessionEventCode.DISCONNECTED]=[];
        }

        if (
            hosturl.lastIndexOf("ws://")!==0 &&
            hosturl.lastIndexOf("wss://")!==0 &&
            hosturl.lastIndexOf("http://")!==0 &&
            hosturl.lastIndexOf("https://")!==0
        ){
            console.error('SolaceContext::createAndConnectSession Invalid protocol - please user one of ws://, wss://, http:// or https:// in host url', hosturl);
            return null;
        }

        if (!hosturl || !username || !vpn){
            console.error('SolaceContext::createAndConnectSession Cannot connect: please specify all the Solace msg router properties', hosturl, username, vpn);
            return null;
        }

        console.log('[redux-solace] connecting to solace msg router using url: ', hosturl);
        console.log('[redux-solace] client name', username);
        console.log('[redux-solace] solace msg router vpn name', vpn);
        console.log('[redux-solace] creating session', vpn);

        // solace session properties
        sessionProperty={
            url: hosturl,
            vpnName: vpn,
            userName: username,
            password: pass,
        };

        if (config && config.usePerMsgAck){
            sessionProperty.publisherProperties={
                acknowledgeMode: this.solace.MessagePublisherAcknowledgeMode.PER_MESSAGE,
            }
        }

        oneSession = this.solace.SolclientFactory.createSession(sessionProperty);

        // add default disconnected hook
        eventHooks[this.solace.DISCONNECTED].push((sessionEvent)=>{
            console.log('[redux-solace] one session disconnected');
            if (oneSession){
                oneSession.dispose();
                oneSession = null;
            }
        });

        let theSessionId = this._addSession(oneSession, sessionCache, eventHooks, config);
        this.solaceSessionEventCodes.forEach((eventCode)=>{
            oneSession.on(eventCode, this._generateOneEventHookOfOnesessionHandler(theSessionId, eventCode));
        })

        console.log('[redux-solace] Establishing one session connection');

        oneSession.connect()
        return this.sessionContextDict[theSessionId];
    };

    addOneToEventHookOfOneSession = (sessionId:string, eventCode:(string|number), cb:(event:any)=>void):void=>{
        if (!this.sessionContextDict[sessionId].eventHooks[eventCode]){
            this.sessionContextDict[sessionId].eventHooks[eventCode] = [];
        }

        if(!this.sessionContextDict[sessionId].eventHooks[eventCode].some((oneCb)=>(oneCb === cb))){
            this.sessionContextDict[sessionId].eventHooks[eventCode].push(cb);
        }
    };

    removeFromEventHookOfOneSession = (sessionId:string, eventCode:(string|number), cb:(event:any)=>void):void=>{
        if (this.sessionContextDict[sessionId].eventHooks[eventCode]){
            this.sessionContextDict[sessionId].eventHooks[eventCode]=
                this.sessionContextDict[sessionId].eventHooks[eventCode].filter( oneCb => (oneCb !== cb));
        }
    };

    disconnectAndRemoveOneSession = (sessionId:string):number=>{
        if (!!this.sessionContextDict[sessionId]){
            console.log('[redux-solace] Disconnecting from solace msg router of sessionId:', sessionId);
            this.sessionContextDict[sessionId].session.disconnect();
            return this.removeSession(sessionId);
        }else{
            console.log('[redux-solace] Failed to disconnecting from solace msg router of non-existing sessionId:', sessionId);
            return 0;
        }
    };

    disconnectAllSessions = ():number => {
        let sum = 0;
        Object.keys(this.sessionContextDict).forEach( (oneSessionId:string)=>{
            sum+=this.disconnectAndRemoveOneSession(oneSessionId);
        });
        return sum;
    };

    sendCacheRequestOfOneSession = (
        sessionId:string, topicName:string,
        requestId:string, cb:Function, userObj:any = {}
    ):void=>{
        if (this.sessionContextDict[sessionId] && this.sessionContextDict[sessionId].session){
            // assert we have one session obj

            // check and create cache session if needed
            if (!this.sessionContextDict[sessionId].cacheSession){
                this.sessionContextDict[sessionId].cacheSession = this.sessionContextDict[sessionId].session.createCacheSession(
                    new this.solace.CacheSessionProperties(
                        this.sessionContextDict[sessionId].sessionCacheName
                    )
                )
            }

            // do request the cache
            this.sessionContextDict[sessionId].cacheSession.sendCacheRequest(
                requestId,
                this.solace.SolclientFactory.createTopicDestination(topicName),
                false,
                this.solace.CacheLiveDataAction.FLOW_THRU,
                new this.solace.CacheCBInfo(
                    cb,userObj
                )
            );
        }else{
            throw `[redux-solace]Cannot find session ${sessionId}`;
        }
    };

    // publish & subscribe

    publishOneTxtMsgOfOneSession = (
        sessionId:string, topicName:string, msgText:string, userDataStr:string = "",userPropertyMap:any = {}
    )=>{
        if(!!this.sessionContextDict[sessionId]){
            const context:SessionContext = this.sessionContextDict[sessionId];
            const message = this.solace.SolclientFactory.createMessage();
            const _userPropertyMap = new this.solace.SDTMapContainer();

            Object.keys(userPropertyMap).forEach((oneKey)=>{
                const oneField = this.solace.SDTField.create(this.solace.SDTFieldType.STRING,''+userPropertyMap[oneKey]);
                _userPropertyMap.addField(oneKey,oneField);
            });

            message.setUserData(userDataStr);
            message.setUserPropertyMap(_userPropertyMap);
            message.setDestination(this.solace.SolclientFactory.createTopicDestination(topicName));
            message.setBinaryAttachment(msgText);
            message.setDeliveryMode(this.solace.MessageDeliveryModeType.DIRECT);

            console.log(`[redux-solace] publishing msg ${msgText} to topic ${topicName}`);

            context.session.send(message);

            console.log(`[redux-solace] msg published`);
        }else{
            console.log(`[redux-solace] cannot publish not-existing ${sessionId}`);
        }

    };

    subscribeOneTopicOfOneSession = (
        sessionId:string, topicName:string, timeout:number=10000
    )=>{
        if(!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            if (context.subscribedTopics.some(one=>(one === topicName))){
                console.log(`[redux-solace] already subscribed to ${topicName} and ready to consume msg`);
            }else{
                console.log(`[redux-solace] subscribing to ${topicName}`);
                context.session.subscribe(
                    this.solace.SolclientFactory.createTopicDestination(topicName),
                    true, // generate confirmation when subscription is added successfully
                    topicName,
                    timeout
                );
                context.subscribedTopics.push(topicName);
            }
        }else{
            console.log(`[redux-solace] cannot subscribe not-existing ${sessionId}`);
        }
    };

    unsubscribeOneTopicOfOneSession = (
        sessionId:string, topicName:string, timeout:number=10000
    )=>{
        if(!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            if (context.subscribedTopics.some(one=>(one === topicName))){
                console.log(`[redux-solace] unsubscribe ${topicName}`);
                context.session.unsubscribe(
                    this.solace.SolclientFactory.createTopicDestination(topicName),
                    true, // generate confirmation when unsubscription is done
                    topicName,
                    timeout
                );
                context.subscribedTopics = context.subscribedTopics.filter( one => (one!==topicName));
            }else{
                console.log(`[redux-solace] cannot unsubscribe ${topicName} b/c not subscribed to it yet`);
            }

        }else{
            console.log(`[redux-solace] cannot unsubscribe not-existing ${sessionId}`);
        }
    };

    // queue and confirmed delivery

    sendOneTxtMsgToQueueOfOneSession = (
        sessionId:string, queueName:string, msgTxt:string, userDataStr:string, userPropertyMap:any, correlationKey:any=null
    ) =>{
        if (!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            const message = this.solace.SolclientFactory.createMessage();
            const _userPropertyMap = new this.solace.SDTMapContainer();

            Object.keys(userPropertyMap).forEach((oneKey)=>{
                const oneField = this.solace.SDTField.create(this.solace.SDTFieldType.STRING,''+userPropertyMap[oneKey]);
                _userPropertyMap.addField(oneKey,oneField);
            });

            message.setUserData(userDataStr);
            message.setUserPropertyMap(_userPropertyMap);
            message.setDestination(this.solace.SolclientFactory.createDurableQueueDestination(queueName));
            message.setBinaryAttachment(msgTxt);
            message.setDeliveryMode(this.solace.MessageDeliveryModeType.PERSISTENT);
            if(correlationKey){
                correlationKey.sessionId = sessionId;
                message.setCorrelationKey(correlationKey);
            }
            console.log(`[redux-solace] sending msg ${msgTxt} to queue ${queueName}`);
            context.session.send(message);
            console.log(`[redux-solace] msg published`);
        }else{
            console.log(`[redux-solace] cannot send to the queue b/c not-existing session ${sessionId}`);
        }
    };

    consumeFromQueueOfOneSession = (
        sessionId:string, queueName:string, onMsgCb:Function,
        autoAck:boolean=true, otherCbDict:{[key:number]:Function,[key:string]:Function} = {}
    ) =>{
        if(!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            if (!!context.consumerDict[queueName]){
                console.log(`[redux-solace] already listen to ${queueName} and ready to consume the message`);
            }else{
                const msgConsumer = context.session.createMessageConsumer({
                    queueDescriptor:{
                        name:queueName,
                        type: this.solace.QueueType.QUEUE,
                    },
                    acknowledgeMode: this.solace.MessageConsumerAcknowledgeMode.CLIENT, // enabling client ack
                });
                msgConsumer.connect();
                msgConsumer.on(this.solace.MessageConsumerEventName.MESSAGE,(message)=>{
                    if (autoAck){
                        message.acknowledge();
                    }
                    onMsgCb(message);
                });

                this.messageConsumerEventCodes.forEach(evtKey => {
                    if (otherCbDict[evtKey]){
                        msgConsumer.on(evtKey,(...args)=>{
                            otherCbDict[evtKey](...args)
                        })
                    }
                });

                context.consumerDict[queueName] = msgConsumer;
            }
        }else{
            console.log(`[redux-solace] cannot consume msg via not-existing session ${sessionId}`);
        }

    };

    // request & reply

    sendTxtMsgReqOfOneSession = (
        sessionId:string, topicName:string, msgTxt:string, userDataStr:string, userPropertyMap:any,
        replyReceivedCb:(session:any,message:any)=>void,replyFailedCb:(session:any,e:Error)=>void,
        userObj:any = {}, deliverToOne:Boolean = true, timeout:number = 5000
    ) =>{
        if (!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            const message = this.solace.SolclientFactory.createMessage();
            const _userPropertyMap = new this.solace.SDTMapContainer();

            Object.keys(userPropertyMap).forEach((oneKey)=>{
                const oneField = this.solace.SDTField.create(this.solace.SDTFieldType.STRING,''+userPropertyMap[oneKey]);
                _userPropertyMap.addField(oneKey,oneField);
            });

            message.setUserData(userDataStr);
            message.setUserPropertyMap(_userPropertyMap);
            message.setDestination(this.solace.SolclientFactory.createDurableQueueDestination(topicName));
            message.setBinaryAttachment(msgTxt);
            message.setDeliveryMode(this.solace.MessageDeliveryModeType.DIRECT);
            message.setDeliverToOne(deliverToOne);

            context.session.sendRequest(
                message, timeout, replyReceivedCb, replyFailedCb, userObj
            );
            console.log(`[redux-solace] req msg send`, msgTxt);

        }else{
            console.log(`[redux-solace] cannot send txt req msg as session ${sessionId} not found`);
        }

    };

    replyOneMsgViaTxtOfOneSession= (
        receivedMsg:any, sessionId:string, msgTxt:string="", userDataStr:string="", userPropertyMap:any={}
    ) =>{
        if (!!this.sessionContextDict[sessionId]){
            const context = this.sessionContextDict[sessionId];
            const message = this.solace.SolclientFactory.createMessage();
            const _userPropertyMap = new this.solace.SDTMapContainer();
            // const correlationKey = receivedMsg.getCorrelationKey();

            Object.keys(userPropertyMap).forEach((oneKey)=>{
                const oneField = this.solace.SDTField.create(this.solace.SDTFieldType.STRING,''+userPropertyMap[oneKey]);
                _userPropertyMap.addField(oneKey,oneField);
            });

            message.setUserData(userDataStr);
            message.setUserPropertyMap(_userPropertyMap);
            message.setBinaryAttachment(msgTxt);

            context.session.sendReply(
                receivedMsg, message
            );

            console.log(`[redux-solace] reply msg send`, msgTxt);

        }else{
            console.log(`[redux-solace] cannot reply the txt msg as session ${sessionId} not found`);
        }

    };

}
