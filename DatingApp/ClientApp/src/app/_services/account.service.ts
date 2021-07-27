import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { loadConfigurationFromPath } from "tslint/lib/configuration";
import { User } from "../models/user";
@Injectable({
  providedIn: "root",
})
export class AccountService {
  baseUrl = environment.apiUrl + "account/";
  private _currentUserSource = new ReplaySubject<User>(1); //buffer koji cuva u ovom slucaju 1, poslednju vrednost ulogovanog user-a (observable collection)=> ili null ili user
  currentUser$ = this._currentUserSource.asObservable();

  constructor(private _http: HttpClient) {}

  login(model: any) {
    return this._http.post(this.baseUrl + "login", model).pipe(
      //rxJS
      map((response: User) => {
        const user = response as User;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    this._currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this._currentUserSource.next(null);
  }

  register(model: any) {
    return this._http.post(this.baseUrl + "register", model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this._currentUserSource.next(user);
          return user;
        }
      })
    );
  }
}
