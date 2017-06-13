/**
 * Created by Jack on 2017/3/25.
 */
var GAME_TIMER = new GameTimer();
function game_init()
{
    cc.spriteFrameCache.addSpriteFrames(res_pix.PIX_PLIST, res_pix.PIX_PNG);

    ////////
    var frame_info =
        [
            cc.spriteFrameCache.getSpriteFrame("button_common_2.png"),
            cc.spriteFrameCache.getSpriteFrame("icon_chance.png"),
            cc.spriteFrameCache.getSpriteFrame("button_question.png"),
            cc.spriteFrameCache.getSpriteFrame("button_question_select.png")
        ];

    var sptFrame = cc.Sprite.createWithSpriteFrame(frame_info[0]);
    sptFrame.setScale(0.5);
    sptFrame.setAnchorPoint(0,1);
    sptFrame.setPosition(4, SCREEN_SIZE.HEIGHT - 4);
    cc._NoticeficationNode.addChild(sptFrame);

    cc.callback_GOLD_FROM = null;

    var sptChance =
        //cc.Sprite.createWithSpriteFrame(frame_info[1]);
        new uiTouchFrameSprite(
            frame_info[1],frame_info[1],
            function(target)
            {
                ////////
                if( cc.callback_GOLD_FROM )
                {
                    cc.callback_GOLD_FROM();
                    cc.callback_GOLD_FROM = null;
                }

                sptChance.stopAllActions();
            }
        );

    cc.SET_SPTCHANCE = function(callback)
    {
        cc.callback_GOLD_FROM = callback;
        var action1 = cc.Sequence.create(
            cc.ScaleTo.create(0.125, 1.08),
            cc.ScaleTo.create(0.125, 1.0),
            cc.ScaleTo.create(0.125, 0.92),
            cc.ScaleTo.create(0.125, 1.0)
        );

        var button_anim = cc.RepeatForever.create(action1);
        sptChance.runAction(button_anim);
    };

    sptChance.setAnchorPoint(0.5,0.5);
    sptChance.setPosition(32 + 90, 128);
    sptFrame.addChild(sptChance);

    ////////
    var labelChance = cc.LabelTTF.create("0", FONT_NAME.FONT_HEITI, 72 );
    labelChance.setScale(1.5);
    labelChance.setAnchorPoint(0,0.5);
    labelChance.setPosition(256, 128 - 8);
    labelChance.textAlign = cc.TEXT_ALIGNMENT_LEFT;
    sptFrame.addChild(labelChance);

    var button_info = new uiTouchFrameSprite(
        frame_info[2], frame_info[3],
        function(target)
        {
            ////////
            const size = cc.director.getWinSize();

            var _frame = cc.spriteFrameCache.getSpriteFrame("info_back_ex.png");
            var _spt   = cc.Sprite.createWithSpriteFrame(_frame);
            _spt.setAnchorPoint(0.5, 1.0);
            _spt.setPosition(size.width/2, size.height);
            cc._TOP_ROOT.addChild(_spt);

            show_common_dialog("智慧星", "参考答案或竞速模式都会消耗智慧星。不过第二天智慧星会加满哟，积极分享也有机会获取额外的智慧星哟。",
                function()
                {
                    cc._TOP_ROOT.removeAllChildrenWithCleanup(true);
                }
            );

            button_info.stopAllActions();
        }
    );

    button_info.setAnchorPoint(0.5, 0.5);
    button_info.setPosition(768 - 32 - 80, 128);
    sptFrame.addChild(button_info);

    var action1 = cc.Sequence.create(
        cc.ScaleTo.create(0.125, 1.08),
        cc.ScaleTo.create(0.125, 1.0),
        cc.ScaleTo.create(0.125, 0.92),
        cc.ScaleTo.create(0.125, 1.0)
    );

    var button_anim = cc.RepeatForever.create(action1);
    button_info.runAction(button_anim);

    ////////
    cc.SET_GOLD =
        function(GOLD,GOLD_MAX)
        {
            labelChance.setString(GOLD.toString() + "/" + GOLD_MAX.toString());
        };


    ////////
    cc._commonDialog = new commonDlg();
    cc._NoticeficationNode.addChild(cc._commonDialog);

    cc._commonConfirmDlg = new commonConfirmDlg();
    cc._NoticeficationNode.addChild(cc._commonConfirmDlg);

    cc._commonWaitDlg = new waitDlg;
    cc._NoticeficationNode.addChild(cc._commonWaitDlg);


    ////////
    cc._TOP_ROOT = cc.Node.create();
    cc._TOP_ROOT.setPosition(0,0);
    cc._NoticeficationNode.addChild(cc._TOP_ROOT);


};


function show_common_dialog(title, info, callback)
{
    cc._commonDialog.setInfo(title, info, callback);
    cc._commonDialog.show();
};

function show_confirm_dialog(title, info, callback)
{
    cc._commonConfirmDlg.setInfo(title, info, callback);
    cc._commonConfirmDlg.show();
};

function show_wait()
{
    cc._commonWaitDlg.show();
}

function close_wait()
{
    cc._commonWaitDlg.close();
}

function TDRecord()
{
    const item_name = "智慧星";
    TDGA.onItemPurchase({
        item :item_name,
        itemNumber : 1,
        priceInVirtualCurrency : data.priceInVirtualCurrency
    });

    TDGA.onItemUse({
        item :item_name,
        itemNumber : 1
    });
};

const MISSION_NAME =
    [
        "普通练习",
        "竞速比赛"
    ];

var _MISSION_INDEX = 0;

function TDMissionBegin(index)
{
    _MISSION_INDEX = index;
    TDGA.onMissionBegin(MISSION_NAME[_MISSION_INDEX]);
}

function TDMissionResult(success, cause)
{
    if( success )
    {
        TDGA.onMissionCompleted(MISSION_NAME[_MISSION_INDEX]);
    }
    else
    {
        TDGA.onMissionFailed(MISSION_NAME[_MISSION_INDEX], cause?cause.toString():"unknown");
    }
}

function initShader()
{
    ////////
    {
        var shader = new cc.GLProgram.create(res_shader.VS_NORMAL, res_shader.PS_AROUND_RECT);
        shader.retain();

        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

        shader.link();
        shader.updateUniforms();

        cc.SHADER_playerImg = shader;
    }

    {
        var shader = new cc.GLProgram.create(res_shader.VS_NORMAL, res_shader.PS_FIGHT_IMG_UP);
        shader.retain();

        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

        shader.link();
        shader.updateUniforms();

        cc.SHADER_playerGameImgUP = shader;
    }

    {
        var shader = new cc.GLProgram.create(res_shader.VS_NORMAL, res_shader.PS_FIGHT_IMG_DOWN);
        shader.retain();

        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);

        shader.link();
        shader.updateUniforms();

        cc.SHADER_playerGameImgDown = shader;
    }
}

////////
window.onload = function(){

    cc.game.onStart = function(){

        //
        cc.view.enableRetina(true);
        cc.view.setDesignResolutionSize(SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT,
            cc.ResolutionPolicy.SHOW_ALL
        );

        cc.screen.requestFullScreen();

        cc._NoticeficationNode = cc.Node.create();
        cc.director.setNotificationNode(cc._NoticeficationNode);

        //
        cc._loaderImage = _LOADING_IMG;

        //load resources
        cc.LoaderScene.preload(gResource, function () {

            //game init
            game_init();
            initShader();

            //game start
            cc.director.runScene(new sceneMain());

            ////////
            loginInit();

            return;
        }, this);
    };

    createCanvas();
    cc.game.run("gameCanvas");

};