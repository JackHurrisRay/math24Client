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
                    var scene = new sceneGame();
                    var _trans = new cc.TransitionFadeTR(1, scene);//new cc.TransitionCrossFade(1, scene);
                    cc.director.runScene(_trans);
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
                    show_common_dialog("竞速排名","该系统目前暂未开放，敬请关注");
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
            //this.setSelfImg("test.jpg");
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