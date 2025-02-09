import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { ServiceRecordService } from '../../../shared/services/service-record.service';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { ServiceRecord } from '../../../shared/interfaces/service-record';

@Component({
  selector: 'app-service-record-info-view',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './service-record-info-view.component.html',
  styleUrl: './service-record-info-view.component.css'
})
export class ServiceRecordInfoViewComponent {
  
  serviceRecordService = inject(ServiceRecordService);
  vehicleService = inject(VehicleService);
  router = inject(Router);

  selectedVehicle: Vehicle | null = null;
  selectedServiceRecord: ServiceRecord | null = null;

  serviceRecordForm = new FormGroup ({
    id: new FormControl(1),
    registerNumber: new FormControl({value: '', disabled: true}),
    serviceMileRange: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    dateOfService: new FormControl('')
  });

  ngOnInit(){
    this.selectedServiceRecord = this.serviceRecordService.getSelectedServiceRecord();
    if (this.selectedServiceRecord) {
      console.log(this.selectedServiceRecord.registerNumber)
      this.serviceRecordForm.patchValue({
        id: this.selectedServiceRecord.id,
        registerNumber: this.selectedServiceRecord.registerNumber,
        serviceMileRange: this.selectedServiceRecord.serviceMileRange,
        description: this.selectedServiceRecord.description,
        dateOfService: this.selectedServiceRecord.dateOfService
      })
    } else {        
      console.error('No service record data found in state.');
      this.router.navigate(['/serviceRecord/viewRecords']);
    }
  }

  onSubmit() {
    const registerNumber = this.selectedServiceRecord?.registerNumber || '';
    const id = this.selectedServiceRecord?.id || 0;
    const serviceRecord: ServiceRecord = {
      id: this.serviceRecordForm.get('id')?.value || 0,
      registerNumber: registerNumber,
      serviceMileRange: this.serviceRecordForm.get('serviceMileRange')?.value || '',
      description: this.serviceRecordForm.get('description')?.value || '',
      dateOfService: this.serviceRecordForm.get('dateOfService')?.value || ''
    }
    this.serviceRecordService.updateServiceRecord(registerNumber, id, serviceRecord).subscribe({
      next: (response) => {
        alert("Service record updated successfully!");
        console.log("Service record updated successfully!", response)
        this.router.navigate(['/serviceRecord/viewRecords']); 
      },
      error: (response)=>{
        alert("Failed to update service record. Please try again.")
        console.error("Error. Failed to update service record.", response)
      }
    })
  }

  onDelete() {
    const confirmDelete = confirm("Are you sure you want to delete this service record?");
    if (confirmDelete){
      if (this.selectedServiceRecord) {
        const registerNumber = this.selectedServiceRecord?.registerNumber || '';
        const id = this.selectedServiceRecord?.id || 0;
  
        this.serviceRecordService.deleteServiceRecord(registerNumber, id).subscribe({
          next: (response) => {
  
            console.log('Service Record deleted successfully:', response);
            this.router.navigate(['/serviceRecord/viewRecords']);
          },
          error: (error) => {
            console.error('Error deleting service record:', error);
          },
        });
      }
    }
  }
}
