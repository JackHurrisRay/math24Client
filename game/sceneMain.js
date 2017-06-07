/**
 * Created by Jack.L on 2017/6/7.
 */

var sceneMain = cc.Scene.extend(
    {
        size:cc.director.getWinSize(),
        ctor:function()
        {
            this._super();

            var _sceneLayer = cc.LayerColor.create(/*cc.color(255,0,0)*/);
            _sceneLayer.setColor(cc.color(GET_RAND(155) + 100,GET_RAND(155),GET_RAND(155)));
            this.addChild(_sceneLayer);

            ////////
            cc.spriteFrameCache.addSpriteFrames(res_pix.PIX_PLIST, res_pix.PIX_PNG);

            var _frameButton =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_main_1.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_main_2.png")
                ];

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
            _sceneLayer.addChild(_buttonMain_1);

            var _buttonMain_2 = new uiTouchSprite(
                null,null,
                function(touch,event)
                {

                }
            );

            _buttonMain_2.initWithSpriteFrame(_frameButton[1]);
            _buttonMain_2.setAnchorPoint(1.0, 0.0);
            _buttonMain_2.setPosition(SCREEN_SIZE.WIDTH - 8.0, 128.0 - 64.0);
            _sceneLayer.addChild(_buttonMain_2);

        }
    }
);