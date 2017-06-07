/**
 * Created by Jack.L on 2017/5/15.
 */
const IP_ADDRESS = "ws://47.92.88.155:1980";

const ENUM_PROTOCAL =
{
    "PROTOCAL_C2S_HEART":100,
    "PROTOCAL_S2C_HEART":101,
    "PROTOCAL_C2S_CONN":1000,
    "PROTOCAL_S2C_CONN":1001,
    "PROTOCAL_C2S_CREATE_ROOM":1100,
    "PROTOCAL_S2C_CREATE_ROOM":1101,
    "PROTOCAL_C2S_ENTER_ROOM":1102,
    "PROTOCAL_S2C_ALL_ENTER_ROOM":1103,
    "PROTOCAL_C2S_YAKYUKEN":1110,
    "PROTOCAL_S2C_ALL_YAKUKEN":1111,
};

const PROTOCAL =
{
    "PROTOCAL_C2S_HEART":100,
    "PROTOCAL_S2C_HEART":101,
    "PROTOCAL_C2S_CONN":1000,
    "PROTOCAL_S2C_CONN":1001,
    "PROTOCAL_C2S_CREATE_ROOM":1100,
    "PROTOCAL_S2C_CREATE_ROOM":1101,
    "PROTOCAL_C2S_ENTER_ROOM":1102,
    "PROTOCAL_S2C_ALL_ENTER_ROOM":1103,
    "PROTOCAL_C2S_YAKYUKEN":1110,
    "PROTOCAL_S2C_ALL_YAKUKEN":1111,

};

const MESSAGE =
{
    "PROTOCAL_C2S_CONN":
    {
        protocal:PROTOCAL.PROTOCAL_C2S_CONN,
        ID:0,
        nickname:'nickname'
    },
    "PROTOCAL_S2C_CONN":
    {
        protocal:PROTOCAL.PROTOCAL_S2C_CONN,
        status:0,
    },
    "PROTOCAL_C2S_CREATE_ROOM":
    {
        protocal:PROTOCAL.PROTOCAL_C2S_CREATE_ROOM,
    },
    "PROTOCAL_S2C_CREATE_ROOM":
    {
        protocal:PROTOCAL.PROTOCAL_S2C_CREATE_ROOM,
        status:0,
    },
    "PROTOCAL_C2S_ENTER_ROOM":
    {
        protocal:PROTOCAL.PROTOCAL_C2S_ENTER_ROOM,
    },
    "PROTOCAL_S2C_ALL_ENTER_ROOM":
    {
        protocal:PROTOCAL.PROTOCAL_S2C_ALL_ENTER_ROOM,
        status:0,
        players:[],
    },
    "PROTOCAL_C2S_YAKYUKEN":
    {
        protocal:PROTOCAL.PROTOCAL_C2S_YAKYUKEN,
        type:0,
    },
    "PROTOCAL_S2C_ALL_YAKUKEN":
    {
        protocal:PROTOCAL.PROTOCAL_S2C_ALL_YAKUKEN,
        status:0, //0,shitou 1,jiandao 2,bu -1,unknown
        flag:0,   //
        result:[] //
    },
};

var NetworkSystem =
    (
        function()
        {
            var instance =
            {
                WebSocket:WebSocket | window.WebSocket | window.MozWebSocket,
                socket:null,
                isInit:false,
                callback_chat:null,
                start:function(player_id, callback)
                {
                    this.self_id = player_id;
                    this.callback_start = callback;
                    this.connect(IP_ADDRESS);
                },
                connect:function(host)
                {
                    var SELF = this;

                    this.host = host;
                    this.socket = new WebSocket(this.host);

                    this.socket.onopen =
                        function(evt)
                        {
                            SELF.isInit = true;

                            ////////
                            //chat client is conn
                            var msg = extendDeep( MESSAGE.PROTOCAL_C2S_CONN );
                            msg.ID = SELF.self_id;

                            SELF.send(msg);

                        };

                    this.socket.onmessage =
                        function(evt)
                        {
                            try
                            {
                                var strData = BASE64.decoder(evt.data);
                                strData = transAscToStringArray(strData);
                                var data = JSON.parse(strData);

                                if( data )
                                {
                                    SELF.onRecv(data);
                                }
                            }
                            catch (e)
                            {

                            }
                        };

                    this.socket.onerror =
                        function(evt)
                        {

                        };

                    this.socket.onclose =
                        function(evt)
                        {
                            SELF.onClose(evt);
                        };
                },
                send:function(msg)
                {
                    if(this.isInit && this.socket.readyState == WebSocket.OPEN)
                    {
                        var _strMsg  = JSON.stringify(msg);
                        var _package = BASE64.encoder(_strMsg);

                        this.socket.send(_package);
                    }
                    else
                    {
                        cc.log('Network Error on State:'+this.socket.readyState);
                    }
                },
                close:function()
                {
                    this.socket.close();
                    this.socket = null;
                },
                onRecv:function(data)
                {
                    console.log(JSON.stringify(data));
                },
                onClose:function(evt)
                {
                    console.log(JSON.stringify(evt));
                }
            };

            return instance;
        }
    )();

