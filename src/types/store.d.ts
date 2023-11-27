export interface storeState{
    user:{
        token: string,
        refreshToken: string,
        avatarUrl: string,
        nickName: string,
        platNo: string,
        openId: string|number,
        unionId: string|number,
        isLogin: boolean,
        hasFreshToken: boolean,
        cid: string|number,
        phoneNo: string|number,
    },
    app:any
}

declare interface ConfirmSku{
    sku: Sku,
    amount: number,
}

declare type ConfirmSkus = Array<ConfirmSku>
