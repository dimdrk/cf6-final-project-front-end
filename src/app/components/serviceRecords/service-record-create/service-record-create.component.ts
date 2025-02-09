import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServiceRecord } from '../../../shared/interfaces/service-record';
import { ServiceRecordService } from '../../../shared/services/service-record.service';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { VehicleService } from '../../../shared/services/vehicle.service';

@Component({
  selector: 'app-service-record-create',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './service-record-create.component.html',
  styleUrl: './service-record-create.component.css'
})
export class ServiceRecordCreateComponent {

  serviceRecordService = inject(ServiceRecordService);
  vehicleService = inject(VehicleService);
  router = inject(Router);

  selectedVehicle: Vehicle | null = null;
  // selectedServiceRecord: ServiceRecord | null = null;
  
  serviceRecordForm = new FormGroup ({
    id: new FormControl(1),
    registerNumber: new FormControl({value: '', disabled: true}),
    serviceMileRange: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    dateOfService: new FormControl('')
  });

  ngOnInit(){
    this.selectedVehicle = this.vehicleService.getSelectedVehicle();
    if (this.selectedVehicle) {
      console.log(this.selectedVehicle.registrationNumber)
      this.serviceRecordForm.patchValue({
        registerNumber: this.selectedVehicle.registrationNumber
      })
    } else {        
      console.error('No vehicle data found in state.');
      this.router.navigate(['/vehicle/viewVehicles']);
    }
  } 
  
  onSubmit() {
    const registerNumber = this.selectedVehicle?.registrationNumber || '';
    const id = this.serviceRecordForm.get('id')?.value || 0;
    const serviceRecord: ServiceRecord = {
      id: this.serviceRecordForm.get('id')?.value || 0,
      registerNumber: registerNumber,
      serviceMileRange: this.serviceRecordForm.get('serviceMileRange')?.value || '',
      description: this.serviceRecordForm.get('description')?.value || '',
      dateOfService: this.serviceRecordForm.get('dateOfService')?.value || ''
    }
    this.serviceRecordService.createServiceRecord(registerNumber, id, serviceRecord).subscribe({
      next: (response) => {
        console.log("Registration completed successfully.", response)
        this.router.navigate(['/serviceRecord/viewRecords']); 
      },
      error: (response)=>{
        console.error("Error. Registration did not complete.", response)
      }
    })
  }
  
  onReset() {
    this.serviceRecordForm.reset();
  }
}
