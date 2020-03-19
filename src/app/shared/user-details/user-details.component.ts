import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  @Input() userFirstName: any;
  @Input() userLastName: string;
  @Input() userStatus: string;
  @Input() messageUnRead: string;
  public userColor:string;
  public userBg:string;
  
  public firstChar: string;


  ngOnInit(): void {

      this.firstChar = this.userFirstName[0];

  } 


  // handling the click



}
