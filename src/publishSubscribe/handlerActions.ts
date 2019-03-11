import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const publishOneTxtMsgToOneSessionRes:ActionCreator<types.IPublishOneTxtMsgToOneSessionResPayload> =
    createFSA<types.IPublishOneTxtMsgToOneSessionResPayload>(
        actionTypes.PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES,
        (options:types.IPublishOneTxtMsgToOneSessionResPayload) => <any> options
    );

export const subscribeOneTopicOfOneSessionRes:ActionCreator<types.ISubscribeOneTopicOfOneSessionResPayload> =
    createFSA<types.ISubscribeOneTopicOfOneSessionResPayload>(
        actionTypes.SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES,
        (options:types.ISubscribeOneTopicOfOneSessionResPayload) => <any> options
    );

export const unsubscribeOneTopicOfOneSessionRes:ActionCreator<types.IUnsubscribeOneTopicOfOneSessionResPayload> =
    createFSA<types.IUnsubscribeOneTopicOfOneSessionResPayload>(
        actionTypes.UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES,
        (options:types.IUnsubscribeOneTopicOfOneSessionResPayload) => <any> options
    );

