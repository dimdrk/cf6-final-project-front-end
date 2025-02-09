import { inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Credentials, User } from '../interfaces/user-backend';
import { LoggedInUser } from '../interfaces/user-backend';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

const API_URL=`${environment.apiURL}/api/users`

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  router = inject(Router);
  user = signal<LoggedInUser | null>(null);
  selectedUser: User | null = null;

  constructor(){
    const access_token = localStorage.getItem("authorization");
    if (access_token){
      const decodedTokenSubject = jwtDecode(access_token) as any
      this.user.set({
        Username: decodedTokenSubject.Username,
        Email: decodedTokenSubject.Email,
        Role: decodedTokenSubject.Role
      })
    }

    effect(() => {
      if (this.user()){
        console.log("User logged in: ", this.user()?.Username);
      } else {
        console.log("No user logged in.");
      }
    })
  }

  registerUser(user: User){
    return this.http.post<{msg: string}>(`${API_URL}/register`, user);
  }

  getUserDetails(username: string){
    const token = localStorage.getItem("authorization");
    const headers = new HttpHeaders({
      Authorization: `${token}`
    });

    return this.http.get<{data: User}>(`${API_URL}/user/${username}`, {headers}).pipe();
  }

  getAllUsers(){
    const token = localStorage.getItem("authorization");
    const headers = new HttpHeaders({
      Authorization: `${token}`
    });

    return this.http.get<{data: User[]}>(`${API_URL}/admin/all`, {headers}).pipe();
  }

  updateUser(username: string, updatedUserData: any){
    const token = localStorage.getItem("authorization");
    const headers = new HttpHeaders({
      Authorization: `${token}`
    });
    return this.http.patch<{msg: string}>(`${API_URL}/user/${username}`, updatedUserData, { headers });
  }

  deleteUser(username: string){
    return this.http.delete<{data: User}>(`${API_URL}/user/${username}`);
  }

  loginUser(credentials: Credentials){
    return this.http.post<{response_token: string}>(`${API_URL}/login`, credentials);
  }

  logoutUser(){
    this.user.set(null);
    localStorage.removeItem('authorization');
    this.router.navigate(['login']);
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }
  getSelectedUse(): User | null {
    return this.selectedUser;
  }
}
