import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { map, take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Member } from "../models/member";
import { PaginatedResult } from "../models/pagination";
import { User } from "../models/user";
import { UserParams } from "../models/userParams";
import { AccountService } from "./account.service";
import { getPaginatedResult, getPaginationHeaders } from "./paginationHelper";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  baseUrl = environment.apiUrl + "users";
  likesUrl = environment.apiUrl + "likes";
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(
    private _http: HttpClient,
    private accountService: AccountService
  ) {
    this.setCurrentUser();
  }

  setCurrentUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    debugger;
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join("-"));
    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );
    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl, params, this._http).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join("-"), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.result), [])
      .find((member: Member) => member.username === username);

    if (member) return of(member);

    return this._http.get<Member>(this.baseUrl + "/" + username);
  }
  updateMember(member: Member) {
    return this._http.put(this.baseUrl, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this._http.put(this.baseUrl + "/set-main-photo/" + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this._http.delete(this.baseUrl + "/delete-photo/" + photoId);
  }

  addLike(username: string) {
    return this._http.post(this.likesUrl + "/" + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("predicate", predicate);

    return getPaginatedResult<Partial<Member[]>>(
      this.likesUrl,
      params,
      this._http
    );
  }
}
