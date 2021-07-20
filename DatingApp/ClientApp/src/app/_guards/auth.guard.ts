import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService } from "../_services/account.service";

@Injectable({
  providedIn: "root",
})
//guards se automatski subscribe-uju na sve observables, pa samim tim i na user-a koji je ulogovan
export class AuthGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> {
    return this._accountService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        this._toastr.error("You shall not paaaaas!!!");
      })
    );
  }
}
