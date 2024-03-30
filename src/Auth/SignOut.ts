export function SignOut() {
  localStorage.removeItem('JWTToken');
  window.location.href = '/';
}
