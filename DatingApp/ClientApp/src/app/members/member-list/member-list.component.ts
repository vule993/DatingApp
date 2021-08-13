import { Component, OnInit } from "@angular/core";
import { Member } from "src/app/models/member";
import { MembersService } from "src/app/_services/members.service";
import { Pagination } from "src/app/models/pagination";
import { UserParams } from "src/app/models/userParams";
import { AccountService } from "src/app/_services/account.service";
import { User } from "src/app/models/user";
import { take } from "rxjs/operators";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"],
})
export class MemberListComponent implements OnInit {
  members: Member[]; //ovde se vraca tekuca starna korisnika
  pagination: Pagination; //ovo mi treba kako bih iscrtao paginaciju
  userParams: UserParams;
  user: User;
  genderList = [
    { value: "male", display: "Males" },
    { value: "female", display: "Females" },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  //na osnovu rednog broja strane i koliko rekorda se vraca ucitavam korisnike
  loadMembers() {
    this.memberService.setUserParams(this.userParams);

    this.memberService.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result; //ucitavam korisnike
      this.pagination = response.pagination; //popunjavam parametre
    });
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
