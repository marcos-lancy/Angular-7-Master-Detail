import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //quando requisitarem dominio/cateogories [quem responderá é = #CotegoriesModule]
  {path: 'cateogories', loadChildren: './pages/categories/categories.module#CotegoriesModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
