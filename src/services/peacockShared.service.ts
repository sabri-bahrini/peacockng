import {Injectable} from '@angular/core';

@Injectable()
export class PeacockSharedService {

  public ip = '';


  constructor() {
  }


  /**
   * Get the Ip address
   * @return {boolean}
   */
  public localIps() {
    let _window: any = window;
    var ip;
    _window.RTCPeerConnection = _window.RTCPeerConnection || _window.mozRTCPeerConnection || _window.webkitRTCPeerConnection || false;

    if (_window.RTCPeerConnection) {
      ip = [];
      var pc: any = new RTCPeerConnection({iceServers: []}), noop = function () {
      };
      pc.createDataChannel('');
      pc.createOffer(pc.setLocalDescription.bind(pc), noop);

      pc.onicecandidate = function (event) {
        if (event && event.candidate && event.candidate.candidate) {
          var s = event.candidate.candidate.split('\n');
          ip.push(s[0].split(' ')[4]);
        }
      };
    }
    this.ip = ip;
  }

  /**
   * Make a random String length 5
   * @return {string}
   */
  makeRandomString(length = 5) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  /**
   * Compare two JSON objects
   *  true : if equals
   *  false: if not
   * @param obj1
   * @param obj2
   */
  public isEqual(obj1, obj2) {
    let objectConstructor = {}.constructor;
    if (Object.keys(obj1).length == Object.keys(obj2).length) {
      for (let key in obj1) {
        if (obj1[key].constructor === objectConstructor) {
          if (!this.isEqual(obj1[key], obj2[key])) {
            return false;
          }
        } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          for (let i in obj2[key]) {
            if (!this.isEqual(obj1[key][i], obj2[key][i])) {
              return false;
            }
          }
        } else if (obj1[key] != obj2[key]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

}
