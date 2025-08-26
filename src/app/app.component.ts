import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Medical Application';
  currentBreadcrumb = 'Dashboard';
  isManagementDropdownOpen = false;
  isMenuDropdownOpen = false;

  toggleManagementDropdown(): void {
    this.isManagementDropdownOpen = !this.isManagementDropdownOpen;
    this.isMenuDropdownOpen = false;
  }

  toggleMenuDropdown(): void {
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
    this.isManagementDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.isManagementDropdownOpen = false;
    this.isMenuDropdownOpen = false;
  }

  public setBreadcrumb(breadcrumb: string): void {
    this.currentBreadcrumb = breadcrumb;
    this.closeDropdowns();
  }

  logout(): void {
    console.log('Logout clicked');
    this.closeDropdowns();
  }
}