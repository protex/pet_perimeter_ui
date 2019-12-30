export function getUserDevicePath() {
  let splitHref = window.location.href.split('/');
  let path = "/" + splitHref[splitHref.length - 2] + "/" + splitHref[splitHref.length -1];
  return path;
}
