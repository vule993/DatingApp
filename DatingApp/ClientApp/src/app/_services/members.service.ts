import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Member } from "../models/member";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  baseUrl = environment.apiUrl + "users";
  members: Member[] = [];

  constructor(private _http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) {
      return of(this.members); //of vraca kao observable
    }
    return this._http.get<Member[]>(this.baseUrl).pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
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
}
