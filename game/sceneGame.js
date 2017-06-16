/**
 * Created by Jack.L on 2017/6/7.
 */

var sceneGame = cc.Scene.extend(
    {
        mathCtrlSystem:new math24Controller(),
        CHOOSE_NUMBER:null,
        CHOOSE_OPERATOR:null,
        QUESTION_INDEX:0,
        QUESTION_CURRENT:null,
        ANSWER_CURRENT:null,
        TIMER:new GameTimer(),
        START_TIME:new Date(),
        TOTAL_TIME:0,
        GAME_RECORD:[],
        AROUND_START:new Date(),
        GAME_END:false,
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
                    show_confirm_dialog("退出练习","您确认要退出当前的练习么？",
                        function()
                        {
                            TDMissionResult(false, "玩家主动退出练习");

                            var scene = new sceneMain();
                            var _trans = new cc.TransitionFadeBL(1, scene);//new cc.TransitionCrossFade(1, scene);
                            cc.director.runScene(_trans);
                        }
                    );
                }
            );

            _button_back.setAnchorPoint(1.0, 1.0);
            _button_back.setPosition(cc.p(SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT));
            _back.addChild(_button_back);

            ////////
            this.UI_NODE = cc.Node.create();
            this.UI_NODE.setPosition(SCREEN_SIZE.WIDTH/2, SCREEN_SIZE.HEIGHT/2);
            _back.addChild(this.UI_NODE);
            this.UI_NODE.setScale(1.00);

            var _nodeCtrl = cc.Node.create();
            _nodeCtrl.setPosition(0, 128);
            this.UI_NODE.addChild(_nodeCtrl);

            var _nodeOperator = cc.Node.create();
            _nodeOperator.setPosition(0, - 128);
            this.UI_NODE.addChild(_nodeOperator);

            var _nodeEx       = cc.Node.create();
            _nodeEx.setPosition(0, -256);
            this.UI_NODE.addChild(_nodeEx);

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
                                    ////////
                                    //record player status
                                    var _RESULT_RECORD = {last: (new Date()).getTime() - SELF.AROUND_START.getTime()};
                                    SELF.GAME_RECORD.push(_RESULT_RECORD);

                                    ////////
                                    if(SELF.QUESTION_INDEX < PlayerData.QUESTIONS.length )
                                    {
                                        show_common_dialog("胜利","恭喜您赢的本局胜利，触摸屏幕进入下一局",
                                            function()
                                            {
                                                //SELF.randStart();
                                                SELF.nextQuestion();
                                            }
                                        );
                                    }
                                    else
                                    {
                                        SELF.GAME_END = true;
                                        var _resultNode = SELF.showResult();

                                        show_common_dialog("训练结束","恭喜您完成了训练，休息一下吧，看看自己训练的结果，离天才还有多远呢",
                                            function()
                                            {
                                                TDMissionResult(true, "");
                                                
                                                var scene = new sceneMain();
                                                var _trans = new cc.TransitionFadeBL(1, scene);//new cc.TransitionCrossFade(1, scene);
                                                cc.director.runScene(_trans);

                                                _resultNode.removeFromParent(true);
                                            }
                                        );
                                    }

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
                var _label = this.CTRL_NUMBER[i].setLabel("",FONT_NAME.FONT_THONBURI, 72);
                _label.setScale(1.8);

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
            var frame_help =
                [
                    cc.spriteFrameCache.getSpriteFrame("button_common_1.png"),
                    cc.spriteFrameCache.getSpriteFrame("button_common_1_select.png")
                ];

            var button_Help = new uiTouchFrameSprite(
                frame_help[0],frame_help[1],
                function(target)
                {
                    if( SELF.ANSWER_CURRENT )
                    {
                        show_common_dialog("参考答案",SELF.ANSWER_CURRENT);
                        return;
                    }

                    if( PlayerData.GOLD == 0 )
                    {
                        TDEventTouch({"参考答案":"智慧星不足"});
                        show_common_dialog("智慧星不足","您的智慧星不足，请开动脑筋解答吧，帮不了你了哟");
                        return;
                    }

                    show_confirm_dialog("参考答案","您要查询参考答案需要花费1颗智慧星哟",
                        function()
                        {
                            ////////
                            //show_common_dialog("参考答案",SELF.QUESTION_CURRENT.result);

                            show_wait();
                            request_GameFindAnswer(
                                SELF.QUESTION_INDEX-1,
                                function(data)
                                {
                                    if( data.status == 0 )
                                    {
                                        SELF.ANSWER_CURRENT = data.answer;
                                        show_common_dialog("参考答案",data.answer);
                                        PlayerData.GOLD = data.GOLD;
                                        PlayerData.refreshGoldUI();

                                        TDEventTouch({"参考答案":"耗费智慧星"});
                                    }
                                    else
                                    {
                                        show_common_dialog("网络错误","网络出现错误，错误代码:"+data.status.toString());
                                    }

                                    close_wait();
                                    return;
                                }
                            );

                        }
                    );
                }
            );

            button_Help.setAnchorPoint(0.0, 0.5);
            button_Help.setScale(0.5);
            button_Help.setPosition(cc.p(-128-64-10, 8));
            _nodeEx.addChild(button_Help);

            const _buttonHelpSize = button_Help.getContentSize();

            var _frameLight = cc.spriteFrameCache.getSpriteFrame("icon_light.png");
            var sptLight = cc.Sprite.createWithSpriteFrame(_frameLight);
            sptLight.setAnchorPoint(0.0, 0.5);
            sptLight.setPosition(cc.p(16.0, _buttonHelpSize.height/2));
            button_Help.addChild(sptLight);

            var _labelHelp = cc.LabelTTF.create("参考答案", FONT_NAME.FONT_SKETCHFLOW_PRINT, 64);
            _labelHelp.setAnchorPoint(0.0, 0.5);
            _labelHelp.setPosition(cc.p(16.0 + 128, _buttonHelpSize.height/2));
            button_Help.addChild(_labelHelp);

            ////////
            var _backAroundInfo = cc.Sprite.createWithSpriteFrame(_frameCtrl[2]);
            _backAroundInfo.setAnchorPoint(0, 1);
            _backAroundInfo.setScale(0.5);
            _backAroundInfo.setPosition(380, SCREEN_SIZE.HEIGHT - 4);
            this.addChild(_backAroundInfo);

            var labelAround = cc.LabelTTF.create("0/0",FONT_NAME.FONT_HEITI,64);
            labelAround.setScale(1.25);
            labelAround.setPosition(128,128);
            _backAroundInfo.addChild(labelAround);

            this.SET_AROUND =
                function(cur, max)
                {
                    labelAround.setString(cur.toString() + "/" + max.toString());
                }

            ////////
            //timer
            var labelTimer = cc.LabelTTF.create("00:00:00", FONT_NAME.FONT_HEITI, 32);
            labelTimer.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            labelTimer.setAnchorPoint(0,1.0);
            labelTimer.setPosition(16, size.height - 140);
            this.addChild(labelTimer);

            setTimeout(
                function()
                {
                    if(SELF.GAME_END)
                    {
                        return;
                    }

                    SELF.START_TIME = new Date();
                    SELF.TIMER.init(
                        100,
                        function()
                        {
                            const startTime = SELF.START_TIME.getTime();

                            SELF.TOTAL_TIME = (new Date()).getTime() - startTime;
                            const lastTime = SELF.TOTAL_TIME/1000;

                            var h = Math.floor( lastTime / 3600 );
                            var m = Math.floor( (lastTime - h*3600)/60 );
                            var s = Math.floor( (lastTime - h*3600 - m*60) );

                            var sh = (h<10)?"0"+ h.toString(): h.toString();
                            var sm = (m<10)?"0"+ m.toString(): m.toString();
                            var ss = (s<10)?"0"+ s.toString(): s.toString();

                            labelTimer.setString(sh + ":" + sm + ":" + ss);
                        }
                    );
                },
                1000
            );

            ////////
            var _frame_check_result =
                [
                    cc.spriteFrameCache.getSpriteFrame("check_10.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_9.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_8.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_7.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_6.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_5.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_4.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_3.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_2.png"),
                    cc.spriteFrameCache.getSpriteFrame("check_1.png"),
                ];

            var _getLevelFromNumber =
                function(number, v)
                {
                    var _index = 9;

                    for( var i=0; i<10; i++ )
                    {
                        const check_number = v[i];
                        if( number * 1.0 < check_number * 1000.0 )
                        {
                            _index = i;
                            break;
                        }
                    }

                    return _index;
                };

            var resultNode = cc.Node.create();
            resultNode.setPosition(size.width/2, size.height/2);
            resultNode.setVisible(false);
            cc._NoticeficationNode.addChild(resultNode);

            var resultArray = [];
            var backArray   = [];

            const resultTitle = ["总耗时:", "平均值:","采样值:","方差值:","均方差:"];

            for( var i=0; i<5; i++ )
            {
                var _backresult = cc.Sprite.createWithSpriteFrame(_frame_check_result[9]);
                _backresult.setScale(0.95);
                _backresult.setAnchorPoint(0.5, 1.0);
                _backresult.setPosition(0, -8-i*96);
                resultNode.addChild(_backresult);
                backArray.push(_backresult);

                var _result = cc.LabelTTF.create(resultTitle[i],FONT_NAME.FONT_HEITI, 32);
                _result.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                _result.setAnchorPoint(0, 0);
                _result.setPosition(18.0, 12.0);
                _backresult.addChild(_result);
                resultArray.push(_result);
            }

            var _transforSecToString =
                function(number)
                {
                    var _n1 = number/10;
                    var _n2 = Math.floor(_n1);
                    var _n3 = _n2 / 100;

                    var _str = _n3.toString();
                    return _str;
                }

            this.showResult =
                function()
                {
                    ////////
                    const _timeResult =
                        [
                            SELF.TOTAL_TIME,
                            SELF.computerAv1(),
                            SELF.computerAv2(),
                            SELF.computerAv3(),
                            SELF.computerAv4(),
                        ];

                    ////////
                    var _backindexArray =
                        [
                            _getLevelFromNumber(_timeResult[0], LEVEL_SCORE.v0),
                            _getLevelFromNumber(_timeResult[1], LEVEL_SCORE.v1),
                            _getLevelFromNumber(_timeResult[2], LEVEL_SCORE.v2),
                            _getLevelFromNumber(_timeResult[3], LEVEL_SCORE.v3),
                            _getLevelFromNumber(_timeResult[4], LEVEL_SCORE.v4),
                        ];

                    ////////
                    var _totalindex = 0;
                    for( var i in _backindexArray )
                    {
                        ////////
                        const index = _backindexArray[i];
                        backArray[i].initWithSpriteFrame(_frame_check_result[index]);

                        _totalindex += index;
                    }

                    _totalindex = _totalindex / _backindexArray.length;
                    _totalindex = Math.floor(_totalindex + 0.5);

                    ////////
                    for( var i in  resultArray )
                    {
                        resultArray[i].setString(resultTitle[i] + _transforSecToString(_timeResult[i]) + "秒" );
                    }

                    //total result
                    var _totalSpt = cc.Sprite.createWithSpriteFrame(_frame_check_result[_totalindex]);
                    _totalSpt.setScale(0.95);
                    _totalSpt.setPosition(0, 128 + 128 + 56);
                    resultNode.addChild(_totalSpt);

                    var _totalResult = cc.LabelTTF.create("总评价",FONT_NAME.FONT_HEITI, 36);
                    _totalResult.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                    _totalResult.setAnchorPoint(0, 0);
                    _totalResult.setPosition(18.0, 12.0);
                    _totalSpt.addChild(_totalResult);

                    resultNode.setVisible(true);
                    return resultNode;
                };

            //this.showResult();

            ////////
            //this.randStart();
            this.nextQuestion();
        },
        computerAv1:function()
        {
            const count = this.GAME_RECORD.length;

            var result = 0;
            for( var i in this.GAME_RECORD )
            {
                result += this.GAME_RECORD[i].last;
            }

            result = result / count;
            return Math.floor(result);

        },
        computerAv2:function()
        {
            const count = this.GAME_RECORD.length;

            var array = [];
            for( var i in this.GAME_RECORD )
            {
                array.push(this.GAME_RECORD[i].last);
            }

            array.sort();

            var result = 0;
            for( var i in array )
            {
                if( i != 0 && i != count - 1 )
                {
                    result += array[i];
                }
            }

            result = result / (count - 2);
            return Math.floor(result);

        },
        computerAv3:function()
        {
            const count = this.GAME_RECORD.length;

            var result = 0;
            for( var i in this.GAME_RECORD )
            {
                result += this.GAME_RECORD[i].last * this.GAME_RECORD[i].last;
            }

            result = Math.sqrt( result );
            return Math.floor(result);

        },
        computerAv4:function()
        {
            const count = this.GAME_RECORD.length;

            var result = 0;
            for( var i in this.GAME_RECORD )
            {
                result += this.GAME_RECORD[i].last * this.GAME_RECORD[i].last;
            }

            result = result / count;
            result = Math.sqrt( result );

            return Math.floor(result);

        },
        nextQuestion:function()
        {
            ////////
            this.QUESTION_CURRENT = PlayerData.QUESTIONS[this.QUESTION_INDEX];
            this.QUESTION_INDEX += 1;

            var _cellArray = this.QUESTION_CURRENT.parament;
            this.QUESTION_CURRENT.parament = changeArray4Sort(_cellArray);

            var _data = this.QUESTION_CURRENT;

            this.start(_data.parament[0], _data.parament[1], _data.parament[2], _data.parament[3]);

            this.SET_AROUND(this.QUESTION_INDEX, PlayerData.QUESTIONS.length);
            this.ANSWER_CURRENT = null;

            ////////
            this.AROUND_START = new Date();
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
