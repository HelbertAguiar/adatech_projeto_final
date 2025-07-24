import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaContainer } from './components/agenda-container/agenda-container';

const routes: Routes = [
  {
    path: '',
    component: AgendaContainer
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
