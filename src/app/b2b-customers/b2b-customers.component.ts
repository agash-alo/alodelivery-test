import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-b2b-customers',
  templateUrl: './b2b-customers.component.html',
  styleUrls: ['./b2b-customers.component.scss'],
})
export class B2bCustomersComponent implements OnInit {
  value: any;
  limit = 9;
  offset = 0;
  userType: any;
  b2bCustomerList: any = [];
  totalCount: any=0;
  // searchLoad : boolean = false;
  // b2b_id: any;
  userid: any;
  _id: any;
  userId: any;
  name: any;
  email: any; 
  verified: any = undefined;
  currentPage: number | undefined;


  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.getlistb2bcustomerDetails()
  }
  pageChange(e): void {
    this.offset = this.paginationOffset(e['pageIndex'], e['pageSize']);
    // console.log(this.offset, 'iiiii');
    this.getlistb2bcustomerDetails();
  }
  paginationOffset(currentPage, itemsPerPage): number {
    let offset = currentPage * itemsPerPage + 1;
    return (offset = offset < 0 ? offset : offset - 1);
  }
  // search filter
  searchCustomer(e: any) {
     this.offset = 0;
    this.value = e?.target?.value;
    this.currentPage = 0;
    // console.log(this.value);
    this.getlistb2bcustomerDetails();
  }
  getlistb2bcustomerDetails() {
    // this.searchLoad = true
    this.userType = 'masteragent,normaluser';
    this.apiService
      .getAllb2bCustomer(this.userType, this.limit, this.offset, this.value,this.verified)
      .then((res) => {
        this.b2bCustomerList = res.data?.data;
        this.totalCount = res?.data?.totalCount;

        console.log(this.b2bCustomerList);
        // this.searchLoad = false;
      })
      .catch((err) => {});
  }

  updateVerifyStatus(e) {

    
    let payload = {
      isVerified: 'true',
      name: e.name,
      email: e.email,
    };
    this.apiService.updateb2bcustomer(e._id,payload).subscribe((response) => {
      this.b2bCustomerList = response.data;
      console.log(this.b2bCustomerList.name)

      if (response.code == 200) {
        console.log('success');
        this.getlistb2bcustomerDetails();
      } else {
      }
    }),
      (err) => {};
    
  }

  viewAll() {
    this.limit = 9;
    this.offset = 0;
    this.verified = undefined;
    this.getlistb2bcustomerDetails();
  }
  verifiedCustomers() {
    this.limit=9;
    this.offset=0;
    this.verified = 'true';
    this.getlistb2bcustomerDetails();
  }
  unverifiedCustomers() {
    this.limit = 9;
    this.offset = 0;
    this.verified = 'false';
    this.getlistb2bcustomerDetails();
  }

  

  async downloadExport() {
    let base64String = "";
    // Assuming you have the Base64-encoded Excel file as a string:
    await this.apiService
      .getConsumerExport('masteragent,normaluser')
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
