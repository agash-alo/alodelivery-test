import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from '../service/api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.scss'],
})
export class CouriersComponent implements OnInit {
  courier_list;

  limit = 9;
  offset = 0;
  totalCount: any = 0;
  userType: any;
  value: any;
  // searchLoad :boolean = true;
  status = [
    { id: '1', isVerified: 'true', value: 'unverified' },
    { id: '2', isVerfied: 'false', value: 'verfied' },
  ];
  courierId: any;
  s: any;
  filte: any;
  Verified: any = undefined;
  currentPage: number | undefined;

  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private dialog: MatDialog,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.courierId = localStorage.getItem('courierViewId')
      ? JSON.parse(localStorage.getItem('courierViewId') || '')
      : '';
    console.log('hii');
    this.getListCourier();
  }

  getListCourier() {
    // this.searchLoad=true
    // this.spinner.show();
    this.userType = 'deliveryman';
    this.apiService
      .getAllCourierDetails(this.userType, this.limit, this.offset, this.value, this.Verified)
      .then((res) => {
        if (res.code == 200) {
          // this.spinner.hide();
          this.courier_list = [...res.data?.data];
          console.log(this.courier_list);
          this.totalCount = res?.data?.totalCount;
          // this.searchLoad = false;
        } else {
        }
      })
      .catch((err) => { });
  }

  pageChange(e): void {
    this.offset = this.paginationOffset(e['pageIndex'], e['pageSize']);
    console.log(this.offset, 'iiiii');
    this.getListCourier();
  }
  paginationOffset(currentPage, itemsPerPage): number {
    let offset = currentPage * itemsPerPage + 1;
    return (offset = offset < 0 ? offset : offset - 1);
  }

  searchCourier(e: any) {
    this.offset = 0;
    this.value = e?.target?.value;
    this.currentPage=0;
    this.getListCourier();
  }

  courierPayout(id: any) {
    console.log(id);
    // localStorage.setItem()
    this.router.navigate(['/courier-payout', { id: id }]);
  }
  generatePayout(id: any) {
    this.router.navigate(['/courier-generate-payout', { id: id }]);
  }
  searchtrip(id: any) {
    this.router.navigate(['/search']);
  }

  couriersView(i: any) {
    console.log(i);
    // console.log('this?.courier_list?.data?.[i]._id', this.courier_list?.[i]._id);
    localStorage.setItem('courierViewId', JSON.stringify(i));
    //  console.log(localStorage.getItem('courierViewId'), 'dfsfdff');
    this.router.navigate(['/courier-view']);
  }
  deletecourier(i: any) {
    console.log(i);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { status: 'Delete' },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // let payload = {
      //   demoStatus: 'closed',
      // };
      if (result) {
        console.log(result);
        this.apiService.deleteCourier(i._id).subscribe((res) => {
          this.getListCourier();
          // this.demoList = response.data;
          // console.log(this.demoList.name);

          // if (res.code == 200) {
          //   console.log('success');
          //   // this.getlistDemoRequest();
          // } else {
          // }
        }),
          (err) => { };
      }
    });
  }
  filteredData: any = [];
  viewAll() {
    this.limit = 9;
    this.offset = 0;
    this.Verified = undefined;
    this.getListCourier();
  }
  verifiedCouriers() {
    this.limit = 9;
    this.offset = 0;
    this.Verified = 'true';
    this.getListCourier();
  }
  unverifiedCouriers() {
    this.limit = 9;
    this.offset = 0;
    this.Verified = 'false';
    this.getListCourier();
  }

  async downloadExport() {
    let base64String = "";
    // Assuming you have the Base64-encoded Excel file as a string:
    await this.apiService
      .getConsumerExport('deliveryman')
      .then((res) => {
        base64String = res?.data;
      })
    // Convert the Base64 string to an ArrayBuffer
    const bytes = window.atob(base64String);
    const arrayBuffer = new ArrayBuffer(bytes.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }
    // Read the Excel file from the ArrayBuffer using XLSX
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    // Export the Excel file to a Blob object
    const excelBlob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // Save the Excel file using FileSaver.js
    saveAs(excelBlob, 'customer.xlsx');
  }



}
