vec4 Execute(vec2 uv)
{
  float speed = 0.3;
  float dot_offset = 0.05;
  float smooth = 0.08;

  float d = 2.0;
  uv -= 0.5;

  float4 color = float4(0.5, 0.0, 0.0, 1.0);

  for (int i = 0; i < 10; i ++) 
  {

    float t = frac(time * speed + (float(i) * dot_offset));
    t = smoothstep(0.0, 1.0, t);
    t = smoothstep(0.0, 1.0, t);

    float s = PI * 2.0;
    vec2 o = float2(sin(t * s), cos(t * s)) * 0.3;
    float dist = length(uv + o) - 0.02;
    if (dist<d)
    {
      color.xyz = vec3(1.0, 1.0, 1.0);//lerp(vec3(0.0, 0.2, 0.35), vec3(1.0, 1.0, 1.0), 1.0 - (cos(t * s) * 0.5 + 0.5));
    }
    d = smin(d, dist, smooth); 
  }
      
  color.w = smoothstep(0.003, 0.0, d) * saturate(time - 0.1);

  return color;
}