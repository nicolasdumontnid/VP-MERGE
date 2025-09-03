import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent {
  searchValue = '';
  isExpanded = false;
  isFocused = false;

  onFocus(): void {
    this.isExpanded = true;
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    if (!this.searchValue.trim()) {
      this.isExpanded = false;
    }
  }

  onInput(): void {
    if (this.searchValue.trim()) {
      this.isExpanded = true;
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.isExpanded = false;
  }

  onSearch(): void {
    if (this.searchValue.trim()) {
      console.log('Searching for:', this.searchValue);
      // Implement search logic here
    }
  }

  onMicrophone(): void {
    console.log('Microphone clicked');
    // Implement voice search logic here
  }

  onCamera(): void {
    console.log('Camera clicked');
    // Implement image search logic here
  }
}