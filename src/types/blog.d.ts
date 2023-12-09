declare interface Model {
    id : string
    createdAt :string
    updatedAt : string
    deletedAt : string
    isAudit :boolean
    auditBy : string
    auditAt : string
    updateBy : string
}

declare interface File extends Model{
    fileId : string
    fileName : string
    fileUrl : string
    fileType : string
    fileSize : number
    fileMd5 : string
}

declare interface SafeUser {
    username:string
    email:string
    phone:string
    cid :string
    gender :string
    birthday:string
    avatar:File
    age :number
    role :string
}

declare interface Tag extends Model{
    tagId :string
    label :string
}

declare interface Location extends Model{
    locationId : string
    country : string
    city : string
    province : string
    area : string
    street : string
    streetNum : string
    longitude : string
    latitude : string
}

declare type Ids = Array<string>

declare interface Article extends Model{
    articleId : string
    title : string
    content : string
    author :SafeUser
    authorId :string
    covers :Array<File>
    tags:Array<Tag>
    location:Location
    likeCids : Ids
    likesCount :number
    collectCids : Ids
    colllectCount:number
    commentIds : Ids
    commentCount :number
    isPrivate :boolean,
    isMarkdown:boolean
}
