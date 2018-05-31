## @peacockng/components
Peacock NG : UI Components for Angular 
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

Once you have installed the library, you can import it in any Angular application:

1 - Import PeacockNg Style in `.angular-cli.json`:


```json
....
 "styles": [
        "../node_modules/bootstrap/dist/css/bootstrap.css",
        "../node_modules/@peacockng/components/css/style.css",
        ....
      ],
...
```

2- In your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import UI componenets modules from @peacockng/components
import { LoaderModule } from '@peacockng/components';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the module as an import
    LoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

3- Once the module is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<pe-basic-loader [visible]="true"
                 [loadingLabel]="'LOADING'"></pe-basic-loader>
```

## Development

To generate all `*.js`, `*.d.ts`, `*.css` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## Consuming in a local application during development
To consume the library in a local application in development mode, you can follow the following steps:

1- Compile the PeacockNg components library
```bash
$ npm run build
```
2- Create a symlink in the global node_modules directory to the dist directory.
```bash
$ cd dist
$ npm link
```

3- Create a new Angular app. Let's assume you use angular-cli:
```bash
$ cd /your-projects-path
$ ng new my-app
```

4- Navigate to the my-app directory:
```bash
$ cd my-app
```

5- From the my-app directory, link the global sample-library directory to node_modules of the my-app directory:
```bash
$ npm link sample-library
```

6- Import modules and `consuming`

7- Run the server
```bash
$ ng serve --preserve-symlinks
```
To make sure the consuming application searches for the peer dependencies in the application's node_modules directory.


## License

MIT © [Sabri BAHRINI](mailto:sabri.bahrini@gmail.com)
