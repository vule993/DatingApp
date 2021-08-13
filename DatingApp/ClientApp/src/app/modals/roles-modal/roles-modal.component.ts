import { Component, Input, OnInit } from "@angular/core";
import { EventEmitter } from "events";
import { BsModalRef } from "ngx-bootstrap/modal";
import { User } from "src/app/models/user";

@Component({
  selector: "app-roles-modal",
  templateUrl: "./roles-modal.component.html",
  styleUrls: ["./roles-modal.component.css"],
})
export class RolesModalComponent implements OnInit {
  @Input() updateSelectedRoles = new EventEmitter();
  user: User;
  roles: any[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
  updateRoles() {
    //this.updateSelectedRoles.emit(this.roles); //ovde problem
    this.bsModalRef.hide();
  }
}
