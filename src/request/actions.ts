import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const sendOneTxtMsgRequestOfOneSession:ActionCreator<types.ISendOneTxtMsgRequestOfOneSessionPayload> =
    createFSA<types.ISendOneTxtMsgRequestOfOneSessionPayload>(
        actionTypes.SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION,
        (options:types.ISendOneTxtMsgRequestOfOneSessionPayload) => <any> options
    );

export const replyOneMsgViaTxtOfOneSession:ActionCreator<types.IReplyOneMsgViaTxtOfOneSessionPayload> =
    createFSA<types.IReplyOneMsgViaTxtOfOneSessionPayload>(
        actionTypes.REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION,
        (options:types.IReplyOneMsgViaTxtOfOneSessionPayload) => <any> options
    );