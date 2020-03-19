export interface ChatMessage{
    chatId?:string ,
    modifiedOn?: string,
    createdOn: Date,
    message: string,
    receiverId:string,
    receiverName: string,
    senderId: string,
    senderName:string
}