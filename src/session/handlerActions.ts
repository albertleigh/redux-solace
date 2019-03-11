import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const createAndConnectSessionRes:ActionCreator<types.ICreateAndConnectSessionResPayload> =
    createFSA<types.ICreateAndConnectSessionResPayload>(
        actionTypes.CREATE_AND_CONNECT_SESSION_RES,
        (options:types.ICreateAndConnectSessionResPayload) => <any> options
    );

export const disconnectAndRemoveOneSessionRes:ActionCreator<types.IDisconnectAndRemoveOneSessionResPayload> =
    createFSA<types.IDisconnectAndRemoveOneSessionResPayload>(
        actionTypes.DISCONNECT_AND_REMOVE_ONE_SESSION_RES,
        (options:types.IDisconnectAndRemoveOneSessionResPayload) => <any> options
    );

export const closeAndRemoveAllSessionRes:ActionCreator<types.ICloseAndRemoveAllSessionsResPayload> =
    createFSA<types.ICloseAndRemoveAllSessionsResPayload>(
        actionTypes.CLOSE_AND_REMOVE_ALL_SESSIONS_RES,
        (options:types.ICloseAndRemoveAllSessionsResPayload) => <any> options
    );

export const sendCacheRequestOfOneSessionRes:ActionCreator<types.ISendCacheRequestOfOneSessionResPayload> =
    createFSA<types.ISendCacheRequestOfOneSessionResPayload>(
        actionTypes.SEND_CACHE_REQUEST_OF_ONE_SESSION_RES,
        (options:types.ISendCacheRequestOfOneSessionResPayload) => <any> options
    );

export const solaceContextChanged:ActionCreator<types.ISolaceContextChangedEventPayload> =
    createFSA<types.ISolaceContextChangedEventPayload>(
        actionTypes.SOLACE_CONTEXT_CHANGED,
        (options:types.ISolaceContextChangedEventPayload) => <any> options
    );