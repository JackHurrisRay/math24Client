/**
 * Created by Jack.L on 2017/6/16.
 */
/*
////////
const ADV_PATH = "http://192.168.3.11/";

////////
var callback_requestjson =
    function(callback)
    {
        var _callback = callback;
        const fullpath = ADV_PATH + "adv.json";

        if( typeof $ != "undefined" && $ != null )
        {
            $.getJSON(
                fullpath,
                function(data)
                {
                    if( _callback )
                    {
                        _callback(data);
                    }
                }
            );
        }
        else
        {
            setTimeout(
                function()
                {
                    callback_requestjson(_callback);
                },
                3000
            );
        }
    };
*/

const ADV_INFO =
{
    "advertisement":
    [
        {
            'name':'北京怡人教育咨询有限公司-西班牙移民',
            'src':'http://5941game.oss-cn-qingdao.aliyuncs.com/advertisement/beijingyirenjiaoyu_xibanyaliuxue.png',
            'href':'http://www.yrcll.top/',
            'time':30000
        },
        {
            'name':'足球游戏',
            'src':'http://5941game.oss-cn-qingdao.aliyuncs.com/advertisement/zuqiuyouxi.jpg',
            'href':'http://act.xianyugame.com/Zuijiazhenrong/Download_Ios6_10?ctype=mtzy',
            'time':30000
        }
    ]
}


////////
var callback_adv =
    function(adv_info)
    {
        const _advInfo = adv_info;

        if( typeof $ != "undefined" && typeof AdvertisementSys != "undefined" && AdvertisementSys != null)
        {
            var adv = new AdvertisementSys;
            adv.init(_advInfo);
        }
        else
        {
            setTimeout(
                function()
                {
                    callback_adv(_advInfo);
                },
                3000
            );
        }
    };

callback_adv(ADV_INFO.advertisement);

////callback_requestjson(callback_adv);

