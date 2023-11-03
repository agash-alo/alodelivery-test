import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from '../service/api-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mobile-app-trips',
  templateUrl: './mobile-app-trips.component.html',
  styleUrls: ['./mobile-app-trips.component.scss'],
})
export class MobileAppTripsComponent implements OnInit {
  acceptedbyId: any;
  usertype: any;
  orderStatus: any;
  Consumernewtrip: any;
  totalCount: any;
  Consumeractivetrip: any;
  activetotalCount: any;
  pick1: any;
  pick2: any;
  drop1: any;
  drop2: any;
  uneffectiveDist: any;
  deliverymanForm!: FormGroup;
  isSubmitted: boolean = false;
  _id: any;
  orderId: any;
  deliveryman: any;
  pickuplatvalue: any;
  pickuplongvalue: any;
  searchLoad:boolean = false;
  constructor(
    private router: Router,
    public apiService: ApiServiceService,
    public fb: FormBuilder,
    public toastr: ToastrService
  ) {
    this.deliverymanForm = this.fb.group({
      deliverymanname: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getListConsumerNewtrip();
    this.getListConsumerActivetrip();
    this.getallActiveDeliveryman();
  }

  // onSelectEvent(value: any) {
  //   console.log(value);
  //   this.acceptedbyId = value;
  // }

  getListConsumerNewtrip() {
   
    this.usertype = 'consumer';
    this.orderStatus = 'new';
    this.apiService
      .getconsumerActiveTrip(this.usertype, this.orderStatus)
      .then((res) => {
        this.Consumernewtrip = res?.data?.data ? res.data.data : [];
        this.totalCount = res?.data.totalCount;
        // this.orderId = this.Consumernewtrip?.tripDetails.orderd;
        // console.log(this.orderId)
        // this._id=this.Consumernewtrip?._id
        for (let value of this.Consumernewtrip)  {
          value.disable=true;
        }
        console.log(this.Consumernewtrip);
      })
      .catch((err) => {});
  }
  getListConsumerActivetrip() {
    this.searchLoad = true
    this.usertype = 'consumer';
    this.orderStatus = 'orderAssigned,orderInProgress,orderPickedUped';
    this.apiService
      .getconsumerActiveTrip(this.usertype, this.orderStatus)
      .then((res) => {
        this.Consumeractivetrip = res?.data?.data ? res.data.data : [];
        this.activetotalCount = res?.data.totalCount;
        // console.log(this.Consumeractivetrip.newAt);
        this.searchLoad = false;
      })
      .catch((err) => {});
    
  }

  moredetails(i: any) {
    console.log('i?.assigneeDetails?._id', i?.assigneeDetails?._id);
    this.router.navigate([
      '/trip_details',
      { courierId: i?.assigneeDetails?._id, id: i?._id },
    ]);
  }

  getallActiveDeliveryman() {
    this.apiService
      .getListAllActiveDeliveryMan()
      .then((res) => {
        this.deliveryman = res?.data ? res.data : [];
        console.log(this.deliveryman);
      })
      .catch((err) => {});
  }

  onSelectionChange(value: any, pickup,i) {
    console.log(pickup[0]?.latitude, 'ryyyfki');
    this.pickuplatvalue = pickup[0]?.latitude;
    this.pickuplongvalue = pickup[0]?.longitude;
    
    // this.test(value, value.primaryAddress);
    this.acceptedbyId = value._id;
    this.pick1 = value?.primaryAddress?.latitude;
    this.pick2 = value?.primaryAddress?.longitude;
    this.uneffectiveDistance(i);
  }
  // test(e: any, pickup: any) {
  //   console.log('pppppppppp', e, pickup);
  //   this.pick1 = e?.primaryAddress?.latitude;
  //   this.pick2 = e?.primaryAddress?.longitude;
  //   (this.drop1 = pickup[0]?.latitude), (this.drop2 = pickup[0]?.longitude);
  //   this.uneffectiveDistance();
  // }
  // test(e: any, pickup: any) {
  //   console.log(this.s2bnewtrip?.pickupAddress);
  //   console.log('pppppppppp', e, pickup);
  //   this.acceptedbyId = e._id;
  //   this.pick1 = e?.primaryAddress?.latitude;
  //   this.pick2 = e?.primaryAddress?.longitude;
  //   this.uneffectiveDistance();
  // }
  uneffectiveDistance(i) {
    let payload = {
      pickUpLat: this?.pick1,
      pickUpLong: this?.pick2,
      dropLat: this?.pickuplatvalue,
      dropLong: this?.pickuplongvalue,
    };
    console.log(payload);
    this.apiService.uneffectiveDistance(payload).subscribe((res) => {
      this.uneffectiveDist = res?.data;
      console.log(this.uneffectiveDist)
      if(res.code == 200)  {
        this.Consumernewtrip[i].disable=false;
      }  else  {
        this.Consumernewtrip[i].disable=true;
      }
    }, err => {
      this.Consumernewtrip[i].disable = true;
    });
  }

  // get deliverymanname() {
  //   return this.deliverymanForm.get('deliverymanname')?.markAllAsTouched();
  // }

  // assigncourier(i: any, type: any) {
  //   this.isSubmitted = true;
  //   console.log('hkdfdj', this.deliverymanForm.invalid);
  //   if (this.deliverymanForm?.invalid == true) {
  //     this.deliverymanForm.markAllAsTouched();
  //     console.log(this.deliverymanForm.get('deliverymanname')?.value);
  //     return;
  //   } else {
  //     this.assign(i, type);
  //     this.deliverymanForm.reset();
  //   }
  // }
  assigncourier(i: any, type: any) {
    this.isSubmitted = true;
    this.assign(i, type);
  }

  assign(i: any, type: any) {
    this._id = i?.tripDetails?._id;
    this.orderId = i?.tripDetails?.orderId;
    console.log(this.orderId);
    let payload = {
      _id: this._id,
      orderId: this.orderId,
      tripStatus: 'accepted',
      acceptedById: this.acceptedbyId,
      assignedAt: new Date(),
      baseKm: this.uneffectiveDist,
    };
    if (!this.acceptedbyId && this.acceptedbyId != '') {
      this.toastr.error('Please Select Assignee');
    } else {
      this.apiService.assignDeliveryManUpdate(this._id, payload).subscribe(
        (res) => {
          this.deliveryman = res?.data?.data;
          this.toastr.success('Successfully Updated...!');
          // if (type == 'consumer') {
          this.getListConsumerNewtrip();
          this.getListConsumerActivetrip();
          this.getallActiveDeliveryman();
          // } else {
          // }
        },
        (err) => {
          this.toastr.error('Failed to update!!!');
        }
      );
    }
  }
}

//
