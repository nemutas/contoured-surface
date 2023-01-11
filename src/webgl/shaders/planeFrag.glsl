varying vec2 v_uv;
varying float v_depth;

void main() {
  float dist = distance(v_uv, vec2(0.5));
  dist = smoothstep(0.3, 0.5, dist);

  vec3 color = vec3(v_depth) + dist;
  color = smoothstep(vec3(-0.3), vec3(1), color);

  gl_FragColor = vec4(color, 1.0);
}