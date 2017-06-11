/**
 * Created by Jack.L on 2017/5/30.
 */
////////
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
    const _msg = {content_id:"1497106073695715"};

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
        if( callback )
        {
            callback(JSON.parse( response ));
        }
    });
}

////////
function loginInit()
{
    show_wait();

    if( wx_data ) {
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
    }
    else
    {
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
                                        close_wait();
                                        show_common_dialog("登录成功", "欢迎来到极速24点游戏，在这里尽情地开发您的大脑吧");
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
    }
}



