/**
 * Created by Jack on 2017/4/28.
 */

var optionSys =
    (
        function () {
            var instance = null;
            function Instance()
            {
                var _instance =
                {
                    CURRENT_MUSIC:null,
                    SWITCH_MUSIC:true,
                    SWITCH_SOUNDEFFECT:true,
                    setMusicForBackground:function(music)
                    {
                        if( !music )
                        {
                            return;
                        }

                        if( this.CURRENT_MUSIC != music )
                        {
                            this.CURRENT_MUSIC = music;

                            if( this.SWITCH_MUSIC )
                            {
                                cc.audioEngine.playMusic(music, true);
                            }
                        }
                    },
                    playSound:function(sound)
                    {
                        if(!sound)
                        {
                            return;
                        }

                        if( this.SWITCH_SOUNDEFFECT )
                        {
                            cc.audioEngine.playEffect(sound);
                        }
                    },
                    switchMusic:function(_switch)
                    {
                        this.SWITCH_MUSIC = _switch;

                        ////
                        if( _switch && this.CURRENT_MUSIC != null )
                        {
                            cc.audioEngine.playMusic(this.CURRENT_MUSIC, true);
                        }
                        else if( !_switch && this.CURRENT_MUSIC != null )
                        {
                            cc.audioEngine.stopMusic(this.CURRENT_MUSIC);
                        }

                    },
                    switchSound: function (_switch)
                    {
                        this.SWITCH_SOUNDEFFECT = _switch;
                    }
                };

                return _instance;
            };

            return {
                getInstance:function(){
                    if(instance == null){
                        instance = Instance();
                    }
                    return instance;
                }
            };
        }
    )();