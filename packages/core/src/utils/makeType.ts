export const PREFIX:string = 'REDUX_SOLACE';
export const DELIMITER:string = '::';

export default (type:string) => `${PREFIX}${DELIMITER}${type}`;
