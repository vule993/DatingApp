import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule, ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(), //forRoot() znaci da ce modul da se load-uje kada se pokrene app, nije lazy-load
    ToastrModule.forRoot({ positionClass: "toast-bottom-right" }),
  ],
  //da bi sve bilo vidljivo u aplikaciji moramo i exportovati module koje smo ovde prebacili
  exports: [BsDropdownModule, ToastrModule],
})
export class SharedModule {}
