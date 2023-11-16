import { Component, Input, OnInit } from '@angular/core';
import { Views } from 'src/enums/Views.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { EventService, Events } from 'src/services/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private eventService: EventService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}
}
