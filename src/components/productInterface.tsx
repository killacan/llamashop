

export interface Product {
    blueprint_id: number,
    description: string, 
    id:string,
    images:Array<{
        src: string,
        position:string, 
        is_default:boolean,
        variant_ids:Array<number>,
    }>,
    tags:Array<string>,
    title:string,
    variants:[
        {
            cost:number,
            id:number,
            is_available:boolean,
            is_default:boolean,
            options:Array<number>
        }
    ],
    options: Array<{
        name:string,
        type:string,
        values: [
            {
                id:number, 
                title:string,
                colors?:Array<string>,
            }
        ]
    }>,
    visible:boolean, 
    error?:string,
    qty?:number,
}