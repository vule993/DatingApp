import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  baseUrl = "https://localhost:5001/api/account/";
  constructor(private _http: HttpClient) {}
  login(model) {
    return this._http.post(this.baseUrl + "login", model);
  }
}
