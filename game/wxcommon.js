/**
 * Created by Jack.L on 2017/5/31.
 */
var server_content =
{
    'game':24,
    'room':"",
    'inviter':""
};

function getWxContent()
{
    var _result = null;
    if( wx_content && typeof wx_content == 'string')
    {
        var _base64DataInfo1  = BASE64.decoder(wx_content);
        var _base64DataInfo2 = transAscToStringArray(_base64DataInfo1);
        _result = JSON.parse(_base64DataInfo2);
    }

    return _result;
}

const wx_data = getWxContent();

if(wx_data)
{
    server_content.inviter = wx_data.ID;
}

function resetWxCommon(room_id)
{
    wx.config(wx_ticket);

    wx.ready(function(){

        wx.checkJsApi(
            {
                jsApiList:wx_ticket.jsApiList,
                success:function(res)
                {
                    console.log(JSON.stringify(res));
                }
            }
        );

        wx.hideAllNonBaseMenuItem();

        wx.hideMenuItems({
            menuList:[
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:editTag',
                'menuItem:delete',
                'menuItem:openWithSafari',
                'menuItem:share:email',
                'menuItem:share:brand',
            ]
        });

        wx.showMenuItems({
            menuList: [
                'menuItem:share:appMessage',
                'menuItem:share:timeline', // 分享到朋友圈
                'menuItem:copyUrl' // 复制链接
            ]
        });

        server_content.room = room_id;
        const _strServerContent =
        BASE64.encoder(JSON.stringify(server_content));

        wx.onMenuShareAppMessage(
            {
                title:"极速24点",
                desc:"内部测试版本，敬请关注!",
                link:"http://huyukongjian.cn/auth?content=" + _strServerContent,
                imgUrl:"http://5941game.oss-cn-qingdao.aliyuncs.com/math24/math24_logo.png",
                type:null,
                dataUrl:null,
                success:function()
                {
                    console.log('wx set success for room=' + room_id.toString());
                    return;
                },
                cacel:function()
                {
                    return;
                }
            }
        );

        wx.onMenuShareTimeline(
            {
                title:"极速24点--内部测试，敬请关注",
                link:"http://huyukongjian.cn/auth?content=" + _strServerContent,
                imgUrl:"http://5941game.oss-cn-qingdao.aliyuncs.com/math24/math24_logo.png",
                type:null,
                dataUrl:null,
                success:function()
                {
                    return;
                },
                cacel:function()
                {
                    return;
                }
            }
        );

        wx.error(
            function(res)
            {
                console.log('wx failed:'+res.errMsg);
            }
        );

    });
}

function initWxCommon()
{
    resetWxCommon(null);
}

function wxShareAppMsg()
{
    wx.showMenuItems({
        menuList: [
            'menuItem:share:appMessage',
            'menuItem:share:timeline', // 分享到朋友圈
            'menuItem:copyUrl' // 复制链接
        ],
        success: function (res) {
            //alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
            console.log(JSON.stringify(res));
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
            console.log(JSON.stringify(res));
        }
    });

    //wx.showOptionMenu();

}

if(wx_data && wx_data.ticket)
{
    var wx_ticket = wx_data.ticket;
    initWxCommon();
}

