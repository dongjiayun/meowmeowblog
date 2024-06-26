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

declare interface SafeUserDetail extends SafeUser{
    commentIds : Ids
    likeArticleIds : Ids
    likeCommentIds : Ids
    collectIds : Ids
    followIds : Ids
    followerIds : Ids
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
    isMarkdown:boolean,
    readCount :number
}

declare interface Comment extends Model {
    commentId: string
    content : string
    author : SafeUser
    authorId : string
    location: Location
    likeIds : Ids
    targetId : string
    attachments : File[]
    articleId : string
    rootCommentId : string
    childrenCommentIds :Ids
}

declare interface Notice extends Model {
    noticeId : string
    avatar : File
    title : string
    content : string
    noticeType: string
    noticeCode :string
    targetCid : string
    isReaded : bool
}

declare interface Message extends Model {
    content : string
    messageId: string
    authorId : string
    author : SafeUser
    likeIds : Ids
}

declare interface Resume extends Model {
    resumeId : string
    content : string
    version : number
    language : string
}

declare type Resumes = Array<Resume>
