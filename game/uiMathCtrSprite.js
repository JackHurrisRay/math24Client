/**
 * Created by Jack.L on 2017/6/7.
 */
var UIMATHCTRL_GROUP = {};

function UIMATCHCTRL_GROUP_CLEAR(key)
{
    var _group = UIMATHCTRL_GROUP[key];
    if( _group )
    {
        for( var i in _group )
        {
            _group[i].setSelect(false);
        }
    }
}

function UIMATCHCTRL_GROUP_GETSELECT(key)
{
    var _group = UIMATHCTRL_GROUP[key];
    var _ctrl = null;

    if( _group )
    {
        for( var i in _group )
        {
            if( _group[i].SELECT )
            {
                _ctrl = _group[i];
                break;
            }
        }
    }

    return _ctrl;
}

var uiMathCtrSprite = cc.Sprite.extend(
    {
        FRAME_NORMAL:null,
        FRAME_SELECT:null,
        SELECT:false,
        GROUP:null,
        LABEL:null,
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
                    onTouchBegan:function(touch, event)
                    {
                        if(!SELF.MUTEX&&UI_TOUCH_MUTEX)
                        {
                            return false;
                        }

                        if (!CHECK_VISIBLE(SELF))
                        {
                            return false;
                        }

                        var touchPos = touch.getLocation();
                        var locationInNode = SELF.convertToNodeSpace(touchPos);

                        var s = SELF.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, locationInNode)) {
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

                            const select = !SELF.SELECT;

                            SELF.setSelect(select);

                            if( SELF.callback_touch )
                            {
                                SELF.callback_touch(SELF);
                            }

                            if( SELF.SELECT && SELF.GROUP )
                            {
                                for( var i in SELF.GROUP )
                                {
                                    var _ctrl = SELF.GROUP[i];

                                    if( _ctrl && _ctrl != SELF )
                                    {
                                        _ctrl.setSelect(false);
                                    }
                                }
                            }

                        }
                    },
                    onTouchCancel:function(touch, event){

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
        addGroup:function(group_name)
        {
            var _group = UIMATHCTRL_GROUP[group_name];
            if( !_group )
            {
                UIMATHCTRL_GROUP[group_name] = [];
                _group = UIMATHCTRL_GROUP[group_name];
            }

            _group.push( this );
            this.GROUP = _group;
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
        },
        setLabel:function(text, font, size)
        {
            this.LABEL = cc.LabelTTF.create(text, font, size);
            const _size = this.getContentSize();
            this.LABEL.setPosition(_size.width/2, _size.height/2);
            this.addChild(this.LABEL);

            return this.LABEL;
        },
        setText:function(text)
        {
            if( this.LABEL )
            {
                this.LABEL.setString(text);
            }
        },
        getText:function()
        {
            var text = null;

            if( this.LABEL )
            {
                text = this.LABEL.getString();
            }

            return text;
        },
        addFrame:function(frame, name)
        {
            var spt = cc.Sprite.createWithSpriteFrame(frame);
            const _size = this.getContentSize();
            spt.setPosition(_size.width/2, _size.height/2);
            this.addChild(spt);

            this[name] = spt;
        }
    }
);

