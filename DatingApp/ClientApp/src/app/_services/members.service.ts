import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Member } from "../models/member";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  baseUrl = environment.apiUrl + "users";
  constructor(private _http: HttpClient) {}

  getMembers() {
    return this._http.get<Member[]>(this.baseUrl);
  }
  getMember(username: string) {
    return this._http.get(this.baseUrl);
  }
}
