import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { CounterComponent } from "./counter/counter.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavComponent } from "./nav/nav.component";
import { RegisterComponent } from "./register/register.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { SharedModule } from "./_modules/shared.module";
import { TestErrorComponent } from "./errors/test-error/test-error.component";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { MemberCardComponent } from "./members/member-card/member-card.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { PreventUnsavedChangesGuard } from "./_guards/prevent-unsaved-changes.guard";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from "./_interceptors/loading.interceptor";
import { PhotoEditorComponent } from "./members/photo-editor/photo-editor.component";
import { TextInputComponent } from "./_forms/text-input/text-input.component";
import { DateInputComponent } from "./_forms/date-input/date-input.component";
import { MemberMessagesComponent } from "./member-messages/member-messages.component";
import { MemberDetailedResolver } from "./_resolvers/member-detailed.resolver";
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { AdminGuard } from "./_guards/admin.guard";
import { HasRoleDirective } from "./_directives/has-role.directive";
import { UserManagmentComponent } from "./admin/user-managment/user-managment.component";
import { PhotoManagmentComponent } from "./admin/photo-managment/photo-managment.component";
import { RolesModalComponent } from "./modals/roles-modal/roles-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    NavComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    ListsComponent,
    MessagesComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DateInputComponent,
    MemberMessagesComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagmentComponent,
    PhotoManagmentComponent,
    RolesModalComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      //ovaj path sluzi da obuhvati sve putanje koje se ticu guard-ova, nema neku drugu semantiku (bar kolko do sada kontam)
      {
        path: "",
        runGuardsAndResolvers: "always", //da na svaku akciju proverava guard
        canActivate: [AuthGuard], //ko je zaduzen za resolve klikova
        children: [
          {
            path: "members",
            component: MemberListComponent,
          },
          {
            path: "members",
            component: MemberCardComponent,
          },
          {
            path: "members/:username",
            component: MemberDetailComponent,
            resolve: { member: MemberDetailedResolver },
          },
          {
            path: "member/edit",
            component: MemberEditComponent,
            canDeactivate: [PreventUnsavedChangesGuard],
          },
          { path: "lists", component: ListsComponent },
          { path: "messages", component: MessagesComponent },
          {
            path: "admin",
            component: AdminPanelComponent,
            canActivate: [AdminGuard],
          },
        ],
      },
      { path: "error-tests", component: TestErrorComponent },
      { path: "not-found", component: NotFoundComponent },
      { path: "server-error", component: ServerErrorComponent },
      { path: "**", component: NotFoundComponent, pathMatch: "full" }, //da match-uje sve ostale putanje, tipa ako neko unese nesto nasumicno ide na home (pathmatch mora jer ako se prepozna podstring
      //baca na tu stranu, pa ako se unese recimo https://localhost:5001/members/pera, vodice na members stranu jer je to najduze poklapanje sa ispravnom putanjom)
    ]),
    BrowserAnimationsModule,
    SharedModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true, //da zadrzimo i predefinisane, da ne koristimo samo nas
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true, //da zadrzimo i predefinisane, da ne koristimo samo nas
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true, //da zadrzimo i predefinisane, da ne koristimo samo nas
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
