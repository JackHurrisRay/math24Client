/**
 * Created by Jack.L on 2017/6/7.
 */

var sceneMain = cc.Scene.extend(
    {
        ctor:function()
        {
            this._super();

            const size = cc.director.getWinSize();

            var _sceneLayer = cc.LayerColor.create(/*cc.color(255,0,0)*/);
            _sceneLayer.setColor(cc.color(GET_RAND(75) + 155,GET_RAND(75),GET_RAND(75)));
            this.addChild(_sceneLayer);

            ////////
            var _frame_back = cc.spriteFrameCache.getSpriteFrame("back1.png")
            var _back = cc.Sprite.createWithSpriteFrame(_frame_back);
            _back.setPosition(size.width/2, size.height/2);
            _sceneLayer.addChild(_back);

            ////////
            var _frameButton =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_main_1.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_main_2.png"),
                ];

            ////////
            var _buttonMain_1 = new uiTouchSprite(
                null,null,
                function(touch,event)
                {
                    show_wait();
                    request_GameNormal(
                        function(data)
                        {
                            close_wait();
                            if( data.status == 0 )
                            {
                                PlayerData.QUESTIONS = [];
                                PlayerData.QUESTIONS = PlayerData.QUESTIONS.concat(data.questions);

                                var scene = new sceneGame();
                                var _trans = new cc.TransitionFadeTR(1, scene);//new cc.TransitionCrossFade(1, scene);
                                cc.director.runScene(_trans);
                            }
                            else
                            {
                                show_common_dialog("网络连接失败","请您检查手机是否正确连上了网络");
                            }
                        }
                    );
                }
            );

            _buttonMain_1.initWithSpriteFrame(_frameButton[0]);
            _buttonMain_1.setAnchorPoint(0.0, 0.0);
            _buttonMain_1.setPosition(8.0, 128.0);
            _back.addChild(_buttonMain_1);

            var _buttonMain_2 = new uiTouchSprite(
                null,null,
                function(touch,event)
                {
                    //show_common_dialog("竞速排名","该系统目前暂未开放，敬请关注");
                    var _callback_competition =
                        function()
                        {
                            show_wait();

                            request_competition(
                                function(data)
                                {
                                    close_wait();

                                    if( data.status == 0 )
                                    {
                                        var scene = new sceneCompetition();
                                        var _trans = new cc.TransitionFadeTR(1, scene);//new cc.TransitionCrossFade(1, scene);
                                        cc.director.runScene(_trans);

                                        scene.startQuestion(data);

                                        PlayerData.GOLD = data.GOLD;
                                        PlayerData.refreshGoldUI();
                                    }
                                    else if( data.status == 402 )
                                    {
                                        show_common_dialog("智慧星不足","您的智慧星不足，目前无法参加竞速比赛哟");
                                    }
                                    else
                                    {
                                        show_common_dialog("网络连接失败","请您检查手机是否正确连上了网络");
                                    }
                                }
                            );
                        };

                    show_confirm_dialog("竞速比赛","参加竞速比赛将花费您1颗智慧星，不过第二天智慧星会加满哟。要参加吗？加油，要做宇宙第一大脑哟",
                        function()
                        {
                            _callback_competition();
                        }
                    );


                }
            );

            _buttonMain_2.initWithSpriteFrame(_frameButton[1]);
            _buttonMain_2.setAnchorPoint(1.0, 0.0);
            _buttonMain_2.setPosition(SCREEN_SIZE.WIDTH - 8.0, 128.0 - 64.0);
            _back.addChild(_buttonMain_2);

            ////////
            var _frame_img =
                [
                    cc.spriteFrameCache.getSpriteFrame("player_img_around.png"),
                    cc.spriteFrameCache.getSpriteFrame("player_img_default.png"),
                ];

            this.PLAYER_IMG = cc.Sprite.createWithSpriteFrame(_frame_img[1]);
            this.PLAYER_IMG.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT * 0.618);
            _back.addChild(this.PLAYER_IMG);

            var _sptAround = cc.Sprite.createWithSpriteFrame(_frame_img[0]);
            _sptAround.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT * 0.618);
            _back.addChild(_sptAround);

            ////////
            const _wx_data = wx_data;
            if(_wx_data)
            {
                const url = "http://app.huyukongjian.cn/account_wx_img/" + _wx_data.ID.toString();
                this.setSelfImg(url);

                ////////
                var _nameLabel = cc.LabelTTF.create(_wx_data.NICKNAME, FONT_NAME.FONT_HEITI, 32);
                _nameLabel.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT * 0.618 - 180);
                _back.addChild(_nameLabel);

            }
        },
        setSelfImg:function(url)
        {
            var shader = cc.SHADER_playerImg;

            loadImgFromUrl(this.PLAYER_IMG, url,
                {w:256,h:256},
                shader
            );
        }
    }
);