/**
 * Created by Jack on 2017/3/25.
 */

var commonDlg =
    cc.Layer.extend(
    {
        ////
        ctor: function () {

            ////
            var SELF = this;
            const size = cc.director.getWinSize();

            ////
            this._super();

            var _frame_background = cc.spriteFrameCache.getSpriteFrame("common_dlg.png");

            this.BACK_GROUND = new uiTouchFrameSprite(_frame_background, _frame_background,
                function(target)
                {
                    SELF.close();

                    if(SELF._callback)
                    {
                        SELF._callback();
                        SELF._callback = null;
                    }
                }
            );
            this.BACK_GROUND.setPosition(size.width / 2, size.height / 2);

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
            this.BACK_GROUND.lock();
            this.setVisible(true);
        },
        close: function () {
            this.setVisible(false);
            this.BACK_GROUND.unlock();
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

var commonConfirmDlg =
    cc.Layer.extend(
        {
            ctor:function()
            {
                const size = cc.director.getWinSize();
                var SELF = this;

                this._super();
                this.setColor(0,0,0);

                this.setVisible(false);

                ////////
                this.BACK_GROUND = cc.Sprite.create();
                var _frame_background = cc.spriteFrameCache.getSpriteFrame("common_dlg.png");
                this.BACK_GROUND.initWithSpriteFrame(_frame_background);
                this.BACK_GROUND.setPosition(size.width / 2, size.height / 2);

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
                var _frameButton =
                    [
                        cc.spriteFrameCache.getSpriteFrame("button_common_1.png"),
                        cc.spriteFrameCache.getSpriteFrame("button_common_1_select.png")
                    ];

                this.BUTTON_CANCEL =
                    new uiTouchFrameSprite(_frameButton[0], _frameButton[1],
                        function(target)
                        {
                            SELF.close();
                        }
                    );

                var labelCancel = cc.LabelTTF.create("取消", FONT_NAME.FONT_SKETCHFLOW_PRINT, 72);
                labelCancel.setScale(1.5);
                labelCancel.setPosition(256, 128);
                this.BUTTON_CANCEL.addChild(labelCancel);

                this.BUTTON_CANCEL.setScale(0.25 * 1.25);
                this.BUTTON_CANCEL.setAnchorPoint(0.0, 1.0);
                this.BUTTON_CANCEL.setPosition(SCREEN_SIZE.WIDTH/2 + 16, SCREEN_SIZE.HEIGHT/2 - 32);
                this.BACK_GROUND.addChild(this.BUTTON_CANCEL);

                this.BUTTON_CONFIRM =
                    new uiTouchFrameSprite(_frameButton[0], _frameButton[1],
                        function(target)
                        {
                            SELF.close();

                            if( SELF._callback )
                            {
                                SELF._callback(target);
                                SELF._callback = null;
                            }
                        }
                    );

                var labelConfirm = cc.LabelTTF.create("确认", FONT_NAME.FONT_SKETCHFLOW_PRINT, 72);
                labelConfirm.setScale(1.5);
                labelConfirm.setPosition(256, 128);
                labelConfirm.setColor(cc.color(80,255,80));
                this.BUTTON_CONFIRM.addChild(labelConfirm);

                this.BUTTON_CONFIRM.setScale(0.25 * 1.25);
                this.BUTTON_CONFIRM.setAnchorPoint(1.0, 1.0);
                this.BUTTON_CONFIRM.setPosition(SCREEN_SIZE.WIDTH/2 - 16, SCREEN_SIZE.HEIGHT/2 - 32);
                this.BACK_GROUND.addChild(this.BUTTON_CONFIRM);

            },
            show:function()
            {
                this.BUTTON_CONFIRM.lock();
                this.BUTTON_CANCEL.lock();
                this.setVisible(true);
            },
            close:function()
            {
                this.setVisible(false);
                this.BUTTON_CANCEL.unlock();
                this.BUTTON_CONFIRM.unlock();
            },
            onEnter: function () {
                this.BACK_GROUND.onEnter();
            },
            onExit: function () {
                this.BACK_GROUND.onExit();
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


var waitDlg = cc.LayerColor.extend(
    {
        ctor:function()
        {
            const size = cc.director.getWinSize();
            var SELF = this;

            this._super();
            this.setColor(0,0,0);
            this.setOpacity(75);

            var _label = cc.LabelTTF.create("Wait...", FONT_NAME.FONT_THONBURI, 32);
            _label.setAnchorPoint(0,0.5);
            _label.setPosition(size.width/2 - 32, size.height/2);
            this.addChild(_label);

            this.setVisible(false);

            this.TIMER = new GameTimer();

            var animIndex = 0;
            const labelString =
                [
                    "Wait.",
                    "Wait..",
                    "Wait...",
                    "Wait....",
                    "Wait.....",
                    "Wait......",
                ];

            this.TIMER.init(1000.0 / 2.0,
                function()
                {
                    _label.setString(labelString[animIndex]);
                    animIndex += 1;

                    if( animIndex >= labelString.length )
                    {
                        animIndex = 0;
                    }
                }
            );

        },
        show:function()
        {
            UI_TOUCH_MUTEX = true;
            this.setVisible(true);
        },
        close:function()
        {
            this.setVisible(false);
            UI_TOUCH_MUTEX = false;
        }
    }
);