import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;
  loginsuccess: boolean = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loginservice:LoginService) {

   
   }

  ngOnInit() {
    //reset login
    this.loginservice.logout();

     // get return url from route parameters or default to '/'
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'contractphysician';
  }

  login(){
    this.loading = true;
    this.loginservice.login(this.model.username, this.model.password)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.loading = false;
                this.loginsuccess = false;
            });
  }

}
