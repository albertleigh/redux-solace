import * as solaceRef from 'solclientjs/lib-browser/solclient';
export let solace = solaceRef;
export { default as Session } from './session';
export * from './session/types'
export { default as PublishSubscribe } from './publishSubscribe';
export * from './publishSubscribe/types'
export { default as Queue } from './queue';
export * from './queue/types'
export { default as Request } from './request';
export * from './request/types'
export { default as Event } from './event';
export * from './event/types'

export * from './utils/SolaceContext';

export { default as createSolaceMiddleware } from './middleware';
