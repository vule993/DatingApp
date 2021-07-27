import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
          { path: "members/:username", component: MemberDetailComponent },
          { path: "lists", component: ListsComponent },
          { path: "messages", component: MessagesComponent },
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
