import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserInfoViewComponent } from './components/users/user-info-view/user-info-view.component';
import { UsersViewComponent } from './components/users/users-view/users-view.component';
import { VehiclesViewComponent } from './components/vehicles/vehicles-view/vehicles-view.component';
import { VehicleInfoViewComponent } from './components/vehicles/vehicle-info-view/vehicle-info-view.component';
import { VehicleCreateComponent } from './components/vehicles/vehicle-create/vehicle-create.component';
import { ServiceRecordsViewComponent } from './components/serviceRecords/service-records-view/service-records-view.component';
import { ServiceRecordInfoViewComponent } from './components/serviceRecords/service-record-info-view/service-record-info-view.component';
import { ServiceRecordCreateComponent } from './components/serviceRecords/service-record-create/service-record-create.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    // { path: 'aboutUs', component: AboutUsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'user/viewUser', component: UserInfoViewComponent, canActivate:[authGuard] },
    { path: 'admin/viewAllusers', component: UsersViewComponent, canActivate:[authGuard] },

    { path: 'vehicle/viewVehicles', component: VehiclesViewComponent, canActivate:[authGuard] },
    { path: 'vehicle/vehicleDetails', component: VehicleInfoViewComponent, canActivate:[authGuard] },
    { path: 'vehicle/createVehicle', component: VehicleCreateComponent, canActivate:[authGuard] },

    { path: 'serviceRecord/viewRecords', component: ServiceRecordsViewComponent, canActivate:[authGuard] },
    { path: 'serviceRecord/viewRecordDetails', component: ServiceRecordInfoViewComponent, canActivate:[authGuard] },
    { path: 'serviceRecord/createServiceRecord', component: ServiceRecordCreateComponent, canActivate:[authGuard] },
];
