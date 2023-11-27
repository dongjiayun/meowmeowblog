declare interface User {
    jwtToken: string,
    refreshToken: string,
    phoneNum: string,
    cid: string,
    platNo: string
}

// 平安好福利
declare interface HFLUser extends User{
    haofuliUserId: string,
    haofuliOpenId: string
}
