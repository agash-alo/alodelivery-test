import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CouriersComponent } from '../couriers/couriers.component';
import { ApiServiceService } from '../service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-courier-view',
  templateUrl: './courier-view.component.html',
  styleUrls: ['./courier-view.component.scss'],
})
export class CourierViewComponent implements OnInit {
  courierId: any;
  courierdetails;
  type: any;
  fileuploadstatus: boolean | undefined;
  selectedfile: any;
  filebase: any;
  toastService: any;
  translate: any;
  documentList: any;
  documentUpload: any;
  element: any;
  imagelist: any = [];
  userId: any;
  isVerified: any;
  viewshow: boolean = false;
  viewshowcomplete: boolean = false;
  name: any;
  email: any;
  activetrip: any;
  completetrip: any;

  constructor(private router: Router, public toastr: ToastrService,
     private apiService: ApiServiceService,public spinner:NgxSpinnerService) {}

  ngOnInit(): void {
    // console.log(localStorage.getItem('courierViewId'),'dfsfdff')
    this.courierId = localStorage.getItem('courierViewId')
      ? JSON.parse(localStorage.getItem('courierViewId') || '')
      : '';

    console.log(this.courierId);
    // console.log(this.courierId.isVerified)
    this.getCourierView();
    this.loadActiveTrips();
    this.loadCompleteTrips();
    // this.verifystatus();
  }

  verifystatus() {
    let verified = {
      isVerified: 'true',
      name: this.courierdetails?.name,
      email: this.courierdetails?.email,
      // imgUrl: this.imagelist?.imgUrl,
    };

    this.apiService
      .updateCourierVerified(this.courierId, verified)
      .subscribe((response) => {
        if (response.code == 200) {
          console.log('success');
          this.getCourierView();
        } else {
        }
      }),
      (err) => {
        // this.fileuploadstatus = false;
      };

  }

  returntocourier() {
    this.router.navigate(['/couriers']);
  }

  getCourierView() {
    // console.log( "fdf",this.courierId[0]._id);
    this.spinner.show();
    this.apiService
      .getListCouriergetById(this.courierId)
      .then((res) => {
        this.spinner.hide();
        console.log(res);
        this.courierdetails = res.data;
        this.isVerified = this.courierdetails.isVerified;

        console.log(this.courierdetails);
      })
      .catch((err) => {});
  }

  async onChange(files) {
    this.fileuploadstatus = true;
    // this.imagelist.imgUrl.value = 'src/assets/images/custm-nbb/user_dummy.png';
    if (files && files.length > 0) {
      var file = files[0];
      let ext =
        file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) ||
        file.name;
      //.png,.jpg,.pdf,.doc,.docx,.jpeg
      // console.log("file.size",file.size)
      if (
        ext == 'png' ||
        ext == 'jpg' ||
        ext == 'pdf' ||
        ext == 'doc' ||
        ext == 'docx' ||
        ext == 'jpeg'
      ) {
        if (!(file.size > 2097152)) {
          // console.log(files)
          let x: any;
          var splitted;
          // this.urls ;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            let str: any = reader.result;
            splitted = str.split(',');
          };
          setTimeout(() => {
            this.uploadFile(files, files[0], splitted[1]);
            // console.log("Data", splitted)
            // this.urls.push(x)
          }, 1000);
          this.filebase = splitted;
          console.log(this.filebase);
          this.toastr.success('Uploaded successfully..!');
          this.getCourierView()
        } else {
          this.fileuploadstatus = false;
          this.toastr.error('Please Upload less 2mb file');
        }
      } else {
        this.toastr.error('Invalid file format');
      }
    }
  }
  async uploadFile(files, file, splitted) {
    const formData1: any = new FormData();

    formData1.append('file', file);

    await this.apiService.UploadFile(formData1).subscribe(
      (res) => {
        res.data;
        this.imagelist = res.data;
        this.getCourierView();
      },
      (err) => {
        this.fileuploadstatus = false;
      }
    );
    this.getCourierView();
  }

  moredetails(i: any) {
    // console.log('ooooooooooooo', i);
    this.router.navigate(['/trip_details', { id: i?._id }]);
  }

  loadActiveTrips() {
    this.viewshow = true;
    this.apiService
      .getlistCourierActiveTrip(this.courierId)
      .then((res) => {
        this.activetrip = res.data.data;
        console.log(this.activetrip);
      })
      .catch((err) => {});
  }
  loadCompleteTrips() {
    this.viewshowcomplete = true;
    this.apiService
      .getlistCourierCompleteTrip(this.courierId)
      .then((res) => {
        this.completetrip = res.data.data;
        console.log(this.completetrip);
      })
      .catch((err) => {});
  }

  load = false;
  loadActive() {
    this.load = true;
  }
  load1 = false;
  loadComplete() {
    this.load1 = true;
  }
}
