import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseAppScrollComponent } from '@ng-vagabond-lab/ng-dsv/base';
import { ButtonScrollTopComponent } from '@ng-vagabond-lab/ng-dsv/ds/button';
import { DsvContainerComponent } from '@ng-vagabond-lab/ng-dsv/ds/container';
import { LinearProgressComponent } from '@ng-vagabond-lab/ng-dsv/ds/linear-progress';
import { DsvThemeComponent } from '@ng-vagabond-lab/ng-dsv/ds/theme';
import { DsvToastComponent } from '@ng-vagabond-lab/ng-dsv/ds/toast';
import { HeaderContainer } from './template/header/container/header.container';
import { MenuContainer } from './template/menu/container/menu.container';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DsvThemeComponent,
    LinearProgressComponent,
    DsvContainerComponent,
    MenuContainer,
    DsvToastComponent,
    MenuContainer,
    ButtonScrollTopComponent,
    HeaderContainer,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent extends BaseAppScrollComponent {

  theme = {
    primary: '#ff8307',
  };
}
