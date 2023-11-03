import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { type } from 'os';

import { Observable, from, observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { map,tap,catcherrors} from rxjs/operators;

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  userId: any;
  courierId: any;
  constructor(private auth: AuthService, private http: HttpClient) { }

  // login
  LoginIn(postData: any): Observable<any> {
    const url = 'auth/login';
    return this.auth.postLogin(url, postData).pipe(map((res) => res));
  }

  // customer getlist
  getListUserDetails(
    usertype?: any,
    limit?: any,
    offset?: any,
    value?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (value) {
        url = `users?userType=${usertype}&limit=${limit}&offset=${offset}&value=${value}`;
      } else {
        url = `users?userType=${usertype}&limit=${limit}&offset=${offset}`;
      }

      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  getListUsergetById(userId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `users/${userId}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  //getlistcustomerorderactivetrip
  getListCustomerActiveTrip(customerId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?userId=${customerId}&orderStatus=orderAssigned,orderInProgress,orderPickedUped`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // getlistcustomerordercompletetrip
  getListCustomerCompleteTrip(customerId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?userId=${customerId}&orderStatus=delivered`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // trip details
  getListTrip(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?_id=${id}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  cancelTrip(_id: any, payload: any) {
    let url = `orders/${_id}`;
    return this.auth.putGuestAuthApiData(url, payload).pipe(map((res) => res));
  }
  deliveredTrip(_id: any, payload: any) {
    let url = `orders/${_id}`;
    return this.auth.putGuestAuthApiData(url, payload).pipe(map((res) => res));
  }
  // -----------------------
  getConsumerExport(type: any, verified?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `users/excelReport/generate?userType=${type}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  getOrderExport(_id: any, fromDate: any, toDate: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (fromDate && toDate && _id) {
        url = `orders/excelReport/generate?initiated=1&createdById=${_id}&fromDate=${fromDate}&toDate=${toDate}`;
      } else {
        url = `orders/excelReport/generate?initiated=1&createdById=${_id}`;
      }

      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  uneffectiveDistance(payload) {
    let url = `trip/latLong/baseCal`;
    return this.auth.postGuestAuthApiData(url, payload).pipe(map((res) => res));
  }

  // courier getlist
  getListCouriergetById(courierId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `users/${courierId}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  //getlistcourierorderactivetrip
  getlistCourierActiveTrip(courierId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?assignedToId=${courierId}&orderStatus=orderAssigned,orderInProgress,orderPickedUped`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // getlistcourierordercompletetrip

  getlistCourierCompleteTrip(courierId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?assignedToId=${courierId}&orderStatus=delivered`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  updateCourierVerified(userId: any, verified: any) {
    let url = `users/${userId}`;
    return this.auth.putGuestAuthApiData(url, verified).pipe(map((res) => res));
  }
  //delete courier
  deleteCourier(courierId: any) {
    let url = `users/${courierId}`;
    return this.auth.deleteGuestAuthApiData(url).pipe(map((res) => res));
  }

  //deliveryman generate payout
  getCompletedTripList(
    courierId: any,
    paymentMode: any,
    paymentStatus: any,
    fromDate: any,
    toDate: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/generate/payout?assignedToId=${courierId}&paymentMode=${paymentMode}&paymentStatus=${paymentStatus}&fromDate=${fromDate}&toDate=${toDate}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  updatePaymentStatus(payload: any) {
    let url = `payout/`;
    return this.auth.postGuestAuthApiData(url, payload).pipe(map((res) => res));
  }
  // courier payout history
  getlistPayoutHistory(courierId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `payout?paidById=${courierId}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  getlistPayoutHistoryView(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `payout/${id}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  deleteBanner(id: any) {
    let url = `banner/${id}`;
    return this.auth.deleteGuestAuthApiData(url).pipe(map((res) => res));
  }

  updateBanner(data: any, id: any) {
    let url = `banner/${id}`;
    return this.auth.putGuestAuthApiData(url, data).pipe(map((res) => res));
  }
  getAllCourierDetails(
    usertype?: any,
    limit?: any,
    offset?: any,
    value?: any,
    verified?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `users?userType=${usertype}&limit=${limit}&offset=${offset}&value=${value ? value : ''}&verified=${verified ? verified : ''}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  getBannerList(type?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `banner?type=${type}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  UploadFile(fileData): Observable<any> {
    // console.log('FROM file upload ==>', fileData);

    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';

    this.courierId = localStorage.getItem('courierViewId')
      ? JSON.parse(localStorage.getItem('courierViewId') || '')
      : '';

    let url = environment.baseUrl + `file/upload/${this.courierId}`;
    return this.http
      .post<any>(url, fileData, {
        headers: {
          Authorization: `${sessionStorage.getItem('tokenA')}`,
          userId: this.userId,
        },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: 'progress', message: progress };
            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        }),
        catchError(this.handleError('err', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      console.error('SERVER ERR', err);
      if ((err.status = 500)) {
        return throwError(err);
      }
      if ((err.status = 401)) {
      } else if ((err.status = 403)) {
      } else {
      }
      return of(result as T);
    };
  }

  // getlistb2bcustomer

  getAllb2bCustomer(
    usertype?: any,
    limit?: any,
    offset?: any,
    value?: any, verified?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {

      let url = `users?userType=${usertype}&limit=${limit}&offset=${offset}&value=${value ? value : ''
        }&verified=${verified ? verified : ''}`;


      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  updateb2bcustomer(userId: any, verified: any) {
    let url = `users/${userId}`;
    return this.auth.putGuestAuthApiData(url, verified).pipe(map((res) => res));
  }
  //---------- getlistb2bcustomer -----

  createBanner(payload: any) {
    let url = `banner`;
    return this.auth.postGuestAuthApiData(url, payload).pipe(map((res) => res));
  }
  // -----     banner management    ----

  uploadBanner(fileData): Observable<any> {
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    let url = environment.baseUrl + `file/bannerUpload`;
    return this.http
      .post<any>(url, fileData, {
        headers: {
          Authorization: `${sessionStorage.getItem('tokenA')}`,
          userId: this.userId,
        },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);

              // console.log('progress ')

              return { status: 'progress', message: progress };

            case HttpEventType.Response:
              // console.log('response ', event.body);
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        }),

        catchError(this.handleError('err', []))
      );
  }

  getListDemoReq(limit?: any, offset?: any, value?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (value) {
        url = `demo?limit=${limit}&offset=${offset}&value=${value}&demoStatus=new`;
      } else {
        url = `demo?limit=${limit}&offset=${offset}&demoStatus=new`;
      }

      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  updatedemoList(userId: any, verified: any) {
    let url = `demo/${userId}`;
    return this.auth.putGuestAuthApiData(url, verified).pipe(map((res) => res));
  }
  // ---------dashboard page api-------
  getconsumerActiveTrip(usertype: any, orderStatus: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders?type=${usertype}&orderStatus=${orderStatus}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  //hhhhhhhhhhhhhhhhhhhhh
  getListAllActiveDeliveryMan(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `users/active/list?userType=deliveryman`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  assignDeliveryManUpdate(userId: any, payload: any) {
    let url = `trip/new/accept`;
    return this.auth.putGuestAuthApiData(url, payload).pipe(map((res) => res));
  }

  // --------dashboard end-----------

  // --------get all trips---------
  getListAllTrip(limit: any, offset: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/admin/list?initiated=1&limit=${limit}&offset=${offset}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  searchFilterByb2bcustomer(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `users/b2bCust/list?userType=subadmin`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  // 
  searchBySubAdmin(limit: any, offset: any, _id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (_id) {
        url = `orders/admin/list?initiated=1&limit=${limit}&offset=${offset}&createdById=${_id}`;
      } else {
        url = `orders/admin/list?initiated=1&limit=${limit}&offset=${offset}`;
      }


      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  searchFilterByTripId(orderCode: any, limit: any, offset: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';

      url = `orders/admin/list?orderCode=${orderCode}&initiated=1&limit=${limit}&offset=${offset}`;

      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  searchFilterByDate(
    orderCode: any,
    _id: any,
    fromDate: any,
    toDate: any,
    limit: any,
    offset: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (_id) {
        url = `orders/admin/list?orderCode=${orderCode}&createdById=${_id}&initiated=1&fromDate=${fromDate}&toDate=${toDate}&limit=${limit}&offset=${offset}`;
      } else {
        url = `orders/admin/list?orderCode=${orderCode}&initiated=1&fromDate=${fromDate}&toDate=${toDate}&limit=${limit}&offset=${offset}`;

      }
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  searchFilteractiveDate(
    fromDate: any,
    toDate: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/dashboard/active?type=s2b&fromDate=${fromDate ? fromDate : ""}&toDate=${toDate ? toDate : ""}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  searchFilterconsumerDate(
    fromDate: any,
    toDate: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/dashboard/active?type=consumer&fromDate=${fromDate ? fromDate : ""}&toDate=${toDate ? toDate : ""}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  tripdata(type: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/dashboard/active?type=${type}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  b2ctripdata(type: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `orders/dashboard/active?type=${type}`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // payout screen  getlist
  getlistPayout(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      url = `payout`;
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }


  // create subAdmin
  createAdmin(postData: any, userId: any): Observable<any> {
    let url = ``;
    if (!userId) {
      url = `users/register`;
      return this.auth.guestpost(url, postData).pipe(map(res => res));
    } else {
      url = `users/${userId}`
      return this.auth.putGuestAuthApiData(url, postData).pipe(map(res => res));
    }


  }

  getSubAdmin(
    usertype?: any,
    limit?: any,
    offset?: any,
    value?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (value) {
        url = `users?userType=${usertype}&limit=${limit}&offset=${offset}&value=${value}`;
      } else {
        url = `users?userType=${usertype}&limit=${limit}&offset=${offset}`;
      }
      this.auth
        .guestAuthGetapi(url)
        .then((resp: any) => {
          resolve(resp);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }


  resetPassword(postData: any): Observable<any> {
    let url = `auth/resetPassword`
    return this.auth.postGuestAuthApiData(url, postData).pipe(map(res => res));

  }
  getOrderTableDetails(limit: any, offset: any, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '';
      if (value) {
        url = `orders/admin/list?initiated=1&limit=${limit}&offset=${offset}&value=${value}`;
      }
      else {
        url = `orders/admin/list?initiated=1&limit=${limit}&offset=${offset}`;
      }

      this.auth.guestAuthGetapi(url).then((resp: any) => {

        resolve(resp);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

}



