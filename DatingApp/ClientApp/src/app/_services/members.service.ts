import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Member } from "../models/member";
import { PaginatedResult } from "../models/pagination";
import { UserParams } from "../models/userParams";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  baseUrl = environment.apiUrl + "users";
  members: Member[] = [];

  constructor(private _http: HttpClient) {}

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params.append("minAge", userParams.minAge.toString());
    params.append("maxAge", userParams.maxAge.toString());
    params.append("gender", userParams.gender.toString());

    return this.getPaginatedResults<Member[]>(this.baseUrl, params);
  }

  getMember(username: string) {
    const member = this.members.find((x) => x.username === username);
    if (member !== undefined) {
      return of(member);
    }
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

  private getPaginatedResults<T>(url, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this._http.get<T>(url, { observe: "response", params }).pipe(
      map((response) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") !== null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());

    return params;
  }
}
