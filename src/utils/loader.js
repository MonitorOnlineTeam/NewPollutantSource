/**
 * Created by jindw 2018-10-11
 * @desc 加载指定资源文件 js, css, img 返回promise
 * @func loader
 * @param URI 资源地址
 * @param targetDOM 资源加载完毕放置的位置 null 表示不加载在文档中
 * @param flag 加载资源的判断标志
 */
function loader(URI, flag, targetDOM){
    if(typeof URI !== 'string'){
        throw new TypeError('Argument "URI" must be string type!');
    }
    if(typeof targetDOM === 'object' && targetDOM !== null && targetDOM instanceof HTMLElement === false){
        throw new TypeError('If argument "targetDOM" is an object, it must be an element object or null! ');
    }
    if(typeof targetDOM !=='object' && typeof targetDOM !== 'undefined' && typeof targetDOM !== 'string'){
        throw new TypeError('If arguemnt "targetDOM" isn\'t an object, it must be a string!');
    }
    if(!!flag && typeof flag !== 'string'){
        throw new TypeError('If you input argument "flag", "flag" must be a string!');
    }
    const fileType = URI.match(/\.([^\.]+)+$/)[1].toLowerCase();
    const fileId = URI.match(/([^\.\/]+)\.[^\.]+$/)[1];
    const appendDOM = typeof targetDOM === 'string' ? document.querySelector(targetDOM) : targetDOM;
    const flagArr = flag && flag.split('.');
    switch(fileType){
        case 'css':
            return loader.loadStyle(fileId, URI);
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return loader.loadImage(fileId, URI, appendDOM);
        default:
            return loader.loadScript(fileId, URI, flagArr);
    }
}

// 加载图片
loader.loadImage = function loadImage(fileId, URI, appendDOM){
    if(!loader.file.image[fileId]) loader.file.image[fileId] = {};
    const thisFile = loader.file.image[fileId];
    if(thisFile.status === 2){
        const cloneImg = document.getElementById(fileId).cloneNode(false);
        cloneImg.id = fileId + new Date().getTime();
        appendDOM && appendDOM.appendChild(cloneImg);
        return Promise.resolve();
    }else if(thisFile.status === 1){
        return new Promise((resolve, reject) => {
            thisFile.callback.push({resolve, reject});
        });
    }else{
        return new Promise((resolve, reject) => {
            loader.file.image[fileId].status = 1;
            loader.file.image[fileId].callback = [{resolve, reject}];
            let image = document.createElement('img');
            image.alt = URI;
            image.id = fileId;
            let timer = setTimeout(()=>{
                image.onload = image.onerror = null;
                loader.file.image[fileId].status = 0;
                rejectAll(loader.file.image[fileId].callback);
                console.error('Load file timeout: "' + URI + '"');
            }, loader.timeout);
            image.onload = function onload(){
                clearTimeout(timer);
                image.onload = image.onerror = null;
                loader.file.image[fileId].status = 2;
                resolveAll(loader.file.image[fileId].callback);
            }
            image.onerror = function onerror(){
                console.error('Load fail: "'+ URI +'"');
                loader.file.image[fileId].status = 0;
                rejectAll(loader.file.image[fileId].callback);
            };
            image.src = URI;
            appendDOM && appendDOM.appendChild(image);
        });
    }
}
// 加载js
loader.loadScript = function loadScript(fileId, URI, flagArr){
    debugger
    if(!loader.file.script[fileId]) loader.file.script[fileId] = {};
    const thisFile = loader.file.script[fileId];
    if(thisFile.status === 2){ // 加载完毕
        return Promise.resolve();
    }else if(thisFile.status === 1){ // 正在加载
        return new Promise((resolve, reject) => {
            thisFile.callback.push({resolve, reject});
        });
    }else{ // 还未加载
        return new Promise((resolve, reject) => {
            loader.file.script[fileId].status = 1;
            loader.file.script[fileId].callback = [{resolve, reject}];
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.async = true;
            script.defer = 'defer';
            script.id = fileId;
            let timer = setTimeout(()=>{
                script.onload = script.onerror = null;
                loader.file.script[fileId].status = 0;
                rejectAll(loader.file.script[fileId].callback);
                console.error('Load file timeout: "' + URI + '"');
            }, loader.timeout);
            script.onload = script.onerror = function onload(){
                clearTimeout(timer);
                script.onload = script.onerror = null;
                if(flagArr instanceof Array){
                    const flag = flagArr.reduce((prev, attr) => {
                        return prev === undefined || prev === null ? Object.create(null) : prev[attr];
                    }, window);
                    if(flag === undefined){
                        loader.file.script[fileId].status = 0;
                        rejectAll(loader.file.script[fileId].callback);
                    }else{
                        loader.file.script[fileId].status = 2;
                        resolveAll(loader.file.script[fileId].callback);
                    }
                }else{
                    loader.file.script[fileId].status = 2;
                    resolveAll(loader.file.script[fileId].callback);
                }
            }
            script.src = URI;
            document.body.appendChild(script);
        });
    }
}
// 加载css
loader.loadStyle = function loadStyle(fileId, URI){
    if(!loader.file.style[fileId]) loader.file.style[fileId] = {};
    const thisFile = loader.file.style[fileId];
    if(thisFile.status === 2){
        return Promise.resolve();
    }else if(thisFile.status === 1){
        return new Promise((resolve, reject) => {
            thisFile.callback.push({resolve, reject});
        });
    }else{
        return new Promise((resolve, reject) => {
            loader.file.style[fileId].status = 1;
            loader.file.style[fileId].callback = [{resolve, reject}];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.charset = 'utf-8';
            link.id = fileId;
            let timer = setTimeout(()=>{
                link.onload = link.onerror = null;
                loader.file.style[fileId].status = 0;
                rejectAll(loader.file.style[fileId].callback);
                console.error('Load file timeout: "' + URI + '"');
            }, loader.timeout);
            link.onload = link.onerror = function onload(){
                clearTimeout(timer);
                link.onload = link.onerror = null;
                loader.file.style[fileId].status = 2;
                resolveAll(loader.file.style[fileId].callback);
            }
            link.href = URI;
            document.head.appendChild(link);
        });
    }
}
// 加载其他
loader._loadOther = function loadOther(fileId, URI){
    throw new Error('Can\'t identify the file type of "' + URI + '"!');
}
// 文件库
loader.file = {
    script: {},
    style: {},
    image: {}
};
// 加载超时
loader.timeout = 10000;
function resolveAll(callbacks){
    let callback;
    while((callback = callbacks.shift())){
        callback.resolve();
    }
}
function rejectAll(callbacks){
    let callback;
    while((callback = callbacks.shift())){
        callback.reject();
    }
}
export default loader;
