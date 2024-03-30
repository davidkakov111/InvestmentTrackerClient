export function SignOut() {
  // document.cookie = 'JWTToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
  // document.cookie = 'JWTToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.com;';
  


  document.cookie = `JWTToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.com; "secure;" : ""`;
  


  window.location.href = '/signin';
}
