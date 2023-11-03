import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stamp-document',
  templateUrl: './stamp-document.component.html',
  styleUrls: ['./stamp-document.component.scss'],
})
export class StampDocumentComponent implements OnInit {
  acceptedbyId: any;
  usertype: any;
  orderStatus: any;
  stampdocument: any;
  stamptotalCount: any = 0;
  activestampdocument: any;
  ActivestamptotalCount: any;
  deliverymanStampForm: FormGroup;
  deliveryman: any;
  pick1: any;
  pick2: any;
  drop1: any;
  drop2: any;
  uneffectiveDist: any;
  isSubmitted: boolean = false;
  _id: any;
  orderId: any;
  pickuplatvalue: any;
  pickuplongvalue: any;
  searchLoad:boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.deliverymanStampForm = this.fb.group({
      deliverymanstampname: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getListStampdocumenttrip();
    this.getListActiveStamp();
    this.getallActiveDeliveryman();
  }

  getListStampdocumenttrip() {
    this.searchLoad = true
    this.usertype = 'stamp';
    this.orderStatus = 'new,';
    this.apiService
      .getconsumerActiveTrip(this.usertype, this.orderStatus)
      .then((res) => {
        this.stampdocument = res?.data?.data ? res.data.data : [];
        this.stamptotalCount = res?.data.totalCount;
        // console.log(this.Consumeractivetrip.newAt);
        for(let value of this.stampdocument)  {
          value.disable = true;
        }
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

  getListActiveStamp() {
    this.usertype = 'stamp';
    this.orderStatus = 'orderAssigned,orderInProgress,orderPickedUped';
    this.apiService
      .getconsumerActiveTrip(this.usertype, this.orderStatus)
      .then((res) => {
        this.activestampdocument = res?.data?.data ? res.data.data : [];
        this.ActivestamptotalCount = res?.data?.totalCount;
      })
      .catch((err) => {});
  }
  // onSelectEvent(value: any) {
  //   console.log(value);
  //   this.acceptedbyId = value;
  // }

  onSelectionChange(value: any, pickup,i) {
    
    console.log(pickup[0]?.latitude, 'ryyyfki');
    this.pickuplatvalue = pickup[0]?.latitude;
    this.pickuplongvalue = pickup[0]?.longitude;
    this.acceptedbyId = value?._id;
    this.pick1 = value?.primaryAddress?.latitude;
    this.pick2 = value?.primaryAddress?.longitude;
    this.uneffectiveDistance(i);
  }
  getallActiveDeliveryman() {
    this.apiService
      .getListAllActiveDeliveryMan()
      .then((res) => {
        this.deliveryman = res?.data ? res.data : [];

        // this.deli_pickuplat = res?.data[0]?.primaryAddress?.latitude;
        // this.deli_pickuplong = res?.data[0]?.primaryAddress?.longitude;
        // console.log(this.deli_pickuplat);
        //  this.uneffectiveDistance();
      })
      .catch((err) => {});
  }
  uneffectiveDistance(i) {
    let payload = {
      pickUpLat: this?.pick1,
      pickUpLong: this?.pick2,
      dropLat: this?.pickuplatvalue,
      dropLong: this?.pickuplongvalue,
    };
    console.log(payload)
    this.apiService.uneffectiveDistance(payload).subscribe((res) => {
      this.uneffectiveDist = res?.data;
      if(res?.code == 200)  {
        // this.buttondis =false;
        this.stampdocument[i].disable = false;
      }  else  {
        // this.buttondis=true;
        this.stampdocument[i].disable =true;
      }
    }, err => {
      // this.buttondis=true;
      this.stampdocument[i].disable = true;
    });
  }
  assignstampcourier(i: any, type: any) {
    this.isSubmitted = true;
    // console.log(this.deliverymanStampForm.valid);
    // if (!this.deliverymanStampForm.valid) {
    //   this.deliverymanStampForm.get('deliverymanstampname')?.markAllAsTouched();
    //   return false;
    // } else {
    // if (this.uneffectiveDist)  {
      
      this.assign(i, type);
    // } 

    // this.deliverymanStampForm.reset();
    // }
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
          this.getListStampdocumenttrip();
          this.getListActiveStamp();
          this.getallActiveDeliveryman();
        },
        (err) => {
          this.toastr.error('Failed to update!!!');
        }
      );
    }
  }
  // get deliverymanname() {
  //   return this.deliverymanStampForm.get('deliverymanname')?.markAllAsTouched();
  // }
}
