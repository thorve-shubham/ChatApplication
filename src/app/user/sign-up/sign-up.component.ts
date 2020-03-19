import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public apiKey: any;

  constructor(  
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,
    ) {     }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } 

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.errorToastr('enter first name')
     

    } else if (!this.lastName) {
      this.toastr.errorToastr('enter last name')

    } else if (!this.mobile) {
      this.toastr.errorToastr('enter mobile')

    } else if (!this.email) {
      this.toastr.errorToastr('enter email')

    } else if (!this.password) {
      this.toastr.errorToastr('enter password')
     

    } else if (!this.apiKey) {
      this.toastr.errorToastr('Enter your API key')

    } else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey
      }

      console.log(data);

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.successToastr('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.errorToastr(apiResponse.message);

          }

        }, (err) => {

          this.toastr.errorToastr('some error occured');

        });

    }

  } 

}
