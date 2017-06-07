#ifdef GL_ES
    precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

void main()
{
    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);

    lowp float _u = v_texCoord.x;
    lowp float _v = v_texCoord.y;

    if(
     (_u > 0.5) &&
     (_v > 0.5) &&
     ((_u-0.5) / (1.0 - _v) > 1.0)
     )
    {
        gl_FragColor = gl_FragColor * vec4(0.0, 0.0, 0.0, 0.0);
    }

    float _uflag = 0.5;
    float _vflag = 0.75;

    float _flag1 = 1.0;
    if( _u > _uflag )
    {
        float _flagU = (1.0 - _u)/(1.0 - _uflag);
        _flagU = _flagU;
        _flag1 = _flag1 * _flagU;
    }

    float _flag2 = 1.0;
    if( _v > _vflag )
    {
        gl_FragColor.rgb  = gl_FragColor.rgb * vec3(0.25,0.25,0.25);
    }

    gl_FragColor.a = gl_FragColor.a * _flag1 * _flag2;

}