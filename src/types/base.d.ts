import type { AxiosResponse } from 'axios'

declare export interface ResponseData extends AxiosResponse {
    message: string;
    status: number;
    data: any;
}

declare export interface ResponseType {
    checkMobile?:boolean
}

declare export interface Dict{
    label:string,
    value:string|number
}

declare type Dicts = Array<Dict>

declare interface Param {
    [key: string]: any
}
