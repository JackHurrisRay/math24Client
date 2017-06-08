/**
 * Created by Jack.L on 2017/6/7.
 */

const KEY_CTRL_NUMBER   = "CTRL_NUMBER";
const KEY_CTRL_OPERATOR = "CTRL_OPERATOR";

var sceneGame = cc.Scene.extend(
    {
        mathCtrlSystem:new math24Controller(),
        CHOOSE_NUMBER:null,
        CHOOSE_OPERATOR:null,
        ctor:function()
        {
            var SELF = this;
            this._super();

            const size = cc.director.getWinSize();

            ////////
            var _sceneLayer = cc.LayerColor.create();
            _sceneLayer.setColor(cc.color(GET_RAND(75),GET_RAND(75),GET_RAND(75) + 55));
            this.addChild(_sceneLayer);

            var _frame_back = cc.spriteFrameCache.getSpriteFrame("back2.png")
            var _back = cc.Sprite.createWithSpriteFrame(_frame_back);
            _back.setPosition(size.width/2, size.height/2);
            _sceneLayer.addChild(_back);

            ////////
            var _frameBack =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_back.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_back_select.png"),
                ];

            var _button_back = new uiTouchFrameSprite(_frameBack[0], _frameBack[1],
                function(target)
                {
                    var scene = new sceneMain();
                    var _trans = new cc.TransitionFadeBL(1, scene);//new cc.TransitionCrossFade(1, scene);
                    cc.director.runScene(_trans);
                }
            );

            _button_back.setAnchorPoint(1.0, 1.0);
            _button_back.setPosition(cc.p(SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT));
            _back.addChild(_button_back);

            ////////
            var _nodeCtrl = cc.Node.create();
            _nodeCtrl.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2 + 128);
            _back.addChild(_nodeCtrl);

            var _nodeOperator = cc.Node.create();
            _nodeOperator.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2 - 128);
            _back.addChild(_nodeOperator);

            ////////
            var _frameCtrl =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_choosenumber.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_prev.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_operator.png")
                ];

            var _frameCtrlSelect =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_choosenumber_select.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_prev_select.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_operator_select.png")
                ];

            ////////
            const _ctrlnumber_wideflag = 96;

            var _ctrlNumber_1 = new uiMathCtrSprite(_frameCtrl[0], _frameCtrlSelect[0], null);

            _ctrlNumber_1.setScale(0.5);
            _ctrlNumber_1.setPosition(cc.p(-_ctrlnumber_wideflag, _ctrlnumber_wideflag));
            _nodeCtrl.addChild(_ctrlNumber_1);

            var _ctrlNumber_2 = new uiMathCtrSprite(_frameCtrl[0], _frameCtrlSelect[0], null);
            _ctrlNumber_2.setFlippedX(true);

            _ctrlNumber_2.setScale(0.5);
            _ctrlNumber_2.setPosition(cc.p(_ctrlnumber_wideflag, _ctrlnumber_wideflag));
            _nodeCtrl.addChild(_ctrlNumber_2);

            var _ctrlNumber_3 = new uiMathCtrSprite(_frameCtrl[0], _frameCtrlSelect[0], null);
            _ctrlNumber_3.setFlippedY(true);

            _ctrlNumber_3.setScale(0.5);
            _ctrlNumber_3.setPosition(cc.p(-_ctrlnumber_wideflag, -_ctrlnumber_wideflag));
            _nodeCtrl.addChild(_ctrlNumber_3);

            var _ctrlNumber_4 = new uiMathCtrSprite(_frameCtrl[0], _frameCtrlSelect[0], null);
            _ctrlNumber_4.setFlippedX(true);
            _ctrlNumber_4.setFlippedY(true);

            _ctrlNumber_4.setScale(0.5);
            _ctrlNumber_4.setPosition(cc.p(_ctrlnumber_wideflag, -_ctrlnumber_wideflag));
            _nodeCtrl.addChild(_ctrlNumber_4);

            this.CTRL_NUMBER =
                [
                    _ctrlNumber_1,
                    _ctrlNumber_2,
                    _ctrlNumber_3,
                    _ctrlNumber_4
                ];

            var callback_number =
                function(target)
                {
                    if( target.SELECT )
                    {
                        if( SELF.CHOOSE_OPERATOR == null || SELF.CHOOSE_NUMBER == null )
                        {
                            SELF.CHOOSE_NUMBER = target;
                        }
                        else if( SELF.CHOOSE_NUMBER != target )
                        {
                            var targets = [SELF.CHOOSE_NUMBER, target, SELF.CHOOSE_OPERATOR];

                            var targetsIndex = [targets[0].INDEX, targets[1].INDEX];
                            var status =
                                [
                                    {text:SELF.CHOOSE_NUMBER.getText(), value:SELF.CHOOSE_NUMBER.VALUE,visible:true, select:true,value_ex:SELF.CHOOSE_NUMBER.VALUE_EX},
                                    {text:target.getText(), value:target.VALUE, visible:true, select:false, value_ex:target.VALUE_EX},
                                ];

                            SELF.mathCtrlSystem.push_ctrl(
                                targetsIndex,status,
                                function(targetArray, statusArray, prev)
                                {
                                    var ctrl_numbers = [SELF.CTRL_NUMBER[targetArray[0]],SELF.CTRL_NUMBER[targetArray[1]]];

                                    UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_NUMBER);

                                    ctrl_numbers[0].setText(statusArray[0].text);
                                    ctrl_numbers[0].VALUE = statusArray[0].value;
                                    ctrl_numbers[0].VALUE_EX = statusArray[0].value_ex;
                                    ctrl_numbers[0].setVisible(statusArray[0].visible);
                                    ctrl_numbers[0].setSelect(statusArray[0].select);

                                    ctrl_numbers[1].setText(statusArray[1].text);
                                    ctrl_numbers[1].VALUE = statusArray[1].value;
                                    ctrl_numbers[1].VALUE_EX = statusArray[1].value_ex;
                                    ctrl_numbers[1].setVisible(statusArray[1].visible);
                                    ctrl_numbers[1].setSelect(statusArray[1].select);

                                    SELF.CHOOSE_NUMBER = ctrl_numbers[0];
                                    UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_OPERATOR);
                                }
                            );

                            const operator_index = SELF.CHOOSE_OPERATOR.OPERATOR;
                            const valueForTwo   = [targets[0].VALUE, targets[1].VALUE];
                            const valueExForTwo = [targets[0].VALUE_EX, targets[1].VALUE_EX];

                            var New_Value = 0;
                            var New_Value_Ex = 0;

                            switch(operator_index)
                            {
                                case 0:
                                {
                                    //+
                                    if( valueExForTwo[0] == 1 && valueExForTwo[1] == 1 )
                                    {
                                        New_Value = valueForTwo[0] + valueForTwo[1];
                                        New_Value_Ex = 1;
                                    }
                                    else
                                    {
                                        New_Value = valueForTwo[0] * valueExForTwo[1] + valueForTwo[1] * valueExForTwo[0];
                                        New_Value_Ex = valueExForTwo[0] * valueExForTwo[1];

                                        if( New_Value % New_Value_Ex == 0 )
                                        {
                                            New_Value = New_Value / New_Value_Ex;
                                            New_Value_Ex = 1;
                                        }
                                    }

                                    break;
                                }
                                case 1:
                                {
                                    //-
                                    if( valueExForTwo[0] == 1 && valueExForTwo[1] == 1 )
                                    {
                                        New_Value = valueForTwo[0] - valueForTwo[1];
                                        New_Value_Ex = 1;
                                    }
                                    else
                                    {
                                        New_Value = valueForTwo[0] * valueExForTwo[1] - valueForTwo[1] * valueExForTwo[0];
                                        New_Value_Ex = valueExForTwo[0] * valueExForTwo[1];

                                        if( New_Value % New_Value_Ex == 0 )
                                        {
                                            New_Value = New_Value / New_Value_Ex;
                                            New_Value_Ex = 1;
                                        }
                                    }

                                    break;
                                }
                                case 2:
                                {
                                    //x
                                    if( valueExForTwo[0] == 1 && valueExForTwo[1] == 1 )
                                    {
                                        New_Value = valueForTwo[0] * valueForTwo[1];
                                        New_Value_Ex = 1;
                                    }
                                    else
                                    {
                                        New_Value = valueForTwo[0] * valueForTwo[1];
                                        New_Value_Ex = valueExForTwo[0] * valueExForTwo[1];

                                        if( New_Value % New_Value_Ex == 0 )
                                        {
                                            New_Value = New_Value / New_Value_Ex;
                                            New_Value_Ex = 1;
                                        }
                                    }

                                    break;
                                }
                                case 3:
                                {
                                    //~~/
                                    if( valueExForTwo[0] == 1 && valueExForTwo[1] == 1 )
                                    {
                                        New_Value = valueForTwo[0];
                                        New_Value_Ex = valueForTwo[1];

                                        if( New_Value % New_Value_Ex == 0 )
                                        {
                                            New_Value = New_Value / New_Value_Ex;
                                            New_Value_Ex = 1;
                                        }
                                    }
                                    else
                                    {
                                        New_Value = valueForTwo[0] * valueExForTwo[1];
                                        New_Value_Ex = valueExForTwo[0] * valueForTwo[1];

                                        if( New_Value % New_Value_Ex == 0 )
                                        {
                                            New_Value = New_Value / New_Value_Ex;
                                            New_Value_Ex = 1;
                                        }
                                    }

                                    break;
                                }
                            }

                            ////////
                            SELF.CHOOSE_NUMBER.setVisible(false);
                            SELF.CHOOSE_NUMBER = target;
                            SELF.CHOOSE_NUMBER.VALUE = New_Value;
                            SELF.CHOOSE_NUMBER.VALUE_EX = New_Value_Ex;

                            if( New_Value_Ex == 1 )
                            {
                                SELF.CHOOSE_NUMBER.setText(New_Value.toString());
                            }
                            else
                            {
                                SELF.CHOOSE_NUMBER.setText(New_Value.toString() + "/" + New_Value_Ex.toString());
                            }

                            const _step_dinex = SELF.mathCtrlSystem.STEP_INDEX;
                            cc.log("math control step for :" + _step_dinex.toString());

                            if( _step_dinex == 3 )
                            {
                                ////////
                                if( New_Value == 24 && New_Value_Ex == 1 )
                                {
                                    show_common_dialog("胜利","恭喜您赢的本局胜利，触摸屏幕进入下一局",
                                        function()
                                        {
                                            SELF.randStart();
                                        }
                                    );
                                }
                                else
                                {
                                    show_common_dialog("失败","您的计算结果不正确，请重新计算",
                                        function()
                                        {
                                            SELF.mathCtrlSystem.prev();
                                        }
                                    );
                                }
                            }
                        }

                        UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_OPERATOR);
                        SELF.CHOOSE_OPERATOR = null;
                    }
                    else
                    {
                        if( target == SELF.CHOOSE_NUMBER )
                        {
                            UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_OPERATOR);
                            SELF.CHOOSE_OPERATOR = null;
                        }
                    }
                };

            var callback_operator =
                function(target)
                {
                    if( target.SELECT )
                    {
                        SELF.CHOOSE_OPERATOR = target;
                    }
                    else
                    {
                        SELF.CHOOSE_OPERATOR = null;
                    }
                };

            for( var i in this.CTRL_NUMBER )
            {
                this.CTRL_NUMBER[i].setLabel("",FONT_NAME.FONT_THONBURI, 72);
                this.CTRL_NUMBER[i].addGroup(KEY_CTRL_NUMBER);
                this.CTRL_NUMBER[i].setCallback(callback_number);
                this.CTRL_NUMBER[i].INDEX = parseInt(i);
            }

            ////////
            var _ctrlPrev = new uiTouchFrameSprite(_frameCtrl[1], _frameCtrlSelect[1],
                function(target)
                {
                    SELF.mathCtrlSystem.prev();
                    if( SELF.CHOOSE_OPERATOR )
                    {
                        SELF.CHOOSE_OPERATOR.setSelect(false);
                        SELF.CHOOSE_OPERATOR = null;
                    }
                }
            );

            _ctrlPrev.setScale(0.5);
            _nodeCtrl.addChild(_ctrlPrev);

            var _labelPrev = cc.LabelTTF.create("撤销", FONT_NAME.FONT_SKETCHFLOW_PRINT, 64);
            _labelPrev.setPosition(cc.p(128, 128));
            _ctrlPrev.addChild(_labelPrev);

            ////////
            const _posOperator =
                [
                    cc.p(-150, 0),
                    cc.p(-50, 0),
                    cc.p(50,0),
                    cc.p(150,0)
                ];

            const _frameOperator =
                [
                    cc.spriteFrameCache.getSpriteFrame("operator_0.png"),
                    cc.spriteFrameCache.getSpriteFrame("operator_1.png"),
                    cc.spriteFrameCache.getSpriteFrame("operator_2.png"),
                    cc.spriteFrameCache.getSpriteFrame("operator_3.png"),
                ];

            this.CTRL_OPERATOR = [null,null,null,null];

            for( var i in _posOperator )
            {
                this.CTRL_OPERATOR[i] = new uiMathCtrSprite(_frameCtrl[2],_frameCtrlSelect[2],null);
                this.CTRL_OPERATOR[i].setScale(0.5 * 0.75);
                this.CTRL_OPERATOR[i].setPosition(_posOperator[i]);
                this.CTRL_OPERATOR[i].addGroup(KEY_CTRL_OPERATOR);
                this.CTRL_OPERATOR[i].addFrame(_frameOperator[i], "OPERATOR_" + i.toString());
                this.CTRL_OPERATOR[i].setCallback(callback_operator);

                this.CTRL_OPERATOR[i].OPERATOR = parseInt(i);

                _nodeOperator.addChild(this.CTRL_OPERATOR[i]);
            }

            ////////
            this.randStart();
        },
        randStart:function()
        {
            const _talbeSize = MATH24_TABLE.length;
            const _index = GET_RAND(_talbeSize);

            const _data = MATH24_TABLE[_index];
            this.start(_data.parament[0], _data.parament[1], _data.parament[2], _data.parament[3]);
        },
        start:function(n1,n2,n3,n4)
        {
            this.CTRL_NUMBER[0].setText(n1.toString());
            this.CTRL_NUMBER[1].setText(n2.toString());
            this.CTRL_NUMBER[2].setText(n3.toString());
            this.CTRL_NUMBER[3].setText(n4.toString());

            this.CTRL_NUMBER[0].VALUE = n1;
            this.CTRL_NUMBER[1].VALUE = n2;
            this.CTRL_NUMBER[2].VALUE = n3;
            this.CTRL_NUMBER[3].VALUE = n4;

            this.mathCtrlSystem.begin();

            this.CHOOSE_NUMBER   = null;
            this.CHOOSE_OPERATOR = null;

            for( var i in this.CTRL_NUMBER )
            {
                this.CTRL_NUMBER[i].setVisible(true);
                this.CTRL_NUMBER[i].VALUE_EX = 1;
            }

            UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_NUMBER);
            UIMATCHCTRL_GROUP_CLEAR(KEY_CTRL_OPERATOR);
        }
    }
);
