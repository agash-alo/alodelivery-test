import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';


import { MenuItems } from '../../../shared/menu-items/menu-items';

import { Router } from '@angular/router';


@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: []
})

export class VerticalAppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  status = true;

  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;

  setClickedRow(i: number, j: number) {
    this.parentIndex = i;
    this.childIndex = j;
  }
  subclickEvent() {
    this.status = true;
  }
  scrollToTop() {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0
    });
  }
  userInfo:any;
  adminMenu:boolean = false;
  menutype:any ='Not Admin';
  roles:any = [];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    
    media: MediaMatcher,
    private router: Router,
    public menuItems: MenuItems,
    
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') as never);
    let userrole = this.userInfo?.role;
    // userrole.forEach((d,i)=>{
    //   this.roles.push(d.role_name);
    //   // if(d.role_name == 'Admin user' && d.id == 4){
    //   //   this.adminMenu = true;
    //   //   this.menutype = 'Admin';
    //   // }else if(d.role_name == 'User Manager' && d.id == 1){
    //   //   this.adminMenu = true;
    //   //   this.menutype = 'Usermanagement';
    //   // }
    // });

    if(this.roles.includes('Admin user')){
        this.adminMenu = true;
        this.menutype = 'Admin';
    }else if(this.roles.includes('User Manager')){
        this.adminMenu = true;
        this.menutype = 'Usermanagement';
    }
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  logout(){
    // this.userServ.userLogout();
    // this.authServ.logOut().then(resp => {
    //   // console.log('FROM LOGOUT =>', resp);
    //   if (resp) {
    //     this.router.navigate(['login']);
    //   }
    // }).catch(err => {
    //   //console.log('FROM LOGOUT ERR =>', err);
    //   this.router.navigate(['login']);
    // });
  }
}
