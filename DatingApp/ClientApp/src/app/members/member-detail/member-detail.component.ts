import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Member } from "src/app/models/member";
import { MembersService } from "src/app/_services/members.service";
import { BrowserModule } from "@angular/platform-browser";
import {
  NgxGalleryAnimation,
  NgxGalleryComponent,
  NgxGalleryImage,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";
@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"],
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    private memberService: MembersService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [
      {
        width: "500px",
        height: "500px",
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  loadMember() {
    this.memberService
      .getMember(this._route.snapshot.paramMap.get("username")) //username je parametar u rutama u app.module members/:username
      .subscribe((member) => {
        this.member = member as Member;
        this.galleryImages = this.getImages();
      });
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    return imageUrls;
  }
}
