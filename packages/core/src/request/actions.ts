import { Action } from 'redux-actions';
import makeType from '../utils/makeType';

import createFSA, { ActionCreator } from '../utils/createFSA';
import * as types from './types';

export const SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION = makeType('SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION');
export const SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES = makeType('SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_RES');

export const REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION = makeType('REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION');
export const REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_RES = makeType('REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_RES');

export const sendOneTxtMsgRequestOfOneSession:ActionCreator<types.ISendOneTxtMsgRequestOfOneSessionPayload> =
    createFSA<types.ISendOneTxtMsgRequestOfOneSessionPayload>(
        SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION,
        (options:types.ISendOneTxtMsgRequestOfOneSessionPayload) => <any> options
    );

export const replyOneMsgViaTxtOfOneSession:ActionCreator<types.IReplyOneMsgViaTxtOfOneSessionPayload> =
    createFSA<types.IReplyOneMsgViaTxtOfOneSessionPayload>(
        REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION,
        (options:types.IReplyOneMsgViaTxtOfOneSessionPayload) => <any> options
    );