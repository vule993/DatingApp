import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { AccountService } from "../_services/account.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public accountService: AccountService) {}

  ngOnInit() {}

  login() {
    this.accountService.login(this.model).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => console.log(err)
    );
  }

  logout() {
    this.accountService.logout();
  }

  capitalizeFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }
}
