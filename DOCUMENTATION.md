## Big pic
The middleware is designed to intercept certain actions, basing upon the payload of the actions, 
certain apis of solace client js will trigger. After these, if needed a FSA(flux standard action) with
`_RES` suffix will be dispatched into redux registered.

Moreover, another set of similar promise based apis are also provided since something calling direct via promise is much easier.

And it will be up the developers to decide which to use.

For instance, to create one session, client app needs to create a `CREATE_AND_CONNECT_SESSION` action via its creator and dispatch it.

```javascript
import {
    Session as SolaceSession
} from 'redux-solace';

// saga side effects as the example

function* establishSolaceSession(){
    
    yield put(SolaceSession.actions.createAndConnectSession({
        hostUrl, vpn, username, sessionCache, pass,       
    }))
}

// or regular redux dispatch 

    dispatch(
        SolaceSession.actions.createAndConnectSession({
             hostUrl, vpn, username, sessionCache, pass,       
         })
     )

``` 

and, make no mistake, the middleware will return `CREATE_AND_CONNECT_SESSION_RES` action and client can take it if needed like

```javascript
import {
    Session as SolaceSession
} from 'redux-solace';

function* some() {
    const resAct = yield take(SolaceSession.actions.CREATE_AND_CONNECT_SESSION_RES);
}

```
and resAct will be like
```text
{
    type:'REDUX_SOLACE::CREATE_AND_CONNECT_SESSION_RES'
    payload:{
        result:{
         id:"011ec047-2690-4c7d-8062-dcdd67df9b6f",
         name:"session-1",
         session,
         sessionCacheName,
         cacheSession,
         eventHooks,
         config,
         subscribedTopics,
         consumerDict,
         createdAt
       }
    }
}
```
whose type is defined in https://github.com/albertleigh/redux-solace/blob/master/src/session/types.ts#L13

Beside the actions triggered by clients, the middleware will dispatch event actions coming from solace message router.

For instance, a regular Message Act on solace onMessage event

```text
{
    type:'REDUX_SOLACE::MESSAGE',
    payload:{
        sessionId:"011ec047-2690-4c7d-8062-dcdd67df9b6f",
        session:{...} // solace client js session
        userDataStr: null,
        attachement: null,
        destination:{
            type:'topic',
            name: 'NY/FI/IP/SOMEAPP/TEST'
        },
        userPropertyMap:{
            protoBuffClass:'order.OrderBook',
            createdDate:'2018-07-17T19:52:39.008Z',
            reduxUI:'request'
        }        
    },
    error:false
}
```

client can consume the onMessage act like
```javascript
import {
    Event as SolaceEvent, solace
} from 'redux-solace';

function* onMessage(action){
    // action is a REDUX_SOLACE::MESSAGE act for each on message event.
    
}

function* defaultFun(){
    yield takeEvery(SolaceEvent.actionsDict[solace.SessionEventCode.MESSAGE].actionType,onMessage);
}

```

Currently, the middleware supports:

Session events:
- `solace.SessionEventCode.UP_NOTICE`
- `solace.SessionEventCode.CONNECT_FAILED_ERROR`
- `solace.SessionEventCode.DISCONNECTED`
- `solace.SessionEventCode.SUBSCRIPTION_ERROR`
- `solace.SessionEventCode.SUBSCRIPTION_OK`
- `solace.SessionEventCode.MESSAGE`
- `solace.SessionEventCode.ACKNOWLEDGED_MESSAGE`
- `solace.SessionEventCode.CAN_ACCEPT_DATA`
- `solace.SessionEventCode.DOWN_ERROR`
- `solace.SessionEventCode.GUARANTEED_MESSAGE_PUBLISHER_DOWN`
- `solace.SessionEventCode.PROPERTY_UPDATE_ERROR`
- `solace.SessionEventCode.PROPERTY_UPDATE_OK`
- `solace.SessionEventCode.RECONNECTED_NOTICE`
- `solace.SessionEventCode.RECONNECTING_NOTICE`
- `solace.SessionEventCode.REJECTED_MESSAGE_ERROR`
- `solace.SessionEventCode.REPUBLISHING_UNACKED_MESSAGES`
- `solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_ERROR`
- `solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_OK`
- `solace.SessionEventCode.VIRTUALROUTER_NAME_CHANGED`

