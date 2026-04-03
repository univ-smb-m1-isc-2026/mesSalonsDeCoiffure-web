import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

    if (token) {
    const tokenPropre = token.replace(/['"]+/g, '').trim();

    const requeteClonee = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenPropre}`
      }
    });
    return next(requeteClonee);
  }

  // Si on n'a pas de token (ex: utilisateur non connecté), on envoie la requête normale
  return next(req);
};
