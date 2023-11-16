import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ListboxModule } from 'primeng/listbox';
import { PasswordModule } from 'primeng/password';

@NgModule({
    imports: [],
    exports: [
        InputTextModule,
        DialogModule,
        AccordionModule,
        ToolbarModule,
        ConfirmDialogModule,
        MenuModule,
        MultiSelectModule,
        RatingModule,
        SkeletonModule,
        ChartModule,
        InputNumberModule,
        CalendarModule,
        OverlayPanelModule,
        EditorModule,
        InputTextareaModule,
        DividerModule,
        RadioButtonModule,
        SplitButtonModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        CardModule,
        DataViewModule,
        TagModule,
        GalleriaModule,
        TooltipModule,
        ListboxModule,
        PasswordModule,
    ],
    providers: [ConfirmationService],
})
export class PrimeNgModule {}