Queue consumer events:
- `solace.MessageConsumerEventName.ACTIVE`
- `solace.MessageConsumerEventName.CONNECT_FAILED_ERROR`
- `solace.MessageConsumerEventName.DISPOSED`
- `solace.MessageConsumerEventName.DOWN`
- `solace.MessageConsumerEventName.DOWN_ERROR`
- `solace.MessageConsumerEventName.GM_DISABLED`
- `solace.MessageConsumerEventName.INACTIVE`
- `solace.MessageConsumerEventName.MESSAGE`
- `solace.MessageConsumerEventName.UP`

## Exported package and function summary
```javascript
import {
    Session, 
    PublishSubscribe, 
    Queue, 
    Request, 
    SolaceEvent, 
    createSolaceMiddleware
} from 'redux-solace';
```
Session.actions
- `CREATE_AND_CONNECT_SESSION`
- `DISCONNECT_AND_REMOVE_ONE_SESSION`
- `CLOSE_AND_REMOVE_ALL_SESSIONS`
- `SEND_CACHE_REQUEST_OF_ONE_SESSION`
- event type `SOLACE_CONTEXT_CHANGED`

PublishSubscribe.actions
- `PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION`
- `SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION`
- `UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION`

Queue.actions:
- `SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION`
- `CONSUME_FROM_QUEUE_OF_ONE_SESSION`

Request.actions:
- `SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION`
- `REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION`

SolaceEvent.actionDict:
- actionDict contains all the keys defined over here https://github.com/albertleigh/redux-solace/blob/master/src/event/actionsGenerator.ts#L10

createSolaceMiddleware
- middleware creator function

## Action details of each package

### Session.action:
The package to handle creating connecting or removing of one or more sessions

#### CREATE_AND_CONNECT_SESSION
`Sessions.actions.createAndConnectSession({hostUrl,vpn,username,pass})`

The action to create a solace session
- Creator example and its parameters
```javascript
import { Session } from 'redux-solace';
function* someFun() {
    yield put(
        Sessions.actions.createAndConnectSession({hostUrl,vpn,username,pass})
    )
  
}
```
Parameters | Description
--- | ---
hostUrl| The url to create and connect a solace session, and this url must start with http://, https://, ws:// or wss://
vpn | the vpn name
username| the user name
sessionCache| the cache name of the session
pass | the password of the user
config.usePerMsgAck| the boolean flag to enable per msg acknowledge mode or not for queue comm pattern

```javascript

{

  type: 'REDUX_SOLACE::CREATE_AND_CONNECT_SESSION_RES',

  payload: {

    result: {

      id: '420b97ce-2b72-4a13-9128-70296ae1cd36',

      name: 'Session-0',

      session: {...}, // solace session object

      config: {

        usePerMsgAck: false

      },

      subscribedTopics: [],

      consumerDict: {},

      createdAt: new Date(1531866477016)

    }

  },

  error: false

}

```

 

Key|Description
---|---
action.err|true if it were an err response.

action.payload.result|The solaceContext Object of the session you just created. *solaceContext will be exlplained in the latter es6/es5 section*

 

#### DISCONNECT_AND_REMOVE_ONE_SESSION

Actions to close and remove a solace session

 

- Creator and its parameters

 

`Session.actions.disconnectAndRemoveOneSession({sessionId,callback?,errorCallback?})`

 

- Creator sample

```javascript

    handleDeleteOneSessionBtnClick: (sessionId)=>()=>(

        dispatch(SolaceSession.actions.disconnectAndRemoveOneSession({sessionId}))

    ),

```

 

Parameters | Description
---|---
sessionId|the id of the session that you want to close
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

 

- Return DISCONNECT_AND_REMOVE_ONE_SESSION_RES

 

```javascript

    yield takeLatest(SolaceSession.actions.DISCONNECT_AND_REMOVE_ONE_SESSION_RES,handleCloseOneSessionsResponse);

```

 

```javascript

{

  type: 'REDUX_SOLACE::DISCONNECT_AND_REMOVE_ONE_SESSION_RES',

  payload: {

    result: 1

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.result|the the total number of the sessions closed

 

#### CLOSE_AND_REMOVE_ALL_SESSIONS

Actions to close and remove all solace sessions

- Creator and its parameters

 

`Session.actions.closeAndRemoveAllSessions({callback?,errorCallback?})`

 

- Creator sample

 

```javascript

    yield put(SolaceSession.actions.closeAndRemoveAllSessions());

```

 

Parameters | Description
---|---
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

 

- Return CLOSE_AND_REMOVE_ALL_SESSIONS_RES

 

```javascript

    yield takeLatest(Session.actions.CLOSE_AND_REMOVE_ALL_SESSIONS_RES,handleCloseAllSolaceSessionsResponse);

```

 

```javascript

{

  type: 'REDUX_SOLACE::CLOSE_AND_REMOVE_ALL_SESSIONS_RES',

  payload: {

    result: 3

  },

  error: false

}

```

 

Key | Description
---|---
result | Total number of connection closed

 

#### SEND_CACHE_REQUEST_OF_ONE_SESSION

 

- Creator and its parameters

 

`Session.actions.sendCacheRequestOfOneSession({sessionId, topicName, requestId, userObj,callback?,errorCallback?})`

 

Parameters | Description
---|---
sessionId| The id of the session to fire a cache request
topicName| The topic destination for which the cache request will be made.
requestId| The application-assigned ID number for the request.
userObj| A context object to be returned with the callback.
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

 

- Return SEND_CACHE_REQUEST_OF_ONE_SESSION_RES

 

Key| Description
---|---
result|the userObject

 

 

#### SOLACE_CONTEXT_CHANGED

This action will be returned when the session context changed including adding/removing sessions and adding/removing topics of a session.

 

- Sample code

 

```javascript

 

    import {handleActions} from 'redux-actions';

   

    const defaultState = {...};

   

    export default handleActions({

       

        ...

       

        [SolaceSession.actions.SOLACE_CONTEXT_CHANGED]:(state,action)=>{

            const {

                total,

                defaultSessionId,

                sessionContexts

            } = action.payload;

            return {

                ...state,

                total,

                defaultSessionId,

                sessions:sessionContexts

            };

        },

       

        ...        

        

    });

   

    },

```

 

- Sample action

```javascript

{

  type: 'REDUX_SOLACE::SOLACE_CONTEXT_CHANGED',

  payload: {

    total: 3,

    defaultSessionId: '399d435b-af3b-48b8-9e17-344d7504a6fc',

    sessionContexts: [

      {

        id: '399d435b-af3b-48b8-9e17-344d7504a6fc',

        name: 'Session-0',

        subscribedTopics: [],

        config: {

          usePerMsgAck: false

        },

        queueNamesConsumed: [],

        sessionCacheName: 'newyorkstaging',

        createdAt: new Date(1531866776379)

      },

      {

        id: '72a7ca33-08c0-4195-bcd8-b7fff7627362',

        name: 'Session-2',

        subscribedTopics: [],

        config: {

          usePerMsgAck: false

        },

        queueNamesConsumed: [],

        sessionCacheName: 'newyorkstaging',

        createdAt: new Date(1531866783714)

      },

      {

        id: 'f6e33f9c-fe0d-4859-804b-28c66f1725f3',

        name: 'Session-1',

        subscribedTopics: [],

        config: {

          usePerMsgAck: false

        },

        queueNamesConsumed: [],

        sessionCacheName: 'newyorkstaging',

        createdAt: new Date(1531866780055)

      }

    ]

  },

  error: false

}

```

- action parameters

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.total|the the total number of the sessions
action.payload.defaultSessionId|the id of the default session
action.payload.sessionContexts|the array of the solace contexts
action.payload.sessionContexts[i].id|the id of the session
action.payload.sessionContexts[i].name|the name of the session
action.payload.sessionContexts[i].subscribedTopics|the topics of the session subscribed
action.payload.sessionContexts[i].createdAt|the js date object of the time the session created

 

### Event.actionsDict

 

The action types dictionary object of solace event.

 

for instance `Event.actionsDict[solace.SessionEventCode.MESSAGE].actionType` will be the action of solace MESSAGE EVENT. When solace trigger this event, the middleware will put this action.

 

- Sample saga

```javascirpt

