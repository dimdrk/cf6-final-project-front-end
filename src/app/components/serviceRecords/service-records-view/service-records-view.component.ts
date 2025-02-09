import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ServiceRecord } from '../../../shared/interfaces/service-record';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { ServiceRecordService } from '../../../shared/services/service-record.service';
import { sortBy } from 'lodash-es';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-service-records-view',
  imports: [RouterLink, NgFor],
  templateUrl: './service-records-view.component.html',
  styleUrl: './service-records-view.component.css'
})
export class ServiceRecordsViewComponent {

  @Output() serviceRecordClicked = new EventEmitter<ServiceRecord>();
  
  router = inject(Router);
  vehicleService = inject(VehicleService);
  serviceRecordService = inject(ServiceRecordService)
  ServiceRecords: ServiceRecord[] = [];

  
  ngOnInit(){
    const registerNumber = this.vehicleService.selectedVehicle?.registrationNumber || ''
    this.serviceRecordService.getServiceRecords(registerNumber).subscribe({
      next: (response) => {
        this.ServiceRecords = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch service records:', err);
      }
    })    
  }
  
  sortOrder: { [key in keyof ServiceRecord]?: 'asc' | 'desc' | 'none' } = {
    registerNumber: 'none',
    serviceMileRange: 'none',
    description: 'none',
    dateOfService: 'none'
  }
  
  sortData(sortKey: keyof ServiceRecord): void {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.ServiceRecords = sortBy(this.ServiceRecords, sortKey).reverse();
    } else {
    this.sortOrder[sortKey] = 'asc';
    this.ServiceRecords = sortBy(this.ServiceRecords, sortKey);
    }  
  }
  
  sortSign(sortKey: keyof ServiceRecord): string {
    if (this.sortOrder[sortKey] === 'asc')
      return '↑';	// ALT + 24 or UTF-8 '&uarr'
    else if (this.sortOrder[sortKey] === 'desc')
      return '↓';	// ALT + 25 or UTF-8 '&darr'
    else return '';
  }
  
  addNewSeviceRecord() {
    this.router.navigate(['serviceRecord/createServiceRecord']);  
  }
  
  viewServiceRecord(serviceRecord: ServiceRecord){
    this.serviceRecordService.setSelectedServiceRecord(serviceRecord);
    this.router.navigate(['/serviceRecord/viewRecordDetails'])
  }

}
