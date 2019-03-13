export interface IEventActionDict {
    [key:string]:{
        actionType:string,
        action:(options:any)=>any
    },
    [key:number]:{
        actionType:string,
        action:(options:any)=>any
    },
}