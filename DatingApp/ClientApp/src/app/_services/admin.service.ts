import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  baseUrl = environment.apiUrl + "admin/";
  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    debugger;
    return this.http.get<Partial<User[]>>(this.baseUrl + "users-with-roles");
  }
}
