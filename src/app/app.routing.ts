import { Routes } from '@angular/router';

import { B2bCustomersComponent } from './b2b-customers/b2b-customers.component';
import { B2bTripsComponent } from './b2b-trips/b2b-trips.component';

import { CourierGeneratePayoutComponent } from './courier-generate-payout/courier-generate-payout.component';
import { CourierPayoutViewComponent } from './courier-payout-view/courier-payout-view.component';
import { CourierPayoutComponent } from './courier-payout/courier-payout.component';
import { CourierViewComponent } from './courier-view/courier-view.component';
import { CouriersComponent } from './couriers/couriers.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemoMaterialModule } from './demo-material-module';
import { DeliveryTripComponent } from './delivery-trip/delivery-trip.component';
import { EnterOtpComponent } from './enter-otp/enter-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';

import { PayoutComponent } from './payout/payout.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchComponent } from './search/search.component';
import { SettingComponent } from './setting/setting.component';
import { StampDocumentComponent } from './stamp-document/stamp-document.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { AuthGuardServiceService } from './service/auth-guard-service.service';
import { DemoRequestComponent } from './demo-request/demo-request.component';
import { MobileAppTripsComponent } from './mobile-app-trips/mobile-app-trips.component';
import { AddSubadminComponent } from './add-subadmin/add-subadmin.component';
import { MapComponent } from './map/map.component';
import { FoodComponent } from './food/food.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuardServiceService],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,

        data: {
          title: ' Admin Dashboard',
          urls: [{ title: 'Dashboard', url: '/   ' }],
        },
      },
      {
        path: 'mobile-app-trips',
        component: MobileAppTripsComponent,

        data: {
          title: 'B2C-Trips',
          urls: [{ title: 'Mobile App Trips', url: '/   ' }],
        },
      },
      {
        path: 'trip_details',
        component: TripDetailsComponent,

        data: {
          title: 'Dashboard',
          urls: [{ title: 'trip_details', url: '/   ' }],
        },
      },
      {
        path: 'search',
        component: SearchComponent,

        data: {
          title: 'Search',
          urls: [{ title: 'Dashboard', url: '/   ' }, { title: 'search' }],
        },
      },
      {
        path: 'delivery_trip',
        component: DeliveryTripComponent,

        data: {
          title: 'Delivery_trip',
          urls: [
            { title: 'Dashboard', url: '/   ' },
            { title: 'delivery_trip' },
          ],
        },
      },
      {
        path: 'stamp_document',
        component: StampDocumentComponent,

        data: {
          title: 'Stamp Document',
          urls: [
            { title: 'Dashboard', url: '/   ' },
            { title: 'stamp_document' },
          ],
        },
      },
      {
        path: 'couriers',
        component: CouriersComponent,

        data: {
          title: 'Couriers',
          urls: [{ title: 'Dashboard', url: '/   ' }, { title: 'couriers' }],
        },
      },
      {
        path: 'courier-view',
        component: CourierViewComponent,

        data: {
          title: 'Courier-view',
          urls: [
            { title: 'Dashboard', url: '/   ' },
            { title: 'courier-view' },
          ],
        },
      },
      {
        path: 'courier-payout',
        component: CourierPayoutComponent,

        data: {
          title: 'Courier-payout',
          urls: [
            { title: 'Dashboard', url: '/   ' },
            { title: 'courier-payout' },
          ],
        },
      },
      {
        path: 'courier-payout-view',
        component: CourierPayoutViewComponent,

        data: {
          title: 'Courier-payout-view',
          urls: [
            { title: 'Dashboard', url: '/ ' },
            { title: 'courier-payout-view' },
          ],
        },
      },
      {
        path: 'courier-generate-payout',
        component: CourierGeneratePayoutComponent,

        data: {
          title: 'Courier-generate-payout',
          urls: [
            { title: 'Dashboard', url: '/ ' },
            { title: 'courier-generate-payout' },
          ],
        },
      },
      {
        path: 'customers',
        component: CustomersComponent,

        data: {
          title: 'B2C-Customers',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'customers' }],
        },
      },
      {
        path: 'customer-view',
        component: CustomerViewComponent,

        data: {
          title: 'Customer-view',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'customer-view' }],
        },
      },
      {
        path: 'b2b-trips',
        component: B2bTripsComponent,

        data: {
          title: 'S2B-Trips',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'b2b-trips' }],
        },
      },
      {
        path: 'b2b-customers',
        component: B2bCustomersComponent,

        data: {
          title: 'S2B-customers',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'b2b-customers' }],
        },
      },
      {
        path: 'payout',
        component: PayoutComponent,

        data: {
          title: 'COD/COP Status',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'payout' }],
        },
      },
      {
        path: 'setting',
        component: SettingComponent,

        data: {
          title: 'Settings',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'setting' }],
        },
      },
      {
        path: 'demo-request',
        component: DemoRequestComponent,

        data: {
          title: 'demo-Request',
          urls: [{ title: 'Dashboard', url: '/ ' }, { title: 'demo-request' }],
        },
      },
      {
        path: 'map',
        component: MapComponent,

        data: {
          title: 'Map',
          urls: [{ title: 'map', url: '/ ' }, { title: 'map' }],
        },
      },
      {
        path: 'add-subadmin',
        component: AddSubadminComponent,

        data: {
          title: 'Create SubAdmin',
          urls: [{ title: 'add-subadmin', url: '/   ' }],
        },
      },
      {
        path: 'restaurant',
        component: RestaurantComponent,

        data: {
          title: 'Restaurant',
          urls: [{ title: 'Restaurant', url: '/   ' }],
        },
      },
      {
        path: 'restaurant/add-restaurant',
        component: AddRestaurantComponent,

        data: {
          title: 'Add Restaurant',
          urls: [{ title: 'Restaurant', url: '/   ' }],
        },
      },
      {
        path: 'restaurant/food',
        component: FoodComponent,

        data: {
          title: 'Food',
          urls: [{ title: 'Food', url: '/   ' }],
        },
      },


     
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Registration',
    },
  },
  {
    path: 'otp',
    component: EnterOtpComponent,
    data: {
      title: 'OTP',
    },
  },

  {
    path: 'forgotpass',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot password',
    },
  },

  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset password',
    },
  },
];
