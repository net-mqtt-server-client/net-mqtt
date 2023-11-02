import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EventBusService } from 'src/services/eventBus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  eventBusSub?: Subscription;

  constructor(
    private translateService: TranslateService,
    private config: PrimeNGConfig,
    private eventBusService: EventBusService,
    private router: Router
  ) {
    translateService.setDefaultLang('en');
    translateService.use('en');
    translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }

  ngOnInit(): void {}

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }
}
