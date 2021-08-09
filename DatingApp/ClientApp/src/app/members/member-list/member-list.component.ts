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

  constructor(
    private memberService: MembersService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  //na osnovu rednog broja strane i koliko rekorda se vraca ucitavam korisnike
  loadMembers() {
    this.memberService.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result; //ucitavam korisnike
      this.pagination = response.pagination; //popunjavam parametre
    });
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
}
