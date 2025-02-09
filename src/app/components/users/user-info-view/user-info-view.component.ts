import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info-view',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './user-info-view.component.html',
  styleUrl: './user-info-view.component.css'
})
export class UserInfoViewComponent {

  userService = inject(UserService);
  router = inject(Router);
  
  user = this.userService.user;

  ViewForm: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    username: new FormControl({value: '', disabled: true}),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    city: new FormControl(''),
    role: new FormControl({value: '', disabled: true}),
  });

  UpdateForm: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    city: new FormControl(''),
  });
  showSuccessMessage = false;
  showErrorMessage = false;
  
  
  ngOnInit(){
    const loggedInUser = this.userService.user();

    if (loggedInUser) {
      this.userService.getUserDetails(loggedInUser.Username).subscribe({
        next: (response) => {
          const userDetails = response.data;

          this.ViewForm.patchValue({
            firstname: userDetails.firstname || '',
            lastname: userDetails.lastname || '',
            username: userDetails.username || '',
            email: userDetails.email || '',
            phoneNumber: userDetails.phoneNumber || '',
            city: userDetails.city || '',
            role: userDetails.role || ''
        })
        }
      })
    } else {      
      this.router.navigate(['/login']);
    }
  }

  onUpdate(){
    const loggedInUser = this.userService.user();

    if (loggedInUser) {
      const updatedUserData = {
        firstname: this.ViewForm.get('firstname')?.value,
        lastname: this.ViewForm.get('lastname')?.value,
        email: this.ViewForm.get('email')?.value,
        phoneNumber: this.ViewForm.get('phoneNumber')?.value,
        city: this.ViewForm.get('city')?.value,
      };
      this.userService.updateUser(loggedInUser.Username, updatedUserData).subscribe({
        next: (response) => {
          alert("Update completed successfully.")
          console.log("Update completed successfully.", response)
        },
        error: (response)=>{
          alert("Error. Update did not complete.")
          console.error("Error. Update did not complete.", response)
        }
      });
    }
  }

  onDelete(){
    const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete){
      const loggedInUser = this.userService.user();
      
      if (loggedInUser) {
        this.userService.deleteUser(loggedInUser.Username).subscribe({
          next: (response)=> {
            console.log("Delete completed successfully.", response)
            this.router.navigate(['']);          
          },
          error: (response)=>{
            this.showErrorMessage = true;
            setTimeout(() => (this.showErrorMessage = false), 10000);
            console.error("Error. Delete did not complete.", response)
          }
        });      
        this.userService.logoutUser();
      }
    }
  }
  
}
