import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
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
          { path: "members/:id", component: MemberDetailComponent },
          { path: "lists", component: ListsComponent },
          { path: "messages", component: MessagesComponent },
        ],
      },

      { path: "**", component: HomeComponent, pathMatch: "full" }, //da match-uje sve ostale putanje, tipa ako neko unese nesto nasumicno ide na home (pathmatch mora jer ako se prepozna podstring
      //baca na tu stranu, pa ako se unese recimo https://localhost:5001/members/pera, vodice na members stranu jer je to najduze poklapanje sa ispravnom putanjom)
    ]),
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
