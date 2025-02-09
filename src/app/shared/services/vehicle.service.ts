import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Vehicle } from '../interfaces/vehicle';

const API_URL=`${environment.apiURL}/api/user-vehicle`

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  http: HttpClient = inject(HttpClient);
  router = inject(Router);
  selectedVehicle: Vehicle | null = null;

  createVehicle(username: string, vehicle: Vehicle){
    return this.http.post<{msg: string}>(`${API_URL}/${username}`, vehicle);
  }
  
  updateVehicle(username: string, registrationNumber: string, vehicle: Vehicle){
    return this.http.patch<{msg: string}>(`${API_URL}/${username}/${registrationNumber}`, vehicle);
  }

  getVehicles(username: string){
    return this.http.get<{ data: Vehicle[] }>(`${API_URL}/${username}`);
  }

  getAVehicle(username: string, registrationNumber: string){
    return this.http.get<{data: Vehicle}>(`${API_URL}/${username}/${registrationNumber}`)
  }

  deleteVehicle(username: string, registrationNumber: string){
    return this.http.delete<{data: Vehicle}>(`${API_URL}/${username}/${registrationNumber}`)
  }

  
  setSelectedVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
  }
  getSelectedVehicle(): Vehicle | null {
    return this.selectedVehicle;
  }
}
