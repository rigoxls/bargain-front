import {Component, OnInit, OnDestroy} from '@angular/core';
import {ClientService} from './shared/client.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    {data: [3, 1, 0], label: 'Cotizaciones realizadas'}
  ];

  public chartLabels: Array<any> = ['Realizadas', 'Pendientes', 'Resueltas'];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  constructor(
    public requestService: ClientService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {
      this.getRequests(this.user.id);
    }
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {
          this.getRequests(this.user.id);
        }
      }
    );
  }

  async getRequests(userId: number) {
    this.requests = await this.requestService.getRequests(userId);
    let pending = 0;
    let resolved = 0;
    this.requests.forEach(req => {
      if (req.status === 'PENDING') {
        pending++;
      } else {
        resolved++;
      }
    });

    this.chartDatasets = [
      {data: [this.requests.length, pending, resolved, 0], label: 'Cotizaciones por cliente'}
    ];
  }

  feedCart(requestId) {
    this.requestService.feedCart(requestId);
    this.router.navigate(['/client/client/true']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
