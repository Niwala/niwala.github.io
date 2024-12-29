[Range(3.0, 0.0, 20.0)]
uniform float speed;

float4 Execute(float2 uv)
{
    return vec4(uv, sin(time * speed) * 0.5 + 0.5, 1.0);
}