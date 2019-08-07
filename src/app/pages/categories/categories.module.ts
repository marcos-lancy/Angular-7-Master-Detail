import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotegoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    CotegoriesRoutingModule
  ]
})
export class CotegoriesModule { }
