# Redux solace
[![version][version-badge]][CHANGELOG] [![license][license-badge]][LICENSE]

Redux-solace wraps the solace js library into a reusable redux middleware

* It is designed for browser runtime only, not for node js runtime
* Written in Typescript
* Provide promise based Apis
* Provide flux action based Apis
* All action parameters follow the Redux/FLUX pattern
* Wrap solace api into one core class
* Support Multi-session management
* Support Publish/Subscribe to topics
* Support Queue msg
* Support request/reply msg

[Documentation](./DOCUMENTATION.md)

## Quick start

### Install

```
    npm install redux-solace -S
    
    -- or 
    
    yarn add redux-solace
```

### Build the middleware and inject into store

User the `createSolaceMiddleware` to create one middleware and add it to middleware chain.

```javascript
    import  { createSolaceMiddleware } from 'redux-solace'
    
    const solaceMiddleware = createSolaceMiddleware();
    const middleware = compose(applyMiddleware(
        sagaMiddleware,
        solaceMiddleware
    ), devtools);
    
    const store = createStore(
        rootReducer,
        middleware
    )
    
```

Then inject the store into your frontend freawer like (React, Angular 5/6/7)
```jsx harmony
    const store = configureStore();
    
    store.dispatch(applicationStarted());
    
    ReactDom.render(
        <React.Fragment>
            <Provider store={store}>
                <App/>
            </Provider>
        </React.Fragment>
    );
```

### All set
Make no mistake , you are now good to connect to the solace message router.

```javascript
    // import the session package and rename it if needed
    import { Session as SolaceSession } from 'redux-solace';
    
    function* createOneSolaceSession(){
        const state = yield select(getSession);
        yield put (SolaceSession.actions.createAndConnectSession({
            hostUrl:            state.newSessionHostUrl,
            vpn:                state.newSessionVpn,
            username:           state.newSessionUsername,
            sessionCache:       state.newSessionCache,
            pass:               state.newSessionPass,
            config:{
                usePerMsgAck:   state.newSessionUsePerMsgAck,
            }
        }))
    }
    
    export default function*(){
        yield takeLatest(SESSION_SUBMIT_NEW, createOneSolaceSession);
    }
```

*sample  response action object*
```json
    {
      "type": "REDUX_SOLACE::CREATE_AND_CONNECT_SESSION_RES",
      "payload": {
          "result": {
            "id": "9401a90b-b4e3-4987-9910-3ed9d7b3ff",
            "name": "Session-0",
            "session": {...} // native solace session object
            "config": {
              "usePerMsgAck": false
            },
            "subscribedTopics": [],
            "consumeDict": {},
            "createdAt": new Date(15326723722)
          }
      },
      "error": false      
    }
```

Response action could be listened like
```javascript
    import { Session as SolaceSession } from 'redux-solace';

    function* handleSolaceSessionResponse(action){
        // if there were any errors while creating the session, the action.error would be the error obj
        if (!action.error){
            yield put(applicationNewSnackbar({message:`${action.payload.result.name} created`}))
            
        }
    }
    
    export default function*(){
        yield takeLatest(SolaceSession.actions.CREATE_AND_CONNECT_SESSION_RES, handleSolaceSessionResponse);
    }
```

or a `SOLACE_CONTEXT_CHANGED` action will be also emitted if sessions changed

```javascript
    import { handleActions } from 'redux-actions';
    import { Session as SolaceSession } from 'redux-solace';
    
    const defaultState = {...};
    
    export default handleActions({
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
                sessions:sessionContexts,
            }
        }
    })
```

## Performance
A benchmark pressure test has been conducted along with a original solution using delegate server connecting solace router via websocket(socket.io).
The conclusion is, using redux-solace will be 10-30ms slower on average per message than original solution using delegate server, 
but redux-solace brings flexibility, avoids delegate sever preprocess or schema negotiation cross teams.  


[LICENSE]: ./LICENSE.md
[CHANGELOG]: ./CHANGELOG.md

[version-badge]: https://img.shields.io/badge/version-0.20.20-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg