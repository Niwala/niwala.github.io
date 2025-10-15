[Float(5.0)]
uniform float floatField;

[Range(3.0, 0.0, 20.0)]
uniform float rangeField;

[Toggle(true)]
uniform float toggleField;

[Color(#4c9be0)]
uniform float4 colorField;

[Enum(1, Dog|Cat|Bird)]
uniform float enumField;

float4 Execute(float4 uv)
{
    return vec4(uv.xy, sin(time * floatField) * 0.5 + 0.5, 1.0);
}