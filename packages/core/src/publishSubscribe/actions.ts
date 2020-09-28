import { Action } from 'redux-actions';
import makeType from '../utils/makeType';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';

export const PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION = makeType('PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION');
export const PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES = makeType('PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_RES');

export const SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION = makeType('SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION');
export const SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES = makeType('SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES');

export const UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION = makeType('UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION');
export const UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES = makeType('UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_RES');

export const publishOneTxtMsgToOneSession:ActionCreator<types.IPublishOneTxtMsgToOneSessionPayload> =
    createFSA<types.IPublishOneTxtMsgToOneSessionPayload>(
        PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION,
        (options:types.IPublishOneTxtMsgToOneSessionPayload) => <any> options
    );

export const subscribeOneTopicOfOneSession:ActionCreator<types.ISubscribeOneTopicOfOneSessionPayload> =
    createFSA<types.ISubscribeOneTopicOfOneSessionPayload>(
        SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
        (options:types.ISubscribeOneTopicOfOneSessionPayload) => <any> options
    );

export const unsubscribeOneTopicOfOneSession:ActionCreator<types.IUnsubscribeOneTopicOfOneSessionPayload> =
    createFSA<types.IUnsubscribeOneTopicOfOneSessionPayload>(
        UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
        (options:types.IUnsubscribeOneTopicOfOneSessionPayload) => <any> options
    );

