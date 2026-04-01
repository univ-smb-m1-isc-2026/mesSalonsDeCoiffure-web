import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  // Si on a un token, on "clone" la requête pour lui ajouter le Header d'autorisation
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq); // On envoie la requête modifiée
  }

  // Si on n'a pas de token (ex: utilisateur non connecté), on envoie la requête normale
  return next(req);
};
