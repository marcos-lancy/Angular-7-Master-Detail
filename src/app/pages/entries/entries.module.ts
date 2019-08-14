import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryListComponent } from "./entry-list/entry-list.component";
import { EntriesRoutingModule } from './entries-routing.module';

@NgModule({
  declarations: [
    EntryListComponent
  ],
  imports: [
    CommonModule,
    EntriesRoutingModule
    
  ]
})
export class EntriesModule { }
