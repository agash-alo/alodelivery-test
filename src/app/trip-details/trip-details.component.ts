import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss'],
})
export class TripDetailsComponent implements OnInit {
  tripId: any;
  id: any;

  tripDetails: any;
  pickUpLat: any;
  pickuplong:any;
  pickuplat: any;
  courierId: any;
  uneffectiveDist: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiServiceService, private toastr: ToastrService,private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params)
      this.id = params?.id;
      this.courierId = params?.courierId;
    });
    this.getTripDetails(this.id);
  }
  getTripDetails(id: any) {
    this.apiService
      .getListTrip(id)
      .then((res) => {
        this.tripDetails = res.data.data[0];
        this.pickuplat = this.tripDetails?.pickupAddress[0]?.latitude;
        this.pickuplong = this.tripDetails?.pickupAddress[0]?.longitude;
        this.uneffectiveDistance();
      })
      .catch((err) => {});
  }
  uneffectiveDistance() {
    let payload = {
      pickUpLat: this.pickuplat,
      pickUpLong: this.pickuplong,
      userId: this.courierId,
      type: 'primary',
    };
    console.log(payload)
    
    this.apiService.uneffectiveDistance(payload).subscribe((res) => {
      this.uneffectiveDist = res?.data;
    });
  }

  canceltrip(){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { status: 'Cancel' },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      
      if (result) {
        console.log(result);
        let payload = {
          cancelledAt: new Date(),
          orderStatus: "cancelled"

        };
        this.apiService
          .cancelTrip(this.id, payload)
          .subscribe((response) => {
            if (response.code == 200) {
              this.toastr.success('Successfully Updated...!');
              this.getTripDetails(this.id);

            } else {
              
            }
          }),
          (err) => {
            // this.fileuploadstatus = false;
          };
      }
    });
  }
  deliveredOrder(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { status: 'Deliver' },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        console.log(result);
        let payload = {
          deliveredAt: new Date(),
          orderStatus: "delivered"

        };
        this.apiService
          .deliveredTrip(this.id, payload)
          .subscribe((response) => {
            if (response.code == 200) {
              this.toastr.success('Successfully Updated...!');
              this.getTripDetails(this.id);

            } else {

            }
          }),
          (err) => {
            // this.fileuploadstatus = false;
          };
      }
    });
  }




  
}
