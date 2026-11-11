// Layered density field, shared by the existing gallery renderer and quieter page backdrops.
export function createNebula(T,scene){
 const uniforms={uTime:{value:0},uAspect:{value:1},uScroll:{value:0},uEnergy:{value:0},uVariant:{value:0},uQuiet:{value:0}};
 const material=new T.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.);}`,fragmentShader:`
 precision highp float;varying vec2 vUv;uniform float uTime,uAspect,uScroll,uEnergy,uVariant,uQuiet;
 float hash(vec3 p){p=fract(p*.3183099+vec3(.11,.23,.37));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return noise(p)*.57+noise(p*2.03+7.1)*.28+noise(p*4.07+19.3)*.15;}
 void main(){
 vec2 p=(vUv-.5)*vec2(uAspect,1.);float t=uTime*.015;vec3 col=vec3(.043,.051,.063);float trans=1.;
 vec2 centre=vec2(.27+sin(uScroll*.21)*.06,.08);float radius=length((p-centre)*vec2(.72,1.25));
 for(int i=0;i<7;i++){
 float z=float(i)*.43;vec3 q=vec3(p*2.5+vec2(t*.22,-t*.13)+vec2(sin(z+t)*.17,cos(z)*.12),z+t*.16);
 float warp=fbm(q*.8);float density=fbm(q+vec3(warp*1.7,warp*.65,0.));
 float ridge=smoothstep(.32,.73,density)*exp(-radius*radius*2.3);float hollow=smoothstep(.25,.56,fbm(q*1.8+4.));ridge*=hollow;
 float light=exp(-length(p-centre-vec2(.14,-.02))*2.4);float pulse=uEnergy*exp(-pow(radius-uTime*.023,2.)*28.);
 vec3 teal=vec3(.271,.431,.451),copper=vec3(.604,.353,.227),plum=vec3(.36,.267,.365);
 vec3 tint=mix(teal,mix(copper,plum,.28+uVariant*.15),smoothstep(.28,.8,warp+vUv.x*.12));
 float alpha=ridge*.26*(1.-uQuiet*.52);col+=trans*alpha*tint*(.48+light*.95+pulse*1.1);trans*=1.-alpha*.9;
 }
 // Fine dust is embedded in the density, with highlights concentrated near the light source.
 float dust=pow(noise(vec3(p*220.,uTime*.004)),30.);col+=dust*vec3(.11,.12,.12)*exp(-radius*2.);
 col*=.62+.38*(1.-smoothstep(.1,1.1,length(vUv-.5)));
 col+= (hash(vec3(gl_FragCoord.xy,1.))-.5)*.009;
 gl_FragColor=vec4(col,1.);
 }`});
 const plane=new T.Mesh(new T.PlaneGeometry(2,2),material);plane.frustumCulled=false;plane.renderOrder=-1000;scene.add(plane);
 return {uniforms,update(time,aspect,scroll=0,quiet=0,variant=0){uniforms.uTime.value=time;uniforms.uAspect.value=aspect;uniforms.uScroll.value=scroll;uniforms.uQuiet.value=quiet;uniforms.uVariant.value=variant;uniforms.uEnergy.value=Math.exp(-Math.pow((time-4.5)/2.6,2));}};
}


