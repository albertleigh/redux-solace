import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions';

export const sendOneTxtMsgRequestOfOneSessionRes:ActionCreator<types.ISendOneTxtMsgRequestOfOneSessionResPayload> =
    createFSA<types.ISendOneTxtMsgRequestOfOneSessionResPayload>(
        actionTypes.SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES,
        (options:types.ISendOneTxtMsgRequestOfOneSessionResPayload) => <any> options
    );

export const replyOneMsgViaTxtOfOneSessionRes:ActionCreator<types.IReplyOneMsgViaTxtOfOneSessionResPayload> =
    createFSA<types.IReplyOneMsgViaTxtOfOneSessionResPayload>(
        actionTypes.REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_RES,
        (options:types.IReplyOneMsgViaTxtOfOneSessionResPayload) => <any> options
    );