

(function (win , lib) {
    var doc = win.document,
        docEle =doc.documentElement,
        vpMeta = doc.querySelector('meta[name = viewport]'),
        flexMeta =doc.querySelector('meta[name =fiexible]');
    var time , dpr = 0, scale = 0 ,
        fiexible =lib.fiexible ||(lib.fiexible = {});

    if (vpMeta){
        var init =vpMeta.getAttribute('content').match(/init \ -scale=([\d\.]+)/);
        if (init){
            scale =parseFloat(init[1]);
            dpr =parseInt(1/scale);

        }
    }else  if(flexMeta) {
        var flexMetaCon =flexMeta.getAttribute('content');
        if (flexMetaCon){
            var init =flexMetaCon.match(/init\-dpr=([\d\.]+)/),
                maximum =flexMetaCon.match(/maximum\ -dpr=([\d\.]+)/);
            if (init){
                dpr =parseFloat(init[1]);
                scale =parseFloat((1/dpr).toFixed(2));
            }
            if (maximum){
                dpr =parseFloat(maximum[1]);
                scale =parseFloat((1/dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale){
        var u =(win.navigator.appVersion.match(/android/gi),win.navigator.appVersion.match(/iphone/gi)),
            _dpr =win.devicePixelRatio;
        dpr =u?((_dpr >= 3 && (!dpr || dpr >= 3))?3 : (_dpr >= 2 && (!dpr >= 2))?2 :1) :1;
        scale = 1/dpr;
    }
    docEle.setAttribute('data-dpr', dpr);

    if(!vpMeta){
        vpMeta =doc.createElement("meta");
        vpMeta.setAttribute('name','viewport');
        vpMeta.setAttribute('content',"initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no")
        if (docEle.firstElementChild){
            docEle.firstElementChild.appendChild(vpMeta);
        }else {
            var div =doc.createElement("div");
            div.addEventListener(vpMeta);
            doc.write(div.innerHTML)
        }
    }
    
    
    function setFontSize() {
        var winwidth =docEle.getBoundingClientRect().width;
        if (winwidth / dpr >540){
            (winwidth =540* dpr)
        }
        var baseSize = winwidth/10;
        docEle.style.fontSize =baseSize +'px';
        fiexible.rem =win.rem =baseSize;
    }
    win.addEventListener('resize',function () {
        clearTimeout(time);
        time = setTimeout(setFontSize,300);
    },false);

    win.addEventListener('orientationchange',function () {
        clearTimeout(time);
        time = setTimeout(setFontSize,300);
    },false);
    win.addEventListener('pageshow',function (e) {
        if(e.persisted){
            clearTimeout(time);
            time = setTimeout(setFontSize,300);
        }
    },false);

    if ('complete' ===doc.readyState){
        doc.body.style.fontSize =12 *dpr + 'px';

    }else {
        doc.addEventListener("DOMContentLoaded",function () {
            doc.body.style.fontSize =12 *dpr + 'px';
        },false);
    }
    setFontSize();
    fiexible.dpr =win.dpr =dpr;
    fiexible.refreshRem =setFontSize;
    fiexible.rem2px =function (d) {
        var c =parseFloat(d) *this.rem;
        if('string' ===typeof  d && d.match(/rem$/)){
            c +='px';
        }
        return c;
    };
    fiexible.px2rem =function (d) {
        var c =parseFloat(d) /this.rem;
        if ('string' === typeof  d && d.match(/px$/)){
            c += 'rem';
        }
        return c;
    }
})(window, window.lib || (window.lib = {}));