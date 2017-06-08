/**
 * Created by Jack on 2017/3/25.
 */

function game_init()
{
    cc.spriteFrameCache.addSpriteFrames(res_pix.PIX_PLIST, res_pix.PIX_PNG);

    cc._commonDialog = new commonDlg();
    cc._NoticeficationNode.addChild(cc._commonDialog);

    /*
    cc._commonDialogConfirm = new commonDlgConfirm();
    cc._NoticeficationNode.addChild(cc._commonDialogConfirm);

    cc._optionDialog = new optionDialog();
    cc._NoticeficationNode.addChild(cc._optionDialog);

    ////////
    var _labelPing = cc.LabelTTF.create("PIN:0", FONT_NAME.FONT_ARIAL, 24);
    _labelPing.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
    _labelPing.setAnchorPoint(0.0, 0.0);
    cc._NoticeficationNode.addChild(_labelPing);
    cc._LabelPing = _labelPing;
    */
};

/*
function setPing(ping)
{
    var _value = ping;

    if( ping < 100 )
    {
        cc._LabelPing.setColor(cc.color(100,255,100));
    }
    else if( ping < 256 )
    {
        cc._LabelPing.setColor(cc.color(255,200,100));
    }
    else
    {
        cc._LabelPing.setColor(cc.color(255,100,100));

        if( _value > 456 )
        {
            _value = 456;
        }
    }

    cc._LabelPing.setString("PIN:" + _value.toString());
}

function show_confirm_dialog(title, info, callback)
{
    cc._commonDialogConfirm.setInfo(title, info);
    cc._commonDialogConfirm.setEvent(callback);
    cc._commonDialogConfirm.show();
}

function show_option_dialog()
{
    cc._optionDialog.show();
}
*/

function show_common_dialog(title, info, callback)
{
    cc._commonDialog.setInfo(title, info, callback);
    cc._commonDialog.show();
};

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
        }, this);
    };

    createCanvas();
    cc.game.run("gameCanvas");

};