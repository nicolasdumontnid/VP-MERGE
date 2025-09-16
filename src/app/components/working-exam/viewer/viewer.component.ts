import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailedExam } from "../../../../models/detailed-exam.interface";

@Component({
  selector: "app-viewer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {
  @Input() exam: DetailedExam | null = null;

  zoomLevel = 100;

  listeOfViewers = [
    "radio3.png",
    "radio2.png",
    "radio1.png",
    "radio.png",
    "micro.png",
    "micro1.png",
  ];
  currentImageIndex = 0;

  constructor() {
    this.currentImageIndex = 1;
  }

  nextImage(): void {
    if (
      this.exam &&
      this.exam.elements &&
      this.currentImageIndex < this.exam.elements.length - 1
    ) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 25, 200);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 25, 25);
  }

  resetZoom(): void {
    this.zoomLevel = 100;
  }
}
