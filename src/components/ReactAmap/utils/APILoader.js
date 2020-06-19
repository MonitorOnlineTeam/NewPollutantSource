import config from "@/config"
const DEFAULT_CONFIG = {
  v: '1.4.0',
  hostAndPath: 'webapi.amap.com/maps',
  key: 'f97efc35164149d0c0f299e7a8adb3d2',
  callback: '__amap_init_callback',
  useAMapUI: false
}

let mainPromise = null
let amapuiPromise = null
let amapuiInited = false
export default class APILoader {
  constructor({ key, useAMapUI, version, protocol }) {
    this.config = { ...DEFAULT_CONFIG, useAMapUI, protocol }
    if (typeof window !== 'undefined') {
      if (key) {
        this.config.key = key
      } else if ('amapkey' in window) {
        this.config.key = window.amapkey
      }
    }
    if (version) {
      this.config.v = version
    }
    this.protocol = protocol || window.location.protocol
    if (this.protocol.indexOf(':') === -1) {
      this.protocol += ':'
    }
  }

  getScriptSrc(cfg) {
    if (config.offlineMapUrl.domain) {
      // return 'http://172.16.9.20:808/amap/js/maps.js?v=1.3&key=c0fa7cbef7939ee6e2ce2d940e623e0b';
      return config.offlineMapUrl.domain + config.offlineMapUrl.srcPath;
    }
    return `${this.protocol}//${cfg.hostAndPath}?v=${cfg.v}&key=${cfg.key}&callback=${cfg.callback}`
  }

  buildScriptTag(src) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src = src
    return script
  }

  getAmapuiPromise() {
    if (window.AMapUI) {
      return Promise.resolve()
    }
    const script = this.buildScriptTag(`${this.protocol}//webapi.amap.com/ui/1.0/main-async.js`)
    const p = new Promise(resolve => {
      script.onload = () => {
        resolve()
      }
    })
    document.body.appendChild(script)
    return p
  }

  getMainPromise() {
    if (window.AMap) {
      return Promise.resolve()
    }
    const script = this.buildScriptTag(this.getScriptSrc(this.config))
    const that = this;
    const p = new Promise(resolve => {
      window[that.config.callback] = () => {
        resolve()
        delete window[that.config.callback]
      }
      setTimeout(() => {
        resolve();
      }, 1000)
    })
    document.body.appendChild(script)
    return p
  }

  load() {
    if (typeof window === 'undefined') {
      return null
    }
    const { useAMapUI } = this.config
    mainPromise = mainPromise || this.getMainPromise()
    if (useAMapUI) {
      amapuiPromise = amapuiPromise || this.getAmapuiPromise()
    }
    return new Promise(resolve => {
      mainPromise.then(() => {
        if (useAMapUI && amapuiPromise) {
          amapuiPromise.then(() => {
            if (window.initAMapUI && !amapuiInited) {
              window.initAMapUI()
              if (typeof useAMapUI === 'function') {
                useAMapUI()
              }
              amapuiInited = true
            }
            resolve()
          })
        } else {
          resolve()
        }
        // if (window.initAMapUI && !amapuiInited) {
        //   window.initAMapUI()
        //   if (typeof useAMapUI === 'function') {
        //     useAMapUI()
        //   }
        //   amapuiInited = true
        // }
        // resolve()
      })
    })
  }
}
