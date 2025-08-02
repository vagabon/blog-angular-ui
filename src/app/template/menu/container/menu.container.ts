import { Component, effect, inject, signal } from '@angular/core';
import { DsvItemComponent } from '@ng-vagabond-lab/ng-dsv/ds/item';
import { DsvMenuComponent, MenuService } from '@ng-vagabond-lab/ng-dsv/ds/menu';
import { AuthService, hasRole } from '@ng-vagabond-lab/ng-dsv/modules/auth';

@Component({
  selector: 'app-menu',
  imports: [DsvMenuComponent, DsvItemComponent],
  templateUrl: './menu.container.html',
  styleUrls: ['./menu.container.scss'],
})
export class MenuContainer {
  menuService = inject(MenuService);
  authService = inject(AuthService);

  isAdmin = signal<boolean>(false);

  menus = signal<{ text: string; icon: string; url: string }[]>([
    {
      text: 'Accueil',
      icon: 'home',
      url: '/home',
    },
    {
      text: 'News',
      icon: 'news',
      url: '/news',
    },
    {
      text: 'Blog',
      icon: 'blogger',
      url: '/blog',
    },
    {
      text: 'Tools',
      icon: 'tools',
      url: '/tools',
    },
    {
      text: 'Todolist',
      icon: 'file-list',
      url: '/todolist',
    },
  ]);

  constructor() {
    effect(() => {
      const isAdmin = hasRole(
        'ADMIN',
        this.authService.userConnected()?.user?.profiles,
      );
      this.isAdmin.set(isAdmin);
    });
  }

  closeMenu() {
    this.menuService.isMenuOpen() && this.menuService.toogleMenu();
  }
}
