import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { PresenceService } from "./presence.service";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  baseUrl = environment.apiUrl + "account/";
  private _currentUserSource = new ReplaySubject<User>(1); //buffer koji cuva u ovom slucaju 1, poslednju vrednost ulogovanog user-a (observable collection)=> ili null ili user
  currentUser$ = this._currentUserSource.asObservable();

  constructor(
    private _http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this._http.post(this.baseUrl + "login", model).pipe(
      //rxJS
      map((response: User) => {
        const user = response as User;
        if (user) {
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;

    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

    localStorage.setItem("user", JSON.stringify(user));
    this._currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this._currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  register(model: any) {
    return this._http.post(this.baseUrl + "register", model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
          return user;
        }
      })
    );
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split(".")[1]));
  }
}
