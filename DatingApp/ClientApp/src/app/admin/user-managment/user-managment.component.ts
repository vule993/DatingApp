import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { RolesModalComponent } from "src/app/modals/roles-modal/roles-modal.component";
import { User } from "src/app/models/user";
import { AdminService } from "src/app/_services/admin.service";

@Component({
  selector: "app-user-managment",
  templateUrl: "./user-managment.component.html",
  styleUrls: ["./user-managment.component.css"],
})
export class UserManagmentComponent implements OnInit {
  users: Partial<User[]>;
  bsModalRef: BsModalRef;
  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe((users) => (this.users = users));
  }

  openRolesModal() {
    const initialState = {
      list: [
        "Open a modal with component",
        "Pass your data",
        "Do something else",
        "...",
      ],
      title: "Modal with component",
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent); //ovde nesto
    this.bsModalRef.content.closeBtnName = "Close";
  }
}
