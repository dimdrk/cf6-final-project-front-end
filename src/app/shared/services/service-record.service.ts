import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '../interfaces/vehicle';
import { environment } from '../../../environments/environment.development';
import { ServiceRecord } from '../interfaces/service-record';

const API_URL=`${environment.apiURL}/api/service-records`

@Injectable({
  providedIn: 'root'
})
export class ServiceRecordService {
  http: HttpClient = inject(HttpClient);
  router = inject(Router);
  selectedVehicle: Vehicle | null = null;
  selectedServiceRecord: ServiceRecord | null = null;

  createServiceRecord(registerNumber: string, id: number, serviceRecord: ServiceRecord) {
    return this.http.post<{msg: string}>(`${API_URL}/${registerNumber}/${id}`, serviceRecord);
  }

  updateServiceRecord(registerNumber: string, id: number, ServiceRecord: ServiceRecord) {
    return this.http.patch<{msg: string}>(`${API_URL}/${registerNumber}/${id}`, ServiceRecord);
  }

  deleteServiceRecord(registerNumber: string, id: number) {
    return this.http.delete<{data: ServiceRecord}>(`${API_URL}/${registerNumber}/${id}`)
  }

  getServiceRecords(registerNumber: string) {
    return this.http.get<{ data: ServiceRecord[] }>(`${API_URL}/${registerNumber}`);
  }

  getAServiceRecord(registerNumber: string, id: number) {
    return this.http.get<{data: ServiceRecord}>(`${API_URL}/${registerNumber}/${id}`)
  }

  setSelectedVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
  }
  getSelectedVehicle(): Vehicle | null {
    return this.selectedVehicle;
  }

  setSelectedServiceRecord(serviceRecord: ServiceRecord) {
    this.selectedServiceRecord = serviceRecord;
  }
  getSelectedServiceRecord(): ServiceRecord | null {
    return this.selectedServiceRecord;
  }
}
