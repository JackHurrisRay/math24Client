/**
 * Created by Jack.L on 2017/6/16.
 */

var AdvertisementSys =
    function(){

        ////////
        var o = {};

        ////////
        var index = 0;
        var winW = $(window).width();
        var h = winW * (96/640);

        o.init = function(data){
            var len = data.length;
            img(data);
            setTimeout(function(){
                $('#layerImg').css('bottom','8px');
                timer(data,len);
            },100);
        }

        var img = function(data){

            var _callback_click =
                function()
                {
                    const _href = data[index].href;

                    request_adv_touch(data[index].name,
                        function(data)
                        {
                            if( data.error_code == 0 )
                            {
                                //window.open(_href);
                                location.href = _href
                            }
                        }
                    );

                    TDEventAdvertisement(data[index].name);
                };

            var html = '<div id="layerImg" style="height:' + h + 'px;position:fixed;left:8px;right:8px;bottom:' + (-2*h) + 'px;z-index:10000000000;transition:bottom 0.3s;-webkit-transition:bottom 0.3s;">' +
                '<a id="AD_TOUCH">' +
                '<img src="' + data[index].src + '" width="100%" height="' + h + '" style="border-radius:5px;position:absolute;left:0;bottom:0;">' +
                '</a>' +
                '</div>';

            $('body').append(html);

            var _touchObj =
                document.getElementById("AD_TOUCH");

            _touchObj.onclick = _callback_click;



        };

        var timer = function(data,num){
            var _time = data[index].time;

            setTimeout(function(){
                $('#layerImg').css('bottom',-2*h + 'px');
                index ++;
                if(index == num){
                    index = 0;
                }
                setTimeout(function(){
                    $('#layerImg').remove();
                    o.init(data)
                },600);
            },_time);
        }

        return o;
    };