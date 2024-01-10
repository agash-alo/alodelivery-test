import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss']
})
export class EnterOtpComponent implements OnInit {

  ImgForm:any;
  label = 'create';
  submitted=false;
  dummyImg: any;
  status:any;
  update=false;
  id:any;
  constructor(private router: Router, private activateRoute: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public _dialogRef: MatDialogRef<EnterOtpComponent>,
    private apiservice: ApiServiceService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.ImgForm = this.formBuilder.group({
      // Name: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      image: ['']
    });
   }

  ngOnInit(): void {
this.update=false;
    this.activateRoute.params.subscribe((params: any) => {
      console.log(params)
      if (params?.id) {
        this.label = "Update";
        // this.btnLabel = 'Update';
      }
    });
    if (this.data) {
      this.update=true;
      this.label = 'Update'
      this.id=this.data?._id;
      console.log(this.data)
      this.ImgForm.get('url')?.patchValue(this.data?.redirectUrl);
      this.ImgForm.get('image')?.patchValue(this.data?.name);
      this.imagelist = this.data.imageUrl;

    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ImgForm.controls;
  }
  create(id?:any) {
    this.submitted = true;
    if(this.ImgForm.valid){
      let payload = {
        name: 'banner',
        imageUrl: this.imagelist,
        redirectUrl: this.ImgForm?.value?.url,
        type: 'web',
        status: 'active',
      }
      this.apiservice.createBanner(payload).subscribe((res) => {
        // this.getBannerList(type);
        this.toastr.success(res?.message);
        this.ImgForm?.reset();
        this._dialogRef?.close(true);
        // this.searchLoad = false;

      });
    }else{
      alert();
    }
    
    }
     
    edit(item:any){
      this.submitted=true;
      if(this.ImgForm.valid){
        let payload = {
          name: 'banner',
          imageUrl: this.imagelist,
          redirectUrl: this.ImgForm?.value?.url,
          type: 'web',
          status: 'active',
          _id: this.id,
        }
        this.apiservice.updateBanner(payload, this.id).subscribe((res) => {
          // this.getBannerList(type);
          this.toastr.success(res?.message);
          this.ImgForm.reset()
          this._dialogRef.close(true);
          // this.searchLoad = false;

        });
      }else{
        alert()
      }
      
    }


  
  fileuploadstatus: boolean | undefined;
  url: any = ''

  onSelectFile(event: any,id?:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event?.target?.result;
      } 
      if(!id){
        this.uploadFile(event.target.files[0])
      }else{
        this.uploadFile(event?.target.file[0],id)
      }
      
    }
  }
  base64ImgArray: any = [];
  imagelist: any = undefined;
  async uploadFile(file: any,id?:any) {
    const formData1: any = new FormData();
    formData1.append('file', file);
    // await this.apiservice.UploadFile(formData1).subscribe(
    //   (res: any) => {
    //     if (res?.data?.imgUrl) {
    //       this.imagelist = res?.data?.imgUrl;
    //     }
    //   },
    //   (err: any) => { }
    // );
    await this.apiservice.uploadBanner(formData1,).subscribe(
      (res) => {
        if (
          res.status == true &&
          res?.data?.imgUrl &&
          res?.data?.imgUrl != ''
        ) {
          this.imagelist = res.data?.imgUrl;

        }
        // console.log(res)     

      },
      (err) => {
        this.fileuploadstatus = false;
      }
    );
  }

  // urlvalidateForm() {
  //   const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  //   this.ImgForm = this.fb.group({
  //     s_url: ['', [Validators.required, Validators.pattern(reg)]],
  //   });
  // }
}
