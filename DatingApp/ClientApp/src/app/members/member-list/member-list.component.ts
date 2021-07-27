import { Component, OnInit } from "@angular/core";
import { Member } from "src/app/models/member";
import { MembersService } from "src/app/_services/members.service";
import { BrowserModule } from "@angular/platform-browser";
import { Observable } from "rxjs";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"],
})
export class MemberListComponent implements OnInit {
  members: Observable<Member[]>;
  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.members = this.memberService.getMembers();
  }
}
