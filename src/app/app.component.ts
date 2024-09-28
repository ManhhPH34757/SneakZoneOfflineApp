import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'SneakZoneOfflineApp';

  constructor(public router: Router) {}

  ngOnInit() {
    this.autoSideBar();
  }

  autoSideBar(): void {
    if (typeof window === 'undefined') {
      // If window is not defined, do nothing.
      return;
    }

    // Admin Panel settings

    //****************************
    /* This is for the mini-sidebar if width is less than 1170 */
    //****************************
    const setsidebartype = (): void => {
      const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width < 1199) {
        $('#main-wrapper').attr('data-sidebartype', 'mini-sidebar');
        $('#main-wrapper').addClass('mini-sidebar');
      } else {
        $('#main-wrapper').attr('data-sidebartype', 'full');
        $('#main-wrapper').removeClass('mini-sidebar');
      }
    };

    $(window).ready(setsidebartype);
    $(window).on('resize', setsidebartype);

    //****************************
    /* This is for sidebartoggler */
    //****************************
    $('.sidebartoggler').on('click', function () {
      $('#main-wrapper').toggleClass('mini-sidebar');
      if ($('#main-wrapper').hasClass('mini-sidebar')) {
        $('.sidebartoggler').prop('checked', true);
        $('#main-wrapper').attr('data-sidebartype', 'mini-sidebar');
      } else {
        $('.sidebartoggler').prop('checked', false);
        $('#main-wrapper').attr('data-sidebartype', 'full');
      }
    });

    $('.sidebartoggler').on('click', function () {
      $('#main-wrapper').toggleClass('show-sidebar');
    });
  }
}
