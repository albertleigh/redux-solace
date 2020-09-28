import * as solaceRef from 'solclientjs/lib-browser/solclient';
export let solace = solaceRef;
export { default as Session } from './session';
export { default as PublishSubscribe } from './publishSubscribe';
export { default as Queue } from './queue';
export { default as Request } from './request';
export { default as Event } from './event';


export { default as createSolaceMiddleware } from './middleware';
