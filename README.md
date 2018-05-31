# @peacockng/components

## Installation

To install this library, run:

```bash
$ npm install bootstrap@4.1.1 --save
$ npm install ngx-pagination@3.1.1 --save
```

```bash
$ npm install @peacockng/components --save
```

## Consuming

Once you have installed the library, you can import your library in any Angular application:



In your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { LoaderModule } from '@peacockng/components';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<pe-basic-loader [visible]="true"
                 [loadingLabel]="'LOADING'"></pe-basic-loader>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Sabri BAHRINI](mailto:sabri.bahrini@gmail.com)
