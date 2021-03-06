/**
 * Created by Jack.L on 2017/5/30.
 */
////////
const CONTENT_ID = "1497106073695715";

const request_settings =
{
    "async": true,
    "crossDomain": true,
    xhrFields:{withCredentials:true},
    "headers": {
        "content-type": "application/json",
    },
    "processData": false,
};

function  checkError(response, callback)
{
    const data = JSON.parse(response);

    if( data.error_code != 0 )
    {
        switch( data.error_code )
        {
            case 120:
            {
                loginInit();
                break;
            }
        }
    }
    else
    {
        if( callback )
        {
            callback(data.data);
        }
    }
};

function request_Login(id,pwd,callback)
{
    const _msg =
    {
        "account_id":id,
        "account_pwd":pwd
    };

    var settings = request_settings;
    settings.method = "POST";
    settings.url = "http://huyukongjian.cn:1021/login/login";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
};

var OPTIONS = {};
function request_Content(callback)
{
    const _msg = {content_id:CONTENT_ID};

    var settings = request_settings;
    settings.url = "http://huyukongjian.cn:1021/trade/applicate_content";
    settings.method = "PUT";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);

        checkError(response,
            function(data)
            {
                OPTIONS = data.options;

                if( callback )
                {
                    callback(data);
                }
            }
        );

        //alert(response);
    });
}

function request_Option(_option_name, _option_value, _callback)
{
    const _msg =
    {
        "content_id":GAME_CONTENT_ID,
        "option_name":_option_name,
        "option_value":_option_value
    };

    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:1021/trade/content_option";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        //console.log(response);

        checkError(response,
            function(data)
            {
                if( _callback )
                {
                    _callback(data);
                }
            }
        );
    });
};

