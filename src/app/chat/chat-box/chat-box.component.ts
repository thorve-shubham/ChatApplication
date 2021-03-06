import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';

//interface

import {ChatMessage} from '../../interfaces/ChatMessage.interface';
@Component({
  
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: []
})
export class ChatBoxComponent implements OnInit,AfterViewInit {

  

  @ViewChild('scrollMe',{read:ElementRef}) public scrollMe: ElementRef;
  public scrollTop:number = null;
  

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean;  

  public scrollToChatTop:boolean;

  public receiverId: any;
  public receiverName: any;
  public previousChatList: any = [];
  public messageText: any; 
  public messageList: any = [];
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;



  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastrManager,
    private cdRef : ChangeDetectorRef
  ) {
    //this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;

  }
  ngAfterViewInit(): void {
    console.log('in view init');
    this.verifyUserConfirmation();
    this.getOnlineUserList();

    this.getMessageFromAUser();
  }
 


  ngOnInit() {

    console.log('inn ng oninit');

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();


    console.log(this.receiverId,this.receiverName);

    console.log(this.scrollMe);
    
    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName)
    }

    //this.checkStatus();

   

   // this.scrollToChatTop=false;
  }

  


public checkStatus(){
  console.log('in checkstatus')
  if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

    this.router.navigate(['/']);
  } 
} 



public verifyUserConfirmation(){
  console.log('n verify user');
  this.SocketService.verifyUser()
    .subscribe((data) => {

      
      //this.scrollToChatTop = false;
      this.SocketService.setUser(this.authToken);

    });
  }
  
  public getOnlineUserList(){
    console.log('getting online usersl liist');
    // let unReadMessages = [];
    // this.SocketService.getUnreadMessages(this.userInfo.userId).subscribe(
    //   (Response)=>{
    //     unReadMessages = Response["data"];
    //     console.log(Response);
    //   }
    // )

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {
          // let msgCount =0;
          // unReadMessages.map((msg)=>{
          //   if(msg.senderId==userList[x].userId){
          //     msgCount++;
          //   }
          // })
          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log(this.userList);

      }); 
  }

 


  public getPreviousChatWithAUser(){
    console.log('get previous chat');
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
    
    this.SocketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {

      console.log(apiResponse);

      if (apiResponse["status"] == 200) {

        this.messageList = apiResponse["data"].concat(previousData);

      } else {

        this.messageList = previousData;
        this.toastr.warningToastr('No Messages available')

       

      }

      this.loadingPreviousChat = false;

    }, (err) => {

      this.toastr.errorToastr('some error occured')


    });

  }


  public loadEarlierPageOfChat(){
    console.log('load earlier chat on demand');
    this.loadingPreviousChat = true;

    this.pageValue++;
    
    this.scrollToChatTop = true;
    this.getPreviousChatWithAUser() 

  } 

  public userSelectedToChat(id,name){
    console.log('inside user selected')
    this.scrollToChatTop=false;
      
    this.userList.map((user)=>{
        if(user.userId==id){
          user.chatting=true;
        }
        else{
          user.chatting = false;
        }
    })

    Cookie.set('receiverId', id);

    Cookie.set('receiverName', name);


    this.receiverName = name;

    this.receiverId = id;

    this.messageList = [];

    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }


    this.SocketService.markChatAsSeen(chatDetails);

    this.getPreviousChatWithAUser();

  } 

  public sendMessage(){
    console.log('inside send message')
    if(this.messageText){

      let chatMsgObject:ChatMessage = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      }
      console.log(chatMsgObject);
      this.SocketService.SendChatMessage(chatMsgObject)
      this.pushToChatWindow(chatMsgObject)
    }
    else{
      this.toastr.warningToastr('text message can not be empty')
    }

  }

  public pushToChatWindow : any =(data)=>{
    console.log('push to chat window')
    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop = false;


  }

  public getMessageFromAUser(){
    console.log('get message from user');
      this.SocketService.chatByUserId(this.userInfo.userId)
      .subscribe((data:ChatMessage)=>{
       

        (this.receiverId==data.senderId)?this.messageList.push(data):'';

        this.toastr.successToastr(`${data.senderName} says : ${data.message}`)

        this.scrollToChatTop=false;

      });

  }


  public logout(){
    console.log('inside logout');
    this.AppService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authtoken');

          Cookie.delete('receiverId');

          Cookie.delete('receiverName');

          this.SocketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.toastr.errorToastr(apiResponse.message)

        } 

      }, (err) => {
        this.toastr.errorToastr('some error occured')


      });

  } 

  
  public showUserName(name:string){
    console.log('inside show username');
    this.toastr.successToastr("You are chatting with "+name)

  }

}
