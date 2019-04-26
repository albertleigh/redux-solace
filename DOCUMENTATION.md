## Big pic
The middleware is designed to intercept certain actions, basing upon the payload of the actions, 
certain apis of solace client js will triggered. After these, if needed a FSA(flux standard action) with
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
pass | the passord of the user
config.usePerMsgAck| the boolean flag to enable per msg acknowledge mode or not for queue comm pattern

