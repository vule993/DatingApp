import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-test-error",
  templateUrl: "./test-error.component.html",
  styleUrls: ["./test-error.component.css"],
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl + "buggy/";
  validationErrors: string[] = [];
  constructor(private _http: HttpClient) {}

  ngOnInit(): void {}

  get404Error() {
    this._http.get(this.baseUrl + "not-found").subscribe(
      (response) => console.log(response),
      (err) => console.log(err)
    );
  }

  get400Error() {
    this._http.get(this.baseUrl + "bad-request").subscribe(
      (response) => console.log(response),
      (err) => console.log(err)
    );
  }

  get500Error() {
    this._http.get(this.baseUrl + "server-error").subscribe(
      (response) => console.log(response),
      (err) => console.log(err)
    );
  }

  get401Error() {
    this._http.get(this.baseUrl + "auth").subscribe(
      (response) => console.log(response),
      (err) => console.log(err)
    );
  }

  get400ValidationError() {
    this._http.post(environment.apiUrl + "account/login", {}).subscribe(
      (response) => console.log(response),
      (err) => {
        console.log(err);
        this.validationErrors = err;
      }
    );
  }
}
