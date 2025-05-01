import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContentAppComponent } from './content-app.component';

@NgModule({
  declarations: [
    ContentAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ContentAppComponent]
})
export class ContentAppModule { } 