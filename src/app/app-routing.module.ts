import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //quando requisitarem dominio/categories [quem responderá é = #CotegoriesModule]
  {path: 'categories', loadChildren: './pages/categories/categories.module#CotegoriesModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
