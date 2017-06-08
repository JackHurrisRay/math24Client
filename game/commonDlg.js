/**
 * Created by Jack on 2017/3/25.
 */

var commonDlg =
    cc.Layer.extend(
    {
        ////
        size:cc.director.getWinSize(),
        ctor: function () {

            ////
            var SELF = this;

            ////
            this._super();

            this.BACK_GROUND = new uiTouchSprite(
                function(touch, event)
                {
                    if(SELF._callback)
                    {
                        SELF._callback();
                        SELF._callback = null;
                    }

                    SELF.close();
                    UI_TOUCH_END_SWITCH = true;
                }
            );

            var _frame_background = cc.spriteFrameCache.getSpriteFrame("common_dlg.png");
            this.BACK_GROUND.initWithSpriteFrame(_frame_background);
            this.BACK_GROUND.setPosition(this.size.width / 2, this.size.height / 2);

            this.addChild(this.BACK_GROUND);

            ////
            this._label_title = cc.LabelTTF.create("标题内容", FONT_NAME.FONT_HEITI, 28);
            this._label_title.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT -  304);
            this.BACK_GROUND.addChild(this._label_title);

            this._label_info = cc.LabelTTF.create("这里为具体通知的内容，测试测试测试测试测试测试，嘿嘿，写长一点测试，再来几个字符串!!!", FONT_NAME.FONT_HEITI, 24);
            this._label_info.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._label_info.setDimensions(300, 180);
            this._label_info.setAnchorPoint(0.5, 1.0);
            this._label_info.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT - 340);
            this.BACK_GROUND.addChild(this._label_info);

            ////
            this.setVisible(false);
        },
        onEnter: function () {
            this.BACK_GROUND.onEnter();
        },
        onExit: function () {
            this.BACK_GROUND.onExit();
        },
        show: function () {
            UI_TOUCH_END_SWITCH = false;
            this.setVisible(true);
        },
        close: function () {
            this.setVisible(false);
            UI_TOUCH_END_SWITCH = true;
        },
        setInfo:function(title, info, callback)
        {
            ////
            this._label_title.setString(title);
            this._label_info.setString(info);
            this._callback = callback;
        }
    }
);

var waitDlg = cc.Sprite.extend(
    {
        size:cc.director.getWinSize(),
        ctor:function()
        {
            this._super();
            this.initWithFile(res_common.COMMON_BACK);
            this.setPosition(this.size.width/2, this.size.height/2);

            var _label = cc.LabelTTF.create("Wait...", FONT_NAME.FONT_HEITI, 32);
            _label.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
            this.addChild(_label);

            this.setVisible(false);
        },
        show:function()
        {
            UI_TOUCH_END_SWITCH = false;
            this.setVisible(true);
        },
        close:function()
        {
            this.setVisible(false);
            UI_TOUCH_END_SWITCH = true;
        }
    }
);