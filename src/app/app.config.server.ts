import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import {} from '@angular/platform-server';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { EnvironmentDto, SSR_CONFIG } from '@ng-vagabond-lab/ng-dsv/environment';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const productionPath = join(process.cwd(), 'browser/config.json');
const localDevPath = join(process.cwd(), 'public/config.json');

const configPath = existsSync(productionPath) ? productionPath : localDevPath;

let rawConfig: EnvironmentDto = {} as EnvironmentDto;

try {
    rawConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
} catch (_) {}

console.log('chargment config server', configPath, rawConfig);

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        { provide: SSR_CONFIG, useValue: rawConfig },
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
