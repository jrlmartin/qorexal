import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ContentAppModule } from './app/content-app.module';

platformBrowserDynamic().bootstrapModule(ContentAppModule)
  .catch(err => console.error(err)); 