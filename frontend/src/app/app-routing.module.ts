import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensorDataComponent } from 'src/components/sensor-data/sensor-data.component';
import { Views } from 'src/enums/Views.enum';

const routes: Routes = [
  { path: Views.MAIN, component: SensorDataComponent },
  { path: Views.ANY, redirectTo: Views.MAIN },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
