import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../../models/detailed-exam.interface';
import { ExamElement } from '../../../../models/exam-element.interface';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {
  @Input() exam: DetailedExam | null = null;

  currentElementIndex = 0;
  zoomLevel = 100;
  isFullscreen = false;

  get currentElement(): ExamElement | null {
    if (!this.exam || !this.exam.elements.length) return null;
    return this.exam.elements[this.currentElementIndex];
  }

  get totalElements(): number {
    return this.exam?.elements.length || 0;
  }

  previousElement(): void {
    if (this.currentElementIndex > 0) {
      this.currentElementIndex--;
    }
  }

  nextElement(): void {
    if (this.currentElementIndex < this.totalElements - 1) {
      this.currentElementIndex++;
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < 300) {
      this.zoomLevel += 25;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 25) {
      this.zoomLevel -= 25;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 100;
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  selectElement(index: number): void {
    this.currentElementIndex = index;
  }
}