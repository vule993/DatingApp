import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "../_services/account.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(
    private accountService: AccountService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe(
      (user) => {
        console.log(user);
        this.cancel();
      },
      (err) => {
        console.log(err);
        debugger;
        if (typeof err.error == "string") {
          this._toastr.error(err.error);
        } else {
          for (const property in err.error.errors) {
            this._toastr.error(err.error.errors[property]);
          }
        }
      }
    );
  }
  cancel() {
    console.log("cancelled");
    this.cancelRegister.emit(false);
  }
}
