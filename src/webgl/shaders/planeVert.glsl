uniform sampler2D tSimulator;
varying vec2 v_uv;
varying float v_depth;

void main() {
  v_uv = uv;
  vec3 pos = position;

  float dist = distance(uv, vec2(0.5));
  dist = 1.0 - smoothstep(0.0, 0.5, dist);

  vec4 sim = texture2D(tSimulator, uv);
  pos.y += normal.y * sim.g * sim.a * 0.1 * dist;
  v_depth = sim.r + (1.0 - sim.a);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}