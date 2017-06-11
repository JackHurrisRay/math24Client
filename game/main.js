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

    var sptChance = cc.Sprite.createWithSpriteFrame(frame_info[1]);
    sptChance.setAnchorPoint(0,0.5);
    sptChance.setPosition(32, 128);
    sptFrame.addChild(sptChance);

    var labelChance = cc.LabelTTF.create("0", FONT_NAME.FONT_HEITI, 72 );
    labelChance.setScale(1.5);
    labelChance.setAnchorPoint(0,0.5);
    labelChance.setPosition(256, 128 - 8);
    sptFrame.addChild(labelChance);

    var button_info = new uiTouchFrameSprite(
        frame_info[2], frame_info[3],
        function(target)
        {
            ////////
            show_common_dialog("智慧星", "您在查看游戏答案时或者选择竞速模式下，都会消耗您的智慧星。不过，每天您的智慧星都会加满哟，开动您的大脑吧^_^");
        }
    );

    button_info.setAnchorPoint(1.0, 0.5);
    button_info.setPosition(768 - 32, 128);
    sptFrame.addChild(button_info);

    cc.SET_GOLD =
        function(GOLD)
        {
            labelChance.setString(GOLD.toString());
        };


    ////////
    cc._commonDialog = new commonDlg();
    cc._NoticeficationNode.addChild(cc._commonDialog);

    cc._commonConfirmDlg = new commonConfirmDlg();
    cc._NoticeficationNode.addChild(cc._commonConfirmDlg);

    cc._commonWaitDlg = new waitDlg;
    cc._NoticeficationNode.addChild(cc._commonWaitDlg);

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

function TDRecord(data)
{
    TDGA.onItemPurchase({
        item :data.item,
        itemNumber : 1,
        priceInVirtualCurrency : data.priceInVirtualCurrency
    });

    TDGA.onItemUse({
        item : data.item,
        itemNumber : 1
    });
};

const MISSION_NAME = "进入房间";
function TDMissionBegin()
{
    TDGA.onMissionBegin(MISSION_NAME);
}

function TDMissionResult(success, cause)
{
    if( success )
    {
        TDGA.onMissionCompleted(MISSION_NAME);
    }
    else
    {
        TDGA.onMissionFailed(MISSION_NAME, cause?cause.toString():"unknown");
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