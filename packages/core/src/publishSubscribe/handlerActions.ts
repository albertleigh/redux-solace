import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actions from './actions';

export const publishOneTxtMsgToOneSessionRes:ActionCreator<types.IPublishOneTxtMsgToOneSessionResPayload> =
    createFSA<types.IPublishOneTxtMsgToOneSessionResPayload>(
        actions.PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES,
        (options:types.IPublishOneTxtMsgToOneSessionResPayload) => <any> options
    );

export const subscribeOneTopicOfOneSessionRes:ActionCreator<types.ISubscribeOneTopicOfOneSessionResPayload> =
    createFSA<types.ISubscribeOneTopicOfOneSessionResPayload>(
        actions.SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES,
        (options:types.ISubscribeOneTopicOfOneSessionResPayload) => <any> options
    );

export const unsubscribeOneTopicOfOneSessionRes:ActionCreator<types.IUnsubscribeOneTopicOfOneSessionResPayload> =
    createFSA<types.IUnsubscribeOneTopicOfOneSessionResPayload>(
        actions.UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES,
        (options:types.IUnsubscribeOneTopicOfOneSessionResPayload) => <any> options
    );

