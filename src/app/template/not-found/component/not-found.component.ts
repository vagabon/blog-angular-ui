import { Component } from "@angular/core";
import { DsvCardComponent } from "@ng-vagabond-lab/ng-dsv/ds/card";

@Component({
    selector: "app-not-found",
    imports: [DsvCardComponent],
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent { }