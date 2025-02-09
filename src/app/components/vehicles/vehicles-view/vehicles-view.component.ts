import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { sortBy } from 'lodash-es';
import { Router } from '@angular/router';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-vehicles-view',
  imports: [ NgFor],
  templateUrl: './vehicles-view.component.html',
  styleUrl: './vehicles-view.component.css'
})
export class VehiclesViewComponent {
  @Output() vehicleClicked = new EventEmitter<Vehicle>();
  
  router = inject(Router);
  userService = inject(UserService);
  vehicleService = inject(VehicleService);
  Vehicles: Vehicle[] = [];


  ngOnInit(){
    const username = this.userService.user()?.Username || '';
    this.vehicleService.getVehicles(username).subscribe({
      next: (response) => {
        this.Vehicles = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch vehicles:', err);
      }
    })    
  }
  
  sortOrder: Vehicle = {
    registrationNumber: 'none',
    mileRange: 'none',
    manufacture: 'none',
    model: 'none',
    color: 'none',
    username: 'none',
    vehicleType: 'none'
  }

  sortData(sortKey: keyof Vehicle): void {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.Vehicles = sortBy(this.Vehicles, sortKey).reverse();
    } else {
    this.sortOrder[sortKey] = 'asc';
    this.Vehicles = sortBy(this.Vehicles, sortKey);
    }  
  }

  sortSign(sortKey: keyof Vehicle): string {
    if (this.sortOrder[sortKey] === 'asc')
      return '↑';	// ALT + 24 or UTF-8 '&uarr'
    else if (this.sortOrder[sortKey] === 'desc')
      return '↓';	// ALT + 25 or UTF-8 '&darr'
    else return '';
  }

  viewVehicle(vehicle: Vehicle) {
    this.vehicleService.setSelectedVehicle(vehicle);
    this.router.navigate(['/vehicle/vehicleDetails']);
  }

  addNewVehicle(){
    this.router.navigate(['vehicle/createVehicle']);          
  }
}
