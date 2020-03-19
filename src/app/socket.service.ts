import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'https://chatapi.edwisor.com';

  private socket;


  constructor(public http: HttpClient) {

    this.socket = io(this.url);

  }

 

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      });

    });

  } 

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); 

    }); 

  } 


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); 

    });



  }

 

  

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } 

  public markChatAsSeen = (userDetails) => {

    this.socket.emit('mark-chat-as-seen', userDetails);

  }  

  

  public getChat(senderId, receiverId, skip): Observable<any> {

    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
  } 

  public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        observer.next(data);

      }); 

    });

  } 

  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  } 


  public exitSocket = () =>{


    this.socket.disconnect();


  }




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } 

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  } 

  public getUnreadMessages(userId){
    return this.http.get(this.url+"/api/v1/chat/unseen/user/list?userId="+userId+"&authtoken=NjUwMTFmOTMyOWMxMGYxNmMxN2ZmMThiNGYzMmVkODY0NGE5NDNmMWU2YWM2ZjljYjg0MGEzZWI4ZTQzNTZkNjM1NGY5MjMxYTVjMTMwYTE0YWM3ZmNhZDExMTVhNTUxN2ZiNWMwODkwZmZkNWJhNWMyOTU5NmVjNGRiYmJkZmQzZA==");
  }   
}
