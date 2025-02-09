import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-vehicle-create',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './vehicle-create.component.html',
  styleUrl: './vehicle-create.component.css'
})
export class VehicleCreateComponent { 
  
  vehicleService = inject(VehicleService);
  userService = inject(UserService);
  router = inject(Router);

  vehicleCreateForm = new FormGroup({
    registrationNumber: new FormControl('', Validators.required),
    vehicleType: new FormControl(''),
    mileRange: new FormControl('', Validators.required),
    manufacture: new FormControl(''),
    model: new FormControl(''),
    color: new FormControl(''),
    registrationDate: new FormControl(''),
    });

  onSubmit() {
    console.log(this.vehicleCreateForm.value);
    const username = this.userService.user()?.Username || '';
    const vehicle: Vehicle = {
      username: username,
      registrationNumber: this.vehicleCreateForm.get('registrationNumber')?.value || '',
      vehicleType: this.vehicleCreateForm.get('vehicleType')?.value || '',
      mileRange: this.vehicleCreateForm.get('mileRange')?.value || '',
      manufacture: this.vehicleCreateForm.get('manufacture')?.value || '',
      model: this.vehicleCreateForm.get('model')?.value || '',
      color: this.vehicleCreateForm.get('color')?.value || '',
      registrationDate: this.vehicleCreateForm.get('registrationDate')?.value || ''
    }

    this.vehicleService.createVehicle(username, vehicle).subscribe({
      next: (response) => {
        alert("Registration completed successfully.");
        console.log("Registration completed successfully.", response)
        this.router.navigate(['/vehicle/viewVehicles']); 
      },
      error: (response)=>{
        alert("Error. Registration did not complete.");
        console.error("Error. Registration did not complete.", response)
      }
    })
  }
  
  onReset() {
    this.vehicleCreateForm.reset();
  }

}
