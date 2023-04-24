import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DeeplinkService {

  constructor() { }

  deeplink() {

    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf("android") > -1;   // Android Check
    let isIphone = ua.indexOf("iphone") > -1;     // IOS Check

    // https://imvikaskohli.medium.com/how-to-do-deep-linking-to-app-from-website-c2ecbf345dd5
    if (isIphone == true) {
      let app = {
        launchApp: function () {
          setTimeout(function () {
            window.location.href = "https://itunes.apple.com/us/app/appname/appid";
          }, 25);
          window.location.href = "bundlename://linkname"; //which page to open(now from mobile, check its authorization)
        },
        openWebApp: function () {
          window.location.href = "https://itunes.apple.com/us/app/appname/appid";
        }
      };
      app.launchApp();
    } else if (isAndroid == true) {
      let app = {
        launchApp: function () {
          window.location.replace("bundlename://linkname"); //which page to open(now from mobile, check its authorization)
          setTimeout(this.openWebApp, 500);
        },
        openWebApp: function () {
          window.location.href = "https://play.google.com/store/apps/details?id=packagename";
        }
      };
      app.launchApp();
    } else {

    }
  }

}
