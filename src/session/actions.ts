import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const createAndConnectSession:ActionCreator<types.ICreateAndConnectSessionPayload> =
    createFSA<types.ICreateAndConnectSessionPayload>(
        actionTypes.CREATE_AND_CONNECT_SESSION,
        (options:types.ICreateAndConnectSessionPayload) => <any> options
    );

export const disconnectAndRemoveOneSession:ActionCreator<types.IDisconnectAndRemoveOneSessionPayload> =
    createFSA<types.IDisconnectAndRemoveOneSessionPayload>(
        actionTypes.DISCONNECT_AND_REMOVE_ONE_SESSION,
        (options:types.IDisconnectAndRemoveOneSessionPayload) => <any> options
    );

export const closeAndRemoveAllSessions:ActionCreator<types.ICloseAndRemoveAllSessionsPayload> =
    createFSA<types.ICloseAndRemoveAllSessionsPayload>(
        actionTypes.CLOSE_AND_REMOVE_ALL_SESSIONS,
        (options:types.ICloseAndRemoveAllSessionsPayload) => <any> options
    );

export const sendCacheRequestOfOneSession:ActionCreator<types.ISendCacheRequestOfOneSessionPayload> =
    createFSA<types.ISendCacheRequestOfOneSessionPayload>(
        actionTypes.SEND_CACHE_REQUEST_OF_ONE_SESSION,
        (options:types.ISendCacheRequestOfOneSessionPayload) => <any> options
    );