import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewInit {
  currentUrl: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateActiveLink();
        });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activateMenuOnClick();
      this.updateActiveLink();
    }
  }

  updateActiveLink(): void {
    const path = this.router.url.split('/')[1];
    if (path) {
      const element = document.getElementById(path);
      if (element) {
        const activeElements = document.querySelectorAll('a.active');
        activeElements.forEach((activeElement) =>
          activeElement.classList.remove('active')
        );
        element.classList.add('active');
      }
    }
  }

  activateMenuOnClick(): void {
    const links = document.querySelectorAll('ul#sidebarnav a');
    links.forEach((link) => {
      this.renderer.listen(link, 'click', (event) => {
        event.preventDefault();
        const clickedElement = event.target as HTMLElement;

        if (!clickedElement.classList.contains('active')) {
          const parentUl = clickedElement.closest('ul');
          if (parentUl) {
            const activeLinks = parentUl.querySelectorAll('a.active');
            activeLinks.forEach((activeLink) =>
              activeLink.classList.remove('active')
            );
          }
          clickedElement.classList.add('active');
        }
      });
    });
  }
}
