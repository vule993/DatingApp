import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "../_services/account.service";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Router } from "@angular/router";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private accountService: AccountService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this._fb.group({
      //prvi param je inicijalna vrednost, validators je angular validator/i
      gender: ["male"],
      username: ["", Validators.required],
      knownAs: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],

      password: [
        "",
        [Validators.required, Validators.maxLength(8), Validators.minLength(4)],
      ],
      confirmPassword: [
        "",
        [Validators.required, this.matchPasswordValues("password")],
      ],
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchPasswordValues(confirmPasswordControl: string): ValidatorFn {
    return (passwordControl: AbstractControl) => {
      return passwordControl?.value ===
        passwordControl?.parent?.controls[confirmPasswordControl].value
        ? null
        : { isMatching: true };
    };
  }

  register() {
    let a = this.registerForm.value;
    debugger;
    debugger;
    this.accountService.register(this.registerForm.value).subscribe(
      (user) => {
        this._router.navigateByUrl("/members");
      },
      (err) => {
        this.validationErrors = err;
      }
    );
  }

  cancel() {
    console.log("cancelled");
    this.cancelRegister.emit(false);
  }
}
