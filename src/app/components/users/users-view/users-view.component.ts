import { Component, EventEmitter, inject, Output } from '@angular/core';
import { User } from '../../../shared/interfaces/user-backend';
import { sortBy } from 'lodash-es';
import { UserService } from '../../../shared/services/user.service';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-view',
  imports: [NgFor],
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.css'
})
export class UsersViewComponent {
  @Output() userClicked = new EventEmitter<User>();
  
  router = inject(Router);
  userService = inject(UserService);
  Users: User[] = [];

  ngOnInit(){
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.Users = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch vehicles:', err);
      }
    })    
  }
  
  viewUser(user: User) {
    this.userService.setSelectedUser(user);
    this.router.navigate(['/vehicle/vehicleDetails']);
  }
  
  sortOrder: User = {
    username: 'none',
    password: 'none',
    firstname: 'none',
    lastname: 'none',
    email: 'none',
    phoneNumber: 'none',
    city: 'none',
    role: 'none'
  }
  
  sortData(sortKey: keyof User): void {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.Users = sortBy(this.Users, sortKey).reverse();
    } else {
    this.sortOrder[sortKey] = 'asc';
    this.Users = sortBy(this.Users, sortKey);
    }  
  }
  
  sortSign(sortKey: keyof User): string {
    if (this.sortOrder[sortKey] === 'asc')
      return '↑';	// ALT + 24 or UTF-8 '&uarr'
    else if (this.sortOrder[sortKey] === 'desc')
      return '↓';	// ALT + 25 or UTF-8 '&darr'
    else return '';
  }

}
