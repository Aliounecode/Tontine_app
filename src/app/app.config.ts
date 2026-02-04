import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor'; // Attention au chemin

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // C'est ici que la magie opère :
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
