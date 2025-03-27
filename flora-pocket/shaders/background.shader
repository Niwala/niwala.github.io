
vec4 Execute(vec4 uv)
{
  float speed = 0.3;
  float dot_offset = 0.05;
  float smooth = 0.08;

  float2 screenPos = uv.xy * screenSize.yy;
  float mouseDist = distance(mousePos.zw, screenPos);
  float mouseFactor = 1.0;//(mouseDist * 0.5) - 7.0;

  float2 cells = frac(uv.xy * 50.0);

  float gridSdf = (length(cells - 0.5) * 0.5) - 0.1;

  float4 color = float4(0.5, 0.0, 0.0, 1.0);


  for (int i = 0; i < 8; i ++) 
  {
    float j = float(i);
    float trailDist = distance(mouseTrail[i].xy, screenPos);
    trailDist = (trailDist * 0.3) - (9.0 - j);
    mouseFactor = smin(mouseFactor, trailDist, 20.0);
  }

  float dist = smoothstep(0.4, 0.0, mouseFactor + 7.0);
  
   color.xyz = float3(0.18, 0.2, 0.21);
   color.w = dist;

  return color;
}