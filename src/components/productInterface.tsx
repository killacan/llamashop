

export interface Product {
    blueprint_id: number,
    description: string, 
    id:string,
    images:Array<{
        src: string,
        position:string
    }>,
    tags:Array<string>,
    title:string,
    variants:Array<unknown>,
    visible:boolean, 
    error?:string,
}