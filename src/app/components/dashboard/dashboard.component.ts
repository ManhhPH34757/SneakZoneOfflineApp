import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProductDetailsService } from '../../services/product-details.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent 
//implements OnInit 
{
  chart: any;
  isMonthlyVisible: boolean = false;
  activeTab: string = 'revenue';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleButtons() {
    this.isMonthlyVisible = !this.isMonthlyVisible;
  }

  topProductsPriod: any[] = [];
  revenuePriod: any[] = [];

  constructor(private productService: ProductDetailsService) {}

  // loadTopProducts(period: string) {
  //   this.productService.findTop5ProductsByPeriod(period).subscribe(
  //     (data) => {
  //       this.topProductsPriod = data.result;
  //     },
  //     (error) => {
  //       console.error('Error fetching top products:', error);
  //     }
  //   );
  // }

  // loadRevenuePriod(period: string) {
  //   this.productService.findRevenueByPeriod(period).subscribe(
  //     (data) => {
  //       this.revenuePriod = data.result;
  //     },
  //     (error) => {
  //       console.error('Error fetching revenue products:', error);
  //     }
  //   );
  // }

  // async ngOnInit() {
  //   Chart.register(...registerables);
  //   await this.loadTopProducts('MONTH');
  //   await this.loadRevenuePriod('MONTH');
  //   if (this.revenuePriod.length > 0) {
  //     await this.createRevenueChart('MONTH');
  //   }
  // }

  createRevenueChart(period: string) {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    let labels: string[] = [];
    let data: number[] = [];

    if (Array.isArray(this.revenuePriod) && this.revenuePriod.length > 0) {
      labels = this.revenuePriod.map((item) => item.period);
      data = this.revenuePriod.map((item) => item.total_revenue);
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label:
              period === 'MONTH'
                ? 'Monthly Revenue Chart'
                : 'Annual Revenue Chart',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  // async switchToMonthly() {
  //   this.toggleButtons();
  //   this.loadTopProducts('month');
  //   await this.loadRevenuePriod('MONTH');
  //   await this.createRevenueChart('MONTH');
  // }

  // async switchToYearly() {
  //   this.toggleButtons();
  //   this.loadTopProducts('YEAR');
  //   await this.loadRevenuePriod('YEAR');
  //   await this.createRevenueChart('YEAR');
  // }
}
