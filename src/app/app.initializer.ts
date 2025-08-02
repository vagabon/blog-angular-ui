import { inject } from "@angular/core";
import { EnvironmentService } from "@ng-vagabond-lab/ng-dsv/environment";
import { AdminService } from "@ng-vagabond-lab/ng-dsv/modules/admin";
import { StorageService } from "@ng-vagabond-lab/ng-dsv/storage";
import { AdminConf } from "./conf/admin.conf";

export const initializeApp = () => {
    const adminService = inject(AdminService);
    const storageService = inject(StorageService);
    storageService.suffixe.set("storage");
    adminService.tabs.set(AdminConf);
    const environmentService = inject(EnvironmentService);
    return environmentService.loadEnv();
}