import { solace } from '@UBA0/redux-solace';

yield takeEvery(SolaceEvent.actionsDict[solace.SessionEventCode.MESSAGE].actionType,handleOnSolaceMessage);

```

 

#### solace.SessionEventCode.MESSAGE

 

This message is a special one. All messages shared by solace will only trigger this one when they arrived.

When they were trigger, a redux will action wil be also sent.

 

`Event.actionsDict[solace.SessionEventCode.MESSAGE].actionType`

 

- Sample action 1

```javascript

{

  type: 'REDUX_SOLACE::MESSAGE',

  payload: {

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    sessionEvent: {...},  // native solace js solace msg object

    userDataStr: 'order.OrderBook',

    attachment: null,

    destination: {

      type: 'topic',

      name: 'NY/FI/IP/HALO/IRSTEST'

    },

    userPropertyMap: {

      protoBuffClass: 'order.OrderBook',

      createDate: '2018-07-17T23:12:19.003Z'

    }

  },

  error: false

}

```

 

- Sample action 2

```javascript

{

  type: 'REDUX_SOLACE::MESSAGE',

  payload: {

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    sessionEvent: {...},  // native solace js solace msg object

    userDataStr: null,

    attachment: {

      text: 'sample text 1',

      lang: 'sample lang 1'

    },

    destination: {

      type: 'topic',

      name: 'NY/FI/IP/HALO/IRSTEST'

    },

    userPropertyMap: {}

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session receiving the message
action.payload.sessionEvent|the native solace sessionEvent object
action.payload.attachment|the attachment object if middleware succeed interpreting from the sessionEvent or it will be null 
action.payload.userPropertyMap|the flat userPropertyMap object of solace msg 
action.payload.destination|the destination object of solace msg 
action.payload.destination|the destination object of solace msg 

 

 

 

### PublishSubscribe.actions

The package to handle publish subscribe and unsubscribe topics of a session.

 

#### PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION

Publish a string based msg to a session

- Creator and its parameters

 

`PublishSubscribe.actions.publishOneTxtMsgToOneSession({sessionId,topicName,msgText,callback?,errorCallback?})`

 

```javascript

    import { PublishSubscribe } from '@UBA0/redux-solace';

   

    yield put(PublishSubscribe.actions.publishOneTxtMsgToOneSession({

        sessionId,

        topicName:state.newPublishFormTopic,

        userDataStr:state.newPublishFormUserDataStr,

        msgText:new TextDecoder('utf-8').decode(buffer),

        userPropertyMap:{

            "protoBuffClass":state.newPublishFormUserDataStr,

            "createDate":new Date().toISOString(),

        }

    }));

```

 

Parameters | Description
---|---
sessionId|the id of the session you want to use
topicName|the topic you want to publish
msgText|the string of the message
userDataStr|the optional string of the user data, could be undefined
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

 

- Return PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES

 

```javascript

{

  type: 'REDUX_SOLACE::PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES',

  payload: {

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    topicName: 'NY/FI/IP/HALO/IRSTEST',

    msgText: '\n\u001e\n\t912828XY1"\t912828XY1*\u00062_YEAR\n\u001e\n\t9128284T4"\t9128284T4*\u00063_YEAR\n\u001e\n\t9128284U1"\t9128284U1*\u00065_YEAR\n\u001e\n\t912828XZ8"\t912828XZ8*\u00067_YEAR\n\u001f\n\t9128284N7"\t9128284N7*\u000710_YEAR\n\u001f\n\t912810SC3"\t912810SC3*\u000730_YEAR',

    userDataStr: 'order.OrderBook',

    userPropertyMap: {

      protoBuffClass: 'order.OrderBook',

      createDate: '2018-07-17T23:25:28.340Z'

    }

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session you want to use
action.payload.topicName|the topic you want to publish
action.payload.msgText|the string of the message
action.payload.userDataStr|the userDataStr of solace msg object
action.payload.userPropertyMap|the flat userPropertyMap of solace msg object

 

 

 

#### SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION

Subscribe a topic of a session

- Creator and its parameters

 

`PublishSubscribe.actions.subscribeOneTopicOfOneSession({sessionId,topicName,timeout?,callback?,errorCallback?})`

 

 

```javascript

    // view

    handleAddOneTopicToOneSession: (sessionId)=>(event,options)=>{

        const {suggestion, suggestionValue, method} = options;

        dispatch(sessionAddOneTopic({

          sessionId,

          topicName:suggestionValue

        }));

    },

    ...

    // saga

    ...

    function* subscribeOneTopicOfOneSession(action){

        yield put(PublishSubscribe.actions.subscribeOneTopicOfOneSession(action.payload));

    }

    yield takeLatest(SESSION_ADD_ONE_TOPIC,subscribeOneTopicOfOneSession);

    ...

```

 

Parameters | Description
---|---
sessionId|the id of the session you want to use
topicName|the topic you want to subscribe
timeout| optional time out value in milliseconds, could be undefined
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

- Return SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES

 

```javascript

{

  type: 'REDUX_SOLACE::SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES',

  payload: {

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    topicName: 'NY/FI/IP/HALO/IRSTEST'

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session you want to use
action.payload.topicName|the topic you want to subscribe

 

#### UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION

Unsubscribe a topic of a session

- Creator parameters

 

`PublishSubscribe.actions.unsubscribeOneTopicOfOneSession({sessionId,topicName,timeout?,callback?,errorCallback?})`

 

```javascript

    // component

    onDelete={onDeleteOneTopicOfOneSession({

        sessionId: onesession.id,

        topicName:topic

    })}

    ...

   

    // view

    onDeleteOneTopicOfOneSession = {handleDeleteOneTopicOfOneSession}

    ...

    handleDeleteOneTopicOfOneSession: (payload)=>()=>(dispatch(sessionRemoveOneTopic(payload))),

    ...

   

    // saga

    ...

    function* unsubscribeOneTopicOfOneSession(action){

        yield put(PublishSubscribe.actions.unsubscribeOneTopicOfOneSession(action.payload));

    }

    yield takeLatest(SESSION_REMOVE_ONE_TOPIC,unsubscribeOneTopicOfOneSession);

    ...

```

 

Parameters | Description
---|---
sessionId|the id of the session you want to use
topicName|the topic you want to unsubscribe
timeout| optional time out value in milliseconds, could be undefined
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

- Return UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES

 

```javascript

{

  type: 'REDUX_SOLACE::UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES',

  payload: {

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    topicName: 'NY/FI/IP/HALO/IRSTEST'

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session you want to use
action.payload.topicName|the topic you want to unsubscribe

 

 

### Queue.actions

The package to handle produce or consume a msg to a queue with confirmed delivery feature.

 

*To create a queue of confirmed deliver feature, the usePerMsgAck flag of CREATE_AND_CONNECT_SESSION action config has to be enabled*

 

*Currently the staging solace client I have for testing does not suport queue, this these package is not e2e tested*

 

 

#### SEND_ONE_TXT_MESSAGE_TO_QUEUE_OF_ONE_SESSION

*todo:// To be completed*

 

#### CONSUME_FROM_QUEUE_OF_ONE_SESSION

*todo:// To be completed*

 

 

### Request.actions

 

#### SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION

 

Send one txt request msg of one session

- Creator parameters

 

`Request.actions.sendOneTxtRequestOfOneSession(

    {

        sessionId:string,

        topicName:string,

        msgText:string,

        userDataStr?:string,

        userPropertyMap?:{[key:string]:string|number},

        userObject:any;

        timeout?:number;

        callback?:(session,message)=>any,

        errorCallback?:(session,event)=>any,

    })`

 

```javascript

    yield put(Request.actions.sendOneTxtRequestOfOneSession({

        sessionId,

        topicName:session.requestFormTopicName,

        userDataStr:"",

        msgText:new TextDecoder('utf-8').decode(buffer),

        userObject:{

            sessionId,

            customizedValue:'customized value from handleSubmitNeRequestMsg'

        },

        userPropertyMap:{

            "protoBuffClass":session.requestFormMsgType,

            "createDate":new Date().toISOString(),

            "reduxUI":"request"

        },

        callback:(session,message)=>{

            console.log('handleOnSolaceRequestMessage::callback',message,message.getBinaryAttachment());

        },

        errorCallback:(session,event)=>{

            console.log('handleOnSolaceRequestMessage::errorCallback',event);

        }

    }));

```

 

Parameters | Description
---|---
sessionId|the id of the session you want to use
topicName|the topic you want to unsubscribe
msgText|the string of the message
userDataStr|the userData string of the request  solace message
userPropertyMap|the userPropertyMap object for the request solace message
userObject| customized object sent with the response action returned 
timeout| optional time out value in milliseconds, could be undefined
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined 

- Return SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES

 

- Successfully response(replied msg) of the request msg

```javascript

{

  type: 'REDUX_SOLACE::SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES',

  payload: {

    sessionId: '0eae4ce3-f1d9-4da1-bb45-4c4e95261702',

    topicName: 'NY/FI/IP/HALO/CLOB/TEST',

    attachment: {

      text: 'sample text 3',

      lang: 'sample lang 3'

    },

    destination: {

      type: 'topic',

      name: '#P2P/v:sol-ny-qagc3/9dSvzexb/solclientjs/chrome-69.0.3470-Windows-7/0308866537/0001/#'

    },

    userDataStr: 'redux_solace_usr_data_str',

    userPropertyMap: {

      createDate: '2018-07-25T23:48:06.989Z',

      origin: 'saga::webwork-handleOnSolaceMessage'

    },

    userObject: {

      sessionId: '0eae4ce3-f1d9-4da1-bb45-4c4e95261702',

      customizedValue: 'customized value from handleSubmitNeRequestMsg'

    },

    session: {...}, // solace native session object

    message: {...} // solace native messageEvent object

  },

  error: false

}

```

- Failure response(Timeout err, no one response)

 

```javascript

{

  type: 'REDUX_SOLACE::SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES',

  payload: {

    name: 'Error',

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    topicName: 'NY/FI/IP/HALO/CLOB/TEST',

    msgText: '\n\u001e\n\t912828XY1"\t912828XY1*\u00062_YEAR\n\u001e\n\t9128284T4"\t9128284T4*\u00063_YEAR\n\u001e\n\t9128284U1"\t9128284U1*\u00065_YEAR\n\u001e\n\t912828XZ8"\t912828XZ8*\u00067_YEAR\n\u001f\n\t9128284N7"\t9128284N7*\u000710_YEAR\n\u001f\n\t912810SC3"\t912810SC3*\u000730_YEAR',

    userDataStr: '',

    userPropertyMap: {

      protoBuffClass: 'order.OrderBook',

      createDate: '2018-07-18T00:11:10.925Z',

      reduxUI: 'request'

    },

    userObject: {

      sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

      customizedValue: 'customized value from handleSubmitNeRequestMsg'

    },

    session: {...}, // solace native session object

    event: {

      message: 'Request timeout',

      name: 'RequestError',

      subcode: 4,

      _eventCode: 9,

      _sessionEventCode: 9,

      _infoStr: 'Request timeout',

      _responseCode: '#REQ2',

      _errorSubcode: 0

    },

    err: {}

  },

  error: true

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session you want to use
action.payload.topicName|the topic you want to unsubscribe
action.payload.msgText|the string of the message
action.payload.userDataStr|the userData string of the request  solace message
action.payload.userPropertyMap|the userPropertyMap object for the request solace message
action.payload.userObject| customized object sent with the response action returned 
action.payload.session| the native solace session on which the msg used
action.payload.message| the native solace reply msg if replied successfully 
action.payload.event| the native solace error event if failed to reply 

 

 

#### REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION

 

Reply one msg via txt msg of one session

 

- Creator parameters

 

`Request.actions.replyOneMsgViaTxtOfOneSession(

    {

        sessionId:string,

        msgText:string,

        userDataStr?:string,

        userPropertyMap?:{[key:string]:string|number},

        callback?:(result:any)=>any,

        errorCallback?:(err:any)=>any,

    })`

 

```javascript

    yield put(Request.actions.replyOneMsgViaTxtOfOneSession({

        message:sessionEvent,

        sessionId,

        msgText:session.replyTxt,

        userDataStr:'redux_solace_usr_data_str',

    }));

```

 

Parameters | Description
---|---
sessionId|the id of the session you want to use
msgText|the string of the message
userDataStr|the userData string of the request  solace message
userPropertyMap|the userPropertyMap object for the request solace message
callback |optional callback when succeed, could be undefined
errorCallback |optional callback when failed, could be undefined

- Return REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_RES

 

```javascript

{

 type: 'REDUX_SOLACE::REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_RES',

  payload: {

    message: {...}, //

    sessionId: 'b4737514-8ae3-492b-be0e-249db8490116',

    msgText: 'Sample reply message',

    userDataStr: 'redux_solace_usr_data_str'

  },

  error: false

}

```

 

Key | Description
---|---
action.err|true if it were an err response.
action.payload.sessionId|the id of the session you want to use
action.payload.msgText|the string of the message
action.payload.userDataStr|the userData string of the request  solace message 
action.payload.session| the native solace session on which the msg used
action.payload.message| the native solace request msg

 

 

## Browser ES2015 and ES2016+ support

 

### Get started

*Solace api are wrapped in a es6 class SolaceContext, and babel transcompile into utils/SolaceContext.js*

 

SolaceContext can be imported either in es5 or es6+

 

```javascript

    // es6

    import SolaceContext from '@UBA0/redux-solace/utils/SolaceContext'

   

    // es5

    const SolaceContext = require('@UBA0/redux-solace/utils/SolaceContext')

```

 

### SolaceContext

 

#### Constructor

 

`SolaceContext.constructor(solace)`

 

Create a solaceContext object handling sessions publish/subscribe msg and etc

 

Parameters | Description
---|---
solace|the object imported via `import solace from 'solclientjs/lib-browser/solclient';`

 

#### Properties

- solace
- defaultSessionId
- total

 

#### Session manipulation

 

- Create session and connect

`SolaceContext.createAndConnectSession(hosturl,username,pass,vpn,sessionCache,eventHooks?,config?):SessionContext`

 

Create, automatically connect to a session and return a object type of SessionContext.

 

- Check whether session context has a default session

`SolaceContext.hasDefaultSession():boolean`

 

- Add one callback function to the eventHook of one session

`SolaceContext.addOneToEventHookOfOneSession(sessionId,evenCode)`

 

- Remove one callback function to the eventHook of one session

`SolaceContext.removeOneToEventHookOfOneSession(sessionId,evenCode)`

 

- Disconnect and remove a session

`SolaceContext.disconnectAndRemoveOneSession(sessionId):number`

 

- Disconnect all sessions

`SolaceContext.disconnectAllSessions():number`

 

- Send a retrieve cached message request of a session

`SolaceContext.sendCacheRequestOfOneSession(sessionId,topicName,requestId, callbackFun, userObj)`

 

#### Publish & subscribe to topic

 

- Publish a string message of a session

`SolaceContext.publishOneTxtMessageOfOneSession(sessionId,topicName,msgText,userDataStr,userPropertyMap)`

 

- Subscribe one topic of a session

`SolaceContext.subscribeOneTopicOfOneSession(sessionId,topicName,timeout)`

 

- Unsubscribe one topic of a session

`SolaceContext.unsubscribeOneTopicOfOneSession(sessionId,topicName,timeout)`

 

#### Queue and confirmed delivered message

- send one txt msg to a queue of a session

`SolaceContext.sendOneTxtMessageToQueueOfOneSession(sessionId,queueName,msgText,userDataStr,userPropertyMap,correlationKey=null)`

- consume from a queue of a session

`SolaceContext.consumeFromQueueOfOneSession(sessionId, queueName, onMessageCallback,autoAcknowledge=true, otherCallbackDict={})`

#### Request & reply message

- send one txt msg request of one session

`SolaceContext.sendTxtMsgRequestOfOneSession(sessionId,topicName,msgText,userDataStr,userPropertyMap,replyReceivedCb, requestFailedCb, userObject={},timeout=5000)`

- reply one txt msg request of one session

`SolaceContext.replyOneMsgViaTxtOfOneSession(receivedMessage,sessionId,msgText,userDataStr,userPropertyMap)`

 

 

## Contribute or customize

Any kind of help or suggestion are welcome.
