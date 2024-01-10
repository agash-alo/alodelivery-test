import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {


  feedback = [];
  searchLoad: any;
  limit: any=9;
  offset: any=0;
  value: any;
  totalCount: any;
  currentPage:any;
  constructor(private apiService: ApiServiceService,private dialog:MatDialog,) { }

  ngOnInit(): void {
    this.getListFeedBack();
  }
  pageChange(e: any): void {
    this.offset = this.paginationOffset(e['PageIndex'], e['PageSize'])
    this.getListFeedBack();

  }
  paginationOffset(currentPage, itemsPerPage): number {
    let offset = currentPage * itemsPerPage + 1;
    return (offset = offset < 0 ? offset : offset - 1);
  }
  getListFeedBack() {
    this.searchLoad = true
    this.apiService
      .getListFeedback(this.limit, this.offset)
      .then((res) => {
        this.feedback = res.data?.data;
        this.totalCount = res?.data?.totalCount;
        console.log(this.feedback);
        this.searchLoad = false;

      })
      .catch((err) => { });
  }
  updateStatus(i) {
    console.log(i);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { status: 'Update' },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let payload = {
        feedBackStatus: 'false',
      };
      if (result) {
        console.log(result);
        this.apiService
          .updateFeedBackList(i._id, payload)
          .subscribe((response) => {
            this.feedback = response.data;
            console.log(this.feedback);

            if (response.code == 200) {

              console.log('success');
              this.getListFeedBack();
            } else {

            }
          }),
          (err) => { };
      }
    });

  }

}
