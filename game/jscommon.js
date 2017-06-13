/**
 * Created by Jack.L on 2017/2/18 0018.
 */
var DEVICE_DPR = window.devicePixelRatio;
const KEY_CTRL_NUMBER   = "CTRL_NUMBER";
const KEY_CTRL_OPERATOR = "CTRL_OPERATOR";

function getTimeMSecond()
{
    var _date = new Date();
    var _result = _date.getTime();

    return _result;
}

function getRandValue()
{
    var _value = Math.floor( Math.random() * 1000000 + getTimeMSecond() ) % 1000000;
    return _value;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
};

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

function GET_RAND(flag)
{
    if( flag <= 1.0 )
    {
        return Math.random();
    }
    else
    {
        const max = Math.floor(flag);
        return Math.floor( Math.random() * 65535 * 65535 + (new Date()).getTime() ) % max;
    }
};

function GET_GPS()
{
    /*
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            // 成功回调函数，接受一个地理位置的对象作为参数。
            // https://developer.mozilla.org/cn/docs/Web/API/Position 参数说明
            //alert(pos.coords.latitude + '  '+pos.coords.longitude);

            cc.log('success');
            alert('success');
        }, function(err) {
            // 错误的回调
            // https://developer.mozilla.org/cn/docs/Web/API/PositionError 错误参数
            cc.log('failed:' + err.message);
            alert('failed:' + err.message);

        }, {
            enableHighAccuracy: true, // 是否获取高精度结果
            timeout: 5000, //超时,毫秒
            maximumAge: 0 //可以接受多少毫秒的缓存位置
            // 详细说明 https://developer.mozilla.org/cn/docs/Web/API/PositionOptions
        });
    } else {
        //alert('抱歉！您的浏览器无法使用地位功能');
        cc.log('can not support geolocation');
    }
    */

    window.addEventListener('message', function(event) {

        // 接收位置信息

        var loc = event.data;

        console.log('location', loc);

    }, false);
}

function checkGeolocation() {
    if(navigator.geolocation) {
        return true;

    } else {
        return false;
    }
}

////////
function  createCanvas()
{
    var mainCanvas = document.createElement("canvas");

    mainCanvas.setAttribute("margin","0");
    mainCanvas.setAttribute("padding","0");
    mainCanvas.setAttribute("display","block");
    mainCanvas.setAttribute("id","gameCanvas");
    document.body.appendChild(mainCanvas);
};

function chkstrlen(str, lengthcheck)
{
    var strlen = 0;
    var index  = 0;

    for(var i = 0;i < str.length; i++)
    {
        if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
            strlen += 2;
        else
            strlen++;

        if(strlen > lengthcheck && index == 0)
        {
            index = i;
        }
    }
    return   {length:strlen, cut:index};
};

function FitString(str, length)
{
    var out = str;
    var cut = chkstrlen(str, length);

    if( cut.cut != 0 )
    {
        out = out.substr(0, cut.cut);
        out += "...";
    }

    return out;
}


////////
function loadImgFromUrl(target, imgUrl, dessize, shader) {

    var self = target;

    var loadCb =
        function(err, img){

            if(err) return;
            cc.textureCache.addImage(imgUrl);
            var texture2d = new cc.Texture2D();
            texture2d.initWithElement(img);
            texture2d.handleLoadedTexture();

            self.initWithTexture(texture2d);

            const _flag_w = dessize.w / self.getContentSize().width;
            const _flag_h = dessize.h / self.getContentSize().height;

            self.setScale(_flag_w, _flag_h);
            if( shader != null )
            {
                self.setShaderProgram( shader );
            }
        };

    cc.loader.loadImg(imgUrl, {isCrossOrigin:true }, loadCb);
};

function extendDeep(parent, child) {
    child = child || {};
    for(var i in parent) {
        if(parent.hasOwnProperty(i)) {
            //检测当前属性是否为对象
            if(typeof parent[i] === "object") {
                //如果当前属性为对象，还要检测它是否为数组
                //这是因为数组的字面量表示和对象的字面量表示不同
                //前者是[],而后者是{}
                child[i] = (Object.prototype.toString.call(parent[i]) === "[object Array]") ? [] : {};

                //递归调用extend
                this.extendDeep(parent[i], child[i]);
            } else {
                child[i] = parent[i];
            }

        }
    }

    return child;
};

var GameTimer =
    function()
    {
        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        var _startTime = window.mozAnimationStartTime || Date.now();
        var _lastTime = 0;
        var _CALLBACK = null;
        var _STOP = false;
        var _callback_stop = null;

        var _update =
            function(timestamp)
            {
                if( _STOP )
                {
                    if( _callback_stop )
                    {
                        _callback_stop();
                        _callback_stop = null;
                    }

                    return;
                }

                var _checktime = (new Date()).getTime();

                if( _checktime - _startTime > _lastTime )
                {
                    if( _CALLBACK )
                    {
                        _CALLBACK();
                    }

                    _startTime = _checktime;
                }

                requestAnimationFrame(_update);
            };

        var _object =
        {
            ANIMATION_ID:0,
            init:function(msecond, callback)
            {
                _lastTime      = msecond;
                _CALLBACK      = callback;
                _callback_stop = null;
                _STOP          = false;
                _startTime     = (new Date()).getTime();

                this.ANIMATION_ID = requestAnimationFrame(_update);
            },
            setTime:function(time)
            {
                _lastTime = time;
            },
            stop:function(callback)
            {
                _callback_stop = callback;
                _STOP = true;
            }
        };

        return _object;
    };

var KEY_MATH =
{
    encrypt:function (str, pwd) {
        if(pwd == null || pwd.length <= 0) {
            alert("Please enter a password with which to encrypt the message.");
            return null;
        }
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.ceil(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        if(mult < 2) {
            alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
            return null;
        }
        var salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i++) {
            enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if(enc_chr < 16) {
                enc_str += "0" + enc_chr.toString(16);
            } else enc_str += enc_chr.toString(16);
            prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while(salt.length < 8)salt = "0" + salt;
        enc_str += salt;
        return enc_str;
    },
    decrypt:function(str, pwd) {
        if(str == null || str.length < 8) {
            alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
            return;
        }
        if(pwd == null || pwd.length <= 0) {
            alert("Please enter a password with which to decrypt the message.");
            return;
        }
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i+=2) {
            enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
            enc_str += String.fromCharCode(enc_chr);
            prand = (mult * prand + incr) % modu;
        }
        return enc_str;
    }
};

var _LOADING_IMG =
    "data:image/png;base64,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";