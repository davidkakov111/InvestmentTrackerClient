export function SignOut() {
  document.cookie = 'JWTToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
  window.location.href = '/signin';
}
