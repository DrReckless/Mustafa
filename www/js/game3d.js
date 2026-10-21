(()=>{var Gc="170";var Yu=0,bl=1,Zu=2;var Bh=1,Wc=2,In=3,_n=0,Xe=1,ve=2,ti=0,Qi=1,Hr=2,Tl=3,Al=4,$u=5,gi=100,Ju=101,Ku=102,Qu=103,ju=104,td=200,ed=201,nd=202,id=203,ga=204,xa=205,sd=206,rd=207,od=208,ad=209,cd=210,ld=211,hd=212,ud=213,dd=214,_a=0,ya=1,va=2,ns=3,Ma=4,Sa=5,Ea=6,wa=7,zh=0,fd=1,pd=2,ei=0,md=1,gd=2,xd=3,Xc=4,_d=5,yd=6,vd=7;var kh=300,is=301,ss=302,Fs=303,ba=304,yo=306,Os=1e3,Dn=1001,Ta=1002,Ke=1003,Md=1004;var rr=1005;var Ee=1006,Oo=1007;var jn=1008;var Nn=1009,Hh=1010,Vh=1011,Bs=1012,qc=1013,_i=1014,Ge=1015,vn=1016,Yc=1017,Zc=1018,rs=1020,Gh=35902,Wh=1021,Xh=1022,Je=1023,qh=1024,Yh=1025,ji=1026,os=1027,$c=1028,Jc=1029,Zh=1030,Kc=1031;var Qc=1033,Fr=33776,Or=33777,Br=33778,zr=33779,Aa=35840,Ra=35841,Ca=35842,Ia=35843,Pa=36196,Da=37492,La=37496,Ua=37808,Na=37809,Fa=37810,Oa=37811,Ba=37812,za=37813,ka=37814,Ha=37815,Va=37816,Ga=37817,Wa=37818,Xa=37819,qa=37820,Ya=37821,kr=36492,Za=36494,$a=36495,$h=36283,Ja=36284,Ka=36285,Qa=36286;var Vr=2300,ja=2301,Bo=2302,Rl=2400,Cl=2401,Il=2402;var Sd=3200,Ed=3201;var Jh=0,wd=1,Kn="",Ae="srgb",ri="srgb-linear",vo="linear",ce="srgb";var Pi=7680;var Pl=519,bd=512,Td=513,Ad=514,Kh=515,Rd=516,Cd=517,Id=518,Pd=519,tc=35044;var Dl="300 es",Ln=2e3,Gr=2001,ni=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ll=1234567,Is=Math.PI/180,zs=180/Math.PI;function xn(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]).toLowerCase()}function Re(n,t,e){return Math.max(t,Math.min(e,n))}function jc(n,t){return(n%t+t)%t}function Dd(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Ld(n,t,e){return n!==t?(e-n)/(t-n):0}function Ps(n,t,e){return(1-e)*n+e*t}function Ud(n,t,e,i){return Ps(n,t,1-Math.exp(-e*i))}function Nd(n,t=1){return t-Math.abs(jc(n,t*2)-t)}function Fd(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Od(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Bd(n,t){return n+Math.floor(Math.random()*(t-n+1))}function zd(n,t){return n+Math.random()*(t-n)}function kd(n){return n*(.5-Math.random())}function Hd(n){n!==void 0&&(Ll=n);let t=Ll+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Vd(n){return n*Is}function Gd(n){return n*zs}function Wd(n){return(n&n-1)===0&&n!==0}function Xd(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function qd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Yd(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+i)/2),h=o((t+i)/2),u=r((t-i)/2),d=o((t-i)/2),f=r((i-t)/2),x=o((i-t)/2);switch(s){case"XYX":n.set(a*h,c*u,c*d,a*l);break;case"YZY":n.set(c*d,a*h,c*u,a*l);break;case"ZXZ":n.set(c*u,c*d,a*h,a*l);break;case"XZX":n.set(a*h,c*x,c*f,a*l);break;case"YXY":n.set(c*f,a*h,c*x,a*l);break;case"ZYZ":n.set(c*x,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function oe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Qh={DEG2RAD:Is,RAD2DEG:zs,generateUUID:xn,clamp:Re,euclideanModulo:jc,mapLinear:Dd,inverseLerp:Ld,lerp:Ps,damp:Ud,pingpong:Nd,smoothstep:Fd,smootherstep:Od,randInt:Bd,randFloat:zd,randFloatSpread:kd,seededRandom:Hd,degToRad:Vd,radToDeg:Gd,isPowerOfTwo:Wd,ceilPowerOfTwo:Xd,floorPowerOfTwo:qd,setQuaternionFromProperEuler:Yd,normalize:oe,denormalize:fn},it=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xt=class n{constructor(t,e,i,s,r,o,a,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l)}set(t,e,i,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],x=i[8],_=s[0],g=s[3],p=s[6],b=s[1],S=s[4],y=s[7],U=s[2],A=s[5],D=s[8];return r[0]=o*_+a*b+c*U,r[3]=o*g+a*S+c*A,r[6]=o*p+a*y+c*D,r[1]=l*_+h*b+u*U,r[4]=l*g+h*S+u*A,r[7]=l*p+h*y+u*D,r[2]=d*_+f*b+x*U,r[5]=d*g+f*S+x*A,r[8]=d*p+f*y+x*D,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,x=e*u+i*d+s*f;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/x;return t[0]=u*_,t[1]=(s*l-h*i)*_,t[2]=(a*i-s*o)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zo.makeScale(t,e)),this}rotate(t){return this.premultiply(zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},zo=new Xt;function jh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ks(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Zd(){let n=ks("canvas");return n.style.display="block",n}var Ul={};function Rs(n){n in Ul||(Ul[n]=!0,console.warn(n))}function $d(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}function Jd(n){let t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Kd(n){let t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var jt={enabled:!0,workingColorSpace:ri,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ce&&(n.r=Un(n.r),n.g=Un(n.g),n.b=Un(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ce&&(n.r=ts(n.r),n.g=ts(n.g),n.b=ts(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Kn?vo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Un(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ts(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Nl=[.64,.33,.3,.6,.15,.06],Fl=[.2126,.7152,.0722],Ol=[.3127,.329],Bl=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zl=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);jt.define({[ri]:{primaries:Nl,whitePoint:Ol,transfer:vo,toXYZ:Bl,fromXYZ:zl,luminanceCoefficients:Fl,workingColorSpaceConfig:{unpackColorSpace:Ae},outputColorSpaceConfig:{drawingBufferColorSpace:Ae}},[Ae]:{primaries:Nl,whitePoint:Ol,transfer:ce,toXYZ:Bl,fromXYZ:zl,luminanceCoefficients:Fl,outputColorSpaceConfig:{drawingBufferColorSpace:Ae}}});var Di,ec=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Di===void 0&&(Di=ks("canvas")),Di.width=t.width,Di.height=t.height;let i=Di.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Di}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ks("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Un(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Un(e[i]/255)*255):e[i]=Un(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Qd=0,Wr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=xn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ko(s[o].image)):r.push(ko(s[o]))}else r=ko(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function ko(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ec.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var jd=0,ze=class n extends ni{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Dn,s=Dn,r=Ee,o=jn,a=Je,c=Nn,l=n.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jd++}),this.uuid=xn(),this.name="",this.source=new Wr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Os:t.x=t.x-Math.floor(t.x);break;case Dn:t.x=t.x<0?0:1;break;case Ta:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Os:t.y=t.y-Math.floor(t.y);break;case Dn:t.y=t.y<0?0:1;break;case Ta:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=kh;ze.DEFAULT_ANISOTROPY=1;var ye=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],x=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(x+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(l+1)/2,y=(f+1)/2,U=(p+1)/2,A=(h+d)/4,D=(u+_)/4,R=(x+g)/4;return S>y&&S>U?S<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(S),s=A/i,r=D/i):y>U?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=A/s,r=R/s):U<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(U),i=D/r,s=R/r),this.set(i,s,r,e),this}let b=Math.sqrt((g-x)*(g-x)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(g-x)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},nc=class extends ni{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);let s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ee,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new ze(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Wr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends nc{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Xr=class extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ic=class extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ce=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],d=r[o+0],f=r[o+1],x=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=x,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==x){let g=1-a,p=c*d+l*f+h*x+u*_,b=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){let U=Math.sqrt(S),A=Math.atan2(U,p*b);g=Math.sin(g*A)/U,a=Math.sin(a*A)/U}let y=a*b;if(c=c*g+d*y,l=l*g+f*y,h=h*g+x*y,u=u*g+_*y,g===1-a){let U=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=U,l*=U,h*=U,u*=U}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[o],d=r[o+1],f=r[o+2],x=r[o+3];return t[e]=a*x+h*u+c*f-l*d,t[e+1]=c*x+h*d+l*u-a*f,t[e+2]=l*x+h*f+a*d-c*u,t[e+3]=h*x-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),u=a(r/2),d=c(i/2),f=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*x,this._y=l*f*u-d*h*x,this._z=l*h*x+d*f*u,this._w=l*h*u-d*f*x;break;case"YXZ":this._x=d*h*u+l*f*x,this._y=l*f*u-d*h*x,this._z=l*h*x-d*f*u,this._w=l*h*u+d*f*x;break;case"ZXY":this._x=d*h*u-l*f*x,this._y=l*f*u+d*h*x,this._z=l*h*x+d*f*u,this._w=l*h*u-d*f*x;break;case"ZYX":this._x=d*h*u-l*f*x,this._y=l*f*u+d*h*x,this._z=l*h*x-d*f*u,this._w=l*h*u+d*f*x;break;case"YZX":this._x=d*h*u+l*f*x,this._y=l*f*u+d*h*x,this._z=l*h*x-d*f*u,this._w=l*h*u-d*f*x;break;case"XZY":this._x=d*h*u-l*f*x,this._y=l*f*u-d*h*x,this._z=l*h*x+d*f*u,this._w=l*h*u+d*f*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(i>a&&i>u){let f=2*Math.sqrt(1+i-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-i-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-i-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Re(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kl.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+c*l+o*u-a*h,this.y=i+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ho.copy(this).projectOnVector(t),this.sub(Ho)}reflect(t){return this.sub(Ho.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ho=new C,kl=new Ce,On=class{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ln):ln.fromBufferAttribute(r,o),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),or.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),or.copy(i.boundingBox)),or.applyMatrix4(t.matrixWorld),this.union(or)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ys),ar.subVectors(this.max,ys),Li.subVectors(t.a,ys),Ui.subVectors(t.b,ys),Ni.subVectors(t.c,ys),Xn.subVectors(Ui,Li),qn.subVectors(Ni,Ui),li.subVectors(Li,Ni);let e=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-li.z,li.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,li.z,0,-li.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-li.y,li.x,0];return!Vo(e,Li,Ui,Ni,ar)||(e=[1,0,0,0,1,0,0,0,1],!Vo(e,Li,Ui,Ni,ar))?!1:(cr.crossVectors(Xn,qn),e=[cr.x,cr.y,cr.z],Vo(e,Li,Ui,Ni,ar))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},wn=[new C,new C,new C,new C,new C,new C,new C,new C],ln=new C,or=new On,Li=new C,Ui=new C,Ni=new C,Xn=new C,qn=new C,li=new C,ys=new C,ar=new C,cr=new C,hi=new C;function Vo(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){hi.fromArray(n,r);let a=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),c=t.dot(hi),l=e.dot(hi),h=i.dot(hi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var tf=new On,vs=new C,Go=new C,ii=class{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):tf.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vs.subVectors(t,this.center);let e=vs.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(vs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Go.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vs.copy(t.center).add(Go)),this.expandByPoint(vs.copy(t.center).sub(Go))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},bn=new C,Wo=new C,lr=new C,Yn=new C,Xo=new C,hr=new C,qo=new C,Hs=class{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Wo.copy(t).add(e).multiplyScalar(.5),lr.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(Wo);let r=t.distanceTo(e)*.5,o=-this.direction.dot(lr),a=Yn.dot(this.direction),c=-Yn.dot(lr),l=Yn.lengthSq(),h=Math.abs(1-o*o),u,d,f,x;if(h>0)if(u=o*c-a,d=o*a-c,x=r*h,u>=0)if(d>=-x)if(d<=x){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-x?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=x?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wo).addScaledVector(lr,d),f}intersectSphere(t,e){bn.subVectors(t.center,this.origin);let i=bn.dot(this.direction),s=bn.dot(bn)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,i,s,r){Xo.subVectors(e,t),hr.subVectors(i,t),qo.crossVectors(Xo,hr);let o=this.direction.dot(qo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Yn.subVectors(this.origin,t);let c=a*this.direction.dot(hr.crossVectors(Yn,hr));if(c<0)return null;let l=a*this.direction.dot(Xo.cross(Yn));if(l<0||c+l>o)return null;let h=-a*Yn.dot(qo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$t=class n{constructor(t,e,i,s,r,o,a,c,l,h,u,d,f,x,_,g){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l,h,u,d,f,x,_,g)}set(t,e,i,s,r,o,a,c,l,h,u,d,f,x,_,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=x,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/Fi.setFromMatrixColumn(t,0).length(),r=1/Fi.setFromMatrixColumn(t,1).length(),o=1/Fi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,x=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+x*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=x+f*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,x=l*h,_=l*u;e[0]=d+_*a,e[4]=x*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-x,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,x=l*h,_=l*u;e[0]=d-_*a,e[4]=-o*u,e[8]=x+f*a,e[1]=f+x*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,f=o*u,x=a*h,_=a*u;e[0]=c*h,e[4]=x*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,f=o*l,x=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=x*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+x,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*c,f=o*l,x=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-x,e[2]=x*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ef,t,nf)}lookAt(t,e,i){let s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Zn.crossVectors(i,Ze),Zn.lengthSq()===0&&(Math.abs(i.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Zn.crossVectors(i,Ze)),Zn.normalize(),ur.crossVectors(Ze,Zn),s[0]=Zn.x,s[4]=ur.x,s[8]=Ze.x,s[1]=Zn.y,s[5]=ur.y,s[9]=Ze.y,s[2]=Zn.z,s[6]=ur.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],x=i[2],_=i[6],g=i[10],p=i[14],b=i[3],S=i[7],y=i[11],U=i[15],A=s[0],D=s[4],R=s[8],E=s[12],v=s[1],P=s[5],H=s[9],z=s[13],B=s[2],Y=s[6],k=s[10],et=s[14],q=s[3],ct=s[7],ut=s[11],Mt=s[15];return r[0]=o*A+a*v+c*B+l*q,r[4]=o*D+a*P+c*Y+l*ct,r[8]=o*R+a*H+c*k+l*ut,r[12]=o*E+a*z+c*et+l*Mt,r[1]=h*A+u*v+d*B+f*q,r[5]=h*D+u*P+d*Y+f*ct,r[9]=h*R+u*H+d*k+f*ut,r[13]=h*E+u*z+d*et+f*Mt,r[2]=x*A+_*v+g*B+p*q,r[6]=x*D+_*P+g*Y+p*ct,r[10]=x*R+_*H+g*k+p*ut,r[14]=x*E+_*z+g*et+p*Mt,r[3]=b*A+S*v+y*B+U*q,r[7]=b*D+S*P+y*Y+U*ct,r[11]=b*R+S*H+y*k+U*ut,r[15]=b*E+S*z+y*et+U*Mt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],x=t[3],_=t[7],g=t[11],p=t[15];return x*(+r*c*u-s*l*u-r*a*d+i*l*d+s*a*f-i*c*f)+_*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+g*(+e*l*u-e*a*f-r*o*u+i*o*f+r*a*h-i*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*o*u-i*o*d+i*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],x=t[12],_=t[13],g=t[14],p=t[15],b=u*g*l-_*d*l+_*c*f-a*g*f-u*c*p+a*d*p,S=x*d*l-h*g*l-x*c*f+o*g*f+h*c*p-o*d*p,y=h*_*l-x*u*l+x*a*f-o*_*f-h*a*p+o*u*p,U=x*u*c-h*_*c-x*a*d+o*_*d+h*a*g-o*u*g,A=e*b+i*S+s*y+r*U;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/A;return t[0]=b*D,t[1]=(_*d*r-u*g*r-_*s*f+i*g*f+u*s*p-i*d*p)*D,t[2]=(a*g*r-_*c*r+_*s*l-i*g*l-a*s*p+i*c*p)*D,t[3]=(u*c*r-a*d*r-u*s*l+i*d*l+a*s*f-i*c*f)*D,t[4]=S*D,t[5]=(h*g*r-x*d*r+x*s*f-e*g*f-h*s*p+e*d*p)*D,t[6]=(x*c*r-o*g*r-x*s*l+e*g*l+o*s*p-e*c*p)*D,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*f+e*c*f)*D,t[8]=y*D,t[9]=(x*u*r-h*_*r-x*i*f+e*_*f+h*i*p-e*u*p)*D,t[10]=(o*_*r-x*a*r+x*i*l-e*_*l-o*i*p+e*a*p)*D,t[11]=(h*a*r-o*u*r-h*i*l+e*u*l+o*i*f-e*a*f)*D,t[12]=U*D,t[13]=(h*_*s-x*u*s+x*i*d-e*_*d-h*i*g+e*u*g)*D,t[14]=(x*a*s-o*_*s-x*i*c+e*_*c+o*i*g-e*a*g)*D,t[15]=(o*u*s-h*a*s+h*i*c-e*u*c-o*i*d+e*a*d)*D,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,x=r*u,_=o*h,g=o*u,p=a*u,b=c*l,S=c*h,y=c*u,U=i.x,A=i.y,D=i.z;return s[0]=(1-(_+p))*U,s[1]=(f+y)*U,s[2]=(x-S)*U,s[3]=0,s[4]=(f-y)*A,s[5]=(1-(d+p))*A,s[6]=(g+b)*A,s[7]=0,s[8]=(x+S)*D,s[9]=(g-b)*D,s[10]=(1-(d+_))*D,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=Fi.set(s[0],s[1],s[2]).length(),o=Fi.set(s[4],s[5],s[6]).length(),a=Fi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],hn.copy(this);let l=1/r,h=1/o,u=1/a;return hn.elements[0]*=l,hn.elements[1]*=l,hn.elements[2]*=l,hn.elements[4]*=h,hn.elements[5]*=h,hn.elements[6]*=h,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,e.setFromRotationMatrix(hn),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=Ln){let c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s),f,x;if(a===Ln)f=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Gr)f=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=Ln){let c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(o-r),d=(e+t)*l,f=(i+s)*h,x,_;if(a===Ln)x=(o+r)*u,_=-2*u;else if(a===Gr)x=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Fi=new C,hn=new $t,ef=new C(0,0,0),nf=new C(1,1,1),Zn=new C,ur=new C,Ze=new C,Hl=new $t,Vl=new Ce,sn=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Re(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Re(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Hl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Vl.setFromEuler(this),this.setFromQuaternion(Vl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};sn.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},sf=0,Gl=new C,Oi=new Ce,Tn=new $t,dr=new C,Ms=new C,rf=new C,of=new Ce,Wl=new C(1,0,0),Xl=new C(0,1,0),ql=new C(0,0,1),Yl={type:"added"},af={type:"removed"},Bi={type:"childadded",child:null},Yo={type:"childremoved",child:null},Ie=class n extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new C,e=new sn,i=new Ce,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $t},normalMatrix:{value:new Xt}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.premultiply(Oi),this}rotateX(t){return this.rotateOnAxis(Wl,t)}rotateY(t){return this.rotateOnAxis(Xl,t)}rotateZ(t){return this.rotateOnAxis(ql,t)}translateOnAxis(t,e){return Gl.copy(t).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wl,t)}translateY(t){return this.translateOnAxis(Xl,t)}translateZ(t){return this.translateOnAxis(ql,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?dr.copy(t):dr.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(Ms,dr,this.up):Tn.lookAt(dr,Ms,this.up),this.quaternion.setFromRotationMatrix(Tn),s&&(Tn.extractRotation(s.matrixWorld),Oi.setFromRotationMatrix(Tn),this.quaternion.premultiply(Oi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yl),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(af),Yo.child=t,this.dispatchEvent(Yo),Yo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yl),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,t,rf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,of,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),x=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),x.length>0&&(i.nodes=x)}return i.object=s,i;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Ie.DEFAULT_UP=new C(0,1,0);Ie.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var un=new C,An=new C,Zo=new C,Rn=new C,zi=new C,ki=new C,Zl=new C,$o=new C,Jo=new C,Ko=new C,Qo=new ye,jo=new ye,ta=new ye,Qn=class n{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),un.subVectors(t,e),s.cross(un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){un.subVectors(s,e),An.subVectors(i,e),Zo.subVectors(t,e);let o=un.dot(un),a=un.dot(An),c=un.dot(Zo),l=An.dot(An),h=An.dot(Zo),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,x=(o*h-a*c)*d;return r.set(1-f-x,x,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getInterpolation(t,e,i,s,r,o,a,c){return this.getBarycoord(t,e,i,s,Rn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Rn.x),c.addScaledVector(o,Rn.y),c.addScaledVector(a,Rn.z),c)}static getInterpolatedAttribute(t,e,i,s,r,o){return Qo.setScalar(0),jo.setScalar(0),ta.setScalar(0),Qo.fromBufferAttribute(t,e),jo.fromBufferAttribute(t,i),ta.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Qo,r.x),o.addScaledVector(jo,r.y),o.addScaledVector(ta,r.z),o}static isFrontFacing(t,e,i,s){return un.subVectors(i,e),An.subVectors(t,e),un.cross(An).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),An.subVectors(this.a,this.b),un.cross(An).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;zi.subVectors(s,i),ki.subVectors(r,i),$o.subVectors(t,i);let c=zi.dot($o),l=ki.dot($o);if(c<=0&&l<=0)return e.copy(i);Jo.subVectors(t,s);let h=zi.dot(Jo),u=ki.dot(Jo);if(h>=0&&u<=h)return e.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(i).addScaledVector(zi,o);Ko.subVectors(t,r);let f=zi.dot(Ko),x=ki.dot(Ko);if(x>=0&&f<=x)return e.copy(r);let _=f*l-c*x;if(_<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(i).addScaledVector(ki,a);let g=h*x-f*u;if(g<=0&&u-h>=0&&f-x>=0)return Zl.subVectors(r,s),a=(u-h)/(u-h+(f-x)),e.copy(s).addScaledVector(Zl,a);let p=1/(g+_+d);return o=_*p,a=d*p,e.copy(i).addScaledVector(zi,o).addScaledVector(ki,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},tu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},fr={h:0,s:0,l:0};function ea(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Vt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=i,jt.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=jt.workingColorSpace){if(t=jc(t,1),e=Re(e,0,1),i=Re(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=ea(o,r,t+1/3),this.g=ea(o,r,t),this.b=ea(o,r,t-1/3)}return jt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ae){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){let i=tu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Un(t.r),this.g=Un(t.g),this.b=Un(t.b),this}copyLinearToSRGB(t){return this.r=ts(t.r),this.g=ts(t.g),this.b=ts(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return jt.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Re(Ue.r*255,0,255))*65536+Math.round(Re(Ue.g*255,0,255))*256+Math.round(Re(Ue.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.fromWorkingColorSpace(Ue.copy(this),e);let i=Ue.r,s=Ue.g,r=Ue.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=jt.workingColorSpace){return jt.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Ae){jt.fromWorkingColorSpace(Ue.copy(this),t);let e=Ue.r,i=Ue.g,s=Ue.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL($n),this.setHSL($n.h+t,$n.s+e,$n.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL($n),t.getHSL(fr);let i=Ps($n.h,fr.h,e),s=Ps($n.s,fr.s,e),r=Ps($n.l,fr.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ue=new Vt;Vt.NAMES=tu;var cf=0,Bn=class extends ni{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=xn(),this.name="",this.blending=Qi,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ga,this.blendDst=xa,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Qi&&(i.blending=this.blending),this.side!==_n&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ga&&(i.blendSrc=this.blendSrc),this.blendDst!==xa&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},zn=class extends Bn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.combine=zh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Pn=lf();function lf(){let n=new ArrayBuffer(4),t=new Float32Array(n),e=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(i[c]=0,i[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(i[c]=1024>>-l-14,i[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(i[c]=l+15<<10,i[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(i[c]=31744,i[c|256]=64512,s[c]=24,s[c|256]=24):(i[c]=31744,i[c|256]=64512,s[c]=13,s[c|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;!(l&8388608);)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)o[c]=c<<23;o[31]=1199570944,o[32]=2147483648;for(let c=33;c<63;++c)o[c]=2147483648+(c-32<<23);o[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(a[c]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function hf(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=Re(n,-65504,65504),Pn.floatView[0]=n;let t=Pn.uint32View[0],e=t>>23&511;return Pn.baseTable[e]+((t&8388607)>>Pn.shiftTable[e])}function uf(n){let t=n>>10;return Pn.uint32View[0]=Pn.mantissaTable[Pn.offsetTable[t]+(n&1023)]+Pn.exponentTable[t],Pn.floatView[0]}var tr={toHalfFloat:hf,fromHalfFloat:uf},Me=new C,pr=new it,Se=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=tc,this.updateRanges=[],this.gpuType=Ge,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)pr.fromBufferAttribute(this,e),pr.applyMatrix3(t),this.setXY(e,pr.x,pr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=fn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=oe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fn(e,this.array)),e}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fn(e,this.array)),e}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fn(e,this.array)),e}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array),s=oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array),s=oe(s,this.array),r=oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==tc&&(t.usage=this.usage),t}};var qr=class extends Se{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Yr=class extends Se{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Ut=class extends Se{constructor(t,e,i){super(new Float32Array(t),e,i)}},df=0,nn=new $t,na=new Ie,Hi=new C,$e=new On,Ss=new On,Te=new C,ae=class n extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jh(t)?Yr:qr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Xt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,i){return nn.makeTranslation(t,e,i),this.applyMatrix4(nn),this}scale(t,e,i){return nn.makeScale(t,e,i),this.applyMatrix4(nn),this}lookAt(t){return na.lookAt(t),na.updateMatrix(),this.applyMatrix4(na.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(i,3))}else{for(let i=0,s=e.count;i<s;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new On);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];$e.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){let i=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Ss.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors($e.min,Ss.min),$e.expandByPoint(Te),Te.addVectors($e.max,Ss.max),$e.expandByPoint(Te)):($e.expandByPoint(Ss.min),$e.expandByPoint(Ss.max))}$e.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Te));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Te.fromBufferAttribute(a,l),c&&(Hi.fromBufferAttribute(t,l),Te.add(Hi)),s=Math.max(s,i.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Se(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<i.count;R++)a[R]=new C,c[R]=new C;let l=new C,h=new C,u=new C,d=new it,f=new it,x=new it,_=new C,g=new C;function p(R,E,v){l.fromBufferAttribute(i,R),h.fromBufferAttribute(i,E),u.fromBufferAttribute(i,v),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,E),x.fromBufferAttribute(r,v),h.sub(l),u.sub(l),f.sub(d),x.sub(d);let P=1/(f.x*x.y-x.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(x.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-x.x).multiplyScalar(P),a[R].add(_),a[E].add(_),a[v].add(_),c[R].add(g),c[E].add(g),c[v].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let R=0,E=b.length;R<E;++R){let v=b[R],P=v.start,H=v.count;for(let z=P,B=P+H;z<B;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let S=new C,y=new C,U=new C,A=new C;function D(R){U.fromBufferAttribute(s,R),A.copy(U);let E=a[R];S.copy(E),S.sub(U.multiplyScalar(U.dot(E))).normalize(),y.crossVectors(A,E);let P=y.dot(c[R])<0?-1:1;o.setXYZW(R,S.x,S.y,S.z,P)}for(let R=0,E=b.length;R<E;++R){let v=b[R],P=v.start,H=v.count;for(let z=P,B=P+H;z<B;z+=3)D(t.getX(z+0)),D(t.getX(z+1)),D(t.getX(z+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Se(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){let x=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,x),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),a.add(h),c.add(h),l.add(h),i.setXYZ(x,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,x=0;for(let _=0,g=c.length;_<g;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let p=0;p<h;p++)d[x++]=l[f++]}return new Se(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,i);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},$l=new $t,ui=new Hs,mr=new ii,Jl=new C,gr=new C,xr=new C,_r=new C,ia=new C,yr=new C,Kl=new C,vr=new C,ee=class extends Ie{constructor(t=new ae,e=new zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){yr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(ia.fromBufferAttribute(u,t),o?yr.addScaledVector(ia,h):yr.addScaledVector(ia.sub(e),h))}e.add(yr)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),mr.copy(i.boundingSphere),mr.applyMatrix4(r),ui.copy(t.ray).recast(t.near),!(mr.containsPoint(ui.origin)===!1&&(ui.intersectSphere(mr,Jl)===null||ui.origin.distanceToSquared(Jl)>(t.far-t.near)**2))&&($l.copy(r).invert(),ui.copy(t.ray).applyMatrix4($l),!(i.boundingBox!==null&&ui.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ui)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,_=d.length;x<_;x++){let g=d[x],p=o[g.materialIndex],b=Math.max(g.start,f.start),S=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=b,U=S;y<U;y+=3){let A=a.getX(y),D=a.getX(y+1),R=a.getX(y+2);s=Mr(this,p,t,i,l,h,u,A,D,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let x=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=x,p=_;g<p;g+=3){let b=a.getX(g),S=a.getX(g+1),y=a.getX(g+2);s=Mr(this,o,t,i,l,h,u,b,S,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,_=d.length;x<_;x++){let g=d[x],p=o[g.materialIndex],b=Math.max(g.start,f.start),S=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=b,U=S;y<U;y+=3){let A=y,D=y+1,R=y+2;s=Mr(this,p,t,i,l,h,u,A,D,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let x=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=x,p=_;g<p;g+=3){let b=g,S=g+1,y=g+2;s=Mr(this,o,t,i,l,h,u,b,S,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function ff(n,t,e,i,s,r,o,a){let c;if(t.side===Xe?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,t.side===_n,a),c===null)return null;vr.copy(a),vr.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(vr);return l<e.near||l>e.far?null:{distance:l,point:vr.clone(),object:n}}function Mr(n,t,e,i,s,r,o,a,c,l){n.getVertexPosition(a,gr),n.getVertexPosition(c,xr),n.getVertexPosition(l,_r);let h=ff(n,t,e,i,gr,xr,_r,Kl);if(h){let u=new C;Qn.getBarycoord(Kl,gr,xr,_r,u),s&&(h.uv=Qn.getInterpolatedAttribute(s,a,c,l,u,new it)),r&&(h.uv1=Qn.getInterpolatedAttribute(r,a,c,l,u,new it)),o&&(h.normal=Qn.getInterpolatedAttribute(o,a,c,l,u,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new C,materialIndex:0};Qn.getNormal(gr,xr,_r,d.normal),h.face=d,h.barycoord=u}return h}var yi=class n extends ae{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;x("z","y","x",-1,-1,i,e,t,o,r,0),x("z","y","x",1,-1,i,e,-t,o,r,1),x("x","z","y",1,1,t,i,e,s,o,2),x("x","z","y",1,-1,t,i,-e,s,o,3),x("x","y","z",1,-1,t,e,i,s,r,4),x("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Ut(l,3)),this.setAttribute("normal",new Ut(h,3)),this.setAttribute("uv",new Ut(u,2));function x(_,g,p,b,S,y,U,A,D,R,E){let v=y/D,P=U/R,H=y/2,z=U/2,B=A/2,Y=D+1,k=R+1,et=0,q=0,ct=new C;for(let ut=0;ut<k;ut++){let Mt=ut*P-z;for(let Dt=0;Dt<Y;Dt++){let qt=Dt*v-H;ct[_]=qt*b,ct[g]=Mt*S,ct[p]=B,l.push(ct.x,ct.y,ct.z),ct[_]=0,ct[g]=0,ct[p]=A>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(Dt/D),u.push(1-ut/R),et+=1}}for(let ut=0;ut<R;ut++)for(let Mt=0;Mt<D;Mt++){let Dt=d+Mt+Y*ut,qt=d+Mt+Y*(ut+1),$=d+(Mt+1)+Y*(ut+1),ot=d+(Mt+1)+Y*ut;c.push(Dt,qt,ot),c.push(qt,$,ot),q+=6}a.addGroup(f,q,E),f+=q,d+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function as(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Oe(n){let t={};for(let e=0;e<n.length;e++){let i=as(n[e]);for(let s in i)t[s]=i[s]}return t}function pf(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function eu(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}var mf={clone:as,merge:Oe},gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,yn=class extends Bn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gf,this.fragmentShader=xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=as(t.uniforms),this.uniformsGroups=pf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Zr=class extends Ie{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=Ln}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Jn=new C,Ql=new it,jl=new it,Be=class extends Zr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Is*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Is*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,Ql,jl),e.subVectors(jl,Ql)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Is*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Vi=-90,Gi=1,sc=class extends Ie{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Be(Vi,Gi,t,e);s.layers=this.layers,this.add(s);let r=new Be(Vi,Gi,t,e);r.layers=this.layers,this.add(r);let o=new Be(Vi,Gi,t,e);o.layers=this.layers,this.add(o);let a=new Be(Vi,Gi,t,e);a.layers=this.layers,this.add(a);let c=new Be(Vi,Gi,t,e);c.layers=this.layers,this.add(c);let l=new Be(Vi,Gi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Ln)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Gr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=x,i.texture.needsPMREMUpdate=!0}},$r=class extends ze{constructor(t,e,i,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:is,super(t,e,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},rc=class extends Fn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new $r(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ee}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new yi(5,5,5),r=new yn({name:"CubemapFromEquirect",uniforms:as(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xe,blending:ti});r.uniforms.tEquirect.value=e;let o=new ee(s,r),a=e.minFilter;return e.minFilter===jn&&(e.minFilter=Ee),new sc(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}},sa=new C,_f=new C,yf=new Xt,dn=class{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=sa.subVectors(i,e).cross(_f.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(sa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||yf.getNormalMatrix(t),s=this.coplanarPoint(sa).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},di=new ii,Sr=new C,Gs=class{constructor(t=new dn,e=new dn,i=new dn,s=new dn,r=new dn,o=new dn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ln){let i=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],x=s[9],_=s[10],g=s[11],p=s[12],b=s[13],S=s[14],y=s[15];if(i[0].setComponents(c-r,d-l,g-f,y-p).normalize(),i[1].setComponents(c+r,d+l,g+f,y+p).normalize(),i[2].setComponents(c+o,d+h,g+x,y+b).normalize(),i[3].setComponents(c-o,d-h,g-x,y-b).normalize(),i[4].setComponents(c-a,d-u,g-_,y-S).normalize(),e===Ln)i[5].setComponents(c+a,d+u,g+_,y+S).normalize();else if(e===Gr)i[5].setComponents(a,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(t){return di.center.set(0,0,0),di.radius=.7071067811865476,di.applyMatrix4(t.matrixWorld),this.intersectsSphere(di)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(Sr.x=s.normal.x>0?t.max.x:t.min.x,Sr.y=s.normal.y>0?t.max.y:t.min.y,Sr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Sr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function nu(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function vf(n){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,l){let h=c.array,u=c.updateRanges;if(n.bindBuffer(l,a),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,x)=>f.start-x.start);let d=0;for(let f=1;f<u.length;f++){let x=u[d],_=u[f];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,x=u.length;f<x;f++){let _=u[f];n.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var ue=class n extends ae{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],x=[],_=[],g=[];for(let p=0;p<h;p++){let b=p*d-o;for(let S=0;S<l;S++){let y=S*u-r;x.push(y,-b,0),_.push(0,0,1),g.push(S/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<a;b++){let S=b+l*p,y=b+l*(p+1),U=b+1+l*(p+1),A=b+1+l*p;f.push(S,y,A),f.push(y,U,A)}this.setIndex(f),this.setAttribute("position",new Ut(x,3)),this.setAttribute("normal",new Ut(_,3)),this.setAttribute("uv",new Ut(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Mf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ef=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Af=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,If=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Df=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Uf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Nf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ff=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Wf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Xf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,qf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Yf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$f=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,tp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ep=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,np=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ip=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,sp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,op=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,up=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,fp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,pp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_p=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,yp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ep=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ap=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ip=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Dp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Up=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Np=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Op=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$p=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Jp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,t0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,e0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,n0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,i0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,s0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,r0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,o0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,a0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,c0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,l0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,h0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,u0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,d0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,f0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,p0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,m0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,x0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,y0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,v0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,M0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,T0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,A0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,R0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,C0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,I0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,P0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,D0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,L0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,U0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,z0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,H0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,V0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,W0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,X0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,J0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Q0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,j0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:Mf,alphahash_pars_fragment:Sf,alphamap_fragment:Ef,alphamap_pars_fragment:wf,alphatest_fragment:bf,alphatest_pars_fragment:Tf,aomap_fragment:Af,aomap_pars_fragment:Rf,batching_pars_vertex:Cf,batching_vertex:If,begin_vertex:Pf,beginnormal_vertex:Df,bsdfs:Lf,iridescence_fragment:Uf,bumpmap_pars_fragment:Nf,clipping_planes_fragment:Ff,clipping_planes_pars_fragment:Of,clipping_planes_pars_vertex:Bf,clipping_planes_vertex:zf,color_fragment:kf,color_pars_fragment:Hf,color_pars_vertex:Vf,color_vertex:Gf,common:Wf,cube_uv_reflection_fragment:Xf,defaultnormal_vertex:qf,displacementmap_pars_vertex:Yf,displacementmap_vertex:Zf,emissivemap_fragment:$f,emissivemap_pars_fragment:Jf,colorspace_fragment:Kf,colorspace_pars_fragment:Qf,envmap_fragment:jf,envmap_common_pars_fragment:tp,envmap_pars_fragment:ep,envmap_pars_vertex:np,envmap_physical_pars_fragment:fp,envmap_vertex:ip,fog_vertex:sp,fog_pars_vertex:rp,fog_fragment:op,fog_pars_fragment:ap,gradientmap_pars_fragment:cp,lightmap_pars_fragment:lp,lights_lambert_fragment:hp,lights_lambert_pars_fragment:up,lights_pars_begin:dp,lights_toon_fragment:pp,lights_toon_pars_fragment:mp,lights_phong_fragment:gp,lights_phong_pars_fragment:xp,lights_physical_fragment:_p,lights_physical_pars_fragment:yp,lights_fragment_begin:vp,lights_fragment_maps:Mp,lights_fragment_end:Sp,logdepthbuf_fragment:Ep,logdepthbuf_pars_fragment:wp,logdepthbuf_pars_vertex:bp,logdepthbuf_vertex:Tp,map_fragment:Ap,map_pars_fragment:Rp,map_particle_fragment:Cp,map_particle_pars_fragment:Ip,metalnessmap_fragment:Pp,metalnessmap_pars_fragment:Dp,morphinstance_vertex:Lp,morphcolor_vertex:Up,morphnormal_vertex:Np,morphtarget_pars_vertex:Fp,morphtarget_vertex:Op,normal_fragment_begin:Bp,normal_fragment_maps:zp,normal_pars_fragment:kp,normal_pars_vertex:Hp,normal_vertex:Vp,normalmap_pars_fragment:Gp,clearcoat_normal_fragment_begin:Wp,clearcoat_normal_fragment_maps:Xp,clearcoat_pars_fragment:qp,iridescence_pars_fragment:Yp,opaque_fragment:Zp,packing:$p,premultiplied_alpha_fragment:Jp,project_vertex:Kp,dithering_fragment:Qp,dithering_pars_fragment:jp,roughnessmap_fragment:t0,roughnessmap_pars_fragment:e0,shadowmap_pars_fragment:n0,shadowmap_pars_vertex:i0,shadowmap_vertex:s0,shadowmask_pars_fragment:r0,skinbase_vertex:o0,skinning_pars_vertex:a0,skinning_vertex:c0,skinnormal_vertex:l0,specularmap_fragment:h0,specularmap_pars_fragment:u0,tonemapping_fragment:d0,tonemapping_pars_fragment:f0,transmission_fragment:p0,transmission_pars_fragment:m0,uv_pars_fragment:g0,uv_pars_vertex:x0,uv_vertex:_0,worldpos_vertex:y0,background_vert:v0,background_frag:M0,backgroundCube_vert:S0,backgroundCube_frag:E0,cube_vert:w0,cube_frag:b0,depth_vert:T0,depth_frag:A0,distanceRGBA_vert:R0,distanceRGBA_frag:C0,equirect_vert:I0,equirect_frag:P0,linedashed_vert:D0,linedashed_frag:L0,meshbasic_vert:U0,meshbasic_frag:N0,meshlambert_vert:F0,meshlambert_frag:O0,meshmatcap_vert:B0,meshmatcap_frag:z0,meshnormal_vert:k0,meshnormal_frag:H0,meshphong_vert:V0,meshphong_frag:G0,meshphysical_vert:W0,meshphysical_frag:X0,meshtoon_vert:q0,meshtoon_frag:Y0,points_vert:Z0,points_frag:$0,shadow_vert:J0,shadow_frag:K0,sprite_vert:Q0,sprite_frag:j0},dt={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},gn={basic:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:Oe([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:Oe([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:Oe([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:Oe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:Oe([dt.points,dt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:Oe([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:Oe([dt.common,dt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:Oe([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:Oe([dt.sprite,dt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distanceRGBA:{uniforms:Oe([dt.common,dt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distanceRGBA_vert,fragmentShader:Zt.distanceRGBA_frag},shadow:{uniforms:Oe([dt.lights,dt.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};gn.physical={uniforms:Oe([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};var Er={r:0,b:0,g:0},fi=new sn,tm=new $t;function em(n,t,e,i,s,r,o){let a=new Vt(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function x(b){let S=b.isScene===!0?b.background:null;return S&&S.isTexture&&(S=(b.backgroundBlurriness>0?e:t).get(S)),S}function _(b){let S=!1,y=x(b);y===null?p(a,c):y&&y.isColor&&(p(y,1),S=!0);let U=n.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,o):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(b,S){let y=x(S);y&&(y.isCubeTexture||y.mapping===yo)?(h===void 0&&(h=new ee(new yi(1,1,1),new yn({name:"BackgroundCubeMaterial",uniforms:as(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(U,A,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),fi.copy(S.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(tm.makeRotationFromEuler(fi)),h.material.toneMapped=jt.getTransfer(y.colorSpace)!==ce,(u!==y||d!==y.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=n.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ee(new ue(2,2),new yn({name:"BackgroundMaterial",uniforms:as(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=jt.getTransfer(y.colorSpace)!==ce,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,S){b.getRGB(Er,eu(n)),i.buffers.color.setClear(Er.r,Er.g,Er.b,S,o)}return{getClearColor:function(){return a},setClearColor:function(b,S=1){a.set(b),c=S,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:_,addToRenderList:g}}function nm(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(v,P,H,z,B){let Y=!1,k=u(z,H,P);r!==k&&(r=k,l(r.object)),Y=f(v,z,H,B),Y&&x(v,z,H,B),B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,y(v,P,H,z),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function c(){return n.createVertexArray()}function l(v){return n.bindVertexArray(v)}function h(v){return n.deleteVertexArray(v)}function u(v,P,H){let z=H.wireframe===!0,B=i[v.id];B===void 0&&(B={},i[v.id]=B);let Y=B[P.id];Y===void 0&&(Y={},B[P.id]=Y);let k=Y[z];return k===void 0&&(k=d(c()),Y[z]=k),k}function d(v){let P=[],H=[],z=[];for(let B=0;B<e;B++)P[B]=0,H[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:H,attributeDivisors:z,object:v,attributes:{},index:null}}function f(v,P,H,z){let B=r.attributes,Y=P.attributes,k=0,et=H.getAttributes();for(let q in et)if(et[q].location>=0){let ut=B[q],Mt=Y[q];if(Mt===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(Mt=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(Mt=v.instanceColor)),ut===void 0||ut.attribute!==Mt||Mt&&ut.data!==Mt.data)return!0;k++}return r.attributesNum!==k||r.index!==z}function x(v,P,H,z){let B={},Y=P.attributes,k=0,et=H.getAttributes();for(let q in et)if(et[q].location>=0){let ut=Y[q];ut===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(ut=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(ut=v.instanceColor));let Mt={};Mt.attribute=ut,ut&&ut.data&&(Mt.data=ut.data),B[q]=Mt,k++}r.attributes=B,r.attributesNum=k,r.index=z}function _(){let v=r.newAttributes;for(let P=0,H=v.length;P<H;P++)v[P]=0}function g(v){p(v,0)}function p(v,P){let H=r.newAttributes,z=r.enabledAttributes,B=r.attributeDivisors;H[v]=1,z[v]===0&&(n.enableVertexAttribArray(v),z[v]=1),B[v]!==P&&(n.vertexAttribDivisor(v,P),B[v]=P)}function b(){let v=r.newAttributes,P=r.enabledAttributes;for(let H=0,z=P.length;H<z;H++)P[H]!==v[H]&&(n.disableVertexAttribArray(H),P[H]=0)}function S(v,P,H,z,B,Y,k){k===!0?n.vertexAttribIPointer(v,P,H,B,Y):n.vertexAttribPointer(v,P,H,z,B,Y)}function y(v,P,H,z){_();let B=z.attributes,Y=H.getAttributes(),k=P.defaultAttributeValues;for(let et in Y){let q=Y[et];if(q.location>=0){let ct=B[et];if(ct===void 0&&(et==="instanceMatrix"&&v.instanceMatrix&&(ct=v.instanceMatrix),et==="instanceColor"&&v.instanceColor&&(ct=v.instanceColor)),ct!==void 0){let ut=ct.normalized,Mt=ct.itemSize,Dt=t.get(ct);if(Dt===void 0)continue;let qt=Dt.buffer,$=Dt.type,ot=Dt.bytesPerElement,wt=$===n.INT||$===n.UNSIGNED_INT||ct.gpuType===qc;if(ct.isInterleavedBufferAttribute){let lt=ct.data,Lt=lt.stride,zt=ct.offset;if(lt.isInstancedInterleavedBuffer){for(let Ot=0;Ot<q.locationSize;Ot++)p(q.location+Ot,lt.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let Ot=0;Ot<q.locationSize;Ot++)g(q.location+Ot);n.bindBuffer(n.ARRAY_BUFFER,qt);for(let Ot=0;Ot<q.locationSize;Ot++)S(q.location+Ot,Mt/q.locationSize,$,ut,Lt*ot,(zt+Mt/q.locationSize*Ot)*ot,wt)}else{if(ct.isInstancedBufferAttribute){for(let lt=0;lt<q.locationSize;lt++)p(q.location+lt,ct.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let lt=0;lt<q.locationSize;lt++)g(q.location+lt);n.bindBuffer(n.ARRAY_BUFFER,qt);for(let lt=0;lt<q.locationSize;lt++)S(q.location+lt,Mt/q.locationSize,$,ut,Mt*ot,Mt/q.locationSize*lt*ot,wt)}}else if(k!==void 0){let ut=k[et];if(ut!==void 0)switch(ut.length){case 2:n.vertexAttrib2fv(q.location,ut);break;case 3:n.vertexAttrib3fv(q.location,ut);break;case 4:n.vertexAttrib4fv(q.location,ut);break;default:n.vertexAttrib1fv(q.location,ut)}}}}b()}function U(){R();for(let v in i){let P=i[v];for(let H in P){let z=P[H];for(let B in z)h(z[B].object),delete z[B];delete P[H]}delete i[v]}}function A(v){if(i[v.id]===void 0)return;let P=i[v.id];for(let H in P){let z=P[H];for(let B in z)h(z[B].object),delete z[B];delete P[H]}delete i[v.id]}function D(v){for(let P in i){let H=i[P];if(H[v.id]===void 0)continue;let z=H[v.id];for(let B in z)h(z[B].object),delete z[B];delete H[v.id]}}function R(){E(),o=!0,r!==s&&(r=s,l(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:E,dispose:U,releaseStatesOfGeometry:A,releaseStatesOfProgram:D,initAttributes:_,enableAttribute:g,disableUnusedAttributes:b}}function im(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function o(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let x=0;x<u;x++)f+=h[x];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let x=0;x<l.length;x++)o(l[x],h[x],d[x]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let x=0;for(let _=0;_<u;_++)x+=h[_]*d[_];e.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function sm(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let D=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(D){return!(D!==Je&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(D){let R=D===vn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(D!==Nn&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==Ge&&!R)}function c(D){if(D==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),U=x>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:U,maxSamples:A}}function rm(n){let t=this,e=null,i=0,s=!1,r=!1,o=new dn,a=new Xt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let x=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!s||x===null||x.length===0||r&&!g)r?h(null):l();else{let b=r?0:i,S=b*4,y=p.clippingState||null;c.value=y,y=h(x,d,S,f);for(let U=0;U!==S;++U)y[U]=e[U];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,x){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=c.value,x!==!0||g===null){let p=f+_*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,y=f;S!==_;++S,y+=4)o.copy(u[S]).applyMatrix4(b,a),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function om(n){let t=new WeakMap;function e(o,a){return a===Fs?o.mapping=is:a===ba&&(o.mapping=ss),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Fs||a===ba)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new rc(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var Jr=class extends Zr{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ji=4,th=[.125,.215,.35,.446,.526,.582],xi=20,ra=new Jr,eh=new Vt,oa=null,aa=0,ca=0,la=!1,mi=(1+Math.sqrt(5))/2,Wi=1/mi,nh=[new C(-mi,Wi,0),new C(mi,Wi,0),new C(-Wi,0,mi),new C(Wi,0,mi),new C(0,mi,-Wi),new C(0,mi,Wi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],cs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){oa=this._renderer.getRenderTarget(),aa=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),la=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(oa,aa,ca),this._renderer.xr.enabled=la,t.scissorTest=!1,wr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),oa=this._renderer.getRenderTarget(),aa=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),la=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ee,minFilter:Ee,generateMipmaps:!1,type:vn,format:Je,colorSpace:ri,depthBuffer:!1},s=ih(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ih(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=am(r)),this._blurMaterial=cm(r,t,e)}return s}_compileMaterial(t){let e=new ee(this._lodPlanes[0],t);this._renderer.compile(e,ra)}_sceneToCubeUV(t,e,i,s){let a=new Be(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(eh),h.toneMapping=ei,h.autoClear=!1;let f=new zn({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),x=new ee(new yi,f),_=!1,g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(eh),_=!0);for(let p=0;p<6;p++){let b=p%3;b===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):b===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));let S=this._cubeSize;wr(s,b*S,p>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===is||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ee(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;wr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,ra)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=nh[(s-r-1)%nh.length];this._blur(t,r-1,r,o,a)}e.autoClear=i}_blur(t,e,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ee(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*xi-1),_=r/x,g=isFinite(r)?1+Math.floor(h*_):xi;g>xi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${xi}`);let p=[],b=0;for(let D=0;D<xi;++D){let R=D/_,E=Math.exp(-R*R/2);p.push(E),D===0?b+=E:D<g&&(b+=2*E)}for(let D=0;D<p.length;D++)p[D]=p[D]/b;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:S}=this;d.dTheta.value=x,d.mipInt.value=S-i;let y=this._sizeLods[s],U=3*y*(s>S-Ji?s-S+Ji:0),A=4*(this._cubeSize-y);wr(e,U,A,3*y,2*y),c.setRenderTarget(e),c.render(u,ra)}};function am(n){let t=[],e=[],i=[],s=n,r=n-Ji+1+th.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>n-Ji?c=th[o-n+Ji-1]:o===0&&(c=0),i.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,x=6,_=3,g=2,p=1,b=new Float32Array(_*x*f),S=new Float32Array(g*x*f),y=new Float32Array(p*x*f);for(let A=0;A<f;A++){let D=A%3*2/3-1,R=A>2?0:-1,E=[D,R,0,D+2/3,R,0,D+2/3,R+1,0,D,R,0,D+2/3,R+1,0,D,R+1,0];b.set(E,_*x*A),S.set(d,g*x*A);let v=[A,A,A,A,A,A];y.set(v,p*x*A)}let U=new ae;U.setAttribute("position",new Se(b,_)),U.setAttribute("uv",new Se(S,g)),U.setAttribute("faceIndex",new Se(y,p)),t.push(U),s>Ji&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function ih(n,t,e){let i=new Fn(n,t,e);return i.texture.mapping=yo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function cm(n,t,e){let i=new Float32Array(xi),s=new C(0,1,0);return new yn({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function sh(){return new yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function rh(){return new yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function tl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function lm(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){let c=a.mapping,l=c===Fs||c===ba,h=c===is||c===ss;if(l||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new cs(n)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new cs(n)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function hm(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Rs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function um(n,t,e,i){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let x in d.attributes)t.remove(d.attributes[x]);for(let x in d.morphAttributes){let _=d.morphAttributes[x];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let x in d)t.update(d[x],n.ARRAY_BUFFER);let f=u.morphAttributes;for(let x in f){let _=f[x];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,x=u.attributes.position,_=0;if(f!==null){let b=f.array;_=f.version;for(let S=0,y=b.length;S<y;S+=3){let U=b[S+0],A=b[S+1],D=b[S+2];d.push(U,A,A,D,D,U)}}else if(x!==void 0){let b=x.array;_=x.version;for(let S=0,y=b.length/3-1;S<y;S+=3){let U=S+0,A=S+1,D=S+2;d.push(U,A,A,D,D,U)}}else return;let g=new(jh(d)?Yr:qr)(d,1);g.version=_;let p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function dm(n,t,e){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,r,d*o),e.update(f,i,1)}function l(d,f,x){x!==0&&(n.drawElementsInstanced(i,f,r,d*o,x),e.update(f,i,x))}function h(d,f,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,x);let g=0;for(let p=0;p<x;p++)g+=f[p];e.update(g,i,1)}function u(d,f,x,_){if(x===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,_,0,x);let p=0;for(let b=0;b<x;b++)p+=f[b]*_[b];e.update(p,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function fm(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function pm(n,t,e){let i=new WeakMap,s=new ye;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(a);if(d===void 0||d.count!==u){let E=function(){D.dispose(),i.delete(a),a.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],S=0;f===!0&&(S=1),x===!0&&(S=2),_===!0&&(S=3);let y=a.attributes.position.count*S,U=1;y>t.maxTextureSize&&(U=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let A=new Float32Array(y*U*4*u),D=new Xr(A,y,U,u);D.type=Ge,D.needsUpdate=!0;let R=S*4;for(let v=0;v<u;v++){let P=g[v],H=p[v],z=b[v],B=y*U*4*v;for(let Y=0;Y<P.count;Y++){let k=Y*R;f===!0&&(s.fromBufferAttribute(P,Y),A[B+k+0]=s.x,A[B+k+1]=s.y,A[B+k+2]=s.z,A[B+k+3]=0),x===!0&&(s.fromBufferAttribute(H,Y),A[B+k+4]=s.x,A[B+k+5]=s.y,A[B+k+6]=s.z,A[B+k+7]=0),_===!0&&(s.fromBufferAttribute(z,Y),A[B+k+8]=s.x,A[B+k+9]=s.y,A[B+k+10]=s.z,A[B+k+11]=z.itemSize===4?s.w:1)}}d={count:u,texture:D,size:new it(y,U)},i.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];let x=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function mm(n,t,e,i){let s=new WeakMap;function r(c){let l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Kr=class extends ze{constructor(t,e,i,s,r,o,a,c,l,h=ji){if(h!==ji&&h!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ji&&(i=_i),i===void 0&&h===os&&(i=rs),super(null,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ke,this.minFilter=c!==void 0?c:Ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},iu=new ze,oh=new Kr(1,1),su=new Xr,ru=new ic,ou=new $r,ah=[],ch=[],lh=new Float32Array(16),hh=new Float32Array(9),uh=new Float32Array(4);function fs(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=ah[s];if(r===void 0&&(r=new Float32Array(s),ah[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function we(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function be(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Mo(n,t){let e=ch[t];e===void 0&&(e=new Int32Array(t),ch[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function gm(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function xm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2fv(this.addr,t),be(e,t)}}function _m(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;n.uniform3fv(this.addr,t),be(e,t)}}function ym(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4fv(this.addr,t),be(e,t)}}function vm(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(we(e,i))return;uh.set(i),n.uniformMatrix2fv(this.addr,!1,uh),be(e,i)}}function Mm(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(we(e,i))return;hh.set(i),n.uniformMatrix3fv(this.addr,!1,hh),be(e,i)}}function Sm(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(we(e,i))return;lh.set(i),n.uniformMatrix4fv(this.addr,!1,lh),be(e,i)}}function Em(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function wm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2iv(this.addr,t),be(e,t)}}function bm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;n.uniform3iv(this.addr,t),be(e,t)}}function Tm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4iv(this.addr,t),be(e,t)}}function Am(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Rm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2uiv(this.addr,t),be(e,t)}}function Cm(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;n.uniform3uiv(this.addr,t),be(e,t)}}function Im(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4uiv(this.addr,t),be(e,t)}}function Pm(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(oh.compareFunction=Kh,r=oh):r=iu,e.setTexture2D(t||r,s)}function Dm(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||ru,s)}function Lm(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||ou,s)}function Um(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||su,s)}function Nm(n){switch(n){case 5126:return gm;case 35664:return xm;case 35665:return _m;case 35666:return ym;case 35674:return vm;case 35675:return Mm;case 35676:return Sm;case 5124:case 35670:return Em;case 35667:case 35671:return wm;case 35668:case 35672:return bm;case 35669:case 35673:return Tm;case 5125:return Am;case 36294:return Rm;case 36295:return Cm;case 36296:return Im;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Dm;case 35680:case 36300:case 36308:case 36293:return Lm;case 36289:case 36303:case 36311:case 36292:return Um}}function Fm(n,t){n.uniform1fv(this.addr,t)}function Om(n,t){let e=fs(t,this.size,2);n.uniform2fv(this.addr,e)}function Bm(n,t){let e=fs(t,this.size,3);n.uniform3fv(this.addr,e)}function zm(n,t){let e=fs(t,this.size,4);n.uniform4fv(this.addr,e)}function km(n,t){let e=fs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Hm(n,t){let e=fs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Vm(n,t){let e=fs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Gm(n,t){n.uniform1iv(this.addr,t)}function Wm(n,t){n.uniform2iv(this.addr,t)}function Xm(n,t){n.uniform3iv(this.addr,t)}function qm(n,t){n.uniform4iv(this.addr,t)}function Ym(n,t){n.uniform1uiv(this.addr,t)}function Zm(n,t){n.uniform2uiv(this.addr,t)}function $m(n,t){n.uniform3uiv(this.addr,t)}function Jm(n,t){n.uniform4uiv(this.addr,t)}function Km(n,t,e){let i=this.cache,s=t.length,r=Mo(e,s);we(i,r)||(n.uniform1iv(this.addr,r),be(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||iu,r[o])}function Qm(n,t,e){let i=this.cache,s=t.length,r=Mo(e,s);we(i,r)||(n.uniform1iv(this.addr,r),be(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ru,r[o])}function jm(n,t,e){let i=this.cache,s=t.length,r=Mo(e,s);we(i,r)||(n.uniform1iv(this.addr,r),be(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ou,r[o])}function tg(n,t,e){let i=this.cache,s=t.length,r=Mo(e,s);we(i,r)||(n.uniform1iv(this.addr,r),be(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||su,r[o])}function eg(n){switch(n){case 5126:return Fm;case 35664:return Om;case 35665:return Bm;case 35666:return zm;case 35674:return km;case 35675:return Hm;case 35676:return Vm;case 5124:case 35670:return Gm;case 35667:case 35671:return Wm;case 35668:case 35672:return Xm;case 35669:case 35673:return qm;case 5125:return Ym;case 36294:return Zm;case 36295:return $m;case 36296:return Jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return Qm;case 35680:case 36300:case 36308:case 36293:return jm;case 36289:case 36303:case 36311:case 36292:return tg}}var oc=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Nm(e.type)}},ac=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=eg(e.type)}},cc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},ha=/(\w+)(\])?(\[|\.)?/g;function dh(n,t){n.seq.push(t),n.map[t.id]=t}function ng(n,t,e){let i=n.name,s=i.length;for(ha.lastIndex=0;;){let r=ha.exec(i),o=ha.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){dh(e,l===void 0?new oc(a,n,t):new ac(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new cc(a),dh(e,u)),e=u}}}var es=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);ng(r,o,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function fh(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var ig=37297,sg=0;function rg(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var ph=new Xt;function og(n){jt._getMatrix(ph,jt.workingColorSpace,n);let t=`mat3( ${ph.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(n)){case vo:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function mh(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+rg(n.getShaderSource(t),o)}else return s}function ag(n,t){let e=og(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function cg(n,t){let e;switch(t){case md:e="Linear";break;case gd:e="Reinhard";break;case xd:e="Cineon";break;case Xc:e="ACESFilmic";break;case yd:e="AgX";break;case vd:e="Neutral";break;case _d:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var br=new C;function lg(){jt.getLuminanceCoefficients(br);let n=br.x.toFixed(4),t=br.y.toFixed(4),e=br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cs).join(`
`)}function ug(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function dg(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Cs(n){return n!==""}function gh(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var fg=/^[ \t]*#include +<([\w\d./]+)>/gm;function lc(n){return n.replace(fg,mg)}var pg=new Map;function mg(n,t){let e=Zt[t];if(e===void 0){let i=pg.get(t);if(i!==void 0)e=Zt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return lc(e)}var gg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _h(n){return n.replace(gg,xg)}function xg(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yh(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function _g(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Bh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Wc?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===In&&(t="SHADOWMAP_TYPE_VSM"),t}function yg(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case is:case ss:t="ENVMAP_TYPE_CUBE";break;case yo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function vg(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ss:t="ENVMAP_MODE_REFRACTION";break}return t}function Mg(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case zh:t="ENVMAP_BLENDING_MULTIPLY";break;case fd:t="ENVMAP_BLENDING_MIX";break;case pd:t="ENVMAP_BLENDING_ADD";break}return t}function Sg(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Eg(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=_g(e),l=yg(e),h=vg(e),u=Mg(e),d=Sg(e),f=hg(e),x=ug(r),_=s.createProgram(),g,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Cs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Cs).join(`
`),p.length>0&&(p+=`
`)):(g=[yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),p=[yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?Zt.tonemapping_pars_fragment:"",e.toneMapping!==ei?cg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,ag("linearToOutputTexel",e.outputColorSpace),lg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Cs).join(`
`)),o=lc(o),o=gh(o,e),o=xh(o,e),a=lc(a),a=gh(a,e),a=xh(a,e),o=_h(o),a=_h(a),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Dl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Dl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=b+g+o,y=b+p+a,U=fh(s,s.VERTEX_SHADER,S),A=fh(s,s.FRAGMENT_SHADER,y);s.attachShader(_,U),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function D(P){if(n.debug.checkShaderErrors){let H=s.getProgramInfoLog(_).trim(),z=s.getShaderInfoLog(U).trim(),B=s.getShaderInfoLog(A).trim(),Y=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,U,A);else{let et=mh(s,U,"vertex"),q=mh(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+et+`
`+q)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||B==="")&&(k=!1);k&&(P.diagnostics={runnable:Y,programLog:H,vertexShader:{log:z,prefix:g},fragmentShader:{log:B,prefix:p}})}s.deleteShader(U),s.deleteShader(A),R=new es(s,_),E=dg(s,_)}let R;this.getUniforms=function(){return R===void 0&&D(this),R};let E;this.getAttributes=function(){return E===void 0&&D(this),E};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,ig)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=sg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=U,this.fragmentShader=A,this}var wg=0,hc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new uc(t),e.set(t,i)),i}},uc=class{constructor(t){this.id=wg++,this.code=t,this.usedTimes=0}};function bg(n,t,e,i,s,r,o){let a=new Vs,c=new hc,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return l.add(E),E===0?"uv":`uv${E}`}function g(E,v,P,H,z){let B=H.fog,Y=z.geometry,k=E.isMeshStandardMaterial?H.environment:null,et=(E.isMeshStandardMaterial?e:t).get(E.envMap||k),q=et&&et.mapping===yo?et.image.height:null,ct=x[E.type];E.precision!==null&&(f=s.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));let ut=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Mt=ut!==void 0?ut.length:0,Dt=0;Y.morphAttributes.position!==void 0&&(Dt=1),Y.morphAttributes.normal!==void 0&&(Dt=2),Y.morphAttributes.color!==void 0&&(Dt=3);let qt,$,ot,wt;if(ct){let re=gn[ct];qt=re.vertexShader,$=re.fragmentShader}else qt=E.vertexShader,$=E.fragmentShader,c.update(E),ot=c.getVertexShaderID(E),wt=c.getFragmentShaderID(E);let lt=n.getRenderTarget(),Lt=n.state.buffers.depth.getReversed(),zt=z.isInstancedMesh===!0,Ot=z.isBatchedMesh===!0,Qt=!!E.map,j=!!E.matcap,rt=!!et,I=!!E.aoMap,It=!!E.lightMap,nt=!!E.bumpMap,vt=!!E.normalMap,ht=!!E.displacementMap,Nt=!!E.emissiveMap,_t=!!E.metalnessMap,T=!!E.roughnessMap,M=E.anisotropy>0,V=E.clearcoat>0,J=E.dispersion>0,tt=E.iridescence>0,K=E.sheen>0,bt=E.transmission>0,ft=M&&!!E.anisotropyMap,yt=V&&!!E.clearcoatMap,Jt=V&&!!E.clearcoatNormalMap,st=V&&!!E.clearcoatRoughnessMap,St=tt&&!!E.iridescenceMap,Ft=tt&&!!E.iridescenceThicknessMap,Bt=K&&!!E.sheenColorMap,Et=K&&!!E.sheenRoughnessMap,Kt=!!E.specularMap,Yt=!!E.specularColorMap,le=!!E.specularIntensityMap,N=bt&&!!E.transmissionMap,pt=bt&&!!E.thicknessMap,Z=!!E.gradientMap,Q=!!E.alphaMap,xt=E.alphaTest>0,mt=!!E.alphaHash,Gt=!!E.extensions,_e=ei;E.toneMapped&&(lt===null||lt.isXRRenderTarget===!0)&&(_e=n.toneMapping);let De={shaderID:ct,shaderType:E.type,shaderName:E.name,vertexShader:qt,fragmentShader:$,defines:E.defines,customVertexShaderID:ot,customFragmentShaderID:wt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ot,batchingColor:Ot&&z._colorsTexture!==null,instancing:zt,instancingColor:zt&&z.instanceColor!==null,instancingMorph:zt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:lt===null?n.outputColorSpace:lt.isXRRenderTarget===!0?lt.texture.colorSpace:ri,alphaToCoverage:!!E.alphaToCoverage,map:Qt,matcap:j,envMap:rt,envMapMode:rt&&et.mapping,envMapCubeUVHeight:q,aoMap:I,lightMap:It,bumpMap:nt,normalMap:vt,displacementMap:d&&ht,emissiveMap:Nt,normalMapObjectSpace:vt&&E.normalMapType===wd,normalMapTangentSpace:vt&&E.normalMapType===Jh,metalnessMap:_t,roughnessMap:T,anisotropy:M,anisotropyMap:ft,clearcoat:V,clearcoatMap:yt,clearcoatNormalMap:Jt,clearcoatRoughnessMap:st,dispersion:J,iridescence:tt,iridescenceMap:St,iridescenceThicknessMap:Ft,sheen:K,sheenColorMap:Bt,sheenRoughnessMap:Et,specularMap:Kt,specularColorMap:Yt,specularIntensityMap:le,transmission:bt,transmissionMap:N,thicknessMap:pt,gradientMap:Z,opaque:E.transparent===!1&&E.blending===Qi&&E.alphaToCoverage===!1,alphaMap:Q,alphaTest:xt,alphaHash:mt,combine:E.combine,mapUv:Qt&&_(E.map.channel),aoMapUv:I&&_(E.aoMap.channel),lightMapUv:It&&_(E.lightMap.channel),bumpMapUv:nt&&_(E.bumpMap.channel),normalMapUv:vt&&_(E.normalMap.channel),displacementMapUv:ht&&_(E.displacementMap.channel),emissiveMapUv:Nt&&_(E.emissiveMap.channel),metalnessMapUv:_t&&_(E.metalnessMap.channel),roughnessMapUv:T&&_(E.roughnessMap.channel),anisotropyMapUv:ft&&_(E.anisotropyMap.channel),clearcoatMapUv:yt&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Jt&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:St&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Et&&_(E.sheenRoughnessMap.channel),specularMapUv:Kt&&_(E.specularMap.channel),specularColorMapUv:Yt&&_(E.specularColorMap.channel),specularIntensityMapUv:le&&_(E.specularIntensityMap.channel),transmissionMapUv:N&&_(E.transmissionMap.channel),thicknessMapUv:pt&&_(E.thicknessMap.channel),alphaMapUv:Q&&_(E.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(vt||M),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(Qt||Q),fog:!!B,useFog:E.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Lt,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:Dt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:_e,decodeVideoTexture:Qt&&E.map.isVideoTexture===!0&&jt.getTransfer(E.map.colorSpace)===ce,decodeVideoTextureEmissive:Nt&&E.emissiveMap.isVideoTexture===!0&&jt.getTransfer(E.emissiveMap.colorSpace)===ce,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===ve,flipSided:E.side===Xe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Gt&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&E.extensions.multiDraw===!0||Ot)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function p(E){let v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(let P in E.defines)v.push(P),v.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(b(v,E),S(v,E),v.push(n.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function b(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function S(E,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),E.push(a.mask)}function y(E){let v=x[E.type],P;if(v){let H=gn[v];P=mf.clone(H.uniforms)}else P=E.uniforms;return P}function U(E,v){let P;for(let H=0,z=h.length;H<z;H++){let B=h[H];if(B.cacheKey===v){P=B,++P.usedTimes;break}}return P===void 0&&(P=new Eg(n,v,E,r),h.push(P)),P}function A(E){if(--E.usedTimes===0){let v=h.indexOf(E);h[v]=h[h.length-1],h.pop(),E.destroy()}}function D(E){c.remove(E)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:U,releaseProgram:A,releaseShaderCache:D,programs:h,dispose:R}}function Tg(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Ag(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function vh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Mh(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,d,f,x,_,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:x,renderOrder:u.renderOrder,z:_,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=x,p.renderOrder=u.renderOrder,p.z=_,p.group=g),t++,p}function a(u,d,f,x,_,g){let p=o(u,d,f,x,_,g);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,x,_,g){let p=o(u,d,f,x,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Ag),i.length>1&&i.sort(d||vh),s.length>1&&s.sort(d||vh)}function h(){for(let u=t,d=n.length;u<d;u++){let f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Rg(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Mh,n.set(i,[o])):s>=r.length?(o=new Mh,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Cg(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Vt};break;case"SpotLight":e={position:new C,direction:new C,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function Ig(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var Pg=0;function Dg(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Lg(n){let t=new Cg,e=Ig(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new C);let s=new C,r=new $t,o=new $t;function a(l){let h=0,u=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,x=0,_=0,g=0,p=0,b=0,S=0,y=0,U=0,A=0,D=0;l.sort(Dg);for(let E=0,v=l.length;E<v;E++){let P=l[E],H=P.color,z=P.intensity,B=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=H.r*z,u+=H.g*z,d+=H.b*z;else if(P.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(P.sh.coefficients[k],z);D++}else if(P.isDirectionalLight){let k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let et=P.shadow,q=e.get(P);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=Y,i.directionalShadowMatrix[f]=P.shadow.matrix,b++}i.directional[f]=k,f++}else if(P.isSpotLight){let k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(H).multiplyScalar(z),k.distance=B,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,i.spot[_]=k;let et=P.shadow;if(P.map&&(i.spotLightMap[U]=P.map,U++,et.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[_]=et.matrix,P.castShadow){let q=e.get(P);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=Y,y++}_++}else if(P.isRectAreaLight){let k=t.get(P);k.color.copy(H).multiplyScalar(z),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=k,g++}else if(P.isPointLight){let k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){let et=P.shadow,q=e.get(P);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,q.shadowCameraNear=et.camera.near,q.shadowCameraFar=et.camera.far,i.pointShadow[x]=q,i.pointShadowMap[x]=Y,i.pointShadowMatrix[x]=P.shadow.matrix,S++}i.point[x]=k,x++}else if(P.isHemisphereLight){let k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(z),k.groundColor.copy(P.groundColor).multiplyScalar(z),i.hemi[p]=k,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=dt.LTC_FLOAT_1,i.rectAreaLTC2=dt.LTC_FLOAT_2):(i.rectAreaLTC1=dt.LTC_HALF_1,i.rectAreaLTC2=dt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let R=i.hash;(R.directionalLength!==f||R.pointLength!==x||R.spotLength!==_||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==b||R.numPointShadows!==S||R.numSpotShadows!==y||R.numSpotMaps!==U||R.numLightProbes!==D)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=y+U-A,i.spotLightMap.length=U,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=D,R.directionalLength=f,R.pointLength=x,R.spotLength=_,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=b,R.numPointShadows=S,R.numSpotShadows=y,R.numSpotMaps=U,R.numLightProbes=D,i.version=Pg++)}function c(l,h){let u=0,d=0,f=0,x=0,_=0,g=h.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){let S=l[p];if(S.isDirectionalLight){let y=i.directional[u];y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(S.isSpotLight){let y=i.spot[f];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(S.isRectAreaLight){let y=i.rectArea[x];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),o.identity(),r.copy(S.matrixWorld),r.premultiply(g),o.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),x++}else if(S.isPointLight){let y=i.point[d];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),d++}else if(S.isHemisphereLight){let y=i.hemi[_];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(g),_++}}}return{setup:a,setupView:c,state:i}}function Sh(n){let t=new Lg(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function o(h){i.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Ug(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Sh(n),t.set(s,[a])):r>=o.length?(a=new Sh(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var dc=class extends Bn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Sd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},fc=class extends Bn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Ng=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Og(n,t,e){let i=new Gs,s=new it,r=new it,o=new ye,a=new dc({depthPacking:Ed}),c=new fc,l={},h=e.maxTextureSize,u={[_n]:Xe,[Xe]:_n,[ve]:ve},d=new yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:Ng,fragmentShader:Fg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let x=new ae;x.setAttribute("position",new Se(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ee(x,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bh;let p=this.type;this.render=function(A,D,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;let E=n.getRenderTarget(),v=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),H=n.state;H.setBlending(ti),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let z=p!==In&&this.type===In,B=p===In&&this.type!==In;for(let Y=0,k=A.length;Y<k;Y++){let et=A[Y],q=et.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ct=q.getFrameExtents();if(s.multiply(ct),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,q.mapSize.y=r.y)),q.map===null||z===!0||B===!0){let Mt=this.type!==In?{minFilter:Ke,magFilter:Ke}:{};q.map!==null&&q.map.dispose(),q.map=new Fn(s.x,s.y,Mt),q.map.texture.name=et.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let ut=q.getViewportCount();for(let Mt=0;Mt<ut;Mt++){let Dt=q.getViewport(Mt);o.set(r.x*Dt.x,r.y*Dt.y,r.x*Dt.z,r.y*Dt.w),H.viewport(o),q.updateMatrices(et,Mt),i=q.getFrustum(),y(D,R,q.camera,et,this.type)}q.isPointLightShadow!==!0&&this.type===In&&b(q,R),q.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(E,v,P)};function b(A,D){let R=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Fn(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(D,null,R,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(D,null,R,f,_,null)}function S(A,D,R,E){let v=null,P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)v=P;else if(v=R.isPointLight===!0?c:a,n.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0){let H=v.uuid,z=D.uuid,B=l[H];B===void 0&&(B={},l[H]=B);let Y=B[z];Y===void 0&&(Y=v.clone(),B[z]=Y,D.addEventListener("dispose",U)),v=Y}if(v.visible=D.visible,v.wireframe=D.wireframe,E===In?v.side=D.shadowSide!==null?D.shadowSide:D.side:v.side=D.shadowSide!==null?D.shadowSide:u[D.side],v.alphaMap=D.alphaMap,v.alphaTest=D.alphaTest,v.map=D.map,v.clipShadows=D.clipShadows,v.clippingPlanes=D.clippingPlanes,v.clipIntersection=D.clipIntersection,v.displacementMap=D.displacementMap,v.displacementScale=D.displacementScale,v.displacementBias=D.displacementBias,v.wireframeLinewidth=D.wireframeLinewidth,v.linewidth=D.linewidth,R.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let H=n.properties.get(v);H.light=R}return v}function y(A,D,R,E,v){if(A.visible===!1)return;if(A.layers.test(D.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===In)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);let z=t.update(A),B=A.material;if(Array.isArray(B)){let Y=z.groups;for(let k=0,et=Y.length;k<et;k++){let q=Y[k],ct=B[q.materialIndex];if(ct&&ct.visible){let ut=S(A,ct,E,v);A.onBeforeShadow(n,A,D,R,z,ut,q),n.renderBufferDirect(R,null,z,ut,A,q),A.onAfterShadow(n,A,D,R,z,ut,q)}}}else if(B.visible){let Y=S(A,B,E,v);A.onBeforeShadow(n,A,D,R,z,Y,null),n.renderBufferDirect(R,null,z,Y,A,null),A.onAfterShadow(n,A,D,R,z,Y,null)}}let H=A.children;for(let z=0,B=H.length;z<B;z++)y(H[z],D,R,E,v)}function U(A){A.target.removeEventListener("dispose",U);for(let R in l){let E=l[R],v=A.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}var Bg={[_a]:ya,[va]:Ea,[Ma]:wa,[ns]:Sa,[ya]:_a,[Ea]:va,[wa]:Ma,[Sa]:ns};function zg(n,t){function e(){let N=!1,pt=new ye,Z=null,Q=new ye(0,0,0,0);return{setMask:function(xt){Z!==xt&&!N&&(n.colorMask(xt,xt,xt,xt),Z=xt)},setLocked:function(xt){N=xt},setClear:function(xt,mt,Gt,_e,De){De===!0&&(xt*=_e,mt*=_e,Gt*=_e),pt.set(xt,mt,Gt,_e),Q.equals(pt)===!1&&(n.clearColor(xt,mt,Gt,_e),Q.copy(pt))},reset:function(){N=!1,Z=null,Q.set(-1,0,0,0)}}}function i(){let N=!1,pt=!1,Z=null,Q=null,xt=null;return{setReversed:function(mt){if(pt!==mt){let Gt=t.get("EXT_clip_control");pt?Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.ZERO_TO_ONE_EXT):Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.NEGATIVE_ONE_TO_ONE_EXT);let _e=xt;xt=null,this.setClear(_e)}pt=mt},getReversed:function(){return pt},setTest:function(mt){mt?lt(n.DEPTH_TEST):Lt(n.DEPTH_TEST)},setMask:function(mt){Z!==mt&&!N&&(n.depthMask(mt),Z=mt)},setFunc:function(mt){if(pt&&(mt=Bg[mt]),Q!==mt){switch(mt){case _a:n.depthFunc(n.NEVER);break;case ya:n.depthFunc(n.ALWAYS);break;case va:n.depthFunc(n.LESS);break;case ns:n.depthFunc(n.LEQUAL);break;case Ma:n.depthFunc(n.EQUAL);break;case Sa:n.depthFunc(n.GEQUAL);break;case Ea:n.depthFunc(n.GREATER);break;case wa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=mt}},setLocked:function(mt){N=mt},setClear:function(mt){xt!==mt&&(pt&&(mt=1-mt),n.clearDepth(mt),xt=mt)},reset:function(){N=!1,Z=null,Q=null,xt=null,pt=!1}}}function s(){let N=!1,pt=null,Z=null,Q=null,xt=null,mt=null,Gt=null,_e=null,De=null;return{setTest:function(re){N||(re?lt(n.STENCIL_TEST):Lt(n.STENCIL_TEST))},setMask:function(re){pt!==re&&!N&&(n.stencilMask(re),pt=re)},setFunc:function(re,an,Sn){(Z!==re||Q!==an||xt!==Sn)&&(n.stencilFunc(re,an,Sn),Z=re,Q=an,xt=Sn)},setOp:function(re,an,Sn){(mt!==re||Gt!==an||_e!==Sn)&&(n.stencilOp(re,an,Sn),mt=re,Gt=an,_e=Sn)},setLocked:function(re){N=re},setClear:function(re){De!==re&&(n.clearStencil(re),De=re)},reset:function(){N=!1,pt=null,Z=null,Q=null,xt=null,mt=null,Gt=null,_e=null,De=null}}}let r=new e,o=new i,a=new s,c=new WeakMap,l=new WeakMap,h={},u={},d=new WeakMap,f=[],x=null,_=!1,g=null,p=null,b=null,S=null,y=null,U=null,A=null,D=new Vt(0,0,0),R=0,E=!1,v=null,P=null,H=null,z=null,B=null,Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,et=0,q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(q)[1]),k=et>=1):q.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),k=et>=2);let ct=null,ut={},Mt=n.getParameter(n.SCISSOR_BOX),Dt=n.getParameter(n.VIEWPORT),qt=new ye().fromArray(Mt),$=new ye().fromArray(Dt);function ot(N,pt,Z,Q){let xt=new Uint8Array(4),mt=n.createTexture();n.bindTexture(N,mt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Gt=0;Gt<Z;Gt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(pt,0,n.RGBA,1,1,Q,0,n.RGBA,n.UNSIGNED_BYTE,xt):n.texImage2D(pt+Gt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xt);return mt}let wt={};wt[n.TEXTURE_2D]=ot(n.TEXTURE_2D,n.TEXTURE_2D,1),wt[n.TEXTURE_CUBE_MAP]=ot(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),wt[n.TEXTURE_2D_ARRAY]=ot(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),wt[n.TEXTURE_3D]=ot(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),lt(n.DEPTH_TEST),o.setFunc(ns),nt(!1),vt(bl),lt(n.CULL_FACE),I(ti);function lt(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function Lt(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function zt(N,pt){return u[N]!==pt?(n.bindFramebuffer(N,pt),u[N]=pt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=pt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=pt),!0):!1}function Ot(N,pt){let Z=f,Q=!1;if(N){Z=d.get(pt),Z===void 0&&(Z=[],d.set(pt,Z));let xt=N.textures;if(Z.length!==xt.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let mt=0,Gt=xt.length;mt<Gt;mt++)Z[mt]=n.COLOR_ATTACHMENT0+mt;Z.length=xt.length,Q=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,Q=!0);Q&&n.drawBuffers(Z)}function Qt(N){return x!==N?(n.useProgram(N),x=N,!0):!1}let j={[gi]:n.FUNC_ADD,[Ju]:n.FUNC_SUBTRACT,[Ku]:n.FUNC_REVERSE_SUBTRACT};j[Qu]=n.MIN,j[ju]=n.MAX;let rt={[td]:n.ZERO,[ed]:n.ONE,[nd]:n.SRC_COLOR,[ga]:n.SRC_ALPHA,[cd]:n.SRC_ALPHA_SATURATE,[od]:n.DST_COLOR,[sd]:n.DST_ALPHA,[id]:n.ONE_MINUS_SRC_COLOR,[xa]:n.ONE_MINUS_SRC_ALPHA,[ad]:n.ONE_MINUS_DST_COLOR,[rd]:n.ONE_MINUS_DST_ALPHA,[ld]:n.CONSTANT_COLOR,[hd]:n.ONE_MINUS_CONSTANT_COLOR,[ud]:n.CONSTANT_ALPHA,[dd]:n.ONE_MINUS_CONSTANT_ALPHA};function I(N,pt,Z,Q,xt,mt,Gt,_e,De,re){if(N===ti){_===!0&&(Lt(n.BLEND),_=!1);return}if(_===!1&&(lt(n.BLEND),_=!0),N!==$u){if(N!==g||re!==E){if((p!==gi||y!==gi)&&(n.blendEquation(n.FUNC_ADD),p=gi,y=gi),re)switch(N){case Qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Hr:n.blendFunc(n.ONE,n.ONE);break;case Tl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Al:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Hr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Tl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Al:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}b=null,S=null,U=null,A=null,D.set(0,0,0),R=0,g=N,E=re}return}xt=xt||pt,mt=mt||Z,Gt=Gt||Q,(pt!==p||xt!==y)&&(n.blendEquationSeparate(j[pt],j[xt]),p=pt,y=xt),(Z!==b||Q!==S||mt!==U||Gt!==A)&&(n.blendFuncSeparate(rt[Z],rt[Q],rt[mt],rt[Gt]),b=Z,S=Q,U=mt,A=Gt),(_e.equals(D)===!1||De!==R)&&(n.blendColor(_e.r,_e.g,_e.b,De),D.copy(_e),R=De),g=N,E=!1}function It(N,pt){N.side===ve?Lt(n.CULL_FACE):lt(n.CULL_FACE);let Z=N.side===Xe;pt&&(Z=!Z),nt(Z),N.blending===Qi&&N.transparent===!1?I(ti):I(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let Q=N.stencilWrite;a.setTest(Q),Q&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Nt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?lt(n.SAMPLE_ALPHA_TO_COVERAGE):Lt(n.SAMPLE_ALPHA_TO_COVERAGE)}function nt(N){v!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),v=N)}function vt(N){N!==Yu?(lt(n.CULL_FACE),N!==P&&(N===bl?n.cullFace(n.BACK):N===Zu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Lt(n.CULL_FACE),P=N}function ht(N){N!==H&&(k&&n.lineWidth(N),H=N)}function Nt(N,pt,Z){N?(lt(n.POLYGON_OFFSET_FILL),(z!==pt||B!==Z)&&(n.polygonOffset(pt,Z),z=pt,B=Z)):Lt(n.POLYGON_OFFSET_FILL)}function _t(N){N?lt(n.SCISSOR_TEST):Lt(n.SCISSOR_TEST)}function T(N){N===void 0&&(N=n.TEXTURE0+Y-1),ct!==N&&(n.activeTexture(N),ct=N)}function M(N,pt,Z){Z===void 0&&(ct===null?Z=n.TEXTURE0+Y-1:Z=ct);let Q=ut[Z];Q===void 0&&(Q={type:void 0,texture:void 0},ut[Z]=Q),(Q.type!==N||Q.texture!==pt)&&(ct!==Z&&(n.activeTexture(Z),ct=Z),n.bindTexture(N,pt||wt[N]),Q.type=N,Q.texture=pt)}function V(){let N=ut[ct];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function J(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Jt(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Bt(N){qt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),qt.copy(N))}function Et(N){$.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),$.copy(N))}function Kt(N,pt){let Z=l.get(pt);Z===void 0&&(Z=new WeakMap,l.set(pt,Z));let Q=Z.get(N);Q===void 0&&(Q=n.getUniformBlockIndex(pt,N.name),Z.set(N,Q))}function Yt(N,pt){let Q=l.get(pt).get(N);c.get(pt)!==Q&&(n.uniformBlockBinding(pt,Q,N.__bindingPointIndex),c.set(pt,Q))}function le(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ct=null,ut={},u={},d=new WeakMap,f=[],x=null,_=!1,g=null,p=null,b=null,S=null,y=null,U=null,A=null,D=new Vt(0,0,0),R=0,E=!1,v=null,P=null,H=null,z=null,B=null,qt.set(0,0,n.canvas.width,n.canvas.height),$.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:lt,disable:Lt,bindFramebuffer:zt,drawBuffers:Ot,useProgram:Qt,setBlending:I,setMaterial:It,setFlipSided:nt,setCullFace:vt,setLineWidth:ht,setPolygonOffset:Nt,setScissorTest:_t,activeTexture:T,bindTexture:M,unbindTexture:V,compressedTexImage2D:J,compressedTexImage3D:tt,texImage2D:St,texImage3D:Ft,updateUBOMapping:Kt,uniformBlockBinding:Yt,texStorage2D:Jt,texStorage3D:st,texSubImage2D:K,texSubImage3D:bt,compressedTexSubImage2D:ft,compressedTexSubImage3D:yt,scissor:Bt,viewport:Et,reset:le}}function Eh(n,t,e,i){let s=kg(i);switch(e){case Wh:return n*t;case qh:return n*t;case Yh:return n*t*2;case $c:return n*t/s.components*s.byteLength;case Jc:return n*t/s.components*s.byteLength;case Zh:return n*t*2/s.components*s.byteLength;case Kc:return n*t*2/s.components*s.byteLength;case Xh:return n*t*3/s.components*s.byteLength;case Je:return n*t*4/s.components*s.byteLength;case Qc:return n*t*4/s.components*s.byteLength;case Fr:case Or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Br:case zr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ra:case Ia:return Math.max(n,16)*Math.max(t,8)/4;case Aa:case Ca:return Math.max(n,8)*Math.max(t,8)/2;case Pa:case Da:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case La:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ua:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Na:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Fa:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Oa:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Ba:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case za:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case ka:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ha:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Va:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ga:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Wa:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Xa:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case qa:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ya:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case kr:case Za:case $a:return Math.ceil(n/4)*Math.ceil(t/4)*16;case $h:case Ja:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Ka:case Qa:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function kg(n){switch(n){case Nn:case Hh:return{byteLength:1,components:1};case Bs:case Vh:case vn:return{byteLength:2,components:1};case Yc:case Zc:return{byteLength:2,components:4};case _i:case qc:case Ge:return{byteLength:4,components:1};case Gh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Hg(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new it,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,M){return f?new OffscreenCanvas(T,M):ks("canvas")}function _(T,M,V){let J=1,tt=_t(T);if((tt.width>V||tt.height>V)&&(J=V/Math.max(tt.width,tt.height)),J<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let K=Math.floor(J*tt.width),bt=Math.floor(J*tt.height);u===void 0&&(u=x(K,bt));let ft=M?x(K,bt):u;return ft.width=K,ft.height=bt,ft.getContext("2d").drawImage(T,0,0,K,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+K+"x"+bt+")."),ft}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),T;return T}function g(T){return T.generateMipmaps}function p(T){n.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(T,M,V,J,tt=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let K=M;if(M===n.RED&&(V===n.FLOAT&&(K=n.R32F),V===n.HALF_FLOAT&&(K=n.R16F),V===n.UNSIGNED_BYTE&&(K=n.R8)),M===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.R8UI),V===n.UNSIGNED_SHORT&&(K=n.R16UI),V===n.UNSIGNED_INT&&(K=n.R32UI),V===n.BYTE&&(K=n.R8I),V===n.SHORT&&(K=n.R16I),V===n.INT&&(K=n.R32I)),M===n.RG&&(V===n.FLOAT&&(K=n.RG32F),V===n.HALF_FLOAT&&(K=n.RG16F),V===n.UNSIGNED_BYTE&&(K=n.RG8)),M===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RG8UI),V===n.UNSIGNED_SHORT&&(K=n.RG16UI),V===n.UNSIGNED_INT&&(K=n.RG32UI),V===n.BYTE&&(K=n.RG8I),V===n.SHORT&&(K=n.RG16I),V===n.INT&&(K=n.RG32I)),M===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGB8UI),V===n.UNSIGNED_SHORT&&(K=n.RGB16UI),V===n.UNSIGNED_INT&&(K=n.RGB32UI),V===n.BYTE&&(K=n.RGB8I),V===n.SHORT&&(K=n.RGB16I),V===n.INT&&(K=n.RGB32I)),M===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),V===n.UNSIGNED_INT&&(K=n.RGBA32UI),V===n.BYTE&&(K=n.RGBA8I),V===n.SHORT&&(K=n.RGBA16I),V===n.INT&&(K=n.RGBA32I)),M===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),M===n.RGBA){let bt=tt?vo:jt.getTransfer(J);V===n.FLOAT&&(K=n.RGBA32F),V===n.HALF_FLOAT&&(K=n.RGBA16F),V===n.UNSIGNED_BYTE&&(K=bt===ce?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function y(T,M){let V;return T?M===null||M===_i||M===rs?V=n.DEPTH24_STENCIL8:M===Ge?V=n.DEPTH32F_STENCIL8:M===Bs&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===_i||M===rs?V=n.DEPTH_COMPONENT24:M===Ge?V=n.DEPTH_COMPONENT32F:M===Bs&&(V=n.DEPTH_COMPONENT16),V}function U(T,M){return g(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ke&&T.minFilter!==Ee?Math.log2(Math.max(M.width,M.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?M.mipmaps.length:1}function A(T){let M=T.target;M.removeEventListener("dispose",A),R(M),M.isVideoTexture&&h.delete(M)}function D(T){let M=T.target;M.removeEventListener("dispose",D),v(M)}function R(T){let M=i.get(T);if(M.__webglInit===void 0)return;let V=T.source,J=d.get(V);if(J){let tt=J[M.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&E(T),Object.keys(J).length===0&&d.delete(V)}i.remove(T)}function E(T){let M=i.get(T);n.deleteTexture(M.__webglTexture);let V=T.source,J=d.get(V);delete J[M.__cacheKey],o.memory.textures--}function v(T){let M=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(M.__webglFramebuffer[J]))for(let tt=0;tt<M.__webglFramebuffer[J].length;tt++)n.deleteFramebuffer(M.__webglFramebuffer[J][tt]);else n.deleteFramebuffer(M.__webglFramebuffer[J]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[J])}else{if(Array.isArray(M.__webglFramebuffer))for(let J=0;J<M.__webglFramebuffer.length;J++)n.deleteFramebuffer(M.__webglFramebuffer[J]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let J=0;J<M.__webglColorRenderbuffer.length;J++)M.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[J]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let V=T.textures;for(let J=0,tt=V.length;J<tt;J++){let K=i.get(V[J]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),o.memory.textures--),i.remove(V[J])}i.remove(T)}let P=0;function H(){P=0}function z(){let T=P;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),P+=1,T}function B(T){let M=[];return M.push(T.wrapS),M.push(T.wrapT),M.push(T.wrapR||0),M.push(T.magFilter),M.push(T.minFilter),M.push(T.anisotropy),M.push(T.internalFormat),M.push(T.format),M.push(T.type),M.push(T.generateMipmaps),M.push(T.premultiplyAlpha),M.push(T.flipY),M.push(T.unpackAlignment),M.push(T.colorSpace),M.join()}function Y(T,M){let V=i.get(T);if(T.isVideoTexture&&ht(T),T.isRenderTargetTexture===!1&&T.version>0&&V.__version!==T.version){let J=T.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(V,T,M);return}}e.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+M)}function k(T,M){let V=i.get(T);if(T.version>0&&V.__version!==T.version){$(V,T,M);return}e.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+M)}function et(T,M){let V=i.get(T);if(T.version>0&&V.__version!==T.version){$(V,T,M);return}e.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+M)}function q(T,M){let V=i.get(T);if(T.version>0&&V.__version!==T.version){ot(V,T,M);return}e.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+M)}let ct={[Os]:n.REPEAT,[Dn]:n.CLAMP_TO_EDGE,[Ta]:n.MIRRORED_REPEAT},ut={[Ke]:n.NEAREST,[Md]:n.NEAREST_MIPMAP_NEAREST,[rr]:n.NEAREST_MIPMAP_LINEAR,[Ee]:n.LINEAR,[Oo]:n.LINEAR_MIPMAP_NEAREST,[jn]:n.LINEAR_MIPMAP_LINEAR},Mt={[bd]:n.NEVER,[Pd]:n.ALWAYS,[Td]:n.LESS,[Kh]:n.LEQUAL,[Ad]:n.EQUAL,[Id]:n.GEQUAL,[Rd]:n.GREATER,[Cd]:n.NOTEQUAL};function Dt(T,M){if(M.type===Ge&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Ee||M.magFilter===Oo||M.magFilter===rr||M.magFilter===jn||M.minFilter===Ee||M.minFilter===Oo||M.minFilter===rr||M.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,ct[M.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,ct[M.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,ct[M.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,ut[M.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,ut[M.minFilter]),M.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,Mt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ke||M.minFilter!==rr&&M.minFilter!==jn||M.type===Ge&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");n.texParameterf(T,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function qt(T,M){let V=!1;T.__webglInit===void 0&&(T.__webglInit=!0,M.addEventListener("dispose",A));let J=M.source,tt=d.get(J);tt===void 0&&(tt={},d.set(J,tt));let K=B(M);if(K!==T.__cacheKey){tt[K]===void 0&&(tt[K]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),tt[K].usedTimes++;let bt=tt[T.__cacheKey];bt!==void 0&&(tt[T.__cacheKey].usedTimes--,bt.usedTimes===0&&E(M)),T.__cacheKey=K,T.__webglTexture=tt[K].texture}return V}function $(T,M,V){let J=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=n.TEXTURE_3D);let tt=qt(T,M),K=M.source;e.bindTexture(J,T.__webglTexture,n.TEXTURE0+V);let bt=i.get(K);if(K.version!==bt.__version||tt===!0){e.activeTexture(n.TEXTURE0+V);let ft=jt.getPrimaries(jt.workingColorSpace),yt=M.colorSpace===Kn?null:jt.getPrimaries(M.colorSpace),Jt=M.colorSpace===Kn||ft===yt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Jt);let st=_(M.image,!1,s.maxTextureSize);st=Nt(M,st);let St=r.convert(M.format,M.colorSpace),Ft=r.convert(M.type),Bt=S(M.internalFormat,St,Ft,M.colorSpace,M.isVideoTexture);Dt(J,M);let Et,Kt=M.mipmaps,Yt=M.isVideoTexture!==!0,le=bt.__version===void 0||tt===!0,N=K.dataReady,pt=U(M,st);if(M.isDepthTexture)Bt=y(M.format===os,M.type),le&&(Yt?e.texStorage2D(n.TEXTURE_2D,1,Bt,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,Bt,st.width,st.height,0,St,Ft,null));else if(M.isDataTexture)if(Kt.length>0){Yt&&le&&e.texStorage2D(n.TEXTURE_2D,pt,Bt,Kt[0].width,Kt[0].height);for(let Z=0,Q=Kt.length;Z<Q;Z++)Et=Kt[Z],Yt?N&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,Et.width,Et.height,St,Ft,Et.data):e.texImage2D(n.TEXTURE_2D,Z,Bt,Et.width,Et.height,0,St,Ft,Et.data);M.generateMipmaps=!1}else Yt?(le&&e.texStorage2D(n.TEXTURE_2D,pt,Bt,st.width,st.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,st.width,st.height,St,Ft,st.data)):e.texImage2D(n.TEXTURE_2D,0,Bt,st.width,st.height,0,St,Ft,st.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Yt&&le&&e.texStorage3D(n.TEXTURE_2D_ARRAY,pt,Bt,Kt[0].width,Kt[0].height,st.depth);for(let Z=0,Q=Kt.length;Z<Q;Z++)if(Et=Kt[Z],M.format!==Je)if(St!==null)if(Yt){if(N)if(M.layerUpdates.size>0){let xt=Eh(Et.width,Et.height,M.format,M.type);for(let mt of M.layerUpdates){let Gt=Et.data.subarray(mt*xt/Et.data.BYTES_PER_ELEMENT,(mt+1)*xt/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,mt,Et.width,Et.height,1,St,Gt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,Et.width,Et.height,st.depth,St,Et.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,Bt,Et.width,Et.height,st.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Yt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,Et.width,Et.height,st.depth,St,Ft,Et.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Z,Bt,Et.width,Et.height,st.depth,0,St,Ft,Et.data)}else{Yt&&le&&e.texStorage2D(n.TEXTURE_2D,pt,Bt,Kt[0].width,Kt[0].height);for(let Z=0,Q=Kt.length;Z<Q;Z++)Et=Kt[Z],M.format!==Je?St!==null?Yt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,Et.width,Et.height,St,Et.data):e.compressedTexImage2D(n.TEXTURE_2D,Z,Bt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?N&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,Et.width,Et.height,St,Ft,Et.data):e.texImage2D(n.TEXTURE_2D,Z,Bt,Et.width,Et.height,0,St,Ft,Et.data)}else if(M.isDataArrayTexture)if(Yt){if(le&&e.texStorage3D(n.TEXTURE_2D_ARRAY,pt,Bt,st.width,st.height,st.depth),N)if(M.layerUpdates.size>0){let Z=Eh(st.width,st.height,M.format,M.type);for(let Q of M.layerUpdates){let xt=st.data.subarray(Q*Z/st.data.BYTES_PER_ELEMENT,(Q+1)*Z/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,st.width,st.height,1,St,Ft,xt)}M.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,St,Ft,st.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Bt,st.width,st.height,st.depth,0,St,Ft,st.data);else if(M.isData3DTexture)Yt?(le&&e.texStorage3D(n.TEXTURE_3D,pt,Bt,st.width,st.height,st.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,St,Ft,st.data)):e.texImage3D(n.TEXTURE_3D,0,Bt,st.width,st.height,st.depth,0,St,Ft,st.data);else if(M.isFramebufferTexture){if(le)if(Yt)e.texStorage2D(n.TEXTURE_2D,pt,Bt,st.width,st.height);else{let Z=st.width,Q=st.height;for(let xt=0;xt<pt;xt++)e.texImage2D(n.TEXTURE_2D,xt,Bt,Z,Q,0,St,Ft,null),Z>>=1,Q>>=1}}else if(Kt.length>0){if(Yt&&le){let Z=_t(Kt[0]);e.texStorage2D(n.TEXTURE_2D,pt,Bt,Z.width,Z.height)}for(let Z=0,Q=Kt.length;Z<Q;Z++)Et=Kt[Z],Yt?N&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,St,Ft,Et):e.texImage2D(n.TEXTURE_2D,Z,Bt,St,Ft,Et);M.generateMipmaps=!1}else if(Yt){if(le){let Z=_t(st);e.texStorage2D(n.TEXTURE_2D,pt,Bt,Z.width,Z.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,St,Ft,st)}else e.texImage2D(n.TEXTURE_2D,0,Bt,St,Ft,st);g(M)&&p(J),bt.__version=K.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function ot(T,M,V){if(M.image.length!==6)return;let J=qt(T,M),tt=M.source;e.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+V);let K=i.get(tt);if(tt.version!==K.__version||J===!0){e.activeTexture(n.TEXTURE0+V);let bt=jt.getPrimaries(jt.workingColorSpace),ft=M.colorSpace===Kn?null:jt.getPrimaries(M.colorSpace),yt=M.colorSpace===Kn||bt===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let Jt=M.isCompressedTexture||M.image[0].isCompressedTexture,st=M.image[0]&&M.image[0].isDataTexture,St=[];for(let Q=0;Q<6;Q++)!Jt&&!st?St[Q]=_(M.image[Q],!0,s.maxCubemapSize):St[Q]=st?M.image[Q].image:M.image[Q],St[Q]=Nt(M,St[Q]);let Ft=St[0],Bt=r.convert(M.format,M.colorSpace),Et=r.convert(M.type),Kt=S(M.internalFormat,Bt,Et,M.colorSpace),Yt=M.isVideoTexture!==!0,le=K.__version===void 0||J===!0,N=tt.dataReady,pt=U(M,Ft);Dt(n.TEXTURE_CUBE_MAP,M);let Z;if(Jt){Yt&&le&&e.texStorage2D(n.TEXTURE_CUBE_MAP,pt,Kt,Ft.width,Ft.height);for(let Q=0;Q<6;Q++){Z=St[Q].mipmaps;for(let xt=0;xt<Z.length;xt++){let mt=Z[xt];M.format!==Je?Bt!==null?Yt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt,0,0,mt.width,mt.height,Bt,mt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt,Kt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Yt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt,0,0,mt.width,mt.height,Bt,Et,mt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt,Kt,mt.width,mt.height,0,Bt,Et,mt.data)}}}else{if(Z=M.mipmaps,Yt&&le){Z.length>0&&pt++;let Q=_t(St[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,pt,Kt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(st){Yt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,St[Q].width,St[Q].height,Bt,Et,St[Q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Kt,St[Q].width,St[Q].height,0,Bt,Et,St[Q].data);for(let xt=0;xt<Z.length;xt++){let Gt=Z[xt].image[Q].image;Yt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt+1,0,0,Gt.width,Gt.height,Bt,Et,Gt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt+1,Kt,Gt.width,Gt.height,0,Bt,Et,Gt.data)}}else{Yt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Bt,Et,St[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Kt,Bt,Et,St[Q]);for(let xt=0;xt<Z.length;xt++){let mt=Z[xt];Yt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt+1,0,0,Bt,Et,mt.image[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt+1,Kt,Bt,Et,mt.image[Q])}}}g(M)&&p(n.TEXTURE_CUBE_MAP),K.__version=tt.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function wt(T,M,V,J,tt,K){let bt=r.convert(V.format,V.colorSpace),ft=r.convert(V.type),yt=S(V.internalFormat,bt,ft,V.colorSpace),Jt=i.get(M),st=i.get(V);if(st.__renderTarget=M,!Jt.__hasExternalTextures){let St=Math.max(1,M.width>>K),Ft=Math.max(1,M.height>>K);tt===n.TEXTURE_3D||tt===n.TEXTURE_2D_ARRAY?e.texImage3D(tt,K,yt,St,Ft,M.depth,0,bt,ft,null):e.texImage2D(tt,K,yt,St,Ft,0,bt,ft,null)}e.bindFramebuffer(n.FRAMEBUFFER,T),vt(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,tt,st.__webglTexture,0,nt(M)):(tt===n.TEXTURE_2D||tt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,tt,st.__webglTexture,K),e.bindFramebuffer(n.FRAMEBUFFER,null)}function lt(T,M,V){if(n.bindRenderbuffer(n.RENDERBUFFER,T),M.depthBuffer){let J=M.depthTexture,tt=J&&J.isDepthTexture?J.type:null,K=y(M.stencilBuffer,tt),bt=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=nt(M);vt(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft,K,M.width,M.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft,K,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,K,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,bt,n.RENDERBUFFER,T)}else{let J=M.textures;for(let tt=0;tt<J.length;tt++){let K=J[tt],bt=r.convert(K.format,K.colorSpace),ft=r.convert(K.type),yt=S(K.internalFormat,bt,ft,K.colorSpace),Jt=nt(M);V&&vt(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Jt,yt,M.width,M.height):vt(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Jt,yt,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,yt,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Lt(T,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,T),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=i.get(M.depthTexture);J.__renderTarget=M,(!J.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Y(M.depthTexture,0);let tt=J.__webglTexture,K=nt(M);if(M.depthTexture.format===ji)vt(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0);else if(M.depthTexture.format===os)vt(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function zt(T){let M=i.get(T),V=T.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==T.depthTexture){let J=T.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),J){let tt=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,J.removeEventListener("dispose",tt)};J.addEventListener("dispose",tt),M.__depthDisposeCallback=tt}M.__boundDepthTexture=J}if(T.depthTexture&&!M.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Lt(M.__webglFramebuffer,T)}else if(V){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]===void 0)M.__webglDepthbuffer[J]=n.createRenderbuffer(),lt(M.__webglDepthbuffer[J],T,!1);else{let tt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=M.__webglDepthbuffer[J];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,K)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),lt(M.__webglDepthbuffer,T,!1);else{let J=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,tt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ot(T,M,V){let J=i.get(T);M!==void 0&&wt(J.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&zt(T)}function Qt(T){let M=T.texture,V=i.get(T),J=i.get(M);T.addEventListener("dispose",D);let tt=T.textures,K=T.isWebGLCubeRenderTarget===!0,bt=tt.length>1;if(bt||(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=M.version,o.memory.textures++),K){V.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[ft]=[];for(let yt=0;yt<M.mipmaps.length;yt++)V.__webglFramebuffer[ft][yt]=n.createFramebuffer()}else V.__webglFramebuffer[ft]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let ft=0;ft<M.mipmaps.length;ft++)V.__webglFramebuffer[ft]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(bt)for(let ft=0,yt=tt.length;ft<yt;ft++){let Jt=i.get(tt[ft]);Jt.__webglTexture===void 0&&(Jt.__webglTexture=n.createTexture(),o.memory.textures++)}if(T.samples>0&&vt(T)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ft=0;ft<tt.length;ft++){let yt=tt[ft];V.__webglColorRenderbuffer[ft]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[ft]);let Jt=r.convert(yt.format,yt.colorSpace),st=r.convert(yt.type),St=S(yt.internalFormat,Jt,st,yt.colorSpace,T.isXRRenderTarget===!0),Ft=nt(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,St,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,V.__webglColorRenderbuffer[ft])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),lt(V.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){e.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),Dt(n.TEXTURE_CUBE_MAP,M);for(let ft=0;ft<6;ft++)if(M.mipmaps&&M.mipmaps.length>0)for(let yt=0;yt<M.mipmaps.length;yt++)wt(V.__webglFramebuffer[ft][yt],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,yt);else wt(V.__webglFramebuffer[ft],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);g(M)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let ft=0,yt=tt.length;ft<yt;ft++){let Jt=tt[ft],st=i.get(Jt);e.bindTexture(n.TEXTURE_2D,st.__webglTexture),Dt(n.TEXTURE_2D,Jt),wt(V.__webglFramebuffer,T,Jt,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,0),g(Jt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let ft=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ft=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ft,J.__webglTexture),Dt(ft,M),M.mipmaps&&M.mipmaps.length>0)for(let yt=0;yt<M.mipmaps.length;yt++)wt(V.__webglFramebuffer[yt],T,M,n.COLOR_ATTACHMENT0,ft,yt);else wt(V.__webglFramebuffer,T,M,n.COLOR_ATTACHMENT0,ft,0);g(M)&&p(ft),e.unbindTexture()}T.depthBuffer&&zt(T)}function j(T){let M=T.textures;for(let V=0,J=M.length;V<J;V++){let tt=M[V];if(g(tt)){let K=b(T),bt=i.get(tt).__webglTexture;e.bindTexture(K,bt),p(K),e.unbindTexture()}}}let rt=[],I=[];function It(T){if(T.samples>0){if(vt(T)===!1){let M=T.textures,V=T.width,J=T.height,tt=n.COLOR_BUFFER_BIT,K=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,bt=i.get(T),ft=M.length>1;if(ft)for(let yt=0;yt<M.length;yt++)e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let yt=0;yt<M.length;yt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(tt|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(tt|=n.STENCIL_BUFFER_BIT)),ft){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]);let Jt=i.get(M[yt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Jt,0)}n.blitFramebuffer(0,0,V,J,0,0,V,J,tt,n.NEAREST),c===!0&&(rt.length=0,I.length=0,rt.push(n.COLOR_ATTACHMENT0+yt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(rt.push(K),I.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,I)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,rt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ft)for(let yt=0;yt<M.length;yt++){e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]);let Jt=i.get(M[yt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,Jt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let M=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function nt(T){return Math.min(s.maxSamples,T.samples)}function vt(T){let M=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ht(T){let M=o.render.frame;h.get(T)!==M&&(h.set(T,M),T.update())}function Nt(T,M){let V=T.colorSpace,J=T.format,tt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||V!==ri&&V!==Kn&&(jt.getTransfer(V)===ce?(J!==Je||tt!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),M}function _t(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=H,this.setTexture2D=Y,this.setTexture2DArray=k,this.setTexture3D=et,this.setTextureCube=q,this.rebindTextures=Ot,this.setupRenderTarget=Qt,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=zt,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=vt}function Vg(n,t){function e(i,s=Kn){let r,o=jt.getTransfer(s);if(i===Nn)return n.UNSIGNED_BYTE;if(i===Yc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Zc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Gh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Hh)return n.BYTE;if(i===Vh)return n.SHORT;if(i===Bs)return n.UNSIGNED_SHORT;if(i===qc)return n.INT;if(i===_i)return n.UNSIGNED_INT;if(i===Ge)return n.FLOAT;if(i===vn)return n.HALF_FLOAT;if(i===Wh)return n.ALPHA;if(i===Xh)return n.RGB;if(i===Je)return n.RGBA;if(i===qh)return n.LUMINANCE;if(i===Yh)return n.LUMINANCE_ALPHA;if(i===ji)return n.DEPTH_COMPONENT;if(i===os)return n.DEPTH_STENCIL;if(i===$c)return n.RED;if(i===Jc)return n.RED_INTEGER;if(i===Zh)return n.RG;if(i===Kc)return n.RG_INTEGER;if(i===Qc)return n.RGBA_INTEGER;if(i===Fr||i===Or||i===Br||i===zr)if(o===ce)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Fr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Fr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===zr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Aa||i===Ra||i===Ca||i===Ia)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Aa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ca)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ia)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Pa||i===Da||i===La)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Pa||i===Da)return o===ce?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===La)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ua||i===Na||i===Fa||i===Oa||i===Ba||i===za||i===ka||i===Ha||i===Va||i===Ga||i===Wa||i===Xa||i===qa||i===Ya)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ua)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Na)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Fa)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Oa)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ba)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===za)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ka)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ha)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Va)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ga)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Wa)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Xa)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===qa)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ya)return o===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===kr||i===Za||i===$a)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===kr)return o===ce?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$a)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===$h||i===Ja||i===Ka||i===Qa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===kr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ja)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ka)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Qa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===rs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var pc=class extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},We=class extends Ie{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gg={type:"move"},Ds=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new We,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new We,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new We,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let _ of t.hand.values()){let g=e.getJointPose(_,i),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,x=.005;l.inputState.pinching&&d>f+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new We;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Wg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,mc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){let s=new ze,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new yn({vertexShader:Wg,fragmentShader:Xg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ee(new ue(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gc=class extends ni{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,x=null,_=new mc,g=e.getContextAttributes(),p=null,b=null,S=[],y=[],U=new it,A=null,D=new Be;D.viewport=new ye;let R=new Be;R.viewport=new ye;let E=[D,R],v=new pc,P=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ot=S[$];return ot===void 0&&(ot=new Ds,S[$]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function($){let ot=S[$];return ot===void 0&&(ot=new Ds,S[$]=ot),ot.getGripSpace()},this.getHand=function($){let ot=S[$];return ot===void 0&&(ot=new Ds,S[$]=ot),ot.getHandSpace()};function z($){let ot=y.indexOf($.inputSource);if(ot===-1)return;let wt=S[ot];wt!==void 0&&(wt.update($.inputSource,$.frame,l||o),wt.dispatchEvent({type:$.type,data:$.inputSource}))}function B(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",Y);for(let $=0;$<S.length;$++){let ot=y[$];ot!==null&&(y[$]=null,S[$].disconnect(ot))}P=null,H=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,b=null,qt.stop(),i.isPresenting=!1,t.setPixelRatio(A),t.setSize(U.width,U.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",B),s.addEventListener("inputsourceschange",Y),g.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(U),s.renderState.layers===void 0){let ot={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,ot),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Fn(f.framebufferWidth,f.framebufferHeight,{format:Je,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let ot=null,wt=null,lt=null;g.depth&&(lt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=g.stencil?os:ji,wt=g.stencil?rs:_i);let Lt={colorFormat:e.RGBA8,depthFormat:lt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Lt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new Fn(d.textureWidth,d.textureHeight,{format:Je,type:Nn,depthTexture:new Kr(d.textureWidth,d.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),qt.setContext(s),qt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Y($){for(let ot=0;ot<$.removed.length;ot++){let wt=$.removed[ot],lt=y.indexOf(wt);lt>=0&&(y[lt]=null,S[lt].disconnect(wt))}for(let ot=0;ot<$.added.length;ot++){let wt=$.added[ot],lt=y.indexOf(wt);if(lt===-1){for(let zt=0;zt<S.length;zt++)if(zt>=y.length){y.push(wt),lt=zt;break}else if(y[zt]===null){y[zt]=wt,lt=zt;break}if(lt===-1)break}let Lt=S[lt];Lt&&Lt.connect(wt)}}let k=new C,et=new C;function q($,ot,wt){k.setFromMatrixPosition(ot.matrixWorld),et.setFromMatrixPosition(wt.matrixWorld);let lt=k.distanceTo(et),Lt=ot.projectionMatrix.elements,zt=wt.projectionMatrix.elements,Ot=Lt[14]/(Lt[10]-1),Qt=Lt[14]/(Lt[10]+1),j=(Lt[9]+1)/Lt[5],rt=(Lt[9]-1)/Lt[5],I=(Lt[8]-1)/Lt[0],It=(zt[8]+1)/zt[0],nt=Ot*I,vt=Ot*It,ht=lt/(-I+It),Nt=ht*-I;if(ot.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Nt),$.translateZ(ht),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Lt[10]===-1)$.projectionMatrix.copy(ot.projectionMatrix),$.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{let _t=Ot+ht,T=Qt+ht,M=nt-Nt,V=vt+(lt-Nt),J=j*Qt/T*_t,tt=rt*Qt/T*_t;$.projectionMatrix.makePerspective(M,V,J,tt,_t,T),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ct($,ot){ot===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ot.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let ot=$.near,wt=$.far;_.texture!==null&&(_.depthNear>0&&(ot=_.depthNear),_.depthFar>0&&(wt=_.depthFar)),v.near=R.near=D.near=ot,v.far=R.far=D.far=wt,(P!==v.near||H!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),P=v.near,H=v.far),D.layers.mask=$.layers.mask|2,R.layers.mask=$.layers.mask|4,v.layers.mask=D.layers.mask|R.layers.mask;let lt=$.parent,Lt=v.cameras;ct(v,lt);for(let zt=0;zt<Lt.length;zt++)ct(Lt[zt],lt);Lt.length===2?q(v,D,R):v.projectionMatrix.copy(D.projectionMatrix),ut($,v,lt)};function ut($,ot,wt){wt===null?$.matrix.copy(ot.matrixWorld):($.matrix.copy(wt.matrixWorld),$.matrix.invert(),$.matrix.multiply(ot.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ot.projectionMatrix),$.projectionMatrixInverse.copy(ot.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=zs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function($){c=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let Mt=null;function Dt($,ot){if(h=ot.getViewerPose(l||o),x=ot,h!==null){let wt=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let lt=!1;wt.length!==v.cameras.length&&(v.cameras.length=0,lt=!0);for(let zt=0;zt<wt.length;zt++){let Ot=wt[zt],Qt=null;if(f!==null)Qt=f.getViewport(Ot);else{let rt=u.getViewSubImage(d,Ot);Qt=rt.viewport,zt===0&&(t.setRenderTargetTextures(b,rt.colorTexture,d.ignoreDepthValues?void 0:rt.depthStencilTexture),t.setRenderTarget(b))}let j=E[zt];j===void 0&&(j=new Be,j.layers.enable(zt),j.viewport=new ye,E[zt]=j),j.matrix.fromArray(Ot.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Ot.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(Qt.x,Qt.y,Qt.width,Qt.height),zt===0&&(v.matrix.copy(j.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),lt===!0&&v.cameras.push(j)}let Lt=s.enabledFeatures;if(Lt&&Lt.includes("depth-sensing")){let zt=u.getDepthInformation(wt[0]);zt&&zt.isValid&&zt.texture&&_.init(t,zt,s.renderState)}}for(let wt=0;wt<S.length;wt++){let lt=y[wt],Lt=S[wt];lt!==null&&Lt!==void 0&&Lt.update(lt,ot,l||o)}Mt&&Mt($,ot),ot.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ot}),x=null}let qt=new nu;qt.setAnimationLoop(Dt),this.setAnimationLoop=function($){Mt=$},this.dispose=function(){}}},pi=new sn,qg=new $t;function Yg(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,eu(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,b,S,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),x(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,b,S):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Xe&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Xe&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let b=t.get(p),S=b.envMap,y=b.envMapRotation;S&&(g.envMap.value=S,pi.copy(y),pi.x*=-1,pi.y*=-1,pi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),g.envMapRotation.value.setFromMatrix4(qg.makeRotationFromEuler(pi)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,b,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=S*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xe&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){let b=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Zg(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,S){let y=S.program;i.uniformBlockBinding(b,y)}function l(b,S){let y=s[b.id];y===void 0&&(x(b),y=h(b),s[b.id]=y,b.addEventListener("dispose",g));let U=S.program;i.updateUBOMapping(b,U);let A=t.render.frame;r[b.id]!==A&&(d(b),r[b.id]=A)}function h(b){let S=u();b.__bindingPointIndex=S;let y=n.createBuffer(),U=b.__size,A=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,U,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,y),y}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let S=s[b.id],y=b.uniforms,U=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let A=0,D=y.length;A<D;A++){let R=Array.isArray(y[A])?y[A]:[y[A]];for(let E=0,v=R.length;E<v;E++){let P=R[E];if(f(P,A,E,U)===!0){let H=P.__offset,z=Array.isArray(P.value)?P.value:[P.value],B=0;for(let Y=0;Y<z.length;Y++){let k=z[Y],et=_(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,H+B,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,B),B+=et.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(b,S,y,U){let A=b.value,D=S+"_"+y;if(U[D]===void 0)return typeof A=="number"||typeof A=="boolean"?U[D]=A:U[D]=A.clone(),!0;{let R=U[D];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return U[D]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function x(b){let S=b.uniforms,y=0,U=16;for(let D=0,R=S.length;D<R;D++){let E=Array.isArray(S[D])?S[D]:[S[D]];for(let v=0,P=E.length;v<P;v++){let H=E[v],z=Array.isArray(H.value)?H.value:[H.value];for(let B=0,Y=z.length;B<Y;B++){let k=z[B],et=_(k),q=y%U,ct=q%et.boundary,ut=q+ct;y+=ct,ut!==0&&U-ut<et.storage&&(y+=U-ut),H.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=y,y+=et.storage}}}let A=y%U;return A>0&&(y+=U-A),b.__size=y,b.__cache={},this}function _(b){let S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function g(b){let S=b.target;S.removeEventListener("dispose",g);let y=o.indexOf(S.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function p(){for(let b in s)n.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Qr=class{constructor(t={}){let{canvas:e=Zd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;let x=new Uint32Array(4),_=new Int32Array(4),g=null,p=null,b=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this.toneMapping=ei,this.toneMappingExposure=1;let y=this,U=!1,A=0,D=0,R=null,E=-1,v=null,P=new ye,H=new ye,z=null,B=new Vt(0),Y=0,k=e.width,et=e.height,q=1,ct=null,ut=null,Mt=new ye(0,0,k,et),Dt=new ye(0,0,k,et),qt=!1,$=new Gs,ot=!1,wt=!1,lt=new $t,Lt=new $t,zt=new C,Ot=new ye,Qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},j=!1;function rt(){return R===null?q:1}let I=i;function It(w,F){return e.getContext(w,F)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Gc}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",xt,!1),e.addEventListener("webglcontextcreationerror",mt,!1),I===null){let F="webgl2";if(I=It(F,w),I===null)throw It(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let nt,vt,ht,Nt,_t,T,M,V,J,tt,K,bt,ft,yt,Jt,st,St,Ft,Bt,Et,Kt,Yt,le,N;function pt(){nt=new hm(I),nt.init(),Yt=new Vg(I,nt),vt=new sm(I,nt,t,Yt),ht=new zg(I,nt),vt.reverseDepthBuffer&&d&&ht.buffers.depth.setReversed(!0),Nt=new fm(I),_t=new Tg,T=new Hg(I,nt,ht,_t,vt,Yt,Nt),M=new om(y),V=new lm(y),J=new vf(I),le=new nm(I,J),tt=new um(I,J,Nt,le),K=new mm(I,tt,J,Nt),Bt=new pm(I,vt,T),st=new rm(_t),bt=new bg(y,M,V,nt,vt,le,st),ft=new Yg(y,_t),yt=new Rg,Jt=new Ug(nt),Ft=new em(y,M,V,ht,K,f,c),St=new Og(y,K,vt),N=new Zg(I,Nt,vt,ht),Et=new im(I,nt,Nt),Kt=new dm(I,nt,Nt),Nt.programs=bt.programs,y.capabilities=vt,y.extensions=nt,y.properties=_t,y.renderLists=yt,y.shadowMap=St,y.state=ht,y.info=Nt}pt();let Z=new gc(y,I);this.xr=Z,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let w=nt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=nt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(w){w!==void 0&&(q=w,this.setSize(k,et,!1))},this.getSize=function(w){return w.set(k,et)},this.setSize=function(w,F,W=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=w,et=F,e.width=Math.floor(w*q),e.height=Math.floor(F*q),W===!0&&(e.style.width=w+"px",e.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(k*q,et*q).floor()},this.setDrawingBufferSize=function(w,F,W){k=w,et=F,q=W,e.width=Math.floor(w*W),e.height=Math.floor(F*W),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(Mt)},this.setViewport=function(w,F,W,X){w.isVector4?Mt.set(w.x,w.y,w.z,w.w):Mt.set(w,F,W,X),ht.viewport(P.copy(Mt).multiplyScalar(q).round())},this.getScissor=function(w){return w.copy(Dt)},this.setScissor=function(w,F,W,X){w.isVector4?Dt.set(w.x,w.y,w.z,w.w):Dt.set(w,F,W,X),ht.scissor(H.copy(Dt).multiplyScalar(q).round())},this.getScissorTest=function(){return qt},this.setScissorTest=function(w){ht.setScissorTest(qt=w)},this.setOpaqueSort=function(w){ct=w},this.setTransparentSort=function(w){ut=w},this.getClearColor=function(w){return w.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor.apply(Ft,arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha.apply(Ft,arguments)},this.clear=function(w=!0,F=!0,W=!0){let X=0;if(w){let O=!1;if(R!==null){let at=R.texture.format;O=at===Qc||at===Kc||at===Jc}if(O){let at=R.texture.type,gt=at===Nn||at===_i||at===Bs||at===rs||at===Yc||at===Zc,Tt=Ft.getClearColor(),At=Ft.getClearAlpha(),kt=Tt.r,Wt=Tt.g,Rt=Tt.b;gt?(x[0]=kt,x[1]=Wt,x[2]=Rt,x[3]=At,I.clearBufferuiv(I.COLOR,0,x)):(_[0]=kt,_[1]=Wt,_[2]=Rt,_[3]=At,I.clearBufferiv(I.COLOR,0,_))}else X|=I.COLOR_BUFFER_BIT}F&&(X|=I.DEPTH_BUFFER_BIT),W&&(X|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),yt.dispose(),Jt.dispose(),_t.dispose(),M.dispose(),V.dispose(),K.dispose(),le.dispose(),N.dispose(),bt.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",xl),Z.removeEventListener("sessionend",_l),ci.stop()};function Q(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;let w=Nt.autoReset,F=St.enabled,W=St.autoUpdate,X=St.needsUpdate,O=St.type;pt(),Nt.autoReset=w,St.enabled=F,St.autoUpdate=W,St.needsUpdate=X,St.type=O}function mt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Gt(w){let F=w.target;F.removeEventListener("dispose",Gt),_e(F)}function _e(w){De(w),_t.remove(w)}function De(w){let F=_t.get(w).programs;F!==void 0&&(F.forEach(function(W){bt.releaseProgram(W)}),w.isShaderMaterial&&bt.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,W,X,O,at){F===null&&(F=Qt);let gt=O.isMesh&&O.matrixWorld.determinant()<0,Tt=Wu(w,F,W,X,O);ht.setMaterial(X,gt);let At=W.index,kt=1;if(X.wireframe===!0){if(At=tt.getWireframeAttribute(W),At===void 0)return;kt=2}let Wt=W.drawRange,Rt=W.attributes.position,te=Wt.start*kt,he=(Wt.start+Wt.count)*kt;at!==null&&(te=Math.max(te,at.start*kt),he=Math.min(he,(at.start+at.count)*kt)),At!==null?(te=Math.max(te,0),he=Math.min(he,At.count)):Rt!=null&&(te=Math.max(te,0),he=Math.min(he,Rt.count));let fe=he-te;if(fe<0||fe===1/0)return;le.setup(O,X,Tt,W,At);let Ve,ie=Et;if(At!==null&&(Ve=J.get(At),ie=Kt,ie.setIndex(Ve)),O.isMesh)X.wireframe===!0?(ht.setLineWidth(X.wireframeLinewidth*rt()),ie.setMode(I.LINES)):ie.setMode(I.TRIANGLES);else if(O.isLine){let Pt=X.linewidth;Pt===void 0&&(Pt=1),ht.setLineWidth(Pt*rt()),O.isLineSegments?ie.setMode(I.LINES):O.isLineLoop?ie.setMode(I.LINE_LOOP):ie.setMode(I.LINE_STRIP)}else O.isPoints?ie.setMode(I.POINTS):O.isSprite&&ie.setMode(I.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ie.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))ie.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Pt=O._multiDrawStarts,En=O._multiDrawCounts,se=O._multiDrawCount,cn=At?J.get(At).bytesPerElement:1,Ii=_t.get(X).currentProgram.getUniforms();for(let Ye=0;Ye<se;Ye++)Ii.setValue(I,"_gl_DrawID",Ye),ie.render(Pt[Ye]/cn,En[Ye])}else if(O.isInstancedMesh)ie.renderInstances(te,fe,O.count);else if(W.isInstancedBufferGeometry){let Pt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,En=Math.min(W.instanceCount,Pt);ie.renderInstances(te,fe,En)}else ie.render(te,fe)};function re(w,F,W){w.transparent===!0&&w.side===ve&&w.forceSinglePass===!1?(w.side=Xe,w.needsUpdate=!0,sr(w,F,W),w.side=_n,w.needsUpdate=!0,sr(w,F,W),w.side=ve):sr(w,F,W)}this.compile=function(w,F,W=null){W===null&&(W=w),p=Jt.get(W),p.init(F),S.push(p),W.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),w!==W&&w.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let X=new Set;return w.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let at=O.material;if(at)if(Array.isArray(at))for(let gt=0;gt<at.length;gt++){let Tt=at[gt];re(Tt,W,O),X.add(Tt)}else re(at,W,O),X.add(at)}),S.pop(),p=null,X},this.compileAsync=function(w,F,W=null){let X=this.compile(w,F,W);return new Promise(O=>{function at(){if(X.forEach(function(gt){_t.get(gt).currentProgram.isReady()&&X.delete(gt)}),X.size===0){O(w);return}setTimeout(at,10)}nt.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let an=null;function Sn(w){an&&an(w)}function xl(){ci.stop()}function _l(){ci.start()}let ci=new nu;ci.setAnimationLoop(Sn),typeof self<"u"&&ci.setContext(self),this.setAnimationLoop=function(w){an=w,Z.setAnimationLoop(w),w===null?ci.stop():ci.start()},Z.addEventListener("sessionstart",xl),Z.addEventListener("sessionend",_l),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,F,R),p=Jt.get(w,S.length),p.init(F),S.push(p),Lt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Lt),wt=this.localClippingEnabled,ot=st.init(this.clippingPlanes,wt),g=yt.get(w,b.length),g.init(),b.push(g),Z.enabled===!0&&Z.isPresenting===!0){let at=y.xr.getDepthSensingMesh();at!==null&&Fo(at,F,-1/0,y.sortObjects)}Fo(w,F,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(ct,ut),j=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,j&&Ft.addToRenderList(g,w),this.info.render.frame++,ot===!0&&st.beginShadows();let W=p.state.shadowsArray;St.render(W,w,F),ot===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=g.opaque,O=g.transmissive;if(p.setupLights(),F.isArrayCamera){let at=F.cameras;if(O.length>0)for(let gt=0,Tt=at.length;gt<Tt;gt++){let At=at[gt];vl(X,O,w,At)}j&&Ft.render(w);for(let gt=0,Tt=at.length;gt<Tt;gt++){let At=at[gt];yl(g,w,At,At.viewport)}}else O.length>0&&vl(X,O,w,F),j&&Ft.render(w),yl(g,w,F);R!==null&&(T.updateMultisampleRenderTarget(R),T.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(y,w,F),le.resetDefaultState(),E=-1,v=null,S.pop(),S.length>0?(p=S[S.length-1],ot===!0&&st.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?g=b[b.length-1]:g=null};function Fo(w,F,W,X){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){X&&Ot.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Lt);let gt=K.update(w),Tt=w.material;Tt.visible&&g.push(w,gt,Tt,W,Ot.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){let gt=K.update(w),Tt=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ot.copy(w.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),Ot.copy(gt.boundingSphere.center)),Ot.applyMatrix4(w.matrixWorld).applyMatrix4(Lt)),Array.isArray(Tt)){let At=gt.groups;for(let kt=0,Wt=At.length;kt<Wt;kt++){let Rt=At[kt],te=Tt[Rt.materialIndex];te&&te.visible&&g.push(w,gt,te,W,Ot.z,Rt)}}else Tt.visible&&g.push(w,gt,Tt,W,Ot.z,null)}}let at=w.children;for(let gt=0,Tt=at.length;gt<Tt;gt++)Fo(at[gt],F,W,X)}function yl(w,F,W,X){let O=w.opaque,at=w.transmissive,gt=w.transparent;p.setupLightsView(W),ot===!0&&st.setGlobalState(y.clippingPlanes,W),X&&ht.viewport(P.copy(X)),O.length>0&&ir(O,F,W),at.length>0&&ir(at,F,W),gt.length>0&&ir(gt,F,W),ht.buffers.depth.setTest(!0),ht.buffers.depth.setMask(!0),ht.buffers.color.setMask(!0),ht.setPolygonOffset(!1)}function vl(w,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new Fn(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?vn:Nn,minFilter:jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));let at=p.state.transmissionRenderTarget[X.id],gt=X.viewport||P;at.setSize(gt.z,gt.w);let Tt=y.getRenderTarget();y.setRenderTarget(at),y.getClearColor(B),Y=y.getClearAlpha(),Y<1&&y.setClearColor(16777215,.5),y.clear(),j&&Ft.render(W);let At=y.toneMapping;y.toneMapping=ei;let kt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),ot===!0&&st.setGlobalState(y.clippingPlanes,X),ir(w,W,X),T.updateMultisampleRenderTarget(at),T.updateRenderTargetMipmap(at),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let Rt=0,te=F.length;Rt<te;Rt++){let he=F[Rt],fe=he.object,Ve=he.geometry,ie=he.material,Pt=he.group;if(ie.side===ve&&fe.layers.test(X.layers)){let En=ie.side;ie.side=Xe,ie.needsUpdate=!0,Ml(fe,W,X,Ve,ie,Pt),ie.side=En,ie.needsUpdate=!0,Wt=!0}}Wt===!0&&(T.updateMultisampleRenderTarget(at),T.updateRenderTargetMipmap(at))}y.setRenderTarget(Tt),y.setClearColor(B,Y),kt!==void 0&&(X.viewport=kt),y.toneMapping=At}function ir(w,F,W){let X=F.isScene===!0?F.overrideMaterial:null;for(let O=0,at=w.length;O<at;O++){let gt=w[O],Tt=gt.object,At=gt.geometry,kt=X===null?gt.material:X,Wt=gt.group;Tt.layers.test(W.layers)&&Ml(Tt,F,W,At,kt,Wt)}}function Ml(w,F,W,X,O,at){w.onBeforeRender(y,F,W,X,O,at),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.onBeforeRender(y,F,W,X,w,at),O.transparent===!0&&O.side===ve&&O.forceSinglePass===!1?(O.side=Xe,O.needsUpdate=!0,y.renderBufferDirect(W,F,X,O,w,at),O.side=_n,O.needsUpdate=!0,y.renderBufferDirect(W,F,X,O,w,at),O.side=ve):y.renderBufferDirect(W,F,X,O,w,at),w.onAfterRender(y,F,W,X,O,at)}function sr(w,F,W){F.isScene!==!0&&(F=Qt);let X=_t.get(w),O=p.state.lights,at=p.state.shadowsArray,gt=O.state.version,Tt=bt.getParameters(w,O.state,at,F,W),At=bt.getProgramCacheKey(Tt),kt=X.programs;X.environment=w.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(w.isMeshStandardMaterial?V:M).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,kt===void 0&&(w.addEventListener("dispose",Gt),kt=new Map,X.programs=kt);let Wt=kt.get(At);if(Wt!==void 0){if(X.currentProgram===Wt&&X.lightsStateVersion===gt)return El(w,Tt),Wt}else Tt.uniforms=bt.getUniforms(w),w.onBeforeCompile(Tt,y),Wt=bt.acquireProgram(Tt,At),kt.set(At,Wt),X.uniforms=Tt.uniforms;let Rt=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Rt.clippingPlanes=st.uniform),El(w,Tt),X.needsLights=qu(w),X.lightsStateVersion=gt,X.needsLights&&(Rt.ambientLightColor.value=O.state.ambient,Rt.lightProbe.value=O.state.probe,Rt.directionalLights.value=O.state.directional,Rt.directionalLightShadows.value=O.state.directionalShadow,Rt.spotLights.value=O.state.spot,Rt.spotLightShadows.value=O.state.spotShadow,Rt.rectAreaLights.value=O.state.rectArea,Rt.ltc_1.value=O.state.rectAreaLTC1,Rt.ltc_2.value=O.state.rectAreaLTC2,Rt.pointLights.value=O.state.point,Rt.pointLightShadows.value=O.state.pointShadow,Rt.hemisphereLights.value=O.state.hemi,Rt.directionalShadowMap.value=O.state.directionalShadowMap,Rt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Rt.spotShadowMap.value=O.state.spotShadowMap,Rt.spotLightMatrix.value=O.state.spotLightMatrix,Rt.spotLightMap.value=O.state.spotLightMap,Rt.pointShadowMap.value=O.state.pointShadowMap,Rt.pointShadowMatrix.value=O.state.pointShadowMatrix),X.currentProgram=Wt,X.uniformsList=null,Wt}function Sl(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=es.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function El(w,F){let W=_t.get(w);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Wu(w,F,W,X,O){F.isScene!==!0&&(F=Qt),T.resetTextureUnits();let at=F.fog,gt=X.isMeshStandardMaterial?F.environment:null,Tt=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ri,At=(X.isMeshStandardMaterial?V:M).get(X.envMap||gt),kt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Wt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Rt=!!W.morphAttributes.position,te=!!W.morphAttributes.normal,he=!!W.morphAttributes.color,fe=ei;X.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(fe=y.toneMapping);let Ve=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ie=Ve!==void 0?Ve.length:0,Pt=_t.get(X),En=p.state.lights;if(ot===!0&&(wt===!0||w!==v)){let en=w===v&&X.id===E;st.setState(X,w,en)}let se=!1;X.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==En.state.version||Pt.outputColorSpace!==Tt||O.isBatchedMesh&&Pt.batching===!1||!O.isBatchedMesh&&Pt.batching===!0||O.isBatchedMesh&&Pt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Pt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Pt.instancing===!1||!O.isInstancedMesh&&Pt.instancing===!0||O.isSkinnedMesh&&Pt.skinning===!1||!O.isSkinnedMesh&&Pt.skinning===!0||O.isInstancedMesh&&Pt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Pt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Pt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Pt.instancingMorph===!1&&O.morphTexture!==null||Pt.envMap!==At||X.fog===!0&&Pt.fog!==at||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==st.numPlanes||Pt.numIntersection!==st.numIntersection)||Pt.vertexAlphas!==kt||Pt.vertexTangents!==Wt||Pt.morphTargets!==Rt||Pt.morphNormals!==te||Pt.morphColors!==he||Pt.toneMapping!==fe||Pt.morphTargetsCount!==ie)&&(se=!0):(se=!0,Pt.__version=X.version);let cn=Pt.currentProgram;se===!0&&(cn=sr(X,F,O));let Ii=!1,Ye=!1,xs=!1,pe=cn.getUniforms(),mn=Pt.uniforms;if(ht.useProgram(cn.program)&&(Ii=!0,Ye=!0,xs=!0),X.id!==E&&(E=X.id,Ye=!0),Ii||v!==w){ht.buffers.depth.getReversed()?(lt.copy(w.projectionMatrix),Jd(lt),Kd(lt),pe.setValue(I,"projectionMatrix",lt)):pe.setValue(I,"projectionMatrix",w.projectionMatrix),pe.setValue(I,"viewMatrix",w.matrixWorldInverse);let Gn=pe.map.cameraPosition;Gn!==void 0&&Gn.setValue(I,zt.setFromMatrixPosition(w.matrixWorld)),vt.logarithmicDepthBuffer&&pe.setValue(I,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&pe.setValue(I,"isOrthographic",w.isOrthographicCamera===!0),v!==w&&(v=w,Ye=!0,xs=!0)}if(O.isSkinnedMesh){pe.setOptional(I,O,"bindMatrix"),pe.setOptional(I,O,"bindMatrixInverse");let en=O.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),pe.setValue(I,"boneTexture",en.boneTexture,T))}O.isBatchedMesh&&(pe.setOptional(I,O,"batchingTexture"),pe.setValue(I,"batchingTexture",O._matricesTexture,T),pe.setOptional(I,O,"batchingIdTexture"),pe.setValue(I,"batchingIdTexture",O._indirectTexture,T),pe.setOptional(I,O,"batchingColorTexture"),O._colorsTexture!==null&&pe.setValue(I,"batchingColorTexture",O._colorsTexture,T));let _s=W.morphAttributes;if((_s.position!==void 0||_s.normal!==void 0||_s.color!==void 0)&&Bt.update(O,W,cn),(Ye||Pt.receiveShadow!==O.receiveShadow)&&(Pt.receiveShadow=O.receiveShadow,pe.setValue(I,"receiveShadow",O.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(mn.envMap.value=At,mn.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(mn.envMapIntensity.value=F.environmentIntensity),Ye&&(pe.setValue(I,"toneMappingExposure",y.toneMappingExposure),Pt.needsLights&&Xu(mn,xs),at&&X.fog===!0&&ft.refreshFogUniforms(mn,at),ft.refreshMaterialUniforms(mn,X,q,et,p.state.transmissionRenderTarget[w.id]),es.upload(I,Sl(Pt),mn,T)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(es.upload(I,Sl(Pt),mn,T),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&pe.setValue(I,"center",O.center),pe.setValue(I,"modelViewMatrix",O.modelViewMatrix),pe.setValue(I,"normalMatrix",O.normalMatrix),pe.setValue(I,"modelMatrix",O.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let en=X.uniformsGroups;for(let Gn=0,Wn=en.length;Gn<Wn;Gn++){let wl=en[Gn];N.update(wl,cn),N.bind(wl,cn)}}return cn}function Xu(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function qu(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,F,W){_t.get(w.texture).__webglTexture=F,_t.get(w.depthTexture).__webglTexture=W;let X=_t.get(w);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,F){let W=_t.get(w);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,W=0){R=w,A=F,D=W;let X=!0,O=null,at=!1,gt=!1;if(w){let At=_t.get(w);if(At.__useDefaultFramebuffer!==void 0)ht.bindFramebuffer(I.FRAMEBUFFER,null),X=!1;else if(At.__webglFramebuffer===void 0)T.setupRenderTarget(w);else if(At.__hasExternalTextures)T.rebindTextures(w,_t.get(w.texture).__webglTexture,_t.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Rt=w.depthTexture;if(At.__boundDepthTexture!==Rt){if(Rt!==null&&_t.has(Rt)&&(w.width!==Rt.image.width||w.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(w)}}let kt=w.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(gt=!0);let Wt=_t.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Wt[F])?O=Wt[F][W]:O=Wt[F],at=!0):w.samples>0&&T.useMultisampledRTT(w)===!1?O=_t.get(w).__webglMultisampledFramebuffer:Array.isArray(Wt)?O=Wt[W]:O=Wt,P.copy(w.viewport),H.copy(w.scissor),z=w.scissorTest}else P.copy(Mt).multiplyScalar(q).floor(),H.copy(Dt).multiplyScalar(q).floor(),z=qt;if(ht.bindFramebuffer(I.FRAMEBUFFER,O)&&X&&ht.drawBuffers(w,O),ht.viewport(P),ht.scissor(H),ht.setScissorTest(z),at){let At=_t.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,At.__webglTexture,W)}else if(gt){let At=_t.get(w.texture),kt=F||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,At.__webglTexture,W||0,kt)}E=-1},this.readRenderTargetPixels=function(w,F,W,X,O,at,gt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=_t.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&gt!==void 0&&(Tt=Tt[gt]),Tt){ht.bindFramebuffer(I.FRAMEBUFFER,Tt);try{let At=w.texture,kt=At.format,Wt=At.type;if(!vt.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!vt.textureTypeReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-X&&W>=0&&W<=w.height-O&&I.readPixels(F,W,X,O,Yt.convert(kt),Yt.convert(Wt),at)}finally{let At=R!==null?_t.get(R).__webglFramebuffer:null;ht.bindFramebuffer(I.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(w,F,W,X,O,at,gt){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=_t.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&gt!==void 0&&(Tt=Tt[gt]),Tt){let At=w.texture,kt=At.format,Wt=At.type;if(!vt.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!vt.textureTypeReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=w.width-X&&W>=0&&W<=w.height-O){ht.bindFramebuffer(I.FRAMEBUFFER,Tt);let Rt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Rt),I.bufferData(I.PIXEL_PACK_BUFFER,at.byteLength,I.STREAM_READ),I.readPixels(F,W,X,O,Yt.convert(kt),Yt.convert(Wt),0);let te=R!==null?_t.get(R).__webglFramebuffer:null;ht.bindFramebuffer(I.FRAMEBUFFER,te);let he=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await $d(I,he,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Rt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,at),I.deleteBuffer(Rt),I.deleteSync(he),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,F=null,W=0){w.isTexture!==!0&&(Rs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,w=arguments[1]);let X=Math.pow(2,-W),O=Math.floor(w.image.width*X),at=Math.floor(w.image.height*X),gt=F!==null?F.x:0,Tt=F!==null?F.y:0;T.setTexture2D(w,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,gt,Tt,O,at),ht.unbindTexture()},this.copyTextureToTexture=function(w,F,W=null,X=null,O=0){w.isTexture!==!0&&(Rs("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,w=arguments[1],F=arguments[2],O=arguments[3]||0,W=null);let at,gt,Tt,At,kt,Wt,Rt,te,he,fe=w.isCompressedTexture?w.mipmaps[O]:w.image;W!==null?(at=W.max.x-W.min.x,gt=W.max.y-W.min.y,Tt=W.isBox3?W.max.z-W.min.z:1,At=W.min.x,kt=W.min.y,Wt=W.isBox3?W.min.z:0):(at=fe.width,gt=fe.height,Tt=fe.depth||1,At=0,kt=0,Wt=0),X!==null?(Rt=X.x,te=X.y,he=X.z):(Rt=0,te=0,he=0);let Ve=Yt.convert(F.format),ie=Yt.convert(F.type),Pt;F.isData3DTexture?(T.setTexture3D(F,0),Pt=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(T.setTexture2DArray(F,0),Pt=I.TEXTURE_2D_ARRAY):(T.setTexture2D(F,0),Pt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);let En=I.getParameter(I.UNPACK_ROW_LENGTH),se=I.getParameter(I.UNPACK_IMAGE_HEIGHT),cn=I.getParameter(I.UNPACK_SKIP_PIXELS),Ii=I.getParameter(I.UNPACK_SKIP_ROWS),Ye=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,fe.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,fe.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,At),I.pixelStorei(I.UNPACK_SKIP_ROWS,kt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Wt);let xs=w.isDataArrayTexture||w.isData3DTexture,pe=F.isDataArrayTexture||F.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let mn=_t.get(w),_s=_t.get(F),en=_t.get(mn.__renderTarget),Gn=_t.get(_s.__renderTarget);ht.bindFramebuffer(I.READ_FRAMEBUFFER,en.__webglFramebuffer),ht.bindFramebuffer(I.DRAW_FRAMEBUFFER,Gn.__webglFramebuffer);for(let Wn=0;Wn<Tt;Wn++)xs&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_t.get(w).__webglTexture,O,Wt+Wn),w.isDepthTexture?(pe&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_t.get(F).__webglTexture,O,he+Wn),I.blitFramebuffer(At,kt,at,gt,Rt,te,at,gt,I.DEPTH_BUFFER_BIT,I.NEAREST)):pe?I.copyTexSubImage3D(Pt,O,Rt,te,he+Wn,At,kt,at,gt):I.copyTexSubImage2D(Pt,O,Rt,te,he+Wn,At,kt,at,gt);ht.bindFramebuffer(I.READ_FRAMEBUFFER,null),ht.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else pe?w.isDataTexture||w.isData3DTexture?I.texSubImage3D(Pt,O,Rt,te,he,at,gt,Tt,Ve,ie,fe.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(Pt,O,Rt,te,he,at,gt,Tt,Ve,fe.data):I.texSubImage3D(Pt,O,Rt,te,he,at,gt,Tt,Ve,ie,fe):w.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,O,Rt,te,at,gt,Ve,ie,fe.data):w.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,O,Rt,te,fe.width,fe.height,Ve,fe.data):I.texSubImage2D(I.TEXTURE_2D,O,Rt,te,at,gt,Ve,ie,fe);I.pixelStorei(I.UNPACK_ROW_LENGTH,En),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,se),I.pixelStorei(I.UNPACK_SKIP_PIXELS,cn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ii),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ye),O===0&&F.generateMipmaps&&I.generateMipmap(Pt),ht.unbindTexture()},this.copyTextureToTexture3D=function(w,F,W=null,X=null,O=0){return w.isTexture!==!0&&(Rs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,w=arguments[2],F=arguments[3],O=arguments[4]||0),Rs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,F,W,X,O)},this.initRenderTarget=function(w){_t.get(w).__webglFramebuffer===void 0&&T.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?T.setTextureCube(w,0):w.isData3DTexture?T.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?T.setTexture2DArray(w,0):T.setTexture2D(w,0),ht.unbindTexture()},this.resetState=function(){A=0,D=0,R=null,ht.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorspace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}};var jr=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Vt(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},to=class extends Ie{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new sn,this.environmentIntensity=1,this.environmentRotation=new sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},eo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=tc,this.updateRanges=[],this.version=0,this.uuid=xn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Fe=new C,Ws=class n{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=fn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=oe(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=fn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=fn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=fn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=fn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array),s=oe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),i=oe(i,this.array),s=oe(s,this.array),r=oe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Se(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new n(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ls=class extends Bn{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Xi,Es=new C,qi=new C,Yi=new C,Zi=new it,ws=new it,au=new $t,Tr=new C,bs=new C,Ar=new C,wh=new it,ua=new it,bh=new it,Xs=class extends Ie{constructor(t=new ls){if(super(),this.isSprite=!0,this.type="Sprite",Xi===void 0){Xi=new ae;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new eo(e,5);Xi.setIndex([0,1,2,0,2,3]),Xi.setAttribute("position",new Ws(i,3,0,!1)),Xi.setAttribute("uv",new Ws(i,2,3,!1))}this.geometry=Xi,this.material=t,this.center=new it(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qi.setFromMatrixScale(this.matrixWorld),au.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Yi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qi.multiplyScalar(-Yi.z);let i=this.material.rotation,s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));let o=this.center;Rr(Tr.set(-.5,-.5,0),Yi,o,qi,s,r),Rr(bs.set(.5,-.5,0),Yi,o,qi,s,r),Rr(Ar.set(.5,.5,0),Yi,o,qi,s,r),wh.set(0,0),ua.set(1,0),bh.set(1,1);let a=t.ray.intersectTriangle(Tr,bs,Ar,!1,Es);if(a===null&&(Rr(bs.set(-.5,.5,0),Yi,o,qi,s,r),ua.set(0,1),a=t.ray.intersectTriangle(Tr,Ar,bs,!1,Es),a===null))return;let c=t.ray.origin.distanceTo(Es);c<t.near||c>t.far||e.push({distance:c,point:Es.clone(),uv:Qn.getInterpolation(Es,Tr,bs,Ar,wh,ua,bh,new it),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Rr(n,t,e,i,s,r){Zi.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(ws.x=r*Zi.x-s*Zi.y,ws.y=s*Zi.x+r*Zi.y):ws.copy(Zi),n.copy(t),n.x+=ws.x,n.y+=ws.y,n.applyMatrix4(au)}var hs=class extends ze{constructor(t=null,e=1,i=1,s,r,o,a,c,l=Ke,h=Ke,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qs=class extends Se{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},$i=new $t,Th=new $t,Cr=[],Ah=new On,$g=new $t,Ts=new ee,As=new ii,si=class extends ee{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qs(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,$g)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new On),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,$i),Ah.copy(t.boundingBox).applyMatrix4($i),this.boundingBox.union(Ah)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,$i),As.copy(t.boundingSphere).applyMatrix4($i),this.boundingSphere.union(As)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=t*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(t,e){let i=this.matrixWorld,s=this.count;if(Ts.geometry=this.geometry,Ts.material=this.material,Ts.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),As.copy(this.boundingSphere),As.applyMatrix4(i),t.ray.intersectsSphere(As)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,$i),Th.multiplyMatrices(i,$i),Ts.matrixWorld=Th,Ts.raycast(t,Cr);for(let o=0,a=Cr.length;o<a;o++){let c=Cr[o];c.instanceId=r,c.object=this,e.push(c)}Cr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new hs(new Float32Array(s*this.count),s,this.count,$c,Ge));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<i.length;l++)o+=i[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Ys=class extends Bn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Rh=new $t,xc=new Hs,Ir=new ii,Pr=new C,no=class extends Ie{constructor(t=new ae,e=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ir.copy(i.boundingSphere),Ir.applyMatrix4(s),Ir.radius+=r,t.ray.intersectsSphere(Ir)===!1)return;Rh.copy(s).invert(),xc.copy(t.ray).applyMatrix4(Rh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,u=i.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let x=d,_=f;x<_;x++){let g=l.getX(x);Pr.fromBufferAttribute(u,g),Ch(Pr,g,c,s,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let x=d,_=f;x<_;x++)Pr.fromBufferAttribute(u,x),Ch(Pr,x,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ch(n,t,e,i,s,r,o){let a=xc.distanceSqToPoint(n);if(a<e){let c=new C;xc.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Zs=class extends ze{constructor(t,e,i,s,r,o,a,c,l){super(t,e,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},rn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let i=this.getLengths(),s=0,r=i.length,o;e?o=e:o=t*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let h=i[s],d=i[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new it:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){let i=new C,s=[],r=[],o=[],a=new C,c=new $t;for(let f=0;f<=t;f++){let x=f/t;s[f]=this.getTangentAt(x,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let x=Math.acos(Re(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,x))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Re(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],f*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},$s=class extends rn{constructor(t=0,e=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new it){let i=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},_c=class extends $s{constructor(t,e,i,s,r,o){super(t,e,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function el(){let n=0,t=0,e=0,i=0;function s(r,o,a,c){n=r,t=a,e=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return n+t*r+e*o+i*a}}}var Dr=new C,da=new el,fa=new el,pa=new el,yc=class extends rn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){let i=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Dr.subVectors(s[0],s[1]).add(s[0]),l=Dr);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Dr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,x=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),x<1e-4&&(x=_),g<1e-4&&(g=_),da.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,x,_,g),fa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,x,_,g),pa.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,x,_,g)}else this.curveType==="catmullrom"&&(da.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),fa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),pa.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(da.calc(c),fa.calc(c),pa.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Ih(n,t,e,i,s){let r=(i-t)*.5,o=(s-e)*.5,a=n*n,c=n*a;return(2*e-2*i+r+o)*c+(-3*e+3*i-2*r-o)*a+r*n+e}function Jg(n,t){let e=1-n;return e*e*t}function Kg(n,t){return 2*(1-n)*n*t}function Qg(n,t){return n*n*t}function Ls(n,t,e,i){return Jg(n,t)+Kg(n,e)+Qg(n,i)}function jg(n,t){let e=1-n;return e*e*e*t}function tx(n,t){let e=1-n;return 3*e*e*n*t}function ex(n,t){return 3*(1-n)*n*n*t}function nx(n,t){return n*n*n*t}function Us(n,t,e,i,s){return jg(n,t)+tx(n,e)+ex(n,i)+nx(n,s)}var io=class extends rn{constructor(t=new it,e=new it,i=new it,s=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new it){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Us(t,s.x,r.x,o.x,a.x),Us(t,s.y,r.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},vc=class extends rn{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Us(t,s.x,r.x,o.x,a.x),Us(t,s.y,r.y,o.y,a.y),Us(t,s.z,r.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},so=class extends rn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Mc=class extends rn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ro=class extends rn{constructor(t=new it,e=new it,i=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new it){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(Ls(t,s.x,r.x,o.x),Ls(t,s.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Sc=class extends rn{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(Ls(t,s.x,r.x,o.x),Ls(t,s.y,r.y,o.y),Ls(t,s.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},oo=class extends rn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let i=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(Ih(a,c.x,l.x,h.x,u.x),Ih(a,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new it().fromArray(s))}return this}},Ec=Object.freeze({__proto__:null,ArcCurve:_c,CatmullRomCurve3:yc,CubicBezierCurve:io,CubicBezierCurve3:vc,EllipseCurve:$s,LineCurve:so,LineCurve3:Mc,QuadraticBezierCurve:ro,QuadraticBezierCurve3:Sc,SplineCurve:oo}),wc=class extends rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ec[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(new Ec[s.type]().fromJSON(s))}return this}},ao=class extends wc{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new so(this.currentPoint.clone(),new it(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){let r=new ro(this.currentPoint.clone(),new it(t,e),new it(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,o){let a=new io(this.currentPoint.clone(),new it(t,e),new it(i,s),new it(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new oo(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,i,s,r,o),this}absarc(t,e,i,s,r,o){return this.absellipse(t,e,i,i,s,r,o),this}ellipse(t,e,i,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,o,a,c),this}absellipse(t,e,i,s,r,o,a,c){let l=new $s(t,e,i,s,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var Pe=class n extends ae{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new C,h=new it;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=i+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ut(o,3)),this.setAttribute("normal",new Ut(a,3)),this.setAttribute("uv",new Ut(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.segments,t.thetaStart,t.thetaLength)}},vi=class n extends ae{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],x=0,_=[],g=i/2,p=0;b(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Ut(u,3)),this.setAttribute("normal",new Ut(d,3)),this.setAttribute("uv",new Ut(f,2));function b(){let y=new C,U=new C,A=0,D=(e-t)/i;for(let R=0;R<=r;R++){let E=[],v=R/r,P=v*(e-t)+t;for(let H=0;H<=s;H++){let z=H/s,B=z*c+a,Y=Math.sin(B),k=Math.cos(B);U.x=P*Y,U.y=-v*i+g,U.z=P*k,u.push(U.x,U.y,U.z),y.set(Y,D,k).normalize(),d.push(y.x,y.y,y.z),f.push(z,1-v),E.push(x++)}_.push(E)}for(let R=0;R<s;R++)for(let E=0;E<r;E++){let v=_[E][R],P=_[E+1][R],H=_[E+1][R+1],z=_[E][R+1];(t>0||E!==0)&&(h.push(v,P,z),A+=3),(e>0||E!==r-1)&&(h.push(P,H,z),A+=3)}l.addGroup(p,A,0),p+=A}function S(y){let U=x,A=new it,D=new C,R=0,E=y===!0?t:e,v=y===!0?1:-1;for(let H=1;H<=s;H++)u.push(0,g*v,0),d.push(0,v,0),f.push(.5,.5),x++;let P=x;for(let H=0;H<=s;H++){let B=H/s*c+a,Y=Math.cos(B),k=Math.sin(B);D.x=E*k,D.y=g*v,D.z=E*Y,u.push(D.x,D.y,D.z),d.push(0,v,0),A.x=Y*.5+.5,A.y=k*.5*v+.5,f.push(A.x,A.y),x++}for(let H=0;H<s;H++){let z=U+H,B=P+H;y===!0?h.push(B,B+1,z):h.push(B+1,B,z),R+=3}l.addGroup(p,R,y===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Qe=class n extends vi{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},bc=class n extends ae{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),l(i),h(),this.setAttribute("position",new Ut(r,3)),this.setAttribute("normal",new Ut(r.slice(),3)),this.setAttribute("uv",new Ut(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let S=new C,y=new C,U=new C;for(let A=0;A<e.length;A+=3)f(e[A+0],S),f(e[A+1],y),f(e[A+2],U),c(S,y,U,b)}function c(b,S,y,U){let A=U+1,D=[];for(let R=0;R<=A;R++){D[R]=[];let E=b.clone().lerp(y,R/A),v=S.clone().lerp(y,R/A),P=A-R;for(let H=0;H<=P;H++)H===0&&R===A?D[R][H]=E:D[R][H]=E.clone().lerp(v,H/P)}for(let R=0;R<A;R++)for(let E=0;E<2*(A-R)-1;E++){let v=Math.floor(E/2);E%2===0?(d(D[R][v+1]),d(D[R+1][v]),d(D[R][v])):(d(D[R][v+1]),d(D[R+1][v+1]),d(D[R+1][v]))}}function l(b){let S=new C;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(b),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function h(){let b=new C;for(let S=0;S<r.length;S+=3){b.x=r[S+0],b.y=r[S+1],b.z=r[S+2];let y=g(b)/2/Math.PI+.5,U=p(b)/Math.PI+.5;o.push(y,1-U)}x(),u()}function u(){for(let b=0;b<o.length;b+=6){let S=o[b+0],y=o[b+2],U=o[b+4],A=Math.max(S,y,U),D=Math.min(S,y,U);A>.9&&D<.1&&(S<.2&&(o[b+0]+=1),y<.2&&(o[b+2]+=1),U<.2&&(o[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,S){let y=b*3;S.x=t[y+0],S.y=t[y+1],S.z=t[y+2]}function x(){let b=new C,S=new C,y=new C,U=new C,A=new it,D=new it,R=new it;for(let E=0,v=0;E<r.length;E+=9,v+=6){b.set(r[E+0],r[E+1],r[E+2]),S.set(r[E+3],r[E+4],r[E+5]),y.set(r[E+6],r[E+7],r[E+8]),A.set(o[v+0],o[v+1]),D.set(o[v+2],o[v+3]),R.set(o[v+4],o[v+5]),U.copy(b).add(S).add(y).divideScalar(3);let P=g(U);_(A,v+0,b,P),_(D,v+2,S,P),_(R,v+4,y,P)}}function _(b,S,y,U){U<0&&b.x===1&&(o[S]=b.x-1),y.x===0&&y.z===0&&(o[S]=U/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.details)}};var Js=class extends ao{constructor(t){super(t),this.uuid=xn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(new ao().fromJSON(s))}return this}},ix={triangulate:function(n,t,e=2){let i=t&&t.length,s=i?t[0]*e:n.length,r=cu(n,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(i&&(r=cx(n,t,r,e)),n.length>80*e){a=l=n[0],c=h=n[1];for(let x=e;x<s;x+=e)u=n[x],d=n[x+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return Ks(r,o,e,a,c,f,0),o}};function cu(n,t,e,i,s){let r,o;if(s===yx(n,t,e,i)>0)for(r=t;r<e;r+=i)o=Ph(r,n[r],n[r+1],o);else for(r=e-i;r>=t;r-=i)o=Ph(r,n[r],n[r+1],o);return o&&So(o,o.next)&&(js(o),o=o.next),o}function Mi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(So(e,e.next)||xe(e.prev,e,e.next)===0)){if(js(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ks(n,t,e,i,s,r,o){if(!n)return;!o&&r&&fx(n,i,s,r);let a=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,r?rx(n,i,s,r):sx(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),js(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=ox(Mi(n),t,e),Ks(n,t,e,i,s,r,2)):o===2&&ax(n,t,e,i,s,r):Ks(Mi(n),t,e,i,s,r,1);break}}}function sx(n){let t=n.prev,e=n,i=n.next;if(xe(t,e,i)>=0)return!1;let s=t.x,r=e.x,o=i.x,a=t.y,c=e.y,l=i.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=s>r?s>o?s:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,x=i.next;for(;x!==t;){if(x.x>=h&&x.x<=d&&x.y>=u&&x.y<=f&&Ki(s,a,r,c,o,l,x.x,x.y)&&xe(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function rx(n,t,e,i){let s=n.prev,r=n,o=n.next;if(xe(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,x=h<u?h<d?h:d:u<d?u:d,_=a>c?a>l?a:l:c>l?c:l,g=h>u?h>d?h:d:u>d?u:d,p=Tc(f,x,t,e,i),b=Tc(_,g,t,e,i),S=n.prevZ,y=n.nextZ;for(;S&&S.z>=p&&y&&y.z<=b;){if(S.x>=f&&S.x<=_&&S.y>=x&&S.y<=g&&S!==s&&S!==o&&Ki(a,h,c,u,l,d,S.x,S.y)&&xe(S.prev,S,S.next)>=0||(S=S.prevZ,y.x>=f&&y.x<=_&&y.y>=x&&y.y<=g&&y!==s&&y!==o&&Ki(a,h,c,u,l,d,y.x,y.y)&&xe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=_&&S.y>=x&&S.y<=g&&S!==s&&S!==o&&Ki(a,h,c,u,l,d,S.x,S.y)&&xe(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;y&&y.z<=b;){if(y.x>=f&&y.x<=_&&y.y>=x&&y.y<=g&&y!==s&&y!==o&&Ki(a,h,c,u,l,d,y.x,y.y)&&xe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function ox(n,t,e){let i=n;do{let s=i.prev,r=i.next.next;!So(s,r)&&lu(s,i,i.next,r)&&Qs(s,r)&&Qs(r,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(r.i/e|0),js(i),js(i.next),i=n=r),i=i.next}while(i!==n);return Mi(i)}function ax(n,t,e,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&gx(o,a)){let c=hu(o,a);o=Mi(o,o.next),c=Mi(c,c.next),Ks(o,t,e,i,s,r,0),Ks(c,t,e,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function cx(n,t,e,i){let s=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*i,c=r<o-1?t[r+1]*i:n.length,l=cu(n,a,c,i,!1),l===l.next&&(l.steiner=!0),s.push(mx(l));for(s.sort(lx),r=0;r<s.length;r++)e=hx(s[r],e);return e}function lx(n,t){return n.x-t.x}function hx(n,t){let e=ux(n,t);if(!e)return t;let i=hu(e,n);return Mi(i,i.next),Mi(e,e.next)}function ux(n,t){let e=t,i=-1/0,s,r=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Ki(o<l?r:i,o,c,l,o<l?i:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Qs(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&dx(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function dx(n,t){return xe(n.prev,n,t.prev)<0&&xe(t.next,n,n.next)<0}function fx(n,t,e,i){let s=n;do s.z===0&&(s.z=Tc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,px(s)}function px(n){let t,e,i,s,r,o,a,c,l=1;do{for(e=n,n=null,r=null,o=0;e;){for(o++,i=e,a=0,t=0;t<l&&(a++,i=i.nextZ,!!i);t++);for(c=l;a>0||c>0&&i;)a!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,a--):(s=i,i=i.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;e=i}r.nextZ=null,l*=2}while(o>1);return n}function Tc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function mx(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ki(n,t,e,i,s,r,o,a){return(s-o)*(t-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(i-a)}function gx(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!xx(n,t)&&(Qs(n,t)&&Qs(t,n)&&_x(n,t)&&(xe(n.prev,n,t.prev)||xe(n,t.prev,t))||So(n,t)&&xe(n.prev,n,n.next)>0&&xe(t.prev,t,t.next)>0)}function xe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function So(n,t){return n.x===t.x&&n.y===t.y}function lu(n,t,e,i){let s=Ur(xe(n,t,e)),r=Ur(xe(n,t,i)),o=Ur(xe(e,i,n)),a=Ur(xe(e,i,t));return!!(s!==r&&o!==a||s===0&&Lr(n,e,t)||r===0&&Lr(n,i,t)||o===0&&Lr(e,n,i)||a===0&&Lr(e,t,i))}function Lr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ur(n){return n>0?1:n<0?-1:0}function xx(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&lu(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Qs(n,t){return xe(n.prev,n,n.next)<0?xe(n,t,n.next)>=0&&xe(n,n.prev,t)>=0:xe(n,t,n.prev)<0||xe(n,n.next,t)<0}function _x(n,t){let e=n,i=!1,s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function hu(n,t){let e=new Ac(n.i,n.x,n.y),i=new Ac(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Ph(n,t,e,i){let s=new Ac(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function js(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ac(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function yx(n,t,e,i){let s=0;for(let r=t,o=e-i;r<e;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Ns=class n{static area(t){let e=t.length,i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return n.area(t)<0}static triangulateShape(t,e){let i=[],s=[],r=[];Dh(t),Lh(i,t);let o=t.length;e.forEach(Dh);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Lh(i,e[c]);let a=ix.triangulate(i,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Dh(n){let t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Lh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}var co=class n extends ae{constructor(t=new Js([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let i=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new Ut(s,3)),this.setAttribute("uv",new Ut(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:vx,S,y=!1,U,A,D,R;p&&(S=p.getSpacedPoints(h),y=!0,d=!1,U=p.computeFrenetFrames(h,!1),A=new C,D=new C,R=new C),d||(g=0,f=0,x=0,_=0);let E=a.extractPoints(l),v=E.shape,P=E.holes;if(!Ns.isClockWise(v)){v=v.reverse();for(let j=0,rt=P.length;j<rt;j++){let I=P[j];Ns.isClockWise(I)&&(P[j]=I.reverse())}}let z=Ns.triangulateShape(v,P),B=v;for(let j=0,rt=P.length;j<rt;j++){let I=P[j];v=v.concat(I)}function Y(j,rt,I){return rt||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(rt,I)}let k=v.length,et=z.length;function q(j,rt,I){let It,nt,vt,ht=j.x-rt.x,Nt=j.y-rt.y,_t=I.x-j.x,T=I.y-j.y,M=ht*ht+Nt*Nt,V=ht*T-Nt*_t;if(Math.abs(V)>Number.EPSILON){let J=Math.sqrt(M),tt=Math.sqrt(_t*_t+T*T),K=rt.x-Nt/J,bt=rt.y+ht/J,ft=I.x-T/tt,yt=I.y+_t/tt,Jt=((ft-K)*T-(yt-bt)*_t)/(ht*T-Nt*_t);It=K+ht*Jt-j.x,nt=bt+Nt*Jt-j.y;let st=It*It+nt*nt;if(st<=2)return new it(It,nt);vt=Math.sqrt(st/2)}else{let J=!1;ht>Number.EPSILON?_t>Number.EPSILON&&(J=!0):ht<-Number.EPSILON?_t<-Number.EPSILON&&(J=!0):Math.sign(Nt)===Math.sign(T)&&(J=!0),J?(It=-Nt,nt=ht,vt=Math.sqrt(M)):(It=ht,nt=Nt,vt=Math.sqrt(M/2))}return new it(It/vt,nt/vt)}let ct=[];for(let j=0,rt=B.length,I=rt-1,It=j+1;j<rt;j++,I++,It++)I===rt&&(I=0),It===rt&&(It=0),ct[j]=q(B[j],B[I],B[It]);let ut=[],Mt,Dt=ct.concat();for(let j=0,rt=P.length;j<rt;j++){let I=P[j];Mt=[];for(let It=0,nt=I.length,vt=nt-1,ht=It+1;It<nt;It++,vt++,ht++)vt===nt&&(vt=0),ht===nt&&(ht=0),Mt[It]=q(I[It],I[vt],I[ht]);ut.push(Mt),Dt=Dt.concat(Mt)}for(let j=0;j<g;j++){let rt=j/g,I=f*Math.cos(rt*Math.PI/2),It=x*Math.sin(rt*Math.PI/2)+_;for(let nt=0,vt=B.length;nt<vt;nt++){let ht=Y(B[nt],ct[nt],It);lt(ht.x,ht.y,-I)}for(let nt=0,vt=P.length;nt<vt;nt++){let ht=P[nt];Mt=ut[nt];for(let Nt=0,_t=ht.length;Nt<_t;Nt++){let T=Y(ht[Nt],Mt[Nt],It);lt(T.x,T.y,-I)}}}let qt=x+_;for(let j=0;j<k;j++){let rt=d?Y(v[j],Dt[j],qt):v[j];y?(D.copy(U.normals[0]).multiplyScalar(rt.x),A.copy(U.binormals[0]).multiplyScalar(rt.y),R.copy(S[0]).add(D).add(A),lt(R.x,R.y,R.z)):lt(rt.x,rt.y,0)}for(let j=1;j<=h;j++)for(let rt=0;rt<k;rt++){let I=d?Y(v[rt],Dt[rt],qt):v[rt];y?(D.copy(U.normals[j]).multiplyScalar(I.x),A.copy(U.binormals[j]).multiplyScalar(I.y),R.copy(S[j]).add(D).add(A),lt(R.x,R.y,R.z)):lt(I.x,I.y,u/h*j)}for(let j=g-1;j>=0;j--){let rt=j/g,I=f*Math.cos(rt*Math.PI/2),It=x*Math.sin(rt*Math.PI/2)+_;for(let nt=0,vt=B.length;nt<vt;nt++){let ht=Y(B[nt],ct[nt],It);lt(ht.x,ht.y,u+I)}for(let nt=0,vt=P.length;nt<vt;nt++){let ht=P[nt];Mt=ut[nt];for(let Nt=0,_t=ht.length;Nt<_t;Nt++){let T=Y(ht[Nt],Mt[Nt],It);y?lt(T.x,T.y+S[h-1].y,S[h-1].x+I):lt(T.x,T.y,u+I)}}}$(),ot();function $(){let j=s.length/3;if(d){let rt=0,I=k*rt;for(let It=0;It<et;It++){let nt=z[It];Lt(nt[2]+I,nt[1]+I,nt[0]+I)}rt=h+g*2,I=k*rt;for(let It=0;It<et;It++){let nt=z[It];Lt(nt[0]+I,nt[1]+I,nt[2]+I)}}else{for(let rt=0;rt<et;rt++){let I=z[rt];Lt(I[2],I[1],I[0])}for(let rt=0;rt<et;rt++){let I=z[rt];Lt(I[0]+k*h,I[1]+k*h,I[2]+k*h)}}i.addGroup(j,s.length/3-j,0)}function ot(){let j=s.length/3,rt=0;wt(B,rt),rt+=B.length;for(let I=0,It=P.length;I<It;I++){let nt=P[I];wt(nt,rt),rt+=nt.length}i.addGroup(j,s.length/3-j,1)}function wt(j,rt){let I=j.length;for(;--I>=0;){let It=I,nt=I-1;nt<0&&(nt=j.length-1);for(let vt=0,ht=h+g*2;vt<ht;vt++){let Nt=k*vt,_t=k*(vt+1),T=rt+It+Nt,M=rt+nt+Nt,V=rt+nt+_t,J=rt+It+_t;zt(T,M,V,J)}}}function lt(j,rt,I){c.push(j),c.push(rt),c.push(I)}function Lt(j,rt,I){Ot(j),Ot(rt),Ot(I);let It=s.length/3,nt=b.generateTopUV(i,s,It-3,It-2,It-1);Qt(nt[0]),Qt(nt[1]),Qt(nt[2])}function zt(j,rt,I,It){Ot(j),Ot(rt),Ot(It),Ot(rt),Ot(I),Ot(It);let nt=s.length/3,vt=b.generateSideWallUV(i,s,nt-6,nt-3,nt-2,nt-1);Qt(vt[0]),Qt(vt[1]),Qt(vt[3]),Qt(vt[1]),Qt(vt[2]),Qt(vt[3])}function Ot(j){s.push(c[j*3+0]),s.push(c[j*3+1]),s.push(c[j*3+2])}function Qt(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Mx(e,i,t)}static fromJSON(t,e){let i=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];i.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ec[s.type]().fromJSON(s)),new n(i,t.options)}},vx={generateTopUV:function(n,t,e,i,s){let r=t[e*3],o=t[e*3+1],a=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new it(r,o),new it(a,c),new it(l,h)]},generateSideWallUV:function(n,t,e,i,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],f=t[s*3+1],x=t[s*3+2],_=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new it(o,1-c),new it(l,1-u),new it(d,1-x),new it(_,1-p)]:[new it(a,1-c),new it(h,1-u),new it(f,1-x),new it(g,1-p)]}};function Mx(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ke=class n extends bc{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}};var lo=class n extends ae{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],l=[],h=[],u=t,d=(e-t)/s,f=new C,x=new it;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){let p=r+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),x.x=(f.x/e+1)/2,x.y=(f.y/e+1)/2,h.push(x.x,x.y)}u+=d}for(let _=0;_<s;_++){let g=_*(i+1);for(let p=0;p<i;p++){let b=p+g,S=b,y=b+i+1,U=b+i+2,A=b+1;a.push(S,y,A),a.push(y,U,A)}}this.setIndex(a),this.setAttribute("position",new Ut(c,3)),this.setAttribute("normal",new Ut(l,3)),this.setAttribute("uv",new Ut(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Ht=class n extends ae{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new C,d=new C,f=[],x=[],_=[],g=[];for(let p=0;p<=i;p++){let b=[],S=p/i,y=0;p===0&&o===0?y=.5/e:p===i&&c===Math.PI&&(y=-.5/e);for(let U=0;U<=e;U++){let A=U/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+S*a),u.y=t*Math.cos(o+S*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+S*a),x.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),g.push(A+y,1-S),b.push(l++)}h.push(b)}for(let p=0;p<i;p++)for(let b=0;b<e;b++){let S=h[p][b+1],y=h[p][b],U=h[p+1][b],A=h[p+1][b+1];(p!==0||o>0)&&f.push(S,y,A),(p!==i-1||c<Math.PI)&&f.push(y,U,A)}this.setIndex(f),this.setAttribute("position",new Ut(x,3)),this.setAttribute("normal",new Ut(_,3)),this.setAttribute("uv",new Ut(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var us=class n extends ae{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=i;f++)for(let x=0;x<=s;x++){let _=x/s*r,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(x/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let x=1;x<=s;x++){let _=(s+1)*f+x-1,g=(s+1)*(f-1)+x-1,p=(s+1)*(f-1)+x,b=(s+1)*f+x;o.push(_,g,b),o.push(g,p,b)}this.setIndex(o),this.setAttribute("position",new Ut(a,3)),this.setAttribute("normal",new Ut(c,3)),this.setAttribute("uv",new Ut(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ct=class extends Bn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Nr(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Sx(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var ds=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Rc=class extends ds{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Rl,endingEnd:Rl}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Cl:r=t,a=2*e-i;break;case Il:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Cl:o=t,c=2*i-e;break;case Il:o=1,c=i+s[1]-s[0];break;default:o=t-1,c=e}let l=(i-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,x=(i-e)/(s-e),_=x*x,g=_*x,p=-d*g+2*d*_-d*x,b=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*x+1,S=(-1-f)*g+(1.5+f)*_+.5*x,y=f*g-f*_;for(let U=0;U!==a;++U)r[U]=p*o[h+U]+b*o[l+U]+S*o[c+U]+y*o[u+U];return r}},Cc=class extends ds{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},Ic=class extends ds{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},pn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Nr(e,this.TimeBufferType),this.values=Nr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Nr(t.times,Array),values:Nr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Ic(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Cc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Rc(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Vr:e=this.InterpolantFactoryMethodDiscrete;break;case ja:e=this.InterpolantFactoryMethodLinear;break;case Bo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vr;case this.InterpolantFactoryMethodLinear:return ja;case this.InterpolantFactoryMethodSmooth:return Bo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Sx(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Bo,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let u=a*i,d=u-i,f=u+i;for(let x=0;x!==i;++x){let _=e[u+x];if(_!==e[d+x]||_!==e[f+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*i,d=o*i;for(let f=0;f!==i;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};pn.prototype.TimeBufferType=Float32Array;pn.prototype.ValueBufferType=Float32Array;pn.prototype.DefaultInterpolation=ja;var Si=class extends pn{constructor(t,e,i){super(t,e,i)}};Si.prototype.ValueTypeName="bool";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=Vr;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;var Pc=class extends pn{};Pc.prototype.ValueTypeName="color";var Dc=class extends pn{};Dc.prototype.ValueTypeName="number";var Lc=class extends ds{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ce.slerpFlat(r,0,o,l-a,o,l,c);return r}},ho=class extends pn{InterpolantFactoryMethodLinear(t){return new Lc(this.times,this.values,this.getValueSize(),t)}};ho.prototype.ValueTypeName="quaternion";ho.prototype.InterpolantFactoryMethodSmooth=void 0;var Ei=class extends pn{constructor(t,e,i){super(t,e,i)}};Ei.prototype.ValueTypeName="string";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=Vr;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var Uc=class extends pn{};Uc.prototype.ValueTypeName="vector";var uo={enabled:!1,files:{},add:function(n,t){this.enabled!==!1&&(this.files[n]=t)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}},Nc=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],x=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return x}return null}}},Ex=new Nc,wi=class{constructor(t){this.manager=t!==void 0?t:Ex,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};wi.DEFAULT_MATERIAL_NAME="__DEFAULT";var Cn={},Fc=class extends Error{constructor(t,e){super(t),this.response=e}},Oc=class extends wi{constructor(t){super(t)}load(t,e,i,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=uo.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Cn[t]!==void 0){Cn[t].push({onLoad:e,onProgress:i,onError:s});return}Cn[t]=[],Cn[t].push({onLoad:e,onProgress:i,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=Cn[t],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,x=f!==0,_=0,g=new ReadableStream({start(p){b();function b(){u.read().then(({done:S,value:y})=>{if(S)p.close();else{_+=y.byteLength;let U=new ProgressEvent("progress",{lengthComputable:x,loaded:_,total:f});for(let A=0,D=h.length;A<D;A++){let R=h[A];R.onProgress&&R.onProgress(U)}p.enqueue(y),b()}},S=>{p.error(S)})}}});return new Response(g)}else throw new Fc(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(x=>f.decode(x))}}}).then(l=>{uo.add(t,l);let h=Cn[t];delete Cn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=Cn[t];if(h===void 0)throw this.manager.itemError(t),l;delete Cn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Bc=class extends wi{constructor(t){super(t)}load(t,e,i,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=uo.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=ks("img");function c(){h(),uo.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),s&&s(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var fo=class extends wi{constructor(t){super(t)}load(t,e,i,s){let r=this,o=new hs,a=new Oc(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(c){let l;try{l=r.parse(c)}catch(h){if(s!==void 0)s(h);else{console.error(h);return}}l.image!==void 0?o.image=l.image:l.data!==void 0&&(o.image.width=l.width,o.image.height=l.height,o.image.data=l.data),o.wrapS=l.wrapS!==void 0?l.wrapS:Dn,o.wrapT=l.wrapT!==void 0?l.wrapT:Dn,o.magFilter=l.magFilter!==void 0?l.magFilter:Ee,o.minFilter=l.minFilter!==void 0?l.minFilter:Ee,o.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(o.colorSpace=l.colorSpace),l.flipY!==void 0&&(o.flipY=l.flipY),l.format!==void 0&&(o.format=l.format),l.type!==void 0&&(o.type=l.type),l.mipmaps!==void 0&&(o.mipmaps=l.mipmaps,o.minFilter=jn),l.mipmapCount===1&&(o.minFilter=Ee),l.generateMipmaps!==void 0&&(o.generateMipmaps=l.generateMipmaps),o.needsUpdate=!0,e&&e(o,l)},i,s),o}},po=class extends wi{constructor(t){super(t)}load(t,e,i,s){let r=new ze,o=new Bc(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},i,s),r}},mo=class extends Ie{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},go=class extends mo{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ma=new $t,Uh=new C,Nh=new C,zc=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gs,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;Uh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Uh),Nh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Nh),e.updateMatrixWorld(),ma.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ma),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ma)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var kc=class extends zc{constructor(){super(new Jr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},xo=class extends mo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.target=new Ie,this.shadow=new kc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var nl="\\[\\]\\.:\\/",wx=new RegExp("["+nl+"]","g"),il="[^"+nl+"]",bx="[^"+nl.replace("\\.","")+"]",Tx=/((?:WC+[\/:])*)/.source.replace("WC",il),Ax=/(WCOD+)?/.source.replace("WCOD",bx),Rx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",il),Cx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",il),Ix=new RegExp("^"+Tx+Ax+Rx+Cx+"$"),Px=["material","materials","bones","map"],Hc=class{constructor(t,e,i){let s=i||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},me=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(wx,"")}static parseTrackName(t){let e=Ix.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Px.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=i(a.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=Hc;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var y_=new Float32Array(1);var Fh=new $t,_o=class{constructor(t,e,i=0,s=1/0){this.ray=new Hs(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Vs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Fh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Fh),this}intersectObject(t,e=!0,i=[]){return Vc(t,this,i,e),i.sort(Oh),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Vc(t[s],this,i,e);return i.sort(Oh),i}};function Oh(n,t){return n.distance-t.distance}function Vc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Vc(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gc);var Eo=class extends fo{constructor(t){super(t),this.type=vn}parse(t){let o=function(R,E){switch(R){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(E||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(E||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(E||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(E||""))}},h=`
`,u=function(R,E,v){E=E||1024;let H=R.pos,z=-1,B=0,Y="",k=String.fromCharCode.apply(null,new Uint16Array(R.subarray(H,H+128)));for(;0>(z=k.indexOf(h))&&B<E&&H<R.byteLength;)Y+=k,B+=k.length,H+=128,k+=String.fromCharCode.apply(null,new Uint16Array(R.subarray(H,H+128)));return-1<z?(v!==!1&&(R.pos+=B+z+1),Y+k.slice(0,z)):!1},d=function(R){let E=/^#\?(\S+)/,v=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,P=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,H=/^\s*FORMAT=(\S+)\s*$/,z=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,B={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},Y,k;for((R.pos>=R.byteLength||!(Y=u(R)))&&o(1,"no header found"),(k=Y.match(E))||o(3,"bad initial token"),B.valid|=1,B.programtype=k[1],B.string+=Y+`
`;Y=u(R),Y!==!1;){if(B.string+=Y+`
`,Y.charAt(0)==="#"){B.comments+=Y+`
`;continue}if((k=Y.match(v))&&(B.gamma=parseFloat(k[1])),(k=Y.match(P))&&(B.exposure=parseFloat(k[1])),(k=Y.match(H))&&(B.valid|=2,B.format=k[1]),(k=Y.match(z))&&(B.valid|=4,B.height=parseInt(k[1],10),B.width=parseInt(k[2],10)),B.valid&2&&B.valid&4)break}return B.valid&2||o(3,"missing format specifier"),B.valid&4||o(3,"missing image size specifier"),B},f=function(R,E,v){let P=E;if(P<8||P>32767||R[0]!==2||R[1]!==2||R[2]&128)return new Uint8Array(R);P!==(R[2]<<8|R[3])&&o(3,"wrong scanline width");let H=new Uint8Array(4*E*v);H.length||o(4,"unable to allocate buffer space");let z=0,B=0,Y=4*P,k=new Uint8Array(4),et=new Uint8Array(Y),q=v;for(;q>0&&B<R.byteLength;){B+4>R.byteLength&&o(1),k[0]=R[B++],k[1]=R[B++],k[2]=R[B++],k[3]=R[B++],(k[0]!=2||k[1]!=2||(k[2]<<8|k[3])!=P)&&o(3,"bad rgbe scanline format");let ct=0,ut;for(;ct<Y&&B<R.byteLength;){ut=R[B++];let Dt=ut>128;if(Dt&&(ut-=128),(ut===0||ct+ut>Y)&&o(3,"bad scanline data"),Dt){let qt=R[B++];for(let $=0;$<ut;$++)et[ct++]=qt}else et.set(R.subarray(B,B+ut),ct),ct+=ut,B+=ut}let Mt=P;for(let Dt=0;Dt<Mt;Dt++){let qt=0;H[z]=et[Dt+qt],qt+=P,H[z+1]=et[Dt+qt],qt+=P,H[z+2]=et[Dt+qt],qt+=P,H[z+3]=et[Dt+qt],z+=4}q--}return H},x=function(R,E,v,P){let H=R[E+3],z=Math.pow(2,H-128)/255;v[P+0]=R[E+0]*z,v[P+1]=R[E+1]*z,v[P+2]=R[E+2]*z,v[P+3]=1},_=function(R,E,v,P){let H=R[E+3],z=Math.pow(2,H-128)/255;v[P+0]=tr.toHalfFloat(Math.min(R[E+0]*z,65504)),v[P+1]=tr.toHalfFloat(Math.min(R[E+1]*z,65504)),v[P+2]=tr.toHalfFloat(Math.min(R[E+2]*z,65504)),v[P+3]=tr.toHalfFloat(1)},g=new Uint8Array(t);g.pos=0;let p=d(g),b=p.width,S=p.height,y=f(g.subarray(g.pos),b,S),U,A,D;switch(this.type){case Ge:D=y.length/4;let R=new Float32Array(D*4);for(let v=0;v<D;v++)x(y,v*4,R,v*4);U=R,A=Ge;break;case vn:D=y.length/4;let E=new Uint16Array(D*4);for(let v=0;v<D;v++)_(y,v*4,E,v*4);U=E,A=vn;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:b,height:S,data:U,header:p.string,gamma:p.gamma,exposure:p.exposure,type:A}}setDataType(t){return this.type=t,this}load(t,e,i,s){function r(o,a){switch(o.type){case Ge:case vn:o.colorSpace=ri,o.minFilter=Ee,o.magFilter=Ee,o.generateMipmaps=!1,o.flipY=!0;break}e&&e(o,a)}return super.load(t,r,i,s)}};var Dx=new po,kn={},pu=4,sl=1024;function mu(n){pu=n}function gu(n){sl=n}function Lx(n){let t=n.width||0;if(!t||t<=sl)return n;let e=sl/t,i=document.createElement("canvas");return i.width=Math.round(n.width*e),i.height=Math.round(n.height*e),i.getContext("2d").drawImage(n,0,0,i.width,i.height),i}function uu(n,t){return new Promise(e=>{Dx.load(n,i=>{i.image=Lx(i.image),i.wrapS=i.wrapT=Os,i.anisotropy=pu,t&&(i.colorSpace=Ae),e(i)},void 0,()=>{console.warn("doku y\xFCklenemedi",n),e(null)})})}var du=["sparse_grass","leafy_grass","withered_grass","farm_soil","stony_dirt_path","aerial_rocks_02","coast_sand_01","snow_field_aerial","clay_plaster","plastered_wall","large_sandstone_blocks","stone_wall","clay_roof_tiles_02","weathered_planks","marble_01","pine_bark","dark_wooden_planks","rock_06"],fu=[["foliage_green","png",!0],["foliage_autumn","png",!0],["foliage_spring","png",!0],["pine_card","png",!0],["pine_card_snow","png",!0],["wheat_ripe","png",!0],["wheat_green","png",!0],["kilim","jpg",!0],["water_nor","jpg",!1],["smoke","png",!0],["grass_card","png",!0]];async function xu(n,t){let e=[],i=0,s=du.length*3+fu.length,r=()=>{i++,t&&t(i/s)};for(let o of du)for(let a of["diff","nor","arm"])e.push(uu(`${n}/${o}_${a}.jpg`,a==="diff").then(c=>{kn[`${o}_${a}`]=c,r()}));for(let[o,a,c]of fu)e.push(uu(`${n}/${o}.${a}`,c).then(l=>{kn[o]=l,r()}));await Promise.all(e)}function ne(n){return kn[n]}function wo(n,t){if(!n)return null;if(t===1)return n;let e=n.clone();return e.repeat.set(t,t),e.needsUpdate=!0,e}function je(n,t={}){let e=t.repeat||1,i=new Ct({map:wo(kn[n+"_diff"],e),normalMap:wo(kn[n+"_nor"],e),roughnessMap:wo(kn[n+"_arm"],e),aoMap:null,roughness:t.roughness??1,metalness:t.metalness??0,color:t.color?new Vt(t.color):new Vt(16777215),side:t.side||_n});return i.normalMap&&i.normalScale.set(t.normal??1,t.normal??1),i}var m={};function _u(){m.plaster=je("plastered_wall",{repeat:2.5,color:14862752}),m.plasterWarm=je("clay_plaster",{repeat:2.5,color:16769725}),m.plasterLight=je("plastered_wall",{repeat:2.5,color:15852232}),m.white=je("plastered_wall",{repeat:2.5,color:16249318}),m.stoneCut=je("marble_01",{repeat:2.2,color:15918799,roughness:.9}),m.stoneRough=je("stone_wall",{repeat:3,color:15260872}),m.stoneGrey=je("large_sandstone_blocks",{repeat:2.5,color:14209220}),m.roof=je("clay_roof_tiles_02",{repeat:2.6,color:16777215}),m.wood=je("weathered_planks",{repeat:2.5,color:13214330}),m.woodDark=je("dark_wooden_planks",{repeat:2.5,color:11569766}),m.bark=je("pine_bark",{repeat:1.5,color:11901568}),m.soilRoof=je("stony_dirt_path",{repeat:2,color:15259320}),m.rock=je("rock_06",{repeat:1.2,color:14078150}),m.lead=new Ct({color:9410718,metalness:.3,roughness:.62,normalMap:wo(kn.plastered_wall_nor,3),normalScale:new it(.4,.4)}),m.dark=new Ct({color:1774607,roughness:1}),m.darkBlue=new Ct({color:2765888,roughness:.6}),m.gold=new Ct({color:14264901,metalness:1,roughness:.3}),m.bronze=new Ct({color:9071162,metalness:.9,roughness:.4}),m.waterSmall=new Ct({color:4026246,metalness:.1,roughness:.08,normalMap:kn.water_nor}),m.leather=new Ct({color:10253392,roughness:.85,side:ve}),m.wool=new Ct({color:15525594,roughness:1}),m.woolDark=new Ct({color:3024418,roughness:.9}),m.camel=new Ct({color:11831896,roughness:.95}),m.sack=new Ct({color:13218698,roughness:1}),m.logEnd=new Ct({color:14267781,roughness:.9}),m.kilim=new Ct({map:kn.kilim,roughness:.95,side:ve}),m.glow=new Ct({color:3346688,emissive:16738842,emissiveIntensity:2.2}),m.glass=new Ct({color:14675701,emissive:9418952,emissiveIntensity:.25,roughness:.2}),m.fabric=[11022891,3107658,2969478,13144620,15327436].map(n=>new Ct({color:n,roughness:.95,side:ve})),m.fruit=[12597547,15105570,15844367,6983466,8072538].map(n=>new Ct({color:n,roughness:.6})),m.flag=new Ct({map:Ux(),roughness:.9,side:ve}),m.cloth=new Ct({color:15656659,roughness:.95,side:ve}),m.skin=new Ct({color:14197884,roughness:.8}),m.rope=new Ct({color:9139029,roughness:1}),m.clay=new Ct({color:10902325,roughness:.85})}function Ux(){let n=document.createElement("canvas");n.width=256,n.height=160;let t=n.getContext("2d");t.fillStyle="#b3141b",t.fillRect(0,0,256,160),t.fillStyle="#f4efe4",t.beginPath(),t.arc(110,80,44,0,Math.PI*2),t.fill(),t.fillStyle="#b3141b",t.beginPath(),t.arc(124,80,36,0,Math.PI*2),t.fill(),t.fillStyle="#f4efe4",t.beginPath();for(let i=0;i<10;i++){let s=-Math.PI/2+i*Math.PI/5,r=i%2?9:22;t.lineTo(168+Math.cos(s)*r,80+Math.sin(s)*r)}t.fill();let e=new Zs(n);return e.colorSpace=Ae,e}function yu(n,t){let e=document.createElement("canvas");e.width=128,e.height=128;let i=e.getContext("2d");for(let r=0;r<8;r++)i.fillStyle=r%2?t:n,i.fillRect(r*16,0,16,128);let s=new Zs(e);return s.colorSpace=Ae,s}var Ti=26,Nx=2,Hn=4;function bo(n,t){let e=Math.sin(n*127.1+t*311.7)*43758.5453;return e-Math.floor(e)}function rl(n,t){let e=Math.floor(n),i=Math.floor(t),s=n-e,r=t-i,o=s*s*(3-2*s),a=r*r*(3-2*r),c=bo(e,i),l=bo(e+1,i),h=bo(e,i+1),u=bo(e+1,i+1);return(c*(1-o)+l*o)*(1-a)+(h*(1-o)+u*o)*a}function ps(n,t){return rl(n,t)*.55+rl(n*2.1,t*2.1)*.28+rl(n*4.3,t*4.3)*.17}var To=class{constructor(t,e){this.N=t,this.map=e,this.size=t+Ti*2,this.buildRiverField(),this.buildMesh(),this.buildWater()}isWater(t,e){let i=this.N,s=Math.max(0,Math.min(i-1,e));return t<0||t>=i?!1:this.map.tiles[s*i+t]===1}buildRiverField(){let t=this.N,e=this.size,i=4;this.wdist=new Float32Array(e*e);for(let s=0;s<e;s++)for(let r=0;r<e;r++){let o=r-Ti,a=s-Ti,c=i;for(let l=-i;l<=i;l++)for(let h=-i;h<=i;h++)if(this.isWater(o+h,a+l)){let u=Math.hypot(h,l);u<c&&(c=u)}this.wdist[s*e+r]=c}}waterDistAt(t,e){let i=this.size,s=t+this.N/2+Ti-.5,r=e+this.N/2+Ti-.5,o=Math.max(0,Math.min(i-2,Math.floor(s))),a=Math.max(0,Math.min(i-2,Math.floor(r))),c=Math.max(0,Math.min(1,s-o)),l=Math.max(0,Math.min(1,r-a)),h=this.wdist[a*i+o],u=this.wdist[a*i+o+1],d=this.wdist[(a+1)*i+o],f=this.wdist[(a+1)*i+o+1];return(h*(1-c)+u*c)*(1-l)+(d*(1-c)+f*c)*l}heightAt(t,e){let i=this.N,s=i/2,r=Math.max(0,Math.abs(t)-s),o=Math.max(0,Math.abs(e)-s),a=Math.hypot(r,o),c=(ps(t*.15,e*.15)-.5)*.06,l=Math.min(1,a/14);c+=l*l*(1.2+ps(t*.07+9,e*.07)*7);let h=this.waterDistAt(t,e),u=Math.max(0,1-h/1.6);return c=c*(1-Math.min(1,u*1.5))-u*u*.38,c}buildMesh(){let t=this.size,e=t*Nx,i=new ue(t,t,e,e);i.rotateX(-Math.PI/2);let s=i.attributes.position,r=i.attributes.uv;for(let c=0;c<s.count;c++){let l=s.getX(c),h=s.getZ(c);s.setY(c,this.heightAt(l,h)),r.setXY(c,l*.5,h*.5)}i.computeVertexNormals();let o=t*Hn;this.splatSize=o,this.splatData=new Uint8Array(o*o*4);for(let c=0;c<o;c++)for(let l=0;l<o;l++){let h=l/Hn-t/2,u=c/Hn-t/2,d=Math.floor(h+this.N/2),f=Math.floor(u+this.N/2),x=0,_=0,g=0,p=this.waterDistAt(h,u);p<1.35&&(g=Math.min(255,(1.35-p)/.6*255)),d>=0&&f>=0&&d<this.N&&f<this.N&&this.map.tiles[f*this.N+d]===2&&(_=230);let b=this.heightAt(h,u);b>3.2&&(_=Math.max(_,Math.min(255,(b-3.2)*120*ps(h*.3,u*.3))));let S=ps(h*.35+50,u*.35);S>.7&&(x=Math.min(80,(S-.7)*700));let y=(c*o+l)*4;this.splatData[y]=x,this.splatData[y+1]=_,this.splatData[y+2]=g,this.splatData[y+3]=0}this.splat=new hs(this.splatData,o,o,Je),this.splat.magFilter=Ee,this.splat.minFilter=Ee,this.splat.needsUpdate=!0,this.blurSplatRegion(0,0,o,o,2);let a=new Ct({map:ne("leafy_grass_diff"),normalMap:ne("leafy_grass_nor"),roughness:1,metalness:0});this.uniforms={tGrass2:{value:ne("sparse_grass_diff")},tDry:{value:ne("withered_grass_diff")},tDirt:{value:ne("stony_dirt_path_diff")},tRock:{value:ne("aerial_rocks_02_diff")},tSand:{value:ne("coast_sand_01_diff")},tField:{value:ne("farm_soil_diff")},tSnow:{value:ne("snow_field_aerial_diff")},tSplat:{value:this.splat},uSnow:{value:0},uAutumn:{value:0},uSize:{value:t}},a.onBeforeCompile=c=>{Object.assign(c.uniforms,this.uniforms),c.vertexShader=c.vertexShader.replace("#include <common>",`#include <common>
varying vec2 vTerr;
varying float vUpN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vTerr = position.xz;
vUpN = normal.y;`),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D tGrass2, tDry, tDirt, tRock, tSand, tField, tSnow, tSplat;
uniform float uSnow, uAutumn, uSize;
varying vec2 vTerr; varying float vUpN;`).replace("#include <map_fragment>",`
vec2 tuv = vMapUv;
vec4 sp = texture2D(tSplat, vTerr / uSize + 0.5);
vec3 g1 = texture2D(map, tuv).rgb;
vec3 g2 = texture2D(tGrass2, tuv * 0.73 + 0.31).rgb;
float macro = texture2D(tGrass2, tuv * 0.043).g;
float mixG = smoothstep(0.35, 0.65, texture2D(tDry, tuv * 0.031 + 0.5).r);
vec3 grass = mix(g1, g2, mixG * 0.35) * vec3(0.95, 1.06, 0.82);
vec3 dry = texture2D(tDry, tuv).rgb;
grass = mix(grass, dry * vec3(1.05, 0.92, 0.7), uAutumn * 0.75);
grass *= mix(0.82, 1.18, macro);
float lum0 = dot(grass, vec3(0.3, 0.59, 0.11));
grass = mix(grass, vec3(lum0) * vec3(0.78, 1.12, 0.5), 0.55 * (1.0 - uAutumn));
vec3 col = grass;
col = mix(col, texture2D(tSand, tuv * 0.8).rgb, sp.b);
col = mix(col, texture2D(tDirt, tuv * 0.9).rgb * 0.95, sp.r);
col = mix(col, texture2D(tRock, tuv * 0.5).rgb, sp.g);
col = mix(col, texture2D(tField, tuv * 0.7).rgb, sp.a);
float sn = uSnow * smoothstep(0.55, 0.85, vUpN) * (0.75 + 0.25 * macro);
col = mix(col, texture2D(tSnow, tuv * 0.5).rgb * 1.05, clamp(sn, 0.0, 1.0));
diffuseColor.rgb *= col;
`)},this.material=a,this.mesh=new ee(i,a),this.mesh.receiveShadow=!0,this.mesh.castShadow=!1}paint(t,e,i,s,r,o,a="max",c=.25){let l=this.size,h=this.splatSize,u=Math.max(0,Math.floor((e-c+l/2)*Hn)),d=Math.min(h-1,Math.ceil((s+c+l/2)*Hn)),f=Math.max(0,Math.floor((i-c+l/2)*Hn)),x=Math.min(h-1,Math.ceil((r+c+l/2)*Hn));for(let _=f;_<=x;_++)for(let g=u;g<=d;g++){let p=g/Hn-l/2,b=_/Hn-l/2,S=Math.max(e-p,0,p-s),y=Math.max(i-b,0,b-r),U=Math.hypot(S,y),A=c>0?Math.max(0,1-U/c):U===0?1:0,D=(_*h+g)*4+t,R=o*A;a==="max"?this.splatData[D]=Math.max(this.splatData[D],R):a==="set"?this.splatData[D]=Math.round(this.splatData[D]*(1-A)+o*A):a==="add"&&(this.splatData[D]=Math.min(255,this.splatData[D]+R))}this.splat.needsUpdate=!0}blurSplatRegion(){}buildWater(){let t=this.size,e=new ue(t,t,1,1);e.rotateX(-Math.PI/2);let i=ne("water_nor");this.waterNor=i,i.repeat.set(t/3,t/3);let s=new Ct({color:3103338,roughness:.06,metalness:.15,normalMap:i,normalScale:new it(.6,.6),transparent:!0,opacity:.88});this.water=new ee(e,s),this.water.position.y=-.13,this.water.receiveShadow=!0}update(t){this.waterNor&&this.waterNor.offset.set(t*.012,t*.02)}};function ms(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new ae,l=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let x=0;x<f.count;++x)u.push(f.getX(x)+h);h+=n[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=vu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);let x=vu(f);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(x)}}return c}function vu(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){let h=n[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Se(o,e,i),c=0;for(let l=0;l<n.length;++l){let h=n[l];if(h.isInterleavedBufferAttribute){let u=c/e;for(let d=0,f=h.count;d<f;d++)for(let x=0;x<e;x++){let _=h.getComponent(d,x);a.setComponent(d+u,x,_)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var Ao=new $t,Mu=new Ce,Su=new sn,Fx=new C,Eu=new C;function wu(n){let t=n.index?n.toNonIndexed():n;for(let e of Object.keys(t.attributes))e!=="position"&&e!=="normal"&&e!=="uv"&&t.deleteAttribute(e);if(!t.attributes.uv){let e=t.attributes.position.count;t.setAttribute("uv",new Se(new Float32Array(e*2),2))}return t.clearGroups(),t}function Io(n,t,e,i=0){let s=new yi(n,t,e),r=s.attributes.uv,o=[[e,t],[e,t],[n,e],[n,e],[n,t],[n,t]],a=i*.6180339%1;for(let c=0;c<6;c++)for(let l=0;l<4;l++){let h=c*4+l;r.setXY(h,r.getX(h)*o[c][0]+a,r.getY(h)*o[c][1]+a*.7)}return s}function Ro(n,t,e,i=12,s=!1){let r=new vi(n,t,e,i,1,s),o=r.attributes.uv,a=Math.PI*2*Math.max(n,t);for(let c=0;c<o.count;c++)o.setXY(c,o.getX(c)*a,o.getY(c)*e);return r}function de(n,t=20,e=1){let i=new Ht(n,t,Math.max(6,t/2),0,Math.PI*2,0,Math.PI/2);i.scale(1,e,1);let s=i.attributes.uv;for(let r=0;r<s.count;r++)s.setXY(r,s.getX(r)*Math.PI*2*n,s.getY(r)*n*1.6);return i}function Co(n,t=!1){let e=[],i=[],s=[],r=a=>{let c=a[0],l=a[1],h=a[2],u=new C().subVectors(l,c).normalize(),d=new C().subVectors(h,c).cross(new C().subVectors(l,c)).normalize().negate(),f=new C().crossVectors(d,u);for(let x=1;x<a.length-1;x++)for(let _ of[a[0],a[x],a[x+1]])e.push(_.x,_.y,_.z),i.push(d.x,d.y,d.z),s.push(_.dot(u),_.dot(f))};for(let a of n)r(a),t&&r(a.slice().reverse());let o=new ae;return o.setAttribute("position",new Ut(e,3)),o.setAttribute("normal",new Ut(i,3)),o.setAttribute("uv",new Ut(s,2)),o}var G=(n,t,e)=>new C(n,t,e);function Tu(n,t,e,i=.06){let s=-n/2-i,r=n/2+i,o=-t/2-i,a=t/2+i,c=Co([[G(s,0,a),G(r,0,a),G(r,e,0),G(s,e,0)],[G(r,0,o),G(s,0,o),G(s,e,0),G(r,e,0)]],!0),l=-n/2,h=n/2,u=t/2,d=Co([[G(h,0,u),G(h,0,-u),G(h,e*(u/(u+i)),0)],[G(l,0,-u),G(l,0,u),G(l,e*(u/(u+i)),0)]]);return{roof:c,gable:d}}function Au(n,t,e,i=.08){let s=-n/2-i,r=n/2+i,o=-t/2-i,a=t/2+i;if(n>=t){let l=(n-t)/2;return Co([[G(s,0,a),G(r,0,a),G(l,e,0),G(-l,e,0)],[G(r,0,o),G(s,0,o),G(-l,e,0),G(l,e,0)],[G(r,0,a),G(r,0,o),G(l,e,0)],[G(s,0,o),G(s,0,a),G(-l,e,0)]].map(bu),!0)}let c=(t-n)/2;return Co([[G(r,0,a),G(r,0,o),G(0,e,-c),G(0,e,c)],[G(s,0,o),G(s,0,a),G(0,e,c),G(0,e,-c)],[G(s,0,a),G(r,0,a),G(0,e,c)],[G(r,0,o),G(s,0,o),G(0,e,-c)]].map(bu),!0)}function bu(n){let t=[];for(let e of n)t.some(i=>i.distanceTo(e)<1e-5)||t.push(e);return t}function Ox(n,t,e=!0){let i=new Js,s=n/2,r=t-s*(e?1.15:1);return i.moveTo(-s,0),i.lineTo(s,0),i.lineTo(s,r),e?(i.quadraticCurveTo(s,t-s*.25,0,t),i.quadraticCurveTo(-s,t-s*.25,-s,r)):i.absarc(0,r,s,0,Math.PI,!1),i.lineTo(-s,0),i}function Bx(n,t,e=!0,i=.015){return new co(Ox(n,t,e),{depth:i,bevelEnabled:!1,curveSegments:8})}var Ne=class{constructor(){this.parts=new Map,this.extra=[]}add(t,e,i=0,s=0,r=0,o=0,a=0,c=0,l=1,h=1,u=1){Su.set(a,o,c,"YXZ"),Mu.setFromEuler(Su),Ao.compose(Fx.set(i,s,r),Mu,Eu.set(l,h,u));let d=wu(t).applyMatrix4(Ao);return this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(d),d}box(t,e,i,s,r,o,a,c=0,l=0){return this.add(Io(r,o,a,l+e*3.1+s*1.7),t,e,i+o/2,s,c)}cyl(t,e,i,s,r,o,a,c=10,l=0,h=0,u=0){return this.add(Ro(r,o,a,c),t,e,i+a/2,s,u,l,h)}beam(t,e,i,s,r=6){let o=new C().subVectors(i,e),a=o.length(),c=wu(Ro(s,s,a,r)),l=new Ce().setFromUnitVectors(new C(0,1,0),o.normalize());Ao.compose(new C().addVectors(e,i).multiplyScalar(.5),l,Eu.set(1,1,1)),c.applyMatrix4(Ao),this.parts.has(t)||this.parts.set(t,[]),this.parts.get(t).push(c)}arch(t,e,i,s,r,o,a,c=!0){let l=Bx(o,a,c),h=0;return e==="+x"?h=Math.PI/2:e==="-z"?h=Math.PI:e==="-x"&&(h=-Math.PI/2),this.add(l,t,i,s,r,h)}rect(t,e,i,s,r,o,a,c=.02){return e==="+z"||e==="-z"?this.box(t,i,s,r,o,a,c):this.box(t,i,s,r,c,a,o)}mesh(t){this.extra.push(t)}build(t=!0){let e=new We;for(let[i,s]of this.parts){let r=ms(s,!1);if(!r)continue;r.computeBoundingSphere();let o=new ee(r,i);o.castShadow=t,o.receiveShadow=!0,e.add(o)}for(let i of this.extra)e.add(i);return e}};function ol(n){let t=n>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function zx(n){let t=n.index?n.toNonIndexed():n;for(let e of Object.keys(t.attributes))["position","normal","uv"].includes(e)||t.deleteAttribute(e);return t}function Ai(n,t,e,i){let s=new C().subVectors(t,n),r=s.length(),o=zx(Ro(i,e,r,6,!0)),a=new Ce().setFromUnitVectors(new C(0,1,0),s.clone().normalize());return o.applyMatrix4(new $t().compose(new C().addVectors(n,t).multiplyScalar(.5),a,new C(1,1,1))),o}function Ru(n,t,e,i=.35,s=3,r){let o=[],a=[],c=[],l=new C;for(let u of n){let d=t*(.8+r()*.4),f=r()*Math.PI;for(let x=0;x<s;x++){let _=f+x*Math.PI/s,g=(r()-.5)*.6,p=new C(Math.cos(_),0,Math.sin(_)),b=new C(-Math.sin(_)*g,1,Math.cos(_)*g).normalize(),y=[[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,1,0,1]].map(([U,A,D,R])=>({p:u.clone().addScaledVector(p,U*d/2).addScaledVector(b,A*d/2),uv:[D,R]}));for(let U of[0,1,2,0,2,3]){let A=y[U];o.push(A.p.x,A.p.y,A.p.z),l.subVectors(A.p,e).normalize(),l.y+=i,l.normalize(),a.push(l.x,l.y,l.z),c.push(A.uv[0],A.uv[1])}}}let h=new ae;return h.setAttribute("position",new Ut(o,3)),h.setAttribute("normal",new Ut(a,3)),h.setAttribute("uv",new Ut(c,2)),h}function kx(n){let t=ol(n),e=[Ai(new C(0,0,0),new C(0,.75,0),.075,.05)],i=new C(0,1.1,0);for(let r=0;r<5;r++){let o=r/5*Math.PI*2+t(),a=new C(Math.cos(o)*.38,.95+t()*.35,Math.sin(o)*.38);e.push(Ai(new C(0,.6+t()*.15,0),a,.035,.012)),e.push(Ai(a,a.clone().add(new C(Math.cos(o+.8)*.15,.15,Math.sin(o+.8)*.15)),.012,.005))}e.push(Ai(new C(0,.7,0),new C(.05,1.45,-.03),.04,.012));let s=[];for(let r=0;r<17;r++){let o=t()*Math.PI*2,a=.15+t()*.33;s.push(new C(Math.cos(o)*a,.92+t()*.6-a*.3,Math.sin(o)*a))}return s.push(new C(0,1.48,0)),{trunk:ms(e),leaves:Ru(s,.5,i,.4,3,t)}}function Hx(n){let t=ol(n),e=[Ai(new C(0,0,0),new C(0,2.1,0),.05,.012)];for(let r=0;r<9;r++){let o=.4+r*.17,a=t()*Math.PI*2;e.push(Ai(new C(0,o,0),new C(Math.cos(a)*.12,o+.25,Math.sin(a)*.12),.014,.004))}let i=[];for(let r=0;r<13;r++){let o=.45+r*.12,a=.13*Math.sin(Math.min(1,(o-.3)/1.7)*Math.PI)+.03,c=t()*Math.PI*2;i.push(new C(Math.cos(c)*a*.6,o,Math.sin(c)*a*.6))}let s=new C(0,1.2,0);return{trunk:ms(e),leaves:Ru(i,.4,s,.2,3,t)}}function Vx(n){let t=ol(n),e=[Ai(new C(0,0,0),new C(0,1.95,0),.06,.01)],i=[],s=[],r=[],o=(l,h,u,d)=>{i.push(l.x,l.y,l.z),s.push(h.x,h.y,h.z),r.push(u,d)},a=9;for(let l=0;l<a;l++){let h=l/(a-1),u=.32+h*1.5,d=.62*Math.pow(1-h,.85)+.1,f=l===a-1?4:7,x=t()*Math.PI*2;for(let _=0;_<f;_++){let g=x+_/f*Math.PI*2+(t()-.5)*.3,p=l===a-1?1.4:-.28-t()*.15,b=new C(Math.cos(g),p,Math.sin(g)).normalize().multiplyScalar(d),S=new C(-Math.sin(g),0,Math.cos(g)).multiplyScalar(d*.36),y=new C(0,u,0),U=y.clone().add(b),A=new C(Math.cos(g)*.55,.85,Math.sin(g)*.55).normalize(),D=y.clone().sub(S),R=U.clone().sub(S),E=U.clone().add(S),v=y.clone().add(S);o(D,A,0,0),o(R,A,1,0),o(E,A,1,1),o(D,A,0,0),o(E,A,1,1),o(v,A,0,1)}}let c=new ae;return c.setAttribute("position",new Ut(i,3)),c.setAttribute("normal",new Ut(s,3)),c.setAttribute("uv",new Ut(r,2)),{trunk:ms(e),leaves:c}}var Cu={value:0};function Iu(n){return n.onBeforeCompile=t=>{t.uniforms.uTime=Cu,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 ip = vec3(instanceMatrix[3][0], 0.0, instanceMatrix[3][2]);
#else
  vec3 ip = vec3(0.0);
#endif
  float sway = sin(uTime * 1.3 + ip.x * 0.7 + ip.z * 0.5) * 0.5 + sin(uTime * 2.7 + ip.x * 1.9) * 0.25;
  transformed.x += sway * 0.025 * position.y;
  transformed.z += sway * 0.018 * position.y;`),t.fragmentShader=t.fragmentShader.replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
  normal = normalize( vNormal );`)},n}var Po=class{constructor(t,e){this.scene=t,this.N=e,this.types={},this.leafMats={};let i=s=>Iu(new Ct({map:s,alphaTest:.45,side:ve,roughness:.85}));this.leafMats.oak=i(ne("foliage_green")),this.leafMats.poplar=i(ne("foliage_green")),this.leafMats.pine=i(ne("pine_card")),this.barkMat=m.bark,this.geos={1:kx(11),2:Vx(23),3:Hx(37)},this.kindName={1:"oak",2:"pine",3:"poplar"}}build(t){for(let c of Object.values(this.types))this.scene.remove(c.trunk),this.scene.remove(c.leaves);this.types={},this.byKey=new Map;let e={1:[],2:[],3:[]};for(let c of t)e[c.kind].push(c);let i=new $t,s=new Ce,r=new C,o=new C,a=new C(0,1,0);for(let c of[1,2,3]){let l=e[c];if(!l.length)continue;let h=this.geos[c],u=new si(h.trunk,this.barkMat,l.length),d=new si(h.leaves,this.leafMats[this.kindName[c]],l.length);l.forEach((f,x)=>{s.setFromAxisAngle(a,f.r),i.compose(o.set(f.x,f.y,f.z),s,r.set(f.s,f.s*(.9+f.r%.2),f.s)),u.setMatrixAt(x,i),d.setMatrixAt(x,i),f.key!==void 0&&this.byKey.set(f.key,{k:c,n:x,m:i.clone()})});for(let f of[u,d])f.castShadow=!0,f.receiveShadow=!0,f.instanceMatrix.needsUpdate=!0,f.computeBoundingSphere(),this.scene.add(f);this.types[c]={trunk:u,leaves:d}}}hide(t){let e=this.byKey.get(t);if(!e)return;let i=this.types[e.k],s=new $t().makeScale(0,0,0);i.trunk.setMatrixAt(e.n,s),i.leaves.setMatrixAt(e.n,s),i.trunk.instanceMatrix.needsUpdate=!0,i.leaves.instanceMatrix.needsUpdate=!0,this.byKey.delete(t)}setSeason(t){let e=t===0?ne("foliage_spring"):t===2?ne("foliage_autumn"):ne("foliage_green");this.leafMats.oak.map=e,this.leafMats.oak.needsUpdate=!0,this.leafMats.poplar.map=t===2?ne("foliage_autumn"):t===0?ne("foliage_spring"):ne("foliage_green"),this.leafMats.poplar.needsUpdate=!0,this.leafMats.pine.map=t===3?ne("pine_card_snow"):ne("pine_card"),this.leafMats.pine.needsUpdate=!0;for(let i of[1,3])this.types[i]&&(this.types[i].leaves.visible=t!==3)}update(t){Cu.value=t}};function Pu(n){let t=[],e=[],i=[];for(let h=0;h<2;h++){let u=h*Math.PI/2,d=[Math.cos(u),Math.sin(u)],f=[[-1,0,0,0],[1,0,1,0],[1,1,1,1],[-1,1,0,1]];for(let x of[0,1,2,0,2,3]){let[_,g,p,b]=f[x];t.push(d[0]*_*.14,g*.09,d[1]*_*.14),e.push(0,1,0),i.push(p,b)}}let s=new ae;s.setAttribute("position",new Ut(t,3)),s.setAttribute("normal",new Ut(e,3)),s.setAttribute("uv",new Ut(i,2));let r=Iu(new Ct({map:ne("grass_card"),alphaTest:.4,side:ve,roughness:1})),o=new si(s,r,n.length),a=new $t,c=new Ce,l=new C(0,1,0);return n.forEach((h,u)=>{c.setFromAxisAngle(l,h.r),a.compose(new C(h.x,h.y,h.z),c,new C(h.s,h.s,h.s)),o.setMatrixAt(u,a)}),o.receiveShadow=!0,o.instanceMatrix.needsUpdate=!0,o.computeBoundingSphere(),o}function oi(n){let t=n*2654435761>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function on(n,t,e,i,s,r,o,a=!0){a?n.arch(m.dark,t,e,i,s,r,o,!0):n.rect(m.dark,t,e,i,s,r,o,.012);let c=.012;t==="+z"?(n.box(m.woodDark,e-r/2-c/2,i,s,c,o*.8,.025),n.box(m.woodDark,e+r/2+c/2,i,s,c,o*.8,.025)):t==="+x"&&(n.box(m.woodDark,e,i,s-r/2-c/2,.025,o*.8,c),n.box(m.woodDark,e,i,s+r/2+c/2,.025,o*.8,c)),n.box(m.stoneCut,t==="+z"?e:e+.02,i-.005,t==="+z"?s+.02:s,t==="+z"?r+.06:.05,.012,t==="+z"?.05:r+.06)}function ge(n,t,e,i,s,r,o,a=m.woodDark){n.rect(m.darkBlue,t,e,i,s,r,o,.012);let c=.012;if(t==="+z"||t==="-z"){let l=s+(t==="+z"?.01:-.01);n.box(a,e,i-c,l,r+.03,c,.03),n.box(a,e,i+o,l,r+.03,c,.02),n.box(a,e,i,l+(t==="+z"?.006:-.006),c*.6,o,.012),n.box(a,e,i+o/2,l+(t==="+z"?.006:-.006),r,c*.6,.012)}else{let l=e+(t==="+x"?.01:-.01);n.box(a,l,i-c,s,.03,c,r+.03),n.box(a,l,i+o,s,.02,c,r+.03),n.box(a,l+(t==="+x"?.006:-.006),i,s,.012,o,c*.6),n.box(a,l+(t==="+x"?.006:-.006),i+o/2,s,.012,c*.6,r)}}function er(n,t,e,i,s,r,o,a=m.roof,c=m.plaster,l=.07,h=!1){let{roof:u,gable:d}=Tu(h?r:s,h?s:r,o,l),f=h?Math.PI/2:0;n.add(u,a,t,e,i,f),n.add(d,c,t,e,i,f)}function ai(n,t,e,i,s,r,o,a=m.roof,c=.08){n.add(Au(s,r,o,c),a,t,e,i)}function Ri(n,t,e,i=3,s=.32,r=0){let o=Math.cos(r),a=Math.sin(r),c=0;for(let l=0;l<i;l++)for(let h=0;h<i-l;h++){let u=(h-(i-l-1)/2)*.075,d=.035+l*.064,f=t+o*u,x=e-a*u;n.cyl(m.bark,f,d-.035,x,.035,.035,s,8,Math.PI/2,0,r),n.add(new Pe(.034,8),m.logEnd,f+a*(s/2+.001),d,x+o*(s/2+.001),r),c++}}function Mn(n,t,e,i=1){n.cyl(m.sack,t,0,e,.035*i,.045*i,.07*i,8),n.add(new Ht(.036*i,8,6),m.sack,t,.07*i,e)}function nr(n,t,e){n.cyl(m.woodDark,t,0,e,.045,.045,.11,10),n.cyl(m.bronze,t,.02,e,.047,.047,.01,10),n.cyl(m.bronze,t,.08,e,.047,.047,.01,10)}function Du(n,t,e,i=0){n.box(m.wood,t,0,e,.09,.07,.09,i)}function gs(n,t,e){n.add(new Ht(.04,10,8),m.clay,t,.04,e,0,0,0,1,1.25,1),n.cyl(m.clay,t,.08,e,.018,.022,.025,8)}function Do(n,t,e,i,s){let r=new ke(i,1),o=r.attributes.position,a=oi(s),c=new Map;for(let l=0;l<o.count;l++){let h=`${o.getX(l).toFixed(4)},${o.getY(l).toFixed(4)},${o.getZ(l).toFixed(4)}`;c.has(h)||c.set(h,.75+a()*.45);let u=c.get(h);o.setXYZ(l,o.getX(l)*u,Math.max(-i*.2,o.getY(l)*u*.7),o.getZ(l)*u)}r.computeVertexNormals(),n.add(r,m.rock,t,i*.25,e,a()*6)}function Gx(n,t,e,i,s=0){n.cyl(i,t,0,e,.03,.045,.17,8,0,0,s),n.add(new Ht(.03,8,6),m.skin,t,.205,e),n.cyl(m.white,t,.225,e,.026,.03,.03,8)}var Lo={konak(n,t){let e=m.stoneRough;n.box(e,1,0,.06,1.88,.16,.06),n.box(e,.06,0,1,.06,.16,1.88),n.box(e,1.94,0,.6,.06,.16,1.08),n.box(e,1.94,0,1.75,.06,.16,.38),n.box(e,.45,0,1.94,.78,.16,.06),n.box(e,1.6,0,1.94,.74,.16,.06),n.box(m.roof,1,.16,.06,1.92,.025,.1);let i=.95,s=.85;n.box(m.stoneRough,i,0,s,1.3,.38,1),on(n,"+z",i,0,s+.505,.16,.3),ge(n,"+x",i+.655,.16,s-.25,.08,.1),ge(n,"+x",i+.655,.16,s+.25,.08,.1);let r=1.5,o=1.18,a=.38,c=.36;n.box(m.white,i,a,s,r,c,o);for(let f=0;f<6;f++){let x=i-r/2+.1+f*(r-.2)/5;n.beam(m.woodDark,G(x,.26,s+.5),G(x,a,s+o/2-.01),.012)}for(let f=0;f<4;f++){let x=s-o/2+.15+f*(o-.3)/3;n.beam(m.woodDark,G(i+.65,.26,x),G(i+r/2-.01,a,x),.012)}for(let f=0;f<=8;f++){let x=i-r/2+f*r/8;n.box(m.woodDark,x,a,s+o/2+.006,.022,c,.012)}for(let f=0;f<=6;f++){let x=s-o/2+f*o/6;n.box(m.woodDark,i+r/2+.006,a,x,.012,c,.022)}n.box(m.woodDark,i,a+.005,s+o/2+.008,r+.02,.022,.014),n.box(m.woodDark,i+r/2+.008,a+.005,s,.014,.022,o+.02);for(let f=0;f<4;f++)ge(n,"+z",i-r/2+.19+f*(r/4),a+.09,s+o/2+.008,.11,.17);for(let f=0;f<3;f++)ge(n,"+x",i+r/2+.008,a+.09,s-o/2+.2+f*(o/3),.11,.17);ai(n,i,a+c,s,r,o,.42,m.roof,.2),n.box(m.stoneRough,i-.35,a+c+.15,s-.2,.09,.42,.09);let l=new Ne;l.cyl(m.woodDark,0,0,0,.008,.012,.75,6),l.add(new Ht(.018,8,6),m.gold,0,.76,0);let h=l.build();h.position.set(.2,.16,1.75);let u=new ue(.34,.21,12,3);u.translate(.17,0,0);let d=new ee(u,m.flag);d.position.set(0,.62,0),d.castShadow=!0,h.add(d),n.mesh(h),t.flag=d,t.smoke=[G(i-.35,a+c+.6,s-.2)],gs(n,1.75,1.6),gs(n,1.68,1.68),nr(n,.3,.3)},ev(n,t,e,i){let s=i&&i.level||1;if(s===2)return Wx(n,t,e);if(s===3)return Xx(n,t,e);let r=oi(e),o=e%3,c=[m.plaster,m.plasterWarm,m.plasterLight][Math.floor(r()*3)],l=.5,h=.48;if(n.box(m.stoneRough,l,0,h,.8,.05,.7),o===0){n.box(c,l,.05,h,.72,.38,.62),n.box(m.soilRoof,l,.43,h,.8,.05,.7);for(let u=0;u<6;u++)n.cyl(m.woodDark,l-.3+u*.12,.42,h+.32,.013,.013,.08,6,Math.PI/2);n.cyl(m.stoneRough,l-.2,.47,h-.15,.035,.04,.07,8),on(n,"+z",l-.12,.05,h+.315,.13,.24,!1),ge(n,"+z",l+.17,.2,h+.315,.1,.1),ge(n,"+x",l+.365,.2,h,.1,.1),t.smoke=[G(l-.2,.56,h-.15)]}else if(o===1){n.box(m.stoneRough,l,.05,h,.66,.2,.56),n.box(m.white,l,.25,h+.02,.74,.22,.64);for(let u=0;u<=4;u++)n.box(m.woodDark,l-.37+u*.185,.25,h+.345,.018,.22,.012);ai(n,l,.47,h+.02,.74,.64,.24,m.roof,.11),on(n,"+z",l-.15,.05,h+.285,.12,.18,!1),ge(n,"+z",l+.1,.31,h+.345,.1,.11),ge(n,"+z",l-.15,.31,h+.345,.1,.11),ge(n,"+x",l+.375,.31,h,.1,.11),n.box(m.stoneRough,l+.2,.55,h-.1,.06,.16,.06),t.smoke=[G(l+.2,.75,h-.1)]}else{n.box(c,l-.08,.05,h-.05,.56,.36,.5),n.box(c,l+.25,.05,h+.12,.26,.3,.4),er(n,l-.08,.41,h-.05,.56,.5,.2,m.roof,c,.06),n.box(m.soilRoof,l+.25,.35,h+.12,.3,.04,.44);for(let u of[l-.33,l-.08])n.cyl(m.woodDark,u,.05,h+.32,.012,.012,.28,6);n.box(m.wood,l-.2,.33,h+.27,.34,.025,.15),on(n,"+z",l-.15,.05,h+.205,.12,.22,!1),ge(n,"+x",l+.385,.16,h+.12,.09,.09),ge(n,"+z",l+.25,.16,h+.325,.09,.09),t.smoke=[G(l-.08,.66,h-.05)]}r()<.5?Ri(n,.12,.88,2,.2,Math.PI/2):gs(n,.15,.9),r()<.4&&nr(n,.88,.9)},cesme(n){n.box(m.stoneCut,.5,0,.5,.7,.03,.7),n.box(m.stoneCut,.5,.03,.42,.42,.42,.2),n.arch(m.darkBlue,"+z",.5,.1,.521,.22,.28),n.arch(m.stoneCut,"+z",.5,.1,.53,.16,.2),n.cyl(m.bronze,.5,.17,.56,.008,.008,.05,6,Math.PI/2),ai(n,.5,.45,.42,.46,.24,.07,m.lead,.07),n.box(m.stoneCut,.5,.42,.42,.5,.03,.28),n.box(m.stoneCut,.5,.03,.66,.4,.09,.14),n.box(m.waterSmall,.5,.12,.66,.34,.005,.09),n.cyl(m.stoneCut,.18,.03,.75,.035,.045,.07,8),gs(n,.82,.72)},pazar(n,t,e){let i=oi(e);[[.45,.45],[1.45,.45],[.45,1.45],[1.45,1.45]].forEach(([r,o],a)=>{for(let[d,f]of[[-.28,-.22],[.28,-.22],[-.28,.22],[.28,.22]])n.cyl(m.woodDark,r+d,0,o+f,.012,.012,.36+(f<0?.06:0),6);let c=new ue(.66,.54,6,4);c.rotateX(-Math.PI/2);let l=c.attributes.position;for(let d=0;d<l.count;d++){let f=l.getX(d)/.33,x=l.getZ(d)/.27;l.setY(d,-x*.035-(1-f*f)*.025)}c.computeVertexNormals();let h=[["#a8322b","#efe6d2"],["#2f6b4a","#efe6d2"],["#2d4f86","#e9dcc0"],["#c8922c","#f2ead8"]][a],u=new Ct({map:yu(h[0],h[1]),roughness:.95,side:ve});n.add(c,u,r,.4,o),n.box(m.wood,r,0,o+.05,.5,.13,.22);for(let d=0;d<7;d++){let f=m.fruit[Math.floor(i()*m.fruit.length)];n.add(new Ht(.035,8,6),f,r-.18+d*.06,.155,o+.05+(i()-.5)*.1)}Mn(n,r-.2,o-.15),Mn(n,r+.22,o-.12,.9),a%2?nr(n,r+.3,o+.3):Du(n,r-.3,o+.3,.3)}),n.add(new ue(.4,.6),m.kilim,1,.004,1,.3,-Math.PI/2)},cami(n,t){n.box(m.stoneCut,1,0,1,1.96,.04,1.96);let e=.95,i=.8,s=1.15,r=.62;n.box(m.stoneCut,e,.04,i,s,r,s),n.box(m.stoneCut,e,.04+r,i,s+.04,.035,s+.04);for(let h=0;h<2;h++)for(let u=0;u<3;u++){let d=-.35+u*.35;n.arch(m.darkBlue,"+x",e+s/2+.002,.12+h*.26,i+d,.11,.18),h===1&&n.arch(m.darkBlue,"+z",e+d,.12+h*.26,i+s/2+.002,.11,.18)}n.cyl(m.stoneCut,e,.04+r+.035,i,.47,.5,.12,8);for(let h=0;h<8;h++){let u=h/8*Math.PI*2+Math.PI/8;n.box(m.darkBlue,e+Math.cos(u)*.475,.75,i+Math.sin(u)*.475,.06,.06,.06,-u)}let o=.04+r+.035+.12;n.add(de(.49,28,.82),m.lead,e,o,i),n.cyl(m.gold,e,o+.4,i,.012,.012,.12,6),n.add(new us(.025,.005,6,12,Math.PI*1.5),m.gold,e,o+.55,i);let a=i+s/2+.18;n.box(m.stoneCut,e,.39,a,s,.05,.36);for(let h=0;h<4;h++)n.cyl(m.stoneCut,e-s/2+.04+h*(s-.08)/3,.04,a+.14,.022,.026,.35,10);for(let h=0;h<3;h++)n.add(de(.15,16,.8),m.lead,e-.38+h*.38,.44,a);let c=1.72,l=.35;n.box(m.stoneCut,c,.04,l,.2,.3,.2),n.cyl(m.stoneCut,c,.34,l,.075,.085,1,12),n.cyl(m.stoneCut,c,1.3,l,.11,.08,.06,12),n.cyl(m.stoneCut,c,1.36,l,.11,.11,.02,12),n.cyl(m.stoneCut,c,1.36,l,.065,.065,.22,12),n.add(new Qe(.075,.38,12),m.lead,c,1.58+.19,l),n.cyl(m.gold,c,1.95,l,.006,.006,.08,6),n.cyl(m.stoneCut,.35,.04,1.62,.13,.14,.12,8),n.add(de(.15,12,.6),m.lead,.35,.3,1.62);for(let h=0;h<4;h++){let u=h/4*Math.PI*2+.4;n.cyl(m.stoneCut,.35+Math.cos(u)*.12,.16,1.62+Math.sin(u)*.12,.01,.01,.14,6)}},hamam(n,t){n.box(m.stoneRough,1,0,1,1.7,.36,1.5),n.box(m.stoneRough,1,.36,1,1.74,.03,1.54),n.box(m.stoneCut,.75,0,1.78,.36,.48,.1),n.arch(m.dark,"+z",.75,0,1.835,.16,.3),n.add(de(.42,24,.75),m.white,.85,.39,.8),n.add(de(.26,18,.75),m.white,1.45,.39,1.25),n.add(de(.24,18,.75),m.white,1.45,.39,.5),n.add(de(.2,16,.75),m.white,.45,.39,1.45);let e=oi(5);for(let i=0;i<18;i++){let s=e()*Math.PI*2,r=.12+e()*.22,o=.39+Math.sqrt(Math.max(0,.42*.42-r*r))*.75;n.add(new Ht(.014,6,4),m.glass,.85+Math.cos(s)*r,o,.8+Math.sin(s)*r)}n.box(m.stoneRough,1.65,.36,.2,.1,.32,.1);for(let i=0;i<2;i++)ge(n,"+x",1.856,.16,.6+i*.6,.08,.1);Ri(n,1.8,.12,3,.25,0),t.smoke=[G(1.65,.75,.2)]},oduncu(n,t){n.box(m.stoneRough,.4,0,.4,.56,.04,.5),n.box(m.wood,.4,.04,.4,.5,.3,.44),er(n,.4,.34,.4,.5,.44,.2,m.woodDark,m.wood,.07),on(n,"+z",.35,.04,.625,.11,.2,!1),Ri(n,.82,.48,4,.36,0),Ri(n,.45,.85,3,.36,Math.PI/2),n.cyl(m.bark,.85,0,.88,.06,.065,.09,10),n.add(new Pe(.058,10),m.logEnd,.85,.091,.88,0,-Math.PI/2),n.beam(m.wood,G(.85,.09,.88),G(.9,.2,.85),.007),n.box(m.bronze,.9,.19,.85,.05,.03,.01,.5)},tasocagi(n,t,e){Do(n,.25,.3,.2,e),Do(n,.55,.2,.16,e+3),Do(n,.2,.62,.14,e+7);for(let s=0;s<5;s++)n.box(m.stoneCut,.6+s%3*.1,Math.floor(s/3)*.07,.65+s%2*.12,.09,.07,.11,s*.2);let i=G(.72,.6,.42);n.beam(m.woodDark,G(.55,0,.3),i,.012),n.beam(m.woodDark,G(.9,0,.32),i,.012),n.beam(m.woodDark,G(.72,0,.62),i,.012),n.beam(m.rope,i,G(.72,.18,.42),.004),n.box(m.stoneCut,.72,.1,.42,.08,.08,.08),n.cyl(m.wood,.4,0,.88,.05,.05,.08,8)},avci(n,t){n.box(m.stoneRough,.4,0,.4,.5,.04,.46),n.box(m.wood,.4,.04,.4,.44,.28,.4),er(n,.4,.32,.4,.44,.4,.18,m.soilRoof,m.wood,.06,!0),on(n,"+z",.4,.04,.605,.11,.2,!1);for(let e of[.62,.92])n.cyl(m.woodDark,e,0,.82,.01,.01,.3,6);n.beam(m.woodDark,G(.62,.29,.82),G(.92,.29,.82),.008),n.add(new ue(.12,.16),m.leather,.7,.2,.82),n.add(new ue(.1,.14),m.leather,.84,.21,.82,.2),n.cyl(m.woodDark,.85,0,.3,.025,.03,.03,8)},tarla(n,t){let i=Math.round(12);for(let x=0;x<=i;x++){let _=x/i*3;for(let[g,p]of[[_,.02],[3-.02,_],[_,3-.02],[.02,_]])n.cyl(m.woodDark,g,0,p,.01,.012,.12,5)}n.cyl(m.woodDark,3*.75,0,3*.25,.008,.008,.3,5),n.beam(m.woodDark,G(3*.75-.08,.24,3*.25),G(3*.75+.08,.24,3*.25),.006),n.add(new Ht(.025,8,6),m.sack,3*.75,.31,3*.25),n.cyl(m.fabric[0],3*.75,.15,3*.25,.03,.04,.1,6);let s=new ae,r=[],o=[],a=[];for(let x=0;x<2;x++){let _=x*Math.PI/2+.4;for(let[g,p,b,S]of[[-1,0,0,0],[1,0,1,0],[1,1,1,1],[-1,0,0,0],[1,1,1,1],[-1,1,0,1]])r.push(Math.cos(_)*g*.11,p*.16,Math.sin(_)*g*.11),o.push(0,1,0),a.push(b,S)}s.setAttribute("position",new Ut(r,3)),s.setAttribute("normal",new Ut(o,3)),s.setAttribute("uv",new Ut(a,2));let c=new Ct({map:ne("wheat_green"),alphaTest:.4,side:ve,roughness:.9}),l=15,h=new si(s,c,l*l);h.castShadow=!0,h.receiveShadow=!0;let u=oi(9),d=[],f=(3-.2)/l;for(let x=0;x<l;x++)for(let _=0;_<l;_++)d.push([.12+_*f+(u()-.5)*.04,.12+x*f+(u()-.5)*.04,u()*3]);t.crops={im:h,base:d,mat:c,last:-1},n.mesh(h)},agil(n,t){let e=[G(.05,0,.05),G(1.95,0,.05),G(1.95,0,1.95),G(.05,0,1.95),G(.05,0,.05)];for(let r=0;r<4;r++){let o=e[r],a=e[r+1];for(let c=0;c<=7;c++){let l=o.clone().lerp(a,c/7);n.cyl(m.woodDark,l.x,0,l.z,.011,.013,.16,5)}r===2?(n.beam(m.wood,G(o.x,.08,o.z),G(1.2,.08,o.z),.008),n.beam(m.wood,G(o.x,.14,o.z),G(1.2,.14,o.z),.008),n.beam(m.wood,G(.8,.08,o.z),G(a.x,.08,o.z),.008),n.beam(m.wood,G(.8,.14,o.z),G(a.x,.14,o.z),.008)):(n.beam(m.wood,G(o.x,.08,o.z),G(a.x,.08,a.z),.008),n.beam(m.wood,G(o.x,.14,o.z),G(a.x,.14,a.z),.008))}n.box(m.wood,.5,0,.35,.75,.24,.04),n.box(m.wood,.14,0,.55,.04,.22,.4);for(let r of[.15,.85])n.cyl(m.woodDark,r,0,.75,.012,.012,.2,6);n.add(Io(.84,.03,.55),m.woodDark,.5,.23,.55,0,.18),n.box(m.wood,1.5,0,.4,.3,.05,.08);let i=[],s=oi(3);for(let r=0;r<7;r++){let o=new Ne;o.add(new Ht(.06,10,8),m.wool,0,.075,0,0,0,0,1.35,.85,.9),o.add(new Ht(.028,8,6),m.woolDark,.085,.09,0,0,0,0,1.3,1,.9);for(let[c,l]of[[.045,.03],[.045,-.03],[-.045,.03],[-.045,-.03]])o.cyl(m.woolDark,c,0,l,.008,.008,.05,4);let a=o.build();a.position.set(.5+s()*1.2,0,.9+s()*.8),a.rotation.y=s()*6,a.userData={tx:a.position.x,tz:a.position.z,wait:s()*3},i.push(a),n.mesh(a)}t.sheep=i},degirmen(n,t){n.cyl(m.stoneRough,.5,0,.48,.22,.26,.62,14),n.add(new Qe(.27,.26,14),m.woodDark,.5,.62+.13,.48),on(n,"+z",.5,0,.735,.1,.2,!0),ge(n,"+x",.735,.35,.48,.06,.08),Mn(n,.2,.85),Mn(n,.3,.88,.9),Mn(n,.82,.82);let e=new We,i=new Ne;i.cyl(m.woodDark,0,0,0,.03,.03,.08,8,Math.PI/2);for(let r=0;r<6;r++){let o=r/6*Math.PI*2,a=G(Math.cos(o)*.42,Math.sin(o)*.42,.04);i.beam(m.woodDark,G(0,0,.04),a,.008);let c=G(-Math.sin(o),Math.cos(o),0),l=G(Math.cos(o)*.12,Math.sin(o)*.12,.045),h=a.clone().setZ(.045),u=[l,h,h.clone().addScaledVector(c,.09),l.clone().addScaledVector(c,.07)],d=new ae().setFromPoints([u[0],u[1],u[2],u[0],u[2],u[3]]);d.setAttribute("uv",new Ut([0,0,1,0,1,1,0,0,1,1,0,1],2)),d.computeVertexNormals(),i.add(d,m.cloth)}let s=i.build();e.add(s),e.position.set(.5,.6,.76),n.mesh(e),t.sails=e},firin(n,t){n.box(m.stoneRough,.45,0,.45,.66,.04,.6),n.box(m.plasterWarm,.4,.04,.45,.56,.32,.5),n.box(m.soilRoof,.4,.36,.45,.62,.04,.56),on(n,"+z",.28,.04,.705,.11,.21,!1),n.add(de(.17,16,.85),m.plaster,.78,.04,.55),n.arch(m.dark,"+z",.78,.04,.715,.09,.09,!1);let e=new ee(new Pe(.035,10),m.glow);e.position.set(.78,.075,.72),n.mesh(e),t.glow=e,n.cyl(m.stoneRough,.6,.36,.3,.035,.04,.22,8),ge(n,"+z",.5,.18,.705,.09,.09),Ri(n,.85,.2,3,.22,Math.PI/2);for(let i=0;i<3;i++)n.add(new Ht(.03,8,6),m.logEnd,.18+i*.07,.025,.85,0,0,0,1.3,.6,1);t.smoke=[G(.6,.6,.3)]},kilimci(n,t){n.box(m.stoneRough,.42,0,.4,.62,.04,.55),n.box(m.plasterLight,.42,.04,.4,.56,.34,.48),ai(n,.42,.38,.4,.56,.48,.2,m.roof,.09),on(n,"+z",.3,.04,.645,.11,.22,!1),ge(n,"+z",.55,.18,.645,.09,.1);for(let e of[.62,.95])n.cyl(m.woodDark,e,0,.85,.011,.011,.36,6);n.beam(m.woodDark,G(.62,.35,.85),G(.95,.35,.85),.01),n.beam(m.woodDark,G(.62,.06,.85),G(.95,.06,.85),.01),n.add(new ue(.3,.27),m.kilim,.785,.205,.85),n.cyl(m.woodDark,.85,0,.12,.008,.008,.3,5),n.beam(m.rope,G(.85,.28,.12),G(.75,.3,.12),.003),n.add(new ue(.2,.32),m.kilim,.88,.16,.17,Math.PI/2)},ambar(n,t){n.box(m.stoneRough,.5,0,.47,.76,.1,.66),n.box(m.wood,.5,.1,.47,.72,.36,.62);for(let e=0;e<=4;e++)n.box(m.woodDark,.14+e*.18,.1,.785,.022,.36,.012);er(n,.5,.46,.47,.72,.62,.26,m.roof,m.wood,.07),n.box(m.woodDark,.5,.1,.785,.24,.26,.02),n.box(m.dark,.5,.1,.788,.008,.26,.02),Mn(n,.15,.9),Mn(n,.24,.9),Mn(n,.85,.88),nr(n,.92,.2)},kervansaray(n,t){let e=m.stoneCut,i=.22,s=.46;n.box(e,1,0,.12+i/2-.11,1.9,s,i),n.box(e,1,0,1.88-i/2+.11,1.9,s,i),n.box(e,.12+i/2-.11,0,1,i,s,1.9-2*i),n.box(e,1.88-i/2+.11,0,1,i,s,1.9-2*i),n.box(m.soilRoof,1,s,1,1.94,.03,1.94),n.box(m.stoneGrey,1,0,1,1.44,.015,1.44),n.box(e,1,.015,1,.3,.32,.3),n.add(de(.15,16,.8),m.lead,1,.335,1);for(let[o,a]of[[.05,.05],[1.95,.05],[.05,1.95],[1.95,1.95]])n.cyl(e,o,0,a,.1,.12,.54,10),n.add(de(.1,10,.7),e,o,.54,a);for(let o=0;o<3;o++)n.box(e,1.95,0,.45+o*.55,.09,.42,.12),n.box(e,.45+o*.55,0,.05,.12,.42,.09);n.box(e,1,0,1.94,.62,.72,.14),n.box(m.stoneGrey,1,0,2.012,.5,.64,.005),n.arch(m.dark,"+z",1,0,2.015,.22,.42),n.arch(m.stoneGrey,"+z",1,0,2.016,.34,.58),n.arch(m.dark,"+z",1,0,2.02,.22,.42);for(let o=0;o<5;o++)n.box(m.stoneCut,.78+o*.11,.62,2.015,.05,.05,.015);for(let o=0;o<4;o++)ge(n,"+x",2.005,.2,.3+o*.42,.04,.12);let r=(o,a,c)=>{let l=new Ne;l.add(new Ht(.1,12,8),m.camel,0,.26,0,0,0,0,1.5,.75,.8),l.add(new Ht(.07,10,8),m.camel,-.02,.33,0,0,0,0,1.1,.9,.8),l.beam(m.camel,G(.13,.27,0),G(.22,.42,0),.025),l.add(new Ht(.035,8,6),m.camel,.25,.43,0,0,0,0,1.6,.9,.9);for(let[u,d]of[[.09,.04],[.09,-.04],[-.09,.04],[-.09,-.04]])l.cyl(m.camel,u,0,d,.012,.014,.22,5);l.box(m.kilim,-.02,.32,0,.12,.02,.17),Mn(l,-.02,.1,.8);let h=l.build();h.position.set(o,0,a),h.rotation.y=c,n.mesh(h)};r(.35,2.25,.3),r(1.75,2.3,2.6)}},al={cami:1.5,kervansaray:1.5};function cl(n,t,e){let i=new Ne,s={},r=Lo[n];r?r(i,s,t||1,e||{}):(console.warn("model yok",n),Lo.depo&&Lo.depo(i,s,t));let o=i.build();if(o.userData.dyn=s,al[n]){let a=new We;for(;o.children.length;)a.add(o.children[0]);a.scale.setScalar(al[n]),o.add(a),s.smoke&&(s.smoke=s.smoke.map(c=>c.clone().multiplyScalar(al[n])))}return o}function Lu(n){Object.assign(Lo,n)}var Uu={rnd:oi,door:on,win:ge,roofGable:er,roofHip:ai,logPile:Ri,sack:Mn,barrel:nr,crate:Du,jar:gs,rock:Do,person:Gx};function Wx(n,t,e){let i=oi(e),s=.46,r=.42;n.box(m.stoneRough,.5,0,.5,.9,.04,.9),n.box(m.plaster,.06,.04,.6,.06,.2,.75),n.box(m.plaster,.3,.04,.95,.5,.2,.06),n.box(m.roof,.3,.24,.95,.54,.025,.09),n.box(m.roof,.06,.24,.6,.09,.025,.79),n.box(m.woodDark,.7,.04,.955,.16,.18,.03),n.box(m.stoneRough,s,.04,r,.6,.24,.52),n.box(m.white,s+.02,.28,r+.03,.7,.24,.6);for(let o=0;o<=4;o++)n.box(m.woodDark,s-.33+o*.175,.28,r+.335,.018,.24,.012);for(let o=0;o<4;o++)n.beam(m.woodDark,G(s-.28+o*.18,.2,r+.27),G(s-.28+o*.18,.28,r+.32),.01);ai(n,s+.02,.52,r+.03,.7,.6,.24,m.roof,.12),on(n,"+z",s-.15,.04,r+.265,.12,.18,!0),ge(n,"+z",s+.1,.34,r+.337,.1,.12),ge(n,"+z",s-.15,.34,r+.337,.1,.12),ge(n,"+x",s+.375,.34,r+.03,.1,.12),n.box(m.stoneRough,s+.2,.6,r-.1,.06,.16,.06),t.smoke=[G(s+.2,.8,r-.1)],n.cyl(m.stoneRough,.25,.04,.78,.05,.05,.07,8);for(let o of[.6,.85])n.cyl(m.woodDark,o,.04,.78,.008,.008,.26,5);n.add(new ue(.3,.2).rotateX(-Math.PI/2),m.fabric[1],.72,.3,.78),i()<.5&&gs(n,.2,.62)}function Xx(n,t,e){n.box(m.stoneCut,.5,0,.5,.96,.04,.96),n.box(m.stoneRough,.04,.04,.55,.06,.24,.85),n.box(m.stoneRough,.25,.04,.96,.42,.24,.06),n.box(m.stoneRough,.88,.04,.96,.18,.24,.06),n.box(m.stoneCut,.62,.04,.96,.08,.32,.08),n.box(m.stoneCut,.78,.04,.96,.08,.32,.08),n.box(m.roof,.7,.36,.96,.26,.03,.12),n.box(m.stoneCut,.48,.04,.4,.72,.3,.6),n.box(m.white,.48+.03,.34,.4+.04,.82,.28,.7),n.box(m.white,.48-.12,.36,.4+.42,.3,.22,.12),ai(n,.48-.12,.58,.4+.42,.3,.12,.06,m.roof,.04);for(let r=0;r<3;r++)ge(n,"+z",.48-.21+r*.09,.42,.4+.481,.06,.12);for(let r=0;r<=5;r++)n.box(m.woodDark,.48-.38+r*.164,.34,.4+.392,.016,.28,.01);for(let r=0;r<2;r++)ge(n,"+z",.48+.12+r*.17,.42,.4+.392,.09,.14);for(let r=0;r<3;r++)ge(n,"+x",.48+.442,.42,.4-.2+r*.2,.09,.14);ge(n,"+x",.48+.362,.14,.4,.08,.1),on(n,"+z",.48+.15,.04,.4+.302,.13,.22,!0),ai(n,.48+.03,.62,.4+.04,.82,.7,.3,m.roof,.14),n.box(m.stoneCut,.48-.2,.75,.4-.15,.07,.2,.07),n.box(m.stoneCut,.48+.25,.75,.4-.1,.07,.2,.07),t.smoke=[G(.48-.2,.97,.4-.15)],n.cyl(m.bark,.2,.04,.8,.025,.035,.3,6),n.add(new Ht(.13,10,8),m.fabric[1],.2,.42,.8,0,0,0,1,.8,1),n.box(m.stoneCut,.45,.04,.82,.16,.04,.12),n.box(m.waterSmall,.45,.081,.82,.12,.004,.08)}function Nu(n){let t=n.w,e=n.h,i=new Ne;i.box(m.stoneRough,t/2,0,e/2,t*.8,.04,e*.8);let s=t>1?.7:.5,r=[[.12,.12],[t-.12,.12],[.12,e-.12],[t-.12,e-.12],[t/2,e-.08],[t-.08,e/2]];for(let[h,u]of r)i.cyl(m.woodDark,h,0,u,.012,.012,s,5);for(let h of[s*.45,s*.9])i.beam(m.wood,G(.12,h,e-.12),G(t-.12,h,e-.12),.01),i.beam(m.wood,G(t-.12,h,.12),G(t-.12,h,e-.12),.01);Ri(i,.15,e-.05,3,.25,Math.PI/2),i.box(m.stoneCut,t-.2,0,e+.02,.1,.07,.1),i.box(m.stoneCut,t-.08,0,e+.02,.1,.07,.1,.3);let o=i.build(),a=["cami","kervansaray","cesme","hamam"].includes(n.key)?m.stoneCut:["oduncu","avci","ambar"].includes(n.key)?m.wood:m.plaster,c=Io(t*.7,1,e*.6);c.translate(0,.5,0);let l=new ee(c,a);return l.position.set(t/2,.04,e/2),l.castShadow=!0,l.receiveShadow=!0,o.add(l),o.userData.wall=l,o.userData.wallH=t>1?.55:.38,o}var{rnd:ll,door:tn,win:qe,roofGable:He,roofHip:Ci,logPile:qx,sack:Yx,barrel:Fu,crate:Ou,jar:hl,rock:ul}=Uu;function dl(n,t,e,i,s=m.stoneCut,r=.06){n.box(s,t,.04,e,r*2.6,.25,r*2.6),n.cyl(s,t,.29,e,r,r*1.12,i,12),n.cyl(s,t,.29+i*.82,e,r*1.5,r*1.05,r*.8,12),n.cyl(s,t,.29+i*.82+r*.8,e,r*1.5,r*1.5,r*.25,12),n.add(new Qe(r,r*5,12),m.lead,t,.29+i+r*2.5,e),n.cyl(m.gold,t,.29+i+r*5,e,.005,.005,.06,5)}function Zx(n,t,e,i=1,s=null,r=Math.random){n.cyl(m.bark,t,0,e,.018*i,.026*i,.22*i,6);let o=m.treeLeaf||(m.treeLeaf=new Ct({color:6261301,roughness:.9}));for(let a=0;a<4;a++){let c=a/4*Math.PI*2+r();n.add(new ke(.09*i,1),o,t+Math.cos(c)*.06*i,.27*i+r()*.06*i,e+Math.sin(c)*.06*i)}if(n.add(new ke(.1*i,1),o,t,.36*i,e),s)for(let a=0;a<7;a++){let c=r()*Math.PI*2;n.add(new Ht(.016*i,6,5),s,t+Math.cos(c)*.12*i,.24*i+r()*.16*i,e+Math.sin(c)*.12*i)}}function $x(n){let t=new Ne,e=new Ct({color:n,roughness:.75});t.add(new Ht(.06,10,8),e,0,.13,0,0,0,0,1.7,.8,.8),t.beam(e,G(.08,.15,0),G(.13,.24,0),.022),t.add(new Ht(.025,8,6),e,.15,.25,0,0,0,0,1.7,.8,.8);for(let[i,s]of[[.07,.025],[.07,-.025],[-.07,.025],[-.07,-.025]])t.cyl(e,i,0,s,.008,.009,.11,5);return t.beam(m.woolDark,G(-.1,.15,0),G(-.13,.08,0),.008),t.build()}function Bu(n,t,e,i,s){let r=s==="okcu"?m.fabric[1]:s==="sipahi"?m.fabric[0]:m.fabric[2];n.cyl(r,t,.02,e,.02,.03,.13,6),n.add(new Ht(.02,6,5),m.skin,t,.165,e),n.cyl(m.white,t,.18,e,.018,.022,.03,6),s!=="okcu"&&n.beam(m.woodDark,G(t+.03,0,e),G(t+.03,.3,e),.004)}var Jx={kuyu(n){n.box(m.stoneRough,.5,0,.5,.5,.02,.5),n.cyl(m.stoneRough,.5,.02,.5,.13,.14,.13,12),n.add(new Pe(.11,12),m.waterSmall,.5,.12,.5,0,-Math.PI/2);for(let t of[.36,.64])n.cyl(m.woodDark,t,.02,.5,.012,.012,.32,5);n.beam(m.woodDark,G(.36,.3,.5),G(.64,.3,.5),.01),He(n,.5,.34,.5,.36,.2,.08,m.roof,m.wood,.03),n.beam(m.rope,G(.5,.3,.5),G(.5,.18,.5),.003),n.cyl(m.woodDark,.5,.14,.5,.02,.018,.04,6),n.cyl(m.woodDark,.72,.02,.62,.03,.025,.05,6)},imaret(n,t){n.box(m.stoneCut,1,0,1,1.9,.03,1.9),n.box(m.stoneCut,.55,.03,.75,.9,.32,1.2),n.box(m.stoneCut,1.35,.03,.55,.8,.3,.8);for(let i=0;i<3;i++)n.add(de(.14,14,.8),m.lead,.55,.35,.35+i*.4);for(let i=0;i<4;i++){let s=1.15+i%2*.4,r=.35+Math.floor(i/2)*.4;n.cyl(m.stoneCut,s,.33,r,.04,.05,.16,8),n.add(new Qe(.05,.08,8),m.lead,s,.53,r)}tn(n,"+z",.55,.03,1.355,.14,.24,!0),qe(n,"+x",1.005,.13,.75,.07,.1),n.add(new Ht(.1,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),m.bronze,1.35,.15,1.45),n.cyl(m.stoneRough,1.35,.03,1.45,.12,.13,.06,10);let e=new ee(new Pe(.04,8),m.glow);e.position.set(1.35,.06,1.585),n.mesh(e),t.glow=e;for(let i=0;i<3;i++)n.box(m.wood,1+i*.25,.03,1.7,.18,.07,.07);t.smoke=[G(1.15,.6,.35),G(1.55,.6,.75)]},subasi(n){n.box(m.stoneRough,.5,0,.5,.6,.36,.55),n.box(m.wood,.5,.36,.52,.66,.22,.62),n.box(m.woodDark,.5,.36,.84,.66,.02,.06);for(let t=0;t<5;t++)n.cyl(m.woodDark,.2+t*.15,.38,.86,.006,.006,.1,4);Ci(n,.5,.58,.52,.66,.62,.22,m.roof,.1),tn(n,"+z",.5,0,.775,.12,.22,!0),qe(n,"+x",.805,.42,.52,.08,.1);for(let t=0;t<3;t++)n.beam(m.woodDark,G(.12+t*.05,0,.92),G(.1+t*.05,.32,.9),.005);n.add(new Pe(.05,10),m.fabric[0],.88,.15,.85)},darussifa(n){let t=m.stoneCut;n.box(t,1,0,1,1.9,.03,1.9),n.box(t,1,.03,.3,1.7,.36,.4),n.box(t,.3,.03,1.1,.4,.36,1.2),n.box(t,1.7,.03,1.1,.4,.36,1.2);for(let e=0;e<6;e++)n.add(de(.1,12,.8),m.lead,.4+e*.24,.39,.3);for(let e=0;e<3;e++)n.add(de(.1,12,.8),m.lead,.3,.39,.75+e*.3),n.add(de(.1,12,.8),m.lead,1.7,.39,.75+e*.3);for(let e=0;e<5;e++)n.cyl(t,.6+e*.2,.03,.55,.018,.02,.3,8);n.box(t,1,.33,.6,.95,.04,.14),n.cyl(t,1,.03,1.15,.12,.14,.08,10),n.add(new Pe(.11,12),m.waterSmall,1,.115,1.15,0,-Math.PI/2),n.box(t,1,.03,1.82,.5,.5,.12),n.arch(m.dark,"+z",1,.03,1.885,.18,.34),n.box(t,.55,.03,1.8,.4,.28,.08),n.box(t,1.45,.03,1.8,.4,.28,.08),qe(n,"+x",1.905,.15,1,.07,.12),qe(n,"+x",1.905,.15,1.4,.07,.12)},bostan(n,t,e){let i=ll(e);for(let r=0;r<=8;r++)for(let[o,a]of[[r*.25,.03],[1.97,r*.25],[r*.25,1.97],[.03,r*.25]])n.cyl(m.woodDark,o,0,a,.006,.008,.1,4);let s=[new Ct({color:5212714,roughness:.9}),new Ct({color:6989882,roughness:.9})];for(let r=0;r<8;r++)for(let o=0;o<9;o++){let a=.18+o*.2,c=.2+r*.22;n.add(new ke(.045,0),s[(r+o)%2],a,.03,c,i()*3,0,0,1,.6,1),r%3===1&&o%2&&n.add(new Ht(.02,6,5),m.fruit[0],a+.03,.04,c),r%3===2&&o%3===0&&n.add(new Ht(.03,6,5),m.fruit[3],a,.03,c,0,0,0,1.3,.8,1)}n.cyl(m.stoneRough,1.75,0,.25,.07,.08,.08,8),n.cyl(m.woodDark,1.75,.08,.25,.025,.02,.05,6)},meyve(n,t,e){let i=ll(e);for(let s=0;s<3;s++)for(let r=0;r<3;r++)Zx(n,.33+r*.66,.33+s*.66,.9+i()*.3,m.fruit[(r+s)%2?0:2],i);for(let s=0;s<3;s++)n.box(m.wood,1.7+s*.08,0,1.85,.07,.06,.1);t.trees=!0},bag(n,t,e){let i=ll(e),s=new Ct({color:4923472,roughness:.4}),r=new Ct({color:6195756,roughness:.9});for(let o=0;o<6;o++){let a=.2+o*.32;for(let c=0;c<6;c++)n.cyl(m.woodDark,.15+c*.34,0,a,.008,.008,.2,4);n.beam(m.rope,G(.15,.18,a),G(1.85,.18,a),.002);for(let c=0;c<11;c++){let l=.2+c*.16;n.add(new ke(.06,0),r,l,.14,a,i()*3,0,0,1,.8,.6),c%2&&n.add(new Ht(.022,6,5),s,l,.09,a+.04,0,0,0,1,1.3,1)}}t.trees=!0},balikci(n){for(let[i,s]of[[.25,.25],[.65,.25],[.25,.6],[.65,.6]])n.cyl(m.woodDark,i,0,s,.015,.015,.12,5);n.box(m.wood,.45,.12,.42,.52,.03,.46),n.box(m.wood,.45,.15,.4,.44,.24,.36),He(n,.45,.39,.4,.44,.36,.16,m.soilRoof,m.wood,.06),tn(n,"+z",.45,.15,.585,.1,.18,!1);for(let i of[.7,.95])n.cyl(m.woodDark,i,0,.85,.008,.008,.25,4);n.beam(m.woodDark,G(.7,.24,.85),G(.95,.24,.85),.005);let t=new Ct({color:10134957,metalness:.4,roughness:.4});for(let i=0;i<5;i++)n.add(new Ht(.018,6,4),t,.73+i*.05,.2,.85,0,0,0,.6,2,.4);let e=new Ht(.16,12,6,0,Math.PI*2,Math.PI/2,Math.PI/2);n.add(e,m.woodDark,.25,.08,.88,.4,0,0,1.6,.5,.6),n.beam(m.wood,G(.05,.06,.95),G(.4,.1,.75),.006),hl(n,.85,.3)},arici(n,t,e){n.box(m.wood,.25,0,.25,.3,.22,.28),He(n,.25,.22,.25,.3,.28,.1,m.soilRoof,m.wood,.04);let i=new Ct({color:13214298,roughness:1});for(let s=0;s<8;s++){let r=.5+s%4*.13,o=.55+Math.floor(s/4)*.22;n.box(m.woodDark,r,0,o,.08,.04,.08),n.cyl(i,r,.04,o,.04,.045,.09,8,0,0,0),n.add(de(.04,8,.6),i,r,.13,o)}for(let s=0;s<4;s++)n.add(new Ht(.035,6,5),m.fruit[4],.15+s*.08,.02,.8)},mandira(n){n.box(m.stoneRough,.45,0,.42,.66,.04,.6),n.box(m.white,.45,.04,.42,.6,.32,.54),He(n,.45,.36,.42,.6,.54,.2,m.roof,m.white,.06),tn(n,"+z",.35,.04,.695,.11,.2,!1),qe(n,"+x",.755,.18,.42,.08,.08);let t=new Ct({color:15784070,roughness:.6});for(let e=0;e<5;e++)n.cyl(t,.62+e%3*.1,Math.floor(e/3)*.035,.85,.045,.045,.035,12);for(let e=0;e<3;e++)n.cyl(m.bronze,.15+e*.08,0,.85,.028,.03,.08,8)},pekmezhane(n,t){n.box(m.stoneRough,.4,0,.38,.6,.04,.55),n.box(m.plasterWarm,.4,.04,.38,.54,.3,.48),n.box(m.soilRoof,.4,.34,.38,.6,.04,.54),tn(n,"+z",.3,.04,.625,.1,.2,!1),n.cyl(m.stoneRough,.72,0,.78,.13,.14,.1,10),n.add(new Ht(.12,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),m.bronze,.72,.2,.78),n.add(new Pe(.11,12),new Ct({color:3805704,roughness:.2}),.72,.195,.78,0,-Math.PI/2);let e=new ee(new Pe(.035,8),m.glow);e.position.set(.72,.04,.925),n.mesh(e),t.glow=e;let i=new Ct({color:4923472,roughness:.5});for(let s=0;s<3;s++)n.cyl(m.sack,.15+s*.11,0,.85,.04,.035,.06,8),n.add(new Ht(.035,6,5),i,.15+s*.11,.06,.85,0,0,0,1,.5,1);t.smoke=[G(.72,.35,.78)]},kilocagi(n){let t=new Ct({color:9067066,roughness:1});n.add(new Pe(.3,16),new Ct({color:5913126,roughness:1}),.45,.005,.45,0,-Math.PI/2);for(let e=0;e<4;e++)n.add(new Ht(.08,8,6),t,.2+e*.18,.02,.85,0,0,0,1.2,.5,1);for(let e of[.2,.7])n.cyl(m.woodDark,e,0,.3,.01,.01,.28,5);n.beam(m.woodDark,G(.2,.27,.3),G(.7,.27,.3),.008),n.add(new ue(.5,.3).rotateX(-Math.PI/2+.2),m.leather,.45,.28,.4),n.cyl(m.woodDark,.8,0,.5,.06,.05,.08,8),n.beam(m.wood,G(.85,0,.6),G(.95,.25,.65),.006)},maden(n,t,e){ul(n,.7,.55,.42,e),ul(n,1.25,.45,.35,e+2),ul(n,.4,.95,.28,e+5),n.box(m.dark,1,0,.92,.26,.3,.08);for(let s of[.86,1.14])n.box(m.woodDark,s,0,.97,.04,.32,.04);n.box(m.woodDark,1,.3,.97,.34,.04,.05);for(let s of[.95,1.05])n.beam(m.bronze,G(s,.005,1),G(s,.005,1.8),.006);for(let s=0;s<7;s++)n.box(m.woodDark,1,0,1.05+s*.11,.16,.01,.03);n.box(m.woodDark,1,.02,1.55,.14,.08,.2);let i=new Ct({color:8010536,roughness:.9});for(let s=0;s<6;s++)n.add(new ke(.035,0),i,1+(s%3-1)*.04,.1,1.5+Math.floor(s/3)*.08);for(let s=0;s<8;s++)n.add(new ke(.05,0),i,1.5+s%4*.08,.02,1.6+Math.floor(s/4)*.1);n.box(m.wood,.45,0,1.55,.4,.28,.35),He(n,.45,.28,1.55,.4,.35,.14,m.woodDark,m.wood,.05)},komurcu(n,t){n.add(de(.24,16,.75),m.soilRoof,.4,0,.45);for(let i=0;i<4;i++){let s=i/4*Math.PI*2;n.box(m.dark,.4+Math.cos(s)*.2,.02,.45+Math.sin(s)*.2,.03,.03,.03)}qx(n,.8,.3,3,.25,0);let e=new Ct({color:1710618,roughness:.7});for(let i=0;i<9;i++)n.add(new ke(.035,0),e,.7+i%3*.06,.02+Math.floor(i/3)*.02,.8+i%2*.05);n.cyl(m.woodDark,.2,0,.85,.008,.008,.25,4),t.smoke=[G(.4,.2,.45)],t.alwaysSmoke=!0},dokumaci(n){n.box(m.stoneRough,.42,0,.4,.62,.04,.55),n.box(m.plasterLight,.42,.04,.4,.56,.32,.48),He(n,.42,.36,.4,.56,.48,.2,m.roof,m.plasterLight,.07),tn(n,"+z",.3,.04,.645,.11,.21,!1),qe(n,"+z",.55,.18,.645,.09,.1);for(let t of[.12,.92])n.cyl(m.woodDark,t,0,.85,.008,.008,.28,4);n.beam(m.rope,G(.12,.27,.85),G(.92,.27,.85),.002);for(let t=0;t<4;t++)n.add(new ue(.14,.16),m.fabric[t],.22+t*.19,.19,.85);n.cyl(m.woodDark,.85,0,.25,.06,.06,.02,10)},comlekci(n,t){n.box(m.stoneRough,.35,0,.35,.5,.04,.5),n.box(m.plasterWarm,.35,.04,.35,.44,.3,.42),n.box(m.soilRoof,.35,.34,.35,.5,.04,.48),tn(n,"+z",.3,.04,.565,.1,.2,!1);let e=new Ct({color:10246714,roughness:.9});n.add(de(.15,12,1.1),e,.78,0,.3),n.cyl(e,.78,.15,.3,.03,.04,.12,8);for(let i=0;i<8;i++)hl(n,.15+i%4*.1,.78+Math.floor(i/4)*.12);n.box(m.wood,.75,0,.75,.25,.1,.15),t.smoke=[G(.78,.3,.3)]},demirci(n,t){n.box(m.stoneRough,.5,0,.45,.8,.04,.7);for(let[s,r]of[[.15,.15],[.85,.15],[.15,.75],[.85,.75]])n.cyl(m.woodDark,s,.04,r,.015,.015,.34,5);He(n,.5,.38,.45,.76,.66,.18,m.roof,m.wood,.04),n.box(m.stoneRough,.5,.04,.2,.7,.28,.08),n.box(m.stoneRough,.3,.04,.35,.2,.14,.18);let e=new ee(new ue(.14,.1).rotateX(-Math.PI/2),m.glow);e.position.set(.3,.185,.35),n.mesh(e),t.glow=e,n.cyl(m.stoneRough,.3,.18,.28,.04,.06,.4,8);let i=new Ct({color:2894894,metalness:.8,roughness:.4});n.cyl(m.bark,.6,.04,.5,.04,.045,.08,8),n.box(i,.6,.12,.5,.12,.04,.05),n.box(i,.67,.13,.5,.04,.02,.03);for(let s=0;s<4;s++)n.beam(m.woodDark,G(.8+s*.03,.04,.9),G(.82+s*.03,.22,.92),.005);Fu(n,.15,.9),t.smoke=[G(.3,.62,.28)]},silahhane(n){n.box(m.stoneCut,1,0,.9,1.6,.04,1.3),n.box(m.stoneRough,1,.04,.75,1.4,.4,.9),He(n,1,.44,.75,1.4,.9,.3,m.roof,m.stoneRough,.08),tn(n,"+z",1,.04,1.205,.2,.3,!0);for(let t=0;t<3;t++)qe(n,"+x",1.705,.2,.45+t*.3,.06,.12);for(let t=0;t<8;t++)n.beam(m.woodDark,G(.4+t*.06,.04,1.42),G(.4+t*.06,.48,1.38),.005);n.beam(m.woodDark,G(.35,.3,1.4),G(.9,.3,1.4),.008);for(let t=0;t<4;t++)n.add(new vi(.06,.06,.01,12).rotateX(Math.PI/2),m.fabric[t%2?0:2],1.25+t*.13,.15,1.42),n.add(new Ht(.012,6,4),m.bronze,1.25+t*.13,.15,1.43);for(let t=0;t<3;t++)Ou(n,.3+t*.12,1.65,t*.3)},yayci(n){n.box(m.stoneRough,.42,0,.4,.6,.04,.52),n.box(m.wood,.42,.04,.4,.54,.3,.46),He(n,.42,.34,.4,.54,.46,.18,m.roof,m.wood,.07),tn(n,"+z",.3,.04,.635,.1,.2,!1);for(let t=0;t<4;t++){let e=new us(.08,.006,4,12,Math.PI*.9);n.add(e,m.woodDark,.6+t*.08,.2,.68,0,0,Math.PI/2+.05)}for(let t of[.15,.85])n.cyl(m.woodDark,t,0,.88,.008,.008,.25,4);n.beam(m.woodDark,G(.15,.24,.88),G(.85,.24,.88),.005);for(let t=0;t<3;t++)n.add(new ue(.12,.14),m.leather,.3+t*.2,.16,.88)},ahir(n,t){n.box(m.stoneRough,1,0,.5,1.7,.06,.6),n.box(m.wood,1,.06,.5,1.6,.3,.5),He(n,1,.36,.5,1.6,.5,.22,m.roof,m.wood,.08);for(let r=0;r<4;r++)n.box(m.dark,.5+r*.33,.06,.755,.14,.2,.01);let e=[G(.1,0,.9),G(1.9,0,.9),G(1.9,0,1.9),G(.1,0,1.9),G(.1,0,.9)];for(let r=0;r<4;r++){let o=e[r],a=e[r+1];for(let c=0;c<=6;c++){let l=o.clone().lerp(a,c/6);n.cyl(m.woodDark,l.x,0,l.z,.01,.012,.15,5)}n.beam(m.wood,G(o.x,.13,o.z),G(a.x,.13,a.z),.007),n.beam(m.wood,G(o.x,.07,o.z),G(a.x,.07,a.z),.007)}n.box(m.wood,1.5,0,1.2,.3,.06,.08);let i=[5913122,2759956,11569760,7227950],s=[];for(let r=0;r<4;r++){let o=$x(i[r]);o.position.set(.4+r*.35,0,1.2+r%2*.35),o.rotation.y=r*1.3,o.userData={tx:o.position.x,tz:o.position.z,wait:r,box:[.25,1,1.75,1.8]},s.push(o),n.mesh(o)}t.sheep=s,t.sheepBox=[.25,1,1.75,1.8]},mescit(n){n.box(m.stoneRough,.45,0,.45,.7,.04,.7),n.box(m.white,.45,.04,.45,.56,.36,.56),Ci(n,.45,.4,.45,.56,.56,.26,m.roof,.1),tn(n,"+z",.45,.04,.731,.12,.22,!0),qe(n,"+x",.731,.18,.35,.06,.11),qe(n,"+x",.731,.18,.55,.06,.11),n.box(m.woodDark,.85,.04,.2,.1,.5,.1),n.box(m.wood,.85,.54,.2,.14,.03,.14),n.box(m.woodDark,.85,.57,.2,.08,.12,.08),n.add(new Qe(.07,.16,4),m.roof,.85,.77,.2,Math.PI/4),n.cyl(m.gold,.85,.85,.2,.004,.004,.05,4),n.box(m.stoneCut,.2,.04,.85,.12,.05,.25)},tekke(n){n.box(m.stoneRough,1,0,1,1.9,.03,1.9),n.box(m.plasterLight,1,.03,.3,1.6,.3,.36),He(n,1,.33,.3,1.6,.36,.16,m.roof,m.plasterLight,.06);for(let e=0;e<5;e++)tn(n,"+z",.4+e*.3,.03,.485,.08,.17,!1);n.box(m.plasterLight,.4,.03,1.1,.5,.36,.7),Ci(n,.4,.39,1.1,.5,.7,.22,m.roof,.08),qe(n,"+x",.655,.16,1,.06,.1),qe(n,"+x",.655,.16,1.25,.06,.1),n.cyl(m.stoneCut,1.35,.03,1.25,.24,.24,.36,8),n.add(new Qe(.27,.3,8),m.lead,1.35,.39+.15,1.25,Math.PI/8),n.arch(m.dark,"+z",1.35,.03,1.47,.1,.2),n.cyl(m.bark,1,.03,1.65,.03,.045,.35,7);let t=m.treeLeaf||(m.treeLeaf=new Ct({color:6261301,roughness:.9}));for(let e=0;e<6;e++){let i=e;n.add(new ke(.12,1),t,1+Math.cos(i)*.1,.45+e%2*.08,1.65+Math.sin(i)*.1)}},medrese(n){let t=m.stoneCut;n.box(t,1,0,1,1.94,.03,1.94),n.box(t,1,.03,.25,1.8,.3,.32),n.box(t,.25,.03,1.05,.32,.3,1.3),n.box(t,1.75,.03,1.05,.32,.3,1.3);for(let e=0;e<7;e++)n.add(de(.09,12,.85),m.lead,.25+e*.25,.33,.25);for(let e=0;e<4;e++)n.add(de(.09,12,.85),m.lead,.25,.33,.6+e*.28),n.add(de(.09,12,.85),m.lead,1.75,.33,.6+e*.28);n.box(t,1,.03,.55,.6,.42,.45),n.add(de(.3,20,.85),m.lead,1,.45,.55),n.arch(m.dark,"+z",1,.03,.78,.28,.36);for(let e=0;e<4;e++)n.cyl(t,.5,.03,.75+e*.28,.016,.018,.26,8),n.cyl(t,1.5,.03,.75+e*.28,.016,.018,.26,8);n.box(t,1,.03,1.85,.5,.52,.14),n.arch(m.darkBlue,"+z",1,.03,1.925,.24,.42),n.arch(m.dark,"+z",1,.03,1.93,.14,.26),n.box(t,.5,.03,1.85,.5,.3,.1),n.box(t,1.5,.03,1.85,.5,.3,.1),n.cyl(t,1,.03,1.25,.1,.12,.06,10),n.add(new Pe(.09,12),m.waterSmall,1,.095,1.25,0,-Math.PI/2),dl(n,1.6,1.82,.8,t,.045)},kadi(n){n.box(m.stoneCut,1,0,1,1.8,.05,1.6),n.box(m.stoneCut,1,.05,.8,1.4,.48,.9),Ci(n,1,.53,.8,1.4,.9,.34,m.roof,.16);for(let t=0;t<6;t++)n.cyl(m.stoneCut,.4+t*.24,.05,1.42,.025,.03,.42,10);n.box(m.stoneCut,1,.47,1.42,1.4,.06,.12),Ci(n,1,.53,1.36,1.4,.18,.06,m.roof,.06),tn(n,"+z",1,.05,1.255,.18,.3,!0);for(let t=0;t<2;t++)qe(n,"+z",.6+t*.8,.2,1.255,.1,.16);for(let t=0;t<3;t++)qe(n,"+x",1.705,.2,.5+t*.3,.08,.16);for(let t=0;t<3;t++)n.box(m.stoneCut,1,0,1.65+t*.05,.7-t*.1,.05-t*.012,.06)},ulucami(n,t){let e=m.stoneCut;n.box(e,2,0,2,3.9,.05,3.9),n.box(e,2,.05,1.35,3,.78,2.2),n.box(e,2,.83,1.35,3.06,.05,2.26);for(let i=0;i<2;i++)for(let s=0;s<3;s++){let r=1+s*1,o=.8+i*1.1;n.cyl(e,r,.88,o,.42,.44,.12,12),n.add(de(.43,24,.75),m.lead,r,1,o),n.cyl(m.gold,r,1.32,o,.008,.008,.1,5)}for(let i=0;i<6;i++)n.arch(m.darkBlue,"+z",.7+i*.52,.2,2.452,.14,.3),n.arch(m.darkBlue,"+z",.7+i*.52,.55,2.452,.12,.2);for(let i=0;i<4;i++)n.arch(m.darkBlue,"+x",3.502,.2,.55+i*.55,.14,.3),n.arch(m.darkBlue,"+x",3.502,.55,.55+i*.55,.12,.2);n.box(m.stoneGrey,2,.05,3.15,3,.01,1.3);for(let i=0;i<9;i++)n.cyl(e,.6+i*.35,.05,3.75,.025,.03,.4,10);n.box(e,2,.45,3.75,3,.05,.2);for(let i=0;i<8;i++)n.add(de(.12,12,.8),m.lead,.78+i*.35,.5,3.75);n.box(e,.55,.05,3.15,.12,.35,1.3),n.box(e,3.45,.05,3.15,.12,.35,1.3),n.cyl(e,2,.05,3.1,.25,.27,.15,10);for(let i=0;i<8;i++){let s=i/8*Math.PI*2;n.cyl(e,2+Math.cos(s)*.24,.2,3.1+Math.sin(s)*.24,.012,.012,.22,5)}n.add(new Qe(.34,.2,8),m.lead,2,.52,3.1,Math.PI/8),n.box(e,2,.05,2.5,.8,1,.18),n.arch(m.darkBlue,"+z",2,.05,2.595,.4,.8),n.arch(m.dark,"+z",2,.05,2.6,.24,.45),dl(n,.3,.3,2.1,e,.08),dl(n,3.7,.3,2.1,e,.08)},depo(n){n.box(m.stoneRough,.5,0,.47,.8,.06,.7),n.box(m.stoneRough,.5,.06,.47,.74,.34,.64),He(n,.5,.4,.47,.74,.64,.22,m.roof,m.stoneRough,.07,!0),n.box(m.woodDark,.5,.06,.795,.26,.24,.02);for(let t=0;t<4;t++)Ou(n,.12+t*.1,.92,t*.3);Fu(n,.9,.88),Yx(n,.82,.12)},bedesten(n){let t=m.stoneCut;n.box(t,1,0,1.5,1.95,.04,2.95),n.box(t,1,.04,1.5,1.3,.52,2.3),n.box(t,1,.56,1.5,1.36,.04,2.36);for(let e=0;e<3;e++)for(let i=0;i<2;i++){let s=.68+i*.64,r=.73+e*.76;n.cyl(t,s,.6,r,.26,.27,.08,10),n.add(de(.27,18,.7),m.lead,s,.68,r)}for(let e=0;e<6;e++){let i=.55+e*.38;n.box(t,1.8,.04,i,.3,.3,.34),n.box(m.woodDark,1.951,.06,i,.01,.2,.24),n.box(t,.2,.04,i,.3,.3,.34)}He(n,1.8,.34,1.5,.34,2.32,.08,m.roof,t,.04,!0),He(n,.2,.34,1.5,.34,2.32,.08,m.roof,t,.04,!0),n.box(t,1,.04,2.7,.5,.62,.12),n.arch(m.dark,"+z",1,.04,2.765,.22,.4),n.add(new ue(.3,.4).rotateX(-Math.PI/2),m.kilim,1.75,.38,2.85);for(let e=0;e<3;e++)hl(n,.15+e*.1,2.85)},kisla(n,t){let e=m.stoneRough;n.box(m.soilRoof,1.5,0,1.5,2.9,.01,2.9),n.box(e,1.5,0,.08,2.9,.34,.12),n.box(e,.08,0,1.5,.12,.34,2.9),n.box(e,2.92,0,1.5,.12,.34,2.9),n.box(e,.75,0,2.92,1.4,.34,.12),n.box(e,2.35,0,2.92,1.2,.34,.12);for(let s=0;s<14;s++)n.box(e,.1+s*.2,.34,.08,.1,.06,.12);for(let s of[1.4,1.8])n.box(e,s,0,2.92,.22,.55,.22),Ci(n,s,.55,2.92,.22,.22,.14,m.roof,.04);n.box(m.wood,1.5,.01,.55,2.4,.32,.6),He(n,1.5,.33,.55,2.4,.6,.22,m.roof,m.wood,.06);for(let s=0;s<6;s++)n.box(m.dark,.6+s*.36,.01,.855,.1,.18,.01);for(let s=0;s<3;s++)n.add(new Qe(.16,.25,8),m.cloth,.45,.125,1.3+s*.42);n.cyl(m.woodDark,2.6,0,1.3,.008,.01,.8,5);let i=new ee(new ue(.3,.19,8,2).translate(.15,0,0),m.flag);i.position.set(2.6,.7,1.3),n.mesh(i),t.flag=i;for(let s=0;s<3;s++)n.cyl(m.woodDark,2.5,0,1.8+s*.25,.01,.01,.22,4),n.add(new Ht(.03,6,5),m.sack,2.5,.24,1.8+s*.25);t.kisla=!0},kule(n){n.box(m.stoneRough,.5,0,.5,.5,.9,.5),n.box(m.stoneRough,.5,.9,.5,.6,.05,.6);for(let t=0;t<4;t++)for(let e=0;e<3;e++){let i=-.22+e*.22,s=[[i,.28],[.28,i],[i,-.28],[-.28,i]][t];n.box(m.stoneRough,.5+s[0],.95,.5+s[1],.08,.08,.08)}n.add(new Qe(.36,.4,4),m.roof,.5,1.25,.5,Math.PI/4);for(let[t,e]of[[.28,.28],[.72,.28],[.28,.72],[.72,.72]])n.cyl(m.woodDark,t,.95,e,.01,.01,.12,4);qe(n,"+z",.5,.5,.751,.06,.12),tn(n,"+z",.5,0,.751,.12,.22,!0)},mehterhane(n){n.box(m.stoneCut,.5,0,.5,.8,.06,.8);for(let[e,i]of[[.18,.18],[.82,.18],[.18,.82],[.82,.82]])n.cyl(m.stoneCut,e,.06,i,.025,.03,.34,8);Ci(n,.5,.4,.5,.7,.7,.26,m.lead,.08);let t=new Ct({color:11024938,roughness:.7});n.cyl(t,.4,.06,.45,.1,.1,.14,12),n.cyl(m.cloth,.4,.2,.45,.1,.1,.005,12),n.add(new Ht(.12,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),m.bronze,.65,.18,.6),n.cyl(m.cloth,.65,.18,.6,.12,.12,.005,12);for(let e=0;e<3;e++)n.cyl(m.gold,.3+e*.08,.06,.75,.025,.025,.005,10)}};Lu(Jx);var gl={yuksek:{pr:2,shadow:2048,aa:!0,outer:1,tufts:2600,tex:1024},orta:{pr:1.5,shadow:1024,aa:!0,outer:.6,tufts:1200,tex:512},dusuk:{pr:1,shadow:0,aa:!1,outer:.3,tufts:0,tex:512}},L={ready:!1,quality:"yuksek",cam:{tx:0,tz:0,dist:14,yaw:Math.PI/4,minD:4,maxD:34},bmap:new Map},Kx=[{sun:16773597,int:3,hemi:.55,fog:13162210,exp:1},{sun:16771528,int:3.4,hemi:.55,fog:14081504,exp:1.05},{sun:16764824,int:2.6,hemi:.5,fog:14010805,exp:1},{sun:15002879,int:2.2,hemi:.7,fog:14673646,exp:1}];function Qx(n,t={}){L.quality=t.quality||"yuksek";let e=gl[L.quality],i=new Qr({canvas:n,antialias:e.aa,powerPreference:"high-performance"});i.setPixelRatio(Math.min(window.devicePixelRatio||1,e.pr)),i.toneMapping=Xc,i.toneMappingExposure=1,i.outputColorSpace=Ae,i.shadowMap.enabled=e.shadow>0,i.shadowMap.type=Wc,mu(Math.min(8,i.capabilities.getMaxAnisotropy())),gu(e.tex),L.renderer=i;let s=new to;L.scene=s,s.fog=new jr(13162210,30,75),s.background=new Vt(13162210);let r=new Be(40,1,.1,200);L.camera=r;let o=new go(14674687,7035454,.55);s.add(o),L.hemi=o;let a=new xo(16773597,3);a.castShadow=e.shadow>0,e.shadow&&(a.shadow.mapSize.set(e.shadow,e.shadow),a.shadow.bias=-4e-4,a.shadow.normalBias=.02),s.add(a),s.add(a.target),L.sun=a;let c=t.base||"tex";return xu(c,t.onProgress).then(()=>new Promise(l=>{new Eo().load(c+"/sky_1k.hdr",h=>{h.mapping=Fs;let u=new cs(i);L.env=u.fromEquirectangular(h).texture,s.environment=L.env,s.environmentIntensity=.55,s.background=h,s.backgroundIntensity=.9,h.dispose,u.dispose(),l()},void 0,()=>l())})).then(()=>{_u(),L.ready=!0,s_()})}function jx(n){let t=L.scene;L.world&&t.remove(L.world);for(let u of L.bmap.values())t.remove(u.obj);L.bmap.clear(),L.N=MAP_N;let e=new We;L.world=e,t.add(e),L.terrain=new To(MAP_N,n.map),e.add(L.terrain.mesh),e.add(L.terrain.water),L.forest?L.forest.scene=e:L.forest=new Po(e,MAP_N);let i=[],s=MAP_N,r=s/2,o=makeRng(n.seed+99);for(let u=0;u<s;u++)for(let d=0;d<s;d++){let f=n.map.trees[u*s+d];if(!f)continue;let x=d-r+.3+o()*.4,_=u-r+.3+o()*.4;i.push({x,z:_,y:L.terrain.heightAt(x,_)-.02,kind:f,s:.8+o()*.45,r:o()*6.28,key:u*s+d})}let a=gl[L.quality],c=s+Ti*2;for(let u=-c/2;u<c/2;u+=1)for(let d=-c/2;d<c/2;d+=1){if(Math.abs(d+.5)<r+.5&&Math.abs(u+.5)<r+.5)continue;let f=d+o(),x=u+o(),_=ps(f*.12+3,x*.12);if(L.terrain.waterDistAt(f,x)<1.6)continue;let g=Math.max(Math.abs(f)-r,Math.abs(x)-r),p=(_-.42)*2.4*a.outer*(g>18?.6:1);if(o()<p){let b=L.terrain.heightAt(f,x);i.push({x:f,z:x,y:b-.02,kind:b>2.5?o()<.75?2:1:1+Math.floor(o()*3),s:.8+o()*.6,r:o()*6.28})}}if(L.forest.build(i),L.treeCache=new Uint8Array(n.map.trees),a.tufts){let u=[];for(let d=0;d<a.tufts;d++){let f=(o()-.5)*(s+20),x=(o()-.5)*(s+20);if(L.terrain.waterDistAt(f,x)<1.1)continue;let _=Math.floor(f+r),g=Math.floor(x+r);_>=0&&g>=0&&_<s&&g<s&&n.map.tiles[g*s+_]>=2||u.push({x:f,z:x,y:L.terrain.heightAt(f,x),s:.7+o()*.9,r:o()*6.28,ti:_,tj:g})}L.tuftList=u,L.tufts=Pu(u),e.add(L.tufts)}let l=new Ne;for(let u=0;u<s;u++)for(let d=0;d<s;d++){let f=n.map.tiles[u*s+d];if(f!==2&&f!==3)continue;f===3&&L.terrain.paint(0,d-r,u-r,d-r+1,u-r+1,200,"max",.3);let x=1+Math.floor(o()*2);for(let _=0;_<x;_++){let g=.12+o()*.22,p=new ke(g,1),b=p.attributes.position,S=new Map;for(let y=0;y<b.count;y++){let U=`${b.getX(y).toFixed(3)},${b.getY(y).toFixed(3)},${b.getZ(y).toFixed(3)}`;S.has(U)||S.set(U,.7+o()*.5);let A=S.get(U);b.setXYZ(y,b.getX(y)*A,b.getY(y)*A*.65,b.getZ(y)*A)}p.computeVertexNormals(),l.add(p,f===3?m.ironRock||(m.ironRock=Object.assign(m.rock.clone(),{}),m.ironRock.color.setHex(11887434),m.ironRock):m.rock,d-r+.2+o()*.6,g*.15,u-r+.2+o()*.6,o()*6)}}e.add(l.build());let h=new zn({color:16769126,transparent:!0,opacity:.35,depthWrite:!1});L.sel=new ee(new ue(1,1).rotateX(-Math.PI/2),h),L.sel.visible=!1,L.sel.renderOrder=2,e.add(L.sel),L.ring=new ee(new lo(.97,1,64).rotateX(-Math.PI/2),new zn({color:10477823,transparent:!0,opacity:.7,depthWrite:!1})),L.ringFill=new ee(new Pe(1,64).rotateX(-Math.PI/2),new zn({color:10477823,transparent:!0,opacity:.1,depthWrite:!1})),L.ring.visible=L.ringFill.visible=!1,e.add(L.ring),e.add(L.ringFill),L.ghostFoot=new ee(new ue(1,1).rotateX(-Math.PI/2),new zn({color:6750071,transparent:!0,opacity:.35,depthWrite:!1})),L.ghostFoot.visible=!1,e.add(L.ghostFoot),L.ghostType=null,L.season=-1,L.cam.tx=0,L.cam.tz=0,ku(n)}function Vn(n,t){return{x:n-L.N/2,z:t-L.N/2}}function ku(n){if(!L.terrain)return;let t=new Set,e=season(n);for(let s of n.buildings){t.add(s.id);let r=L.bmap.get(s.id),o=s.progress>=1,a=s.level||1;if(!r||r.built!==o||r.level!==a){r&&L.world.remove(r.obj);let c=Object.assign({key:s.type},BUILDINGS[s.type]),l=o?cl(s.type,s.id,{level:a}):Nu(c),h=Vn(s.i,s.j);l.position.set(h.x,0,h.z),L.world.add(l);let u=!r;r={obj:l,built:o,type:s.type,b:s,level:a},L.bmap.set(s.id,r),u&&t_(s,c),e_(s,c)}if(r.b=s,o){let c=r.obj.userData.dyn,l=s.workers>0&&!s.paused&&!s.noInput;if(r.working=l,c.glow&&(c.glow.visible=l),c.crops&&n_(c.crops,s,e),c.sheep){let h=s.type==="agil"?Math.min(c.sheep.length,Math.ceil(s.sheep/3)):Math.min(c.sheep.length,Math.ceil((n.res.at||0)/2)+1);c.sheep.forEach((u,d)=>{u.visible=d<h})}if(c.trees){let h=Math.min(1,.45+(s.age||0)/YEAR_DAYS*.55);r.obj.children.forEach(u=>{u.isMesh&&(u.scale.y=h)})}}else{let c=r.obj.userData.wall;c.scale.y=Math.max(.03,s.progress)*r.obj.userData.wallH}}for(let[s,r]of L.bmap)if(!t.has(s)&&(L.world.remove(r.obj),L.bmap.delete(s),r.type==="tarla"||r.type==="bostan")){let o=Vn(r.b.i,r.b.j),a=BUILDINGS[r.type];L.terrain.paint(3,o.x,o.z,o.x+a.w,o.z+a.h,0,"set",.05)}let i=n.map.trees;for(let s=0;s<i.length;s++)L.treeCache[s]&&!i[s]&&(L.forest.hide(s),L.treeCache[s]=0);e!==L.season&&i_(e)}function t_(n,t){let e=Vn(n.i,n.j);n.type==="tarla"||n.type==="bostan"?L.terrain.paint(3,e.x+.04,e.z+.04,e.x+t.w-.04,e.z+t.h-.04,255,"max",.05):n.type==="agil"||n.type==="ahir"||n.type==="meyve"||n.type==="bag"?L.terrain.paint(0,e.x+.1,e.z+.1,e.x+t.w-.1,e.z+t.h-.1,150,"max",.3):L.terrain.paint(0,e.x+.1,e.z+.1,e.x+t.w-.1,e.z+t.h-.1,230,"max",.35)}function e_(n,t){if(!L.tufts)return;let e=new $t().makeScale(0,0,0),i=!1;L.tuftList.forEach((s,r)=>{s.ti>=n.i-0&&s.ti<n.i+t.w&&s.tj>=n.j&&s.tj<n.j+t.h&&(L.tufts.setMatrixAt(r,e),i=!0)}),i&&(L.tufts.instanceMatrix.needsUpdate=!0)}function n_(n,t,e){let i=0,s=!1;if(t.crop==="nadas"){n.last!==-2&&(n.last=-2,n.im.visible=!1);return}n.im.visible=!0,n.mat.color.setHex((t.harvestCrop||t.crop)==="arpa"?14280360:16777215),e===0?i=t.sown>.05?.12+t.growth*.9:0:e===1?i=.15+t.growth*.9:e===2&&(i=t.harvest>1?1:0,s=!0),e===1&&t.growth>.75&&(s=!0);let r=Math.round(i*20)+(s?100:0)+(t.harvest>1?Math.round(t.harvest/5)*1e3:0);if(r===n.last)return;n.last=r,n.mat.map=ne(s?"wheat_ripe":"wheat_green"),n.mat.needsUpdate=!0;let o=new $t,a=new Ce,c=new C(0,1,0),l=e===2&&t.harvest>1?Math.min(1,t.harvest/80):e===0?t.sown:1;n.base.forEach(([h,u,d],f)=>{let x=i>0&&f/n.base.length<l+.001;a.setFromAxisAngle(c,d);let _=x?i*(.85+d%.3):0;o.compose(new C(h,0,u),a,new C(x?1:0,_,x?1:0)),n.im.setMatrixAt(f,o)}),n.im.instanceMatrix.needsUpdate=!0}function i_(n){L.season=n;let t=Kx[n];L.sun.color.setHex(t.sun),L.sun.intensity=t.int,L.hemi.intensity=t.hemi,L.scene.fog.color.setHex(t.fog),L.terrain.uniforms.uSnow.value=n===3?1:0,L.terrain.uniforms.uAutumn.value=n===2?1:n===1?.12:0,L.forest.setSeason(n),L.tufts&&(L.tufts.visible=n!==3),L.snow&&(L.snow.visible=n===3);let e=n===3;for(let i of["roof","soilRoof","lead"]){let s=m[i];s.userData.base===void 0&&(s.userData.base=s.color.getHex(),s.userData.origMap=s.map),s.color.setHex(e?16054267:s.userData.base),s.map=e?ne("snow_field_aerial_diff"):s.userData.origMap,s.needsUpdate=!0}}function s_(){let n=new ls({map:ne("smoke"),transparent:!0,depthWrite:!1,opacity:.5,color:14540253});L.smokePool=[];for(let s=0;s<120;s++){let r=new Xs(n.clone());r.visible=!1,L.scene.add(r),L.smokePool.push({sp:r,life:0})}L.smokeT=0;let t=1800,e=new Float32Array(t*3);for(let s=0;s<t;s++)e[s*3]=(Math.random()-.5)*40,e[s*3+1]=Math.random()*14,e[s*3+2]=(Math.random()-.5)*40;let i=new ae;i.setAttribute("position",new Se(e,3)),L.snow=new no(i,new Ys({color:16777215,size:.06,transparent:!0,opacity:.85,depthWrite:!1})),L.snow.visible=!1,L.scene.add(L.snow),L.people=[]}function Hu(n){let t=L.smokePool.find(e=>e.life<=0);t&&(t.life=1,t.sp.visible=!0,t.sp.position.copy(n),t.vx=(Math.random()-.5)*.05+.08,t.vz=(Math.random()-.5)*.05)}var zu=[9117214,3039134,4156197,8018490,11569706,5979514,13816008,4868682];function r_(n){let t=new Ne,e=new Ct({color:zu[n%zu.length],roughness:.95});t.cyl(e,0,.02,0,.022,.034,.14,7),t.cyl(m.woolDark,-0,0,0,.02,.02,.03,6),t.add(new Ht(.022,8,6),m.skin,0,.18,0),n%3===0?t.add(new Ht(.026,8,6),m.white,0,.195,0,0,0,0,1,.7,1):n%3===1?t.cyl(m.fabric[0],0,.19,0,.018,.022,.035,8):t.cyl(m.woodDark,0,.19,0,.02,.024,.03,8);let i=t.build();return i.traverse(s=>{s.isMesh&&(s.castShadow=!0)}),i}function o_(n,t){for(;L.people.length<n.length;){let e=r_(L.people.length);L.scene.add(e),L.people.push(e)}L.people.forEach((e,i)=>{let s=n[i];if(!s){e.visible=!1;return}e.visible=!0;let r=s.x-L.N/2,o=s.y-L.N/2,a=r-e.position.x,c=o-e.position.z;Math.abs(a)+Math.abs(c)>5e-4&&(e.rotation.y=Math.atan2(a,c));let l=Math.abs(a)+Math.abs(c)>5e-4&&Math.abs(a)+Math.abs(c)<1;e.position.set(r,(L.terrain?Math.max(0,L.terrain.heightAt(r,o)):0)+(l?Math.abs(Math.sin(t*9+i))*.012:0),o),l&&Math.random()<.02&&L.terrain.paint(0,r-.05,o-.05,r+.05,o+.05,3,"add",.08)})}var fl=0;function a_(n,t,e,i,s,r){if(!L.ready||!L.terrain)return;let o=L.renderer.domElement,a=o.clientWidth,c=o.clientHeight;if((L.vw!==a||L.vh!==c)&&(L.vw=a,L.vh=c,L.renderer.setSize(a,c,!1),L.camera.aspect=a/c,L.camera.updateProjectionMatrix()),Vu(),L.terrain.update(t),L.forest.update(t),i.selected&&L.bmap.has(i.selected.id)){let h=BUILDINGS[i.selected.type],u=Vn(i.selected.i,i.selected.j);L.sel.visible=!0,L.sel.scale.set(h.w,1,h.h),L.sel.position.set(u.x+h.w/2,.03,u.z+h.h/2),pl(h.radius,u.x+h.w/2,u.z+h.h/2)}else L.sel.visible=!1,i.ghost||pl(0);if(i.ghost){let h=BUILDINGS[i.ghost.type];L.ghostType!==i.ghost.type&&(L.ghost&&L.world.remove(L.ghost),L.ghost=cl(i.ghost.type,7),L.ghostMat=new Ct({color:8978329,transparent:!0,opacity:.55,depthWrite:!1}),L.ghost.traverse(d=>{d.isMesh&&(d.material=L.ghostMat,d.castShadow=!1)}),L.world.add(L.ghost),L.ghostType=i.ghost.type);let u=Vn(i.ghost.i,i.ghost.j);L.ghost.visible=!0,L.ghost.position.set(u.x,.01,u.z),L.ghostMat.color.setHex(i.ghost.ok?8978329:16737877),L.ghostFoot.visible=!0,L.ghostFoot.scale.set(h.w,1,h.h),L.ghostFoot.position.set(u.x+h.w/2,.035,u.z+h.h/2),L.ghostFoot.material.color.setHex(i.ghost.ok?6750071:16729156),pl(h.radius||(h.need==="orman"?4.5:0),u.x+h.w/2,u.z+h.h/2)}else L.ghost&&(L.ghost.visible=!1,L.ghostFoot.visible=!1);let l=L.season;for(let h of L.bmap.values()){if(!h.built)continue;let u=h.obj.userData.dyn;if(u.sails&&h.working&&r&&(u.sails.rotation.z-=n*1.4),u.flag){let d=u.flag.geometry.attributes.position;for(let f=0;f<d.count;f++){let x=d.getX(f);d.setZ(f,Math.sin(t*5+x*18)*.025*x*3)}d.needsUpdate=!0}if(u.sheep&&r)for(let d of u.sheep){let f=d.userData;if(f.wait>0){f.wait-=n;continue}let x=f.tx-d.position.x,_=f.tz-d.position.z,g=Math.hypot(x,_),p=u.sheepBox||[.3,.85,1.7,1.8];g<.02?(f.tx=p[0]+Math.random()*(p[2]-p[0]),f.tz=p[1]+Math.random()*(p[3]-p[1]),f.wait=1+Math.random()*5):(d.position.x+=x/g*n*.12,d.position.z+=_/g*n*.12,d.rotation.y=Math.atan2(x,_)-Math.PI/2)}}if(r&&(fl+=n),fl>.35){fl=0;for(let h of L.bmap.values()){if(!h.built)continue;let u=h.obj.userData.dyn;if(!u.smoke)continue;let d=h.type==="ev"||h.type==="konak";if(d&&(l===2||l===3)||!d&&h.working||u.alwaysSmoke)for(let f of u.smoke)Hu(f.clone().add(h.obj.position))}}for(let h of L.smokePool){if(h.life<=0)continue;if(h.life-=n*.28,h.life<=0){h.sp.visible=!1;continue}h.sp.position.y+=n*.22,h.sp.position.x+=h.vx*n,h.sp.position.z+=h.vz*n;let u=1-h.life;h.sp.scale.setScalar(.12+u*.5),h.sp.material.opacity=.45*h.life*Math.min(1,u*5)}if(L.snow&&L.snow.visible){let h=L.snow.geometry.attributes.position;for(let u=0;u<h.count;u++){let d=h.getY(u)-n*.9;d<0&&(d+=14),h.setY(u,d),h.setX(u,h.getX(u)+Math.sin(t+u)*n*.1)}h.needsUpdate=!0,L.snow.position.set(L.cam.tx,0,L.cam.tz)}o_(s,t),c_(e,n,r),h_(e,t),u_(e),L.renderer.render(L.scene,L.camera)}function c_(n,t,e){if(!L.flames){L.flames=[];let r=new ls({map:ne("smoke"),color:16742938,transparent:!0,blending:Hr,depthWrite:!1});for(let o=0;o<40;o++){let a=new Xs(r.clone());a.visible=!1,L.scene.add(a),L.flames.push(a)}}let i=(n.fx||[]).filter(r=>r.type==="fire"),s=0;for(let r of i){let o=Vn(r.i,r.j);for(let a=0;a<8&&s<L.flames.length;a++,s++){let c=L.flames[s],l=(performance.now()/600+a*.37)%1;c.visible=!0,c.position.set(o.x+.3+a%3*.2,.1+l*.5,o.z+.3+Math.floor(a/3)*.2),c.scale.setScalar(.25*(1-l)+.08),c.material.opacity=.9*(1-l)}e&&Math.random()<.3&&Hu(new C(o.x+.5,.5,o.z+.5))}for(;s<L.flames.length;s++)L.flames[s].visible=!1}function l_(){let n=new Ne;n.add(new Ht(.1,12,8),m.camel,0,.26,0,0,0,0,1.5,.75,.8),n.add(new Ht(.07,10,8),m.camel,-.02,.33,0,0,0,0,1.1,.9,.8),n.beam(m.camel,new C(.13,.27,0),new C(.22,.42,0),.025),n.add(new Ht(.035,8,6),m.camel,.25,.43,0,0,0,0,1.6,.9,.9);for(let[t,e]of[[.09,.04],[.09,-.04],[-.09,.04],[-.09,-.04]])n.cyl(m.camel,t,0,e,.012,.014,.22,5);return n.box(m.kilim,-.02,.32,0,.12,.02,.17),n.cyl(m.sack,-.02,.18,.1,.035,.045,.07,8),n.cyl(m.sack,-.02,.18,-.1,.035,.045,.07,8),n.build()}function h_(n,t){let e=n.caravan;if(!L.caravanGrp){L.caravanGrp=new We;for(let h=0;h<5;h++){let u=l_();u.position.set(-h*.45,0,0),u.userData.k=h,L.caravanGrp.add(u)}L.scene.add(L.caravanGrp)}if(!e){L.caravanGrp.visible=!1;return}L.caravanGrp.visible=!0;let i=e.from,s=e.to,r=e.t;e.state==="burada"&&(r=1),e.state==="gidiyor"&&(i=e.to,s=e.from);let o=i.x+(s.x-i.x)*r,a=i.y+(s.y-i.y)*r,c=Vn(o,a),l=Math.atan2(s.y-i.y,s.x-i.x);L.caravanGrp.position.set(c.x,Math.max(0,L.terrain.heightAt(c.x,c.z)),c.z),L.caravanGrp.rotation.y=-l,L.caravanGrp.children.forEach(h=>{h.position.y=e.state==="burada"?0:Math.abs(Math.sin(t*4+h.userData.k))*.02})}function u_(n){let t=[...L.bmap.values()].find(a=>a.type==="kisla"&&a.built),e=Math.min(30,armySize(n)),i=e+"_"+(t?t.b.id:0)+"_"+JSON.stringify(n.army);if(i===L.soldierKey||(L.soldierKey=i,L.soldierGrp&&(L.scene.remove(L.soldierGrp),L.soldierGrp=null),!t||!e))return;let s=new Ne,r=[];for(let a of UNIT_KEYS)for(let c=0;c<n.army[a];c++)r.push(a);for(let a=0;a<e;a++)Bu(s,.9+a%8*.17,1.35+Math.floor(a/8)*.2,0,r[a]);L.soldierGrp=s.build();let o=Vn(t.b.i,t.b.j);L.soldierGrp.position.set(o.x,0,o.z),L.scene.add(L.soldierGrp)}function pl(n,t,e){if(!n){L.ring.visible=L.ringFill.visible=!1;return}L.ring.visible=L.ringFill.visible=!0,L.ring.scale.set(n,1,n),L.ringFill.scale.set(n,1,n),L.ring.position.set(t,.05,e),L.ringFill.position.set(t,.04,e)}function Vu(){let n=L.cam,t=(n.dist-n.minD)/(n.maxD-n.minD),e=Qh.lerp(.5,.95,Math.pow(t,.7)),i=Math.cos(e)*n.dist,s=Math.sin(e)*n.dist,r=L.terrain?Math.max(0,L.terrain.heightAt(n.tx,n.tz)):0;L.camera.position.set(n.tx+Math.sin(n.yaw)*i,r+s,n.tz+Math.cos(n.yaw)*i),L.camera.lookAt(n.tx,r+.3,n.tz);let o=Math.max(8,n.dist*1.1),a=new C(-.55,.75,.35).normalize();if(L.sun.position.set(n.tx+a.x*30,a.y*30,n.tz+a.z*30),L.sun.target.position.set(n.tx,0,n.tz),L.sun.castShadow){let c=L.sun.shadow.camera;c.left=-o,c.right=o,c.top=o,c.bottom=-o,c.near=1,c.far=80,c.updateProjectionMatrix()}L.scene.fog.near=n.dist*1.6,L.scene.fog.far=n.dist*4.5+25}function Uo(){let n=L.cam,t=(L.N||48)/2+2;n.tx=Math.max(-t,Math.min(t,n.tx)),n.tz=Math.max(-t,Math.min(t,n.tz)),n.dist=Math.max(n.minD,Math.min(n.maxD,n.dist))}function d_(n,t){let e=L.cam,i=e.dist*.0016*(1e3/Math.max(400,L.vh||600)),s=-Math.sin(e.yaw),r=-Math.cos(e.yaw),o=Math.cos(e.yaw),a=-Math.sin(e.yaw);e.tx-=(o*n-s*t)*i,e.tz-=(a*n-r*t)*i,Uo()}function f_(n,t,e){let i=t!==void 0?ml(t,e):null;if(L.cam.dist/=n,Uo(),i){Vu(),L.camera.updateMatrixWorld();let s=ml(t,e);s&&(L.cam.tx+=i.x-s.x,L.cam.tz+=i.z-s.z,Uo())}}function p_(n){L.cam.yaw+=n}function m_(n,t){let e=Vn(n,t);L.cam.tx=e.x,L.cam.tz=e.z,Uo()}var No=new _o,g_=new dn(new C(0,1,0),0);function ml(n,t){let e=L.renderer.domElement,i=new it(n/e.clientWidth*2-1,-(t/e.clientHeight)*2+1);No.setFromCamera(i,L.camera);let s=new C;return No.ray.intersectPlane(g_,s)?s:null}function Gu(n,t){let e=ml(n,t);return e?{i:Math.floor(e.x+L.N/2),j:Math.floor(e.z+L.N/2)}:null}function x_(n,t){let e=L.renderer.domElement,i=new it(n/e.clientWidth*2-1,-(t/e.clientHeight)*2+1);No.setFromCamera(i,L.camera);let s=[];for(let a of L.bmap.values())s.push(a.obj);let r=No.intersectObjects(s,!0);if(!r.length)return null;let o=r[0].object;for(;o&&o.parent&&!s.includes(o);)o=o.parent;for(let[a,c]of L.bmap)if(c.obj===o)return a;return null}function __(){let n=L.renderer.domElement;return Gu(n.clientWidth/2,n.clientHeight/2)}window.Render3D={init:Qx,setGame:jx,sync:ku,frame:a_,pan:d_,zoom:f_,rotate:p_,pick:Gu,pickBuilding:x_,centerOn:m_,screenCenterTile:__,R:L,QUALITY:gl};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
