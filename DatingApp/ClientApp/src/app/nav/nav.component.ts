import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { User } from "../models/user";
import { AccountService } from "../_services/account.service";
import { MembersService } from "../_services/members.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    public accountService: AccountService,
    public memberService: MembersService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {}

  login() {
    this.accountService.login(this.model).subscribe(
      (data) => {
        this._router.navigateByUrl("/members");
        this.memberService.setCurrentUser();
      },
      (err) => {
        console.log(err);
        this._toastr.error(err.error);
      }
    );
  }

  logout() {
    this.accountService.logout();
    this._router.navigateByUrl("/");
  }

  capitalizeFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }
}
