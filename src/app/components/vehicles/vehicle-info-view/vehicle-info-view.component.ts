import { Component, inject, OnInit } from '@angular/core';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { UserService } from '../../../shared/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ServiceRecordService } from '../../../shared/services/service-record.service';

@Component({
  selector: 'app-vehicle-info-view',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-info-view.component.html',
  styleUrl: './vehicle-info-view.component.css'
})
export class VehicleInfoViewComponent implements OnInit {
  
  vehicleService = inject(VehicleService);
  serviceRecordService = inject(ServiceRecordService)
  userService = inject(UserService);
  router = inject(Router);

  selectedVehicle: Vehicle | null = null;

  vehicleUpdateForm = new FormGroup({
    registrationNumber: new FormControl({value: '', disabled: true}),
    vehicleType: new FormControl('', Validators.required),
    mileRange: new FormControl('', Validators.required),
    manufacture: new FormControl(''),
    model: new FormControl(''),
    color: new FormControl(''),
    registrationDate: new FormControl(''),
    });

    ngOnInit(){
      this.selectedVehicle = this.vehicleService.getSelectedVehicle();
      if (this.selectedVehicle) {
        this.populateForm(this.selectedVehicle);
      } else {        
        console.error('No vehicle data found in state.');
        this.router.navigate(['/vehicle/viewVehicles']);
      }
    }

    populateForm(vehicle: Vehicle) {
      if (!vehicle) return;

      this.vehicleUpdateForm.patchValue({
        registrationNumber: vehicle.registrationNumber,
        vehicleType: vehicle.vehicleType,
        mileRange: vehicle.mileRange,
        manufacture: vehicle.manufacture,
        model: vehicle.model,
        color: vehicle.color,
        registrationDate: vehicle.registrationDate,
      });
    }

  onSubmit() {
    const username = this.userService.user()?.Username || '';
    const registrationNumber = this.selectedVehicle?.registrationNumber || '';
    const updatedVehicle: Vehicle = {
      username: username,
      registrationNumber: registrationNumber,
      vehicleType: this.vehicleUpdateForm.get('vehicleType')?.value || '',
      mileRange: this.vehicleUpdateForm.get('mileRange')?.value || '',
      manufacture: this.vehicleUpdateForm.get('manufacture')?.value || '',
      model: this.vehicleUpdateForm.get('model')?.value || '',
      color: this.vehicleUpdateForm.get('color')?.value || '',
      registrationDate: this.vehicleUpdateForm.get('registrationDate')?.value || ''
    }

    this.vehicleService.updateVehicle(username, registrationNumber, updatedVehicle).subscribe({
      next: (response) => {
        alert("Vehicle updated successfully!");
        console.log("Vehicle updated successfully!", response.msg)
        this.router.navigate(['/vehicle/viewVehicles']); 
      },
      error: (response)=>{
        alert("Failed to update vehicle. Please try again.");
        console.error("Error. Failed to update vehicle.", response)
      }
    })
  }
  
  onDelete() {
    const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete){
      if (this.selectedVehicle) {
        const username = this.userService.user()?.Username || '';
        const registrationNumber = this.selectedVehicle.registrationNumber;
  
        this.vehicleService.deleteVehicle(username, registrationNumber).subscribe({
          next: (response) => {
            console.log("USERNAME: ", username)
            console.log('Vehicle deleted successfully:', response);
            this.router.navigate(['/vehicle/viewVehicles']);
          },
          error: (error) => {
            console.error('Error deleting vehicle:', error);
          },
        });
      }

    }
  }

  viewServiceRecords(vehicle: Vehicle | null){
    vehicle = this.selectedVehicle;
    if (!vehicle) {
      console.error("No vehicle selected for service records.");
      return;
    }
    this.serviceRecordService.setSelectedVehicle(vehicle);
    this.router.navigate(['/serviceRecord/viewRecords']);

  }
}
