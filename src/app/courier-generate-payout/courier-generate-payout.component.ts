import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-courier-generate-payout',
  templateUrl: './courier-generate-payout.component.html',
  styleUrls: ['./courier-generate-payout.component.scss'],
})
export class CourierGeneratePayoutComponent implements OnInit {
  deliveryman: any;
  completetripdetails: any;
  courierId: any;
  id: any;
  paymentMode: any;
  paymentStatus: any;
  fromDate: any;
  toDate: any;
  searchtripDateForm: any;
  totalCount: any = 0;
  name: any;
  totalAmount: any;
  paymentstatus: any;
  _id: any;
  tripidarray: any =[];
  userId: any;
  paid:boolean=false;
  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.searchtripDateForm = this.formBuilder.group({
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
    });
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    this.getCompletedTripList();
  }

  getCompletedTripList() {
    this.paymentMode = 'cash on delivery,cash on pickup';
    this.paymentStatus = 'CODcompleted,COPcompleted';
    this.fromDate = this.searchtripDateForm.controls['fromdate'].value;
    this.toDate = this.searchtripDateForm.controls['todate'].value;
    // console.log(this.fromDate);
    // console.log(this.toDate);
    this.apiService
      .getCompletedTripList(
        this.id,
        this.paymentMode,
        this.paymentStatus,
        this.fromDate,
        this.toDate
      )
      .then((res) => {
        this.completetripdetails = res?.data?.data ? res.data.data : [];
        this.totalCount = res.data.totalCount;
        console.log(res.data.data);

        for (let i of res.data.data) {
          var items = i._id;
          this.tripidarray.push(items);
        }
        console.log(this.tripidarray);
        this.totalAmount = this.completetripdetails.reduce(
          (accumulator, currentItem) => {
            return accumulator + currentItem.amountDetails.finalAmount;
          },
          0
        );
        console.log(this.totalAmount);
        console.log(this.completetripdetails?.length);
      })
      .catch((err) => {});
  }

  moredetails(i: any) {
    this.router.navigate(['/trip_details', { id: i?._id }]);
  }

  updatePaymentStatus() {
    let payload = {
      orderIds: this.tripidarray,
      noOfOrders: this.totalCount,
      totalAmount: this.totalAmount,
      paidById: this.id,
      receivedById: this.userId,
      paid:true
    };
    
    this.apiService.updatePaymentStatus(payload).subscribe((response) => {
      this.paymentstatus = response.data;
      console.log(this.paymentstatus);
      if (response.code == 200) {
        console.log('success');
        this.getCompletedTripList();
      } else {
      }
    }),
      (err) => {};
  }
}
