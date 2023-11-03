import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FormBuilder, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  alltripdetails: any;
  totalCount: any;
  value: any;
  tripdetail: any;
  orderCode: any;
  offset = 0;
  limit = 9;
  fromdate: any;
  todate: any;
  tripId: any;
  searchtripidForm: any;
  searchtripDateForm: any;
  fromDate: any;
  toDate: any;
  yesterday = new Date();
  searchLoad: boolean = false;
  currentPage: number | undefined;
  customerList:any;
  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService
  ) {
    this.searchtripidForm = this.formBuilder.group({
      tripid: ['', [Validators.required]],
    });
    this.searchtripDateForm = this.formBuilder.group({
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getListAllTrip();
    this.getListbyB2bcustomer();
  }
  getListAllTrip() {
    this.searchLoad=true;
    this.apiService
      .getListAllTrip(this.limit, this.offset)
      .then((res) => {
        this.alltripdetails = res?.data?.data ? res.data.data : [];
        this.totalCount = res?.data?.totalCount;
        this.searchLoad = false;
        console.log(this.alltripdetails);
      })
      .catch((err) => { });
  }

  // searchcustomers(e: any) {
  //   this.value = e?.target?.value;
  // }
  pageChange(e: any): void {
    this.offset = this.paginationOffset(e['pageIndex'], e['pageSize']);
    // this.getListAllTrip();
    this.searchTripByDate();
  }
  paginationOffset(currentPage:any, itemsPerPage:any): number {
    let offset = currentPage * itemsPerPage + 1;
    return (offset = offset < 0 ? offset : offset - 1);
  }
  subadminId:any=[''];
  onSelectionChange(i:any){
    console.log(i,"oooooooooooooooooooooo")
    this.subadminId=i?._id
    this.apiService.searchBySubAdmin(this.limit,this.offset,i?._id).then((res=>{
    if(res.code=200){
      this.alltripdetails=res?.data?.data;
      this.totalCount=res?.data?.totalCount;
      
    }
    }))

  }
  
  // search filter
  // searchCustomer(e: any) {
  //   this.offset = 0;
  //   this.value = e?.target?.value;
  //   // this.getlistDemoRequest();
  // }
  // searchFromDate(e: any) {
  //   this.fromdate = e?.target?.value;
  // }
  // searchTodate(e: any) {
  //   this.todate = e?.target?.value;
  // }

  getListbyB2bcustomer() {

    this.apiService
      .searchFilterByb2bcustomer()
      .then((res) => {
        if(res.status=200){
          this.customerList = res?.data ? res?.data:[];
          console.log(this.customerList, "222222222222222");
        }
    
      })
      .catch((err) => { });
  }


  searchTrip() {
    this.offset = 0;
    this.tripId = this.searchtripidForm?.controls['tripid']?.value;
    this.apiService
      .searchFilterByTripId(this.tripId,this.limit, this.offset)
      .then((res) => {
        console.log(res);
        this.alltripdetails = res?.data?.data ? res.data.data : [];
        this.totalCount = res?.data?.totalCount;
      })
      .catch((err) => {
        this.toastr.error(
          err?.error?.message ? err.error.message : 'invalid Input'
        );
        console.log(err);
      });
  }

  searchTripByDate() {

    this.tripId = this.searchtripidForm?.controls['tripid'].value;
    this.fromDate = this.searchtripDateForm?.controls['fromdate'].value;
    this.toDate = this.searchtripDateForm?.controls['todate'].value;
    console.log(this.tripId);
    console.log(this.fromDate);
    console.log(this.toDate);

    this.apiService
      .searchFilterByDate(
        this.tripId,
        this.subadminId,
        this.fromDate,
        this.toDate,
        this.limit,
        this.offset
      )
      .then((res) => {
        console.log(res);
        this.alltripdetails = res?.data?.data ? res.data.data : [];
        this.totalCount = res?.data?.totalCount;
        if (res == 200) {
          this.searchtripDateForm.reset();
          this.getListAllTrip();
        }
      })
      .catch((err) => { });
  }

  moredetails(i: any) {
    console.log(i);
    this.router.navigate(['/trip_details', { id: i?._id }]);
  }

  async downloadExport() {
    let base64String = "";
    // Assuming you have the Base64-encoded Excel file as a string:
    await this.apiService
      .getOrderExport(this.subadminId,this.fromDate,this.toDate)
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
    saveAs(excelBlob, 'orderList.xlsx');
  }




}
