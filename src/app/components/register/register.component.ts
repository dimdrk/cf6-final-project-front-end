import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/interfaces/user-backend';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ NgIf,
    MatInputModule, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  userService = inject(UserService);
  router = inject(Router);

    registrationForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    });

    onSubmit() {
      console.log(this.registrationForm.value);
      const user: User = {
        username: this.registrationForm.get('username')?.value || '',
        password: this.registrationForm.get('password')?.value || '',
        firstname: this.registrationForm.get('firstname')?.value || '',
        lastname: this.registrationForm.get('lastname')?.value || '',
        email: this.registrationForm.get('email')?.value || '',
        role: this.registrationForm.get('role')?.value || '',
        phoneNumber: this.registrationForm.get('phoneNumber')?.value || '',
        city: this.registrationForm.get('city')?.value || '',
      }
      this.userService.registerUser(user).subscribe({
        next: (response) => {
          console.log("Registration completed successfully.", response)
          this.router.navigate(['/user/viewUser']); 
        },
        error: (response)=>{
          console.error("Error. Registration did not complete.", response)
        }
      })
    }

    onReset() {
      this.registrationForm.reset();
    }
}
