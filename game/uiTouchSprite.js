/**
 * Created by Jack.L on 2017/2/23 0023.
 */
var UI_TOUCH_END_SWITCH = true;
var UI_TOUCH_MUTEX = false;

function CHECK_VISIBLE(node)
{
    var _check = true;

    var _temp = node;

    while(_temp!=null)
    {
        if( !_temp.isVisible() )
        {
            _check = false;
            break;
        }
        else
        {
            _temp = _temp.getParent();
        }
    }

    return _check;
}

var uiTouchSprite = cc.Sprite.extend(
    {
        TARGET:null,
        TOUCH_SOUND:res_sound.touch,
        MUTEX:false,
        lock:function()
        {
            this.MUTEX = true;
            UI_TOUCH_MUTEX = true;
        },
        unlock:function()
        {
            this.MUTEX = false;
            UI_TOUCH_MUTEX = false;
        },
        setTarget:function(target)
        {
            this.TARGET = target;
        },
        ctor:function(funcBegan,funcMoved,funcEnd,funcCancel,target)
        {
            ////
            this._super();

            ////
            this.setTarget(target);
            var SELF = this;

            SELF.setSwallowTouches =
                function(set)
                {
                    SELF._listener.swallowTouches = set;
                };

            ////
            this._listener = cc.EventListener.create(
                {
                    ////
                    event:cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches:false,

                    ////////
                    onTouchBegan: function (touch, event) {

                        if(!SELF.MUTEX&&UI_TOUCH_MUTEX)
                        {
                            return false;
                        }

                        var target = event.getCurrentTarget();

                        if( !CHECK_VISIBLE(target) )
                        {
                            return false;
                        }

                        if(this._funcBegan != null)
                        {
                            this._funcBegan(touch, event, target.TARGET);
                            return true;
                        }
                        else
                        {
                            if( !UI_TOUCH_END_SWITCH )
                            {
                                return false;
                            }

                            var touchPos = touch.getLocation();
                            //touchPos.x = touchPos.x / 2.0;
                            //touchPos.y = touchPos.y * SCREEN_SIZE.HEIGHT / 360;

                            var locationInNode = target.convertToNodeSpace(touchPos);

                            var s = target.getContentSize();
                            var rect = cc.rect(0, 0, s.width, s.height);
                            if (cc.rectContainsPoint(rect, locationInNode)) {
                                cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                                target.opacity = 180;

                                return true;
                            }
                            return false;
                        }
                    },
                    onTouchMoved: function (touch, event) {
                        if(this._funcMoved != null)
                        {
                            var target = event.getCurrentTarget();
                            this._funcMoved(touch, event, target.TARGET);
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        if (this._funcEnd != null)
                        {
                            var target = event.getCurrentTarget();
                            target.opacity = 255;

                            ////
                            var touchPos = touch.getLocation();
                            //touchPos.x = touchPos.x / 2.0;
                            //touchPos.y = touchPos.y * SCREEN_SIZE.HEIGHT / 360;

                            var locationInNode = target.convertToNodeSpace(touchPos);
                            var s = target.getContentSize();
                            var rect = cc.rect(0, 0, s.width, s.height);
                            if (cc.rectContainsPoint(rect, locationInNode) && UI_TOUCH_END_SWITCH) {
                                optionSys.getInstance().playSound(SELF.TOUCH_SOUND);
                                this._funcEnd(touch, event, target.TARGET);
                            }
                        }
                    },
                    onTouchCancel:function(touch, event){
                        if(this._funcCancel != null )
                        {
                            var target = event.getCurrentTarget();
                            target.opacity = 255;

                            this._funcCancel(touch, event, target.TARGET);
                        }
                    }
                }
            );

            ////////
            this._listener._funcBegan    = funcBegan;
            this._listener._funcMoved    = funcMoved;
            this._listener._funcEnd      = funcEnd;
            this._listener._funcCancel   = funcCancel;
        },

        onEnter: function ()
        {
            this._super();
            cc.eventManager.addListener(this._listener, this);
        },

        onExit:function()
        {
            cc.eventManager.removeListener(this._listener);
        }
    }
);

var uiTouchFrameSprite = cc.Sprite.extend(
    {
        FRAME_NORMAL:null,
        FRAME_SELECT:null,
        GROUP:null,
        ctor:function(frame_normal, frame_select, callback_touch)
        {
            this._super();
            var SELF = this;
            SELF.callback_touch = callback_touch;

            this.FRAME_NORMAL = frame_normal;
            this.FRAME_SELECT = frame_select;

            this.initWithSpriteFrame(this.FRAME_NORMAL);

            this._listener = cc.EventListener.create(
                {
                    event:cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches:true,
                    onTouchBegan:function(touch, event) {
                        if (!CHECK_VISIBLE(SELF)) {
                            return false;
                        }

                        var touchPos = touch.getLocation();
                        var locationInNode = SELF.convertToNodeSpace(touchPos);

                        var s = SELF.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            SELF.setSelect(true);
                            return true;
                        }

                        return false;
                    },
                    onTouchMoved:function(touch, event){

                    },
                    onTouchEnded:function(touch, event){
                        ////
                        var touchPos = touch.getLocation();

                        var locationInNode = SELF.convertToNodeSpace(touchPos);
                        var s = SELF.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, locationInNode) && UI_TOUCH_END_SWITCH) {
                            optionSys.getInstance().playSound(SELF.TOUCH_SOUND);

                            SELF.setSelect(false);

                            if( SELF.callback_touch )
                            {
                                SELF.callback_touch(SELF);
                            }
                        }
                    },
                    onTouchCancel:function(touch, event){
                        SELF.setSelect(false);
                    }
                }
            );
        },
        setSelect:function(select)
        {
            this.SELECT = select;

            if( this.SELECT )
            {
                this.initWithSpriteFrame(this.FRAME_SELECT);
            }
            else
            {
                this.initWithSpriteFrame(this.FRAME_NORMAL);
            }
        },
        onEnter:function()
        {
            this._super();
            cc.eventManager.addListener(this._listener, this);
        },
        onExit:function()
        {
            cc.eventManager.removeListener(this._listener);
        },
        setCallback:function(callback)
        {
            this.callback_touch = callback;
        }
    }
);