////////
function request_LoginGame(uid, callback)
{
    const _msg =
    {
        "uid":uid
    };

    if( wx_data && wx_data.inviter && wx_data.inviter_datecheck )
    {
        _msg.inviter = wx_data.inviter;
        _msg.inviter_datecheck = wx_data.inviter_datecheck;
    }

    var settings = request_settings;
    settings.method = "POST";
    settings.url = "http://huyukongjian.cn:2424/login";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_GameNormal(callback)
{
    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/nor_mode";

    $.ajax(settings).done(function (response) {
        console.log(response);

        if( response.status == 0 )
        {
            TDMissionBegin(0);
        }

        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_GameFindAnswer(index, callback)
{
    const _msg =
    {
        "question_index":index
    };

    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/find_answer";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);

        if( response.status == 0 )
        {
            TDRecord();
        }

        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_competition(callback)
{
    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/com_mode";

    $.ajax(settings).done(function (response) {
        console.log(response);

        if( response.status == 0 )
        {
            TDRecord();

            TDMissionBegin(1);
        }

        ////parse response
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_competition_next(key, callback)
{
    const _msg =
    {
        "key":key
    };

    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/com_mode/next";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);

        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_competition_top(callback)
{
    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/com_top";

    $.ajax(settings).done(function (response) {
        console.log(response);

        ////parse response
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_add_gold_from(callback)
{
    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:2424/game/add_gold_from";

    $.ajax(settings).done(function (response) {
        console.log(response);

        ////parse response
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

function request_adv_touch(advertisement, callback)
{
    const _msg =
    {
        "content_id":CONTENT_ID,
        "name":advertisement
    };

    var settings = request_settings;
    settings.method = "PUT";
    settings.url = "http://huyukongjian.cn:1021/sys/advertisement";
    settings.data = JSON.stringify(_msg);

    $.ajax(settings).done(function (response) {
        console.log(response);

        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

////////
function setPlayerImgFromURL(ID, spt, w, h)
{
    const url = "http://app.huyukongjian.cn/account_wx_img/" + ID.toString();
    var shader = cc.SHADER_playerImg;

    loadImgFromUrl(spt, url,
        {w:w,h:h},
        shader
    );
}

function createPlayersInTop(PLAYER_LIST)
{
    ////////
    const player_count = PLAYER_LIST.length;

    ////////
    const size = cc.director.getWinSize();

    ////////
    var _topNode = cc._TOP_ROOT;
    _topNode.setVisible(false);

    var _nodeArray = [];

    const _imgwideflag = 128;
    const _screen_y_flag = size.height / 2 - 96;

    const _count = 4;
    const _screen_width_flag = size.width / _count;

    for( var i=0; i<_count; i++ )
    {
        for( var j=0; j<_count; j++ )
        {
            var _node = cc.Node.create();
            _node.setPosition(cc.p(_screen_width_flag/2 + _screen_width_flag*j, _screen_y_flag-i*_screen_width_flag));

            _nodeArray.push(_node);
            _topNode.addChild(_node);
            _node.setVisible(false);
        }
    }

    var _frame_img =
        [
            cc.spriteFrameCache.getSpriteFrame("player_img_around.png"),
            cc.spriteFrameCache.getSpriteFrame("player_img_default.png"),
        ];

    for( var i in PLAYER_LIST )
    {
        if( i < _nodeArray.length )
        {
            var _node = _nodeArray[i];
            const ID = PLAYER_LIST[i];

            var PLAYER_IMG = cc.Sprite.createWithSpriteFrame(_frame_img[1]);
            _node.addChild(PLAYER_IMG);

            var _sptAround = cc.Sprite.createWithSpriteFrame(_frame_img[0]);
            _node.addChild(_sptAround);

            const sizeflag = _imgwideflag / 256.0;
            PLAYER_IMG.setScale(sizeflag);
            _sptAround.setScale(sizeflag);

            _node.setVisible(true);

            ////////
            setPlayerImgFromURL(ID, PLAYER_IMG, _imgwideflag, _imgwideflag);

            ////////
            var action1 = cc.Sequence.create(
                cc.ScaleTo.create(0.125, 1.0 + 0.01 + Math.random() * 0.05),
                cc.ScaleTo.create(0.125, 1.0),
                cc.ScaleTo.create(0.125, 1.0 - 0.01 - Math.random() * 0.25),
                cc.ScaleTo.create(0.125, 1.0)
            );

            var button_anim = cc.RepeatForever.create(action1);
            _node.runAction(button_anim);

        }
        else
        {
            break;
        }

    }

    //_topNode.setVisible(true);
}

////////
function loginInit(callback_after_init)
{
    show_wait();

    if( wx_data ) {
        /*
        request_Login(wx_data.login_id, wx_data.login_pwd,
            function (res) {
                //request_Login(wx_data.login_id, wx_data.login_pwd);
                request_Content(
                    function(data)
                    {
                        request_LoginGame(wx_data.ID);
                    }
                );
            }
        );
        */

        request_Login(wx_data.login_id, wx_data.login_pwd,
            function(res)
            {
                if( res && ( res.error_code == 0 || res.error_code == 210 ) )
                {
                    //success
                    request_Content(
                        function(data)
                        {
                            console.log('登录游戏服务器');

                            request_LoginGame(wx_data.ID,
                                function(data)
                                {
                                    if(data.status == 0)
                                    {

                                        PlayerData.GOLD = data.GOLD;
                                        PlayerData.GOLD_MAX = data.GOLD_MAX;
                                        PlayerData.refreshGoldUI();

                                        PlayerData.UID = wx_data.ID;

                                        if( data.GOLD_FROM && data.GOLD_FROM.length > 0 )
                                        {
                                            console.log(JSON.stringify(data));

                                            createPlayersInTop(data.GOLD_FROM);
                                            const gold_from_length = data.GOLD_FROM.length;

                                            cc.SET_SPTCHANCE(
                                                function()
                                                {
                                                    ////////
                                                    request_add_gold_from(
                                                        function(data)
                                                        {
                                                            const gold_add_value   = data.GOLD_ADD;

                                                            cc._TOP_ROOT.setVisible(true);
                                                            PlayerData.GOLD = data.GOLD;

                                                            ////////
                                                            show_common_dialog(
                                                                "友谊共进",
                                                                "您有" + gold_from_length.toString()  + "个好友因为积极参赛，共为您提供了" + gold_add_value.toString() + "个金币哟",
                                                                function()
                                                                {
                                                                    PlayerData.refreshGoldUI();
                                                                    cc._TOP_ROOT.removeAllChildrenWithCleanup(true);
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }

                                        close_wait();

                                        if( !cc.IS_CONN )
                                        {
                                            cc.IS_CONN = true;
                                            show_common_dialog("登录成功", "欢迎来到极速24点游戏，在这里尽情地开发您的大脑吧",
                                                function()
                                                {
                                                    if( callback_after_init )
                                                    {
                                                        callback_after_init();
                                                    }
                                                }
                                            );
                                        }
                                        else
                                        {
                                            if( callback_after_init )
                                            {
                                                callback_after_init();
                                            }
                                        }

                                        ////////
                                        TDGA.Account(
                                            {
                                                accountId:wx_data.login_id,
                                                accountType:1,
                                                accountName:wx_data.NICKNAME
                                            }
                                        );

                                        if( wx_data )
                                        {
                                            TDGA.Account.setGender(wx_data.sex);
                                        }
                                    }
                                    else
                                    {
                                        close_wait();
                                        show_common_dialog("登录失败", "请您检查手机是否正确连上了网络，并重新进入游戏");
                                    }
                                }
                            );
                        }
                    );
                }
                else
                {
                    close_wait();
                    show_common_dialog("登录失败", "请您检查手机是否正确连上了网络，并重新进入游戏");
                }

                return;
            }
        );

    }
    else
    {
        ///*
        request_Login("18302079187", "password",
            function(res)
            {
                if( res && ( res.error_code == 0 || res.error_code == 210 ) )
                {
                    //success
                    request_Content(
                        function(data)
                        {
                            request_LoginGame("1497033632009086",
                                function(data)
                                {
                                    if(data.status == 0)
                                    {

                                        PlayerData.GOLD = data.GOLD;
                                        PlayerData.GOLD_MAX = data.GOLD_MAX;
                                        PlayerData.refreshGoldUI();
                                        PlayerData.UID = "1497033632009086";

                                        close_wait();
                                        show_common_dialog("登录成功", "欢迎来到极速24点游戏，在这里尽情地开发您的大脑吧");

                                        ////////
                                    }
                                    else
                                    {
                                        close_wait();
                                        show_common_dialog("登录失败", "请您检查手机是否正确连上了网络");
                                    }
                                }
                            );
                        }
                    );
                }
                else
                {
                    close_wait();
                    show_common_dialog("登录失败", "请您检查您的手机正确连上了网络");
                }

                return;
            }
        );

        //*/

    }


}



