import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    isDarkTheme = false;

    toggleTheme(): void {
        //this.isDarkTheme = !this.isDarkTheme;
    }
}
