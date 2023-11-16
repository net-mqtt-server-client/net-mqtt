import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonsModule } from 'src/components/commons/commons.module';
import { PrimeNgModule } from './primeng.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';

import { HeaderComponent } from 'src/components/header/header.component';
import { FooterComponent } from 'src/components/footer/footer.component';
import { QuillModule } from 'ngx-quill';
import { SensorDataComponent } from 'src/components/sensor-data/sensor-data.component';
import { SensorDataFilterComponent } from 'src/components/sensor-data/sensor-data-filter/sensor-data-filter.component';

@NgModule({
    declarations: [
        AppComponent,
        SensorDataComponent,
        SensorDataFilterComponent,
        HeaderComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        PrimeNgModule,
        InputSwitchModule,
        HttpClientModule,
        CommonsModule,
        QuillModule.forRoot({
            customOptions: [
                {
                    import: 'formats/font',
                    whitelist: [
                        'mirza',
                        'roboto',
                        'aref',
                        'serif',
                        'sansserif',
                        'monospace',
                    ],
                },
            ],
            modules: {
                syntax: false,
                toolbar: [
                    [
                        'bold',
                        'italic',
                        'strike',
                        { header: 1 },
                        { header: 2 },
                        { list: 'ordered' },
                        { list: 'bullet' },
                    ],
                ],
            },
            placeholder: '',
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ReactiveFormsModule,
        FormsModule,
        PanelModule,
        InplaceModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
