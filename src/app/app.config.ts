import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp,initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore} from '@angular/fire/firestore';
import { provideAuth, getAuth } from "@angular/fire/auth";

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore())
    ]),
  ],
};
