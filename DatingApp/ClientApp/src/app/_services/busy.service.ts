import { Injectable } from "@angular/core";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private _spiner: NgxSpinnerService) {}

  busy() {
    debugger;
    this.busyRequestCount++;
    this._spiner.show(undefined, {
      type: "line-scale-party",
      bdColor: "rgba(255,255,255,0)",
      color: "#333333",
    });
  }

  idle() {
    debugger;
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this._spiner.hide();
    }
  }
}
