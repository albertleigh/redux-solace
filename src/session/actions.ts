import { Action } from 'redux-actions';
import makeType from '../utils/makeType';
import createFSA, { ActionCreator } from '../utils/createFSA';
import * as types from './types';

export const CREATE_AND_CONNECT_SESSION = makeType('CREATE_AND_CONNECT_SESSION');
export const CREATE_AND_CONNECT_SESSION_RES = makeType('CREATE_AND_CONNECT_SESSION_RES');

export const DISCONNECT_AND_REMOVE_ONE_SESSION = makeType('DISCONNECT_AND_REMOVE_ONE_SESSION');
export const DISCONNECT_AND_REMOVE_ONE_SESSION_RES = makeType('DISCONNECT_AND_REMOVE_ONE_SESSION_RES');

export const CLOSE_AND_REMOVE_ALL_SESSIONS = makeType('CLOSE_AND_REMOVE_ALL_SESSIONS');
export const CLOSE_AND_REMOVE_ALL_SESSIONS_RES = makeType('CLOSE_AND_REMOVE_ALL_SESSIONS_RES');

export const SEND_CACHE_REQUEST_OF_ONE_SESSION = makeType('SEND_CACHE_REQUEST_OF_ONE_SESSION');
export const SEND_CACHE_REQUEST_OF_ONE_SESSION_RES = makeType('SEND_CACHE_REQUEST_OF_ONE_SESSION_RES');

export const SOLACE_CONTEXT_CHANGED = makeType('SOLACE_CONTEXT_CHANGED');



export const createAndConnectSession:ActionCreator<types.ICreateAndConnectSessionPayload> =
    createFSA<types.ICreateAndConnectSessionPayload>(
        CREATE_AND_CONNECT_SESSION,
        (options:types.ICreateAndConnectSessionPayload) => <any> options
    );

export const disconnectAndRemoveOneSession:ActionCreator<types.IDisconnectAndRemoveOneSessionPayload> =
    createFSA<types.IDisconnectAndRemoveOneSessionPayload>(
        DISCONNECT_AND_REMOVE_ONE_SESSION,
        (options:types.IDisconnectAndRemoveOneSessionPayload) => <any> options
    );

export const closeAndRemoveAllSessions:ActionCreator<types.ICloseAndRemoveAllSessionsPayload> =
    createFSA<types.ICloseAndRemoveAllSessionsPayload>(
        CLOSE_AND_REMOVE_ALL_SESSIONS,
        (options:types.ICloseAndRemoveAllSessionsPayload) => <any> options
    );

export const sendCacheRequestOfOneSession:ActionCreator<types.ISendCacheRequestOfOneSessionPayload> =
    createFSA<types.ISendCacheRequestOfOneSessionPayload>(
        SEND_CACHE_REQUEST_OF_ONE_SESSION,
        (options:types.ISendCacheRequestOfOneSessionPayload) => <any> options
    );