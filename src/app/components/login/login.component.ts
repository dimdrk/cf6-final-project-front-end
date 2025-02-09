import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Credentials, LoggedInUser } from '../../shared/interfaces/user-backend';
import { jwtDecode } from 'jwt-decode';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ RouterLink, ReactiveFormsModule, NgIf ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    userSevice = inject(UserService);
    router = inject(Router);

    invalidLogin = false;

    loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    })

    onSubmit(){
      const credentials = this.loginForm.value as Credentials
      this.userSevice.loginUser(credentials).subscribe({
          next: (response) => {
              const access_token = response.response_token;
              localStorage.setItem("authorization", "bearer " + access_token);

              const decodedTokenSubject = jwtDecode(access_token) as LoggedInUser;

              this.userSevice.user.set({
                  Username: decodedTokenSubject.Username,
                  Email: decodedTokenSubject.Email,
                  Role: decodedTokenSubject.Role
              });
              if (decodedTokenSubject.Role === "SUPER-ADMIN"){
                this.router.navigate(['admin/viewAllusers']);
              }
              this.router.navigate(['user/viewUser']);
          },
          error: (error) => {
              console.log('Login Error', error);
              this.invalidLogin = true;
          }
      })
  }
}
