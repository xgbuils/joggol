!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){function c(){var a=Date.now(),b={time:(a-this.played)*this.v};this.func(b),this.id=window.requestAnimationFrame(c.bind(this))}a("./rAF.js");var d=function(a){this.func=a,this.on=!1,this.paused=this.played=Date.now(),this.v=1,this.active=!1};d.prototype={play:function(){this.func&&!this.on&&(this.paused&&(this.played+=Date.now()-this.paused),c.call(this),this.active=this.on=!0)},pause:function(){this.func&&this.on&&(cancelAnimationFrame(this.id),this.active=this.on=!1,this.paused=Date.now())},mute:function(){this.func&&this.on&&(cancelAnimationFrame(this.id),this.active=this.on=!1,this.paused=void 0)},stop:function(){this.func&&(this.pause(),this.paused=this.played=Date.now())},seek:function(a){if(this.func){var b=Date.now();this.played=b-a,this.paused=b}},speed:function(a){if(this.func&&isFinite(a))if(a){a/=this.v;var b=Date.now(),c=(b-this.played)/a;if(this.played=b-c,this.paused){var d=(b-this.paused)/a;this.paused=b-d}this.v*=a,this.active&&this.play()}else this.pause(),this.active=!0},remove:function(){this.func&&(this.pause(),delete this.func)}},b.exports=d},{"./rAF.js":2}],2:[function(){!function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}()},{}],3:[function(a,b){function c(){this.shapes=[],this.canvas=document.createElement("canvas"),this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.ctx=this.canvas.getContext("2d")}var d=c.prototype;d.add=function(a){this.shapes.push(a),a.layer=this},d.draw=function(){this.clear(),this.shapes.forEach(function(a){a.draw()})};var e=window.navigator.userAgent,f=/android/i.test(e)&&e.indexOf("534.30");f?(console.log("native_android_browser"),d.clear=function(){this.ctx.clearRect(0,0,this.width,this.height),this.canvas.style.display="none",this.canvas.offsetHeight,this.canvas.style.display="inherit"}):d.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},d.remove=function(){this.clear(),this.shapes.forEach(function(a){delete a.layer}),this.shapes=[]},b.exports=c},{}],4:[function(a,b){function c(a){this.shape=a}c.prototype.draw=function(){var a=this.shape,b=this.layer;b.ctx.beginPath(),b.ctx.arc(a.x,a.y,a.radius,0,2*Math.PI),b.ctx.closePath(),a.fill&&(b.ctx.fillStyle=a.fill,b.ctx.fill())},c.prototype.setX=function(a){this.shape.x=a},c.prototype.setY=function(a){this.shape.y=a},b.exports=c},{}],5:[function(a,b){function c(a){this.layers=[];var b=this.container=document.getElementById(a.container);if(!b)throw new Error("element #"+a.container+" does not exist");var c=b.style;c.position="relative",c.width=a.width+"px",c.height=a.height+"px",c.overflow="hidden",this.width=parseInt(a.width),this.height=parseInt(a.height)}c.prototype.add=function(a){var b=a.canvas;this.layers.push(a),b.width=a.width=this.width,b.height=a.height=this.height,this.container.appendChild(b)},c.prototype.resize=function(a){var b=parseInt(a.width),c=parseInt(a.height),d=this.container.style;isFinite(b)&&(d.width=b+"px",this.width=b),isFinite(c)&&(d.height=c+"px",this.height=c)},b.exports=c},{}],6:[function(a,b){b.exports={Animation:a("./Animation/Animation.js"),Stage:a("./Canvas/Stage.js"),Layer:a("./Canvas/Layer.js"),Circle:a("./Canvas/Shape/Circle.js")}},{"./Animation/Animation.js":1,"./Canvas/Layer.js":3,"./Canvas/Shape/Circle.js":4,"./Canvas/Stage.js":5}],7:[function(a,b){b.exports=a("./src/siteswap-generator")},{"./src/siteswap-generator":8}],8:[function(a,b){function c(a){var b={};for(var c in a)b[c]=a[c];return b}function d(a,b,c){var d=[];"number"==typeof a&&(a={max:a}),void 0===a.min&&(a.min=a.max),"number"==typeof b&&(b={max:b}),void 0===b.min&&(b.min=1),void 0===c?c={max:b.max*a.max}:"number"==typeof c?c={max:c}:"number"!=typeof c.max&&(c.max=b.max*a.max),void 0===c.min&&(c.min=0),console.log(a,b,c);for(var f=a.max;f>=a.min;--f){for(var g,h,i=Math.max(b.min,2),j=b.max;j>=i;--j){g=Math.min(c.max,j*f),h=Math.max(c.min,f+1);for(var k=g;k>=h;--k)e(f,j,k,d)}b.min<=1&&1<=b.max&&c.min<=f&&f<=c.max&&d.push([f])}return d}function e(a,b,c,d){if(1===b&&a===c)d.push([a]);else{var e={};e[c%b]=!0,f(b,c,e,{array:[c],index:0,pos:1,rest:a*b-c},d)}}function f(a,b,d,e,g){if(e.pos<a){var h=a-e.pos,i=e.array[e.index],j=Math.min(i,e.rest),k=e.rest-b*(h-1);h>1&&k++,k=Math.max(k,0);for(var l=j;l>=k;--l){var m=i>l?0:e.index+1,n=(l+e.pos)%a;if(void 0===d[n]){var o=c(d);o[n]=!0,f(a,b,o,{array:e.array.concat([l]),index:m,pos:e.pos+1,rest:e.rest-l},g)}}}else 0===e.index&&g.push(e.array)}b.exports=d},{}],9:[function(a,b){function c(){"use strict";var a,b,e,f,h,i,j=arguments[0],k=1,l=arguments.length,m=!1;for("boolean"==typeof j?(m=j,j=arguments[1]||{},k=2):("object"!=typeof j&&"function"!=typeof j||null==j)&&(j={});l>k;++k)if(a=arguments[k],null!=a)for(b in a)e=j[b],f=a[b],j!==f&&(m&&f&&(g(f)||(h=Array.isArray(f)))?(h?(h=!1,i=e&&Array.isArray(e)?e:[]):i=e&&g(e)?e:{},j[b]=c(m,i,f)):f!==d&&(j[b]=f));return j}var d,e=Object.prototype.hasOwnProperty,f=Object.prototype.toString,g=function(a){"use strict";if(!a||"[object Object]"!==f.call(a))return!1;var b=e.call(a,"constructor"),c=a.constructor&&a.constructor.prototype&&e.call(a.constructor.prototype,"isPrototypeOf");if(a.constructor&&!b&&!c)return!1;var g;for(g in a);return g===d||e.call(a,g)};b.exports=c},{}],10:[function(a,b){function c(a,b){var c,d=b.time,e=b.position,f=d.now;if(f<d.thrown){c=e.middle.x-e.start.x,a.setX(e.start.x+c*f/d.thrown);var g=.5*b.gravity*d.thrown;a.setY(e.start.y-g*f+.5*b.gravity*f*f)}else c=e.end.x-e.middle.x,a.setX(e.middle.x+c*(f-d.thrown)/d.caught),a.setY(e.middle.y)}var d=a("kinemajs"),e=a("./extend.js"),f=function(){function a(a,b){var c,d=a.juggling,e=a.stage,f=(b-d.waiting.time)*d.interval;if(e.width){var g=(d.integer_height-d.waiting.time)*d.interval,h=g/f;c=h*e.width,console.log("uu",h)}else{var g=(3-d.waiting.time)*d.interval,h=g/f;c=1.5*d.height*h}return{width:.5*c,gravity:8*d.height/(f*f),shift:d.waiting.shift*h,radius:d.balls.radius*h}}function b(b){console.log(b.stage),this.attrs={},this.attrs=e(!0,this.attrs,{stage:{width:500,height:650},juggling:{interval:500,waiting:{time:.5,shift:50},integer_height:5,balls:{radius:10,colors:["red","blue","green","yellow","black","orange","purple"]},height:.8*b.stage.height,center:{x:.5*b.stage.width,y:.9*b.stage.height}},layer:new d.Layer},b),this.attrs.stage=new d.Stage(this.attrs.stage),this.attrs.stage.add(this.attrs.layer);var c=this.attrs.juggling,f=a(this.attrs,this.attrs.juggling.integer_height);c.width=f.width,c.gravity=f.gravity}for(var f="abcdefghijklmnopqrstuvwxyz",g={},h=0;10>h;++h)g[h]=h;for(var h=0;h<f.length;++h)g[f[h]]=h+10;return b.toPattern=function(a){return a.split("").map(function(a){return g[a]})},b.prototype.setPattern=function(e){"string"==typeof e&&(e=b.toPattern(e));var f,g,h,i,j=this.attrs,k=(j.stage,j.juggling),l=Math.max.apply(null,e);if(l>k.integer_height){var m=a(j,l);i=m.width,h=m.gravity,g=m.shift,f=m.radius}else g=k.waiting.shift,i=k.width,h=k.gravity,f=k.balls.radius;var n=e.reduce(function(a,b){return a+b},0);if(n%e.length!=0)throw new Error("El patró es irrealitzable. Es necessita un nombre enter de boles. Actualment: "+n/e.length);n/=e.length;for(var o=[],p=0;p<e.length;++p){var q={};q.value=e[p],q.next=(p+q.value)%e.length,q.period=(q.value-k.waiting.time)*k.interval,q.velocity=.5*h*q.period,o.push(q)}for(var p=0;p<e.length;++p)if(!o[p].cycle){for(var r={},s=p,t=0;!r[s];)r[s]=!0,s=o[s].next,t+=o[s].value;for(var s in r)o[s].cycle=t}var u=k.center.y;g/=2;var v=k.center.x-i/2,w=k.center.x+i/2,x=0,y=0,p=0,z=0,A={};for(this.balls=[];n>p;){if(0!==o[y].value)if(void 0===A[x]){A[x]=p,A[x+o[y].value]=p,++p;var B={figure:new d.Circle({x:x%2===0?v+15:w-15,y:u,radius:f||10,fill:k.balls.colors[z%k.balls.colors.length]}),start:x,cycle:o[y].cycle};this.balls.push(B),j.layer.add(B.figure),++z}else A[x+o[y].value]=o[y].value;++x,y=x%o.length}var C=this;j.animation=new d.Animation(function(a){var b=Math.floor(a.time/k.interval);C.balls.forEach(function(d){var e=a.time-k.interval*d.start;if(e>=0){e%=d.cycle*k.interval;for(var f,i=d.start%o.length;;){f=o[i].value;var j=f*k.interval;if(j>e)break;e-=j,i=o[i].next}var l=b-Math.floor(e/k.interval),m={};m.start=l%2===0?{x:v+g,y:u}:{x:w-g,y:u},(l+o[i].value)%2===0?(m.middle={x:v-g,y:u},m.end={x:v+g,y:u}):(m.middle={x:w+g,y:u},m.end={x:w-g,y:u});var n={value:o[i].value,time:{total:k.interval,thrown:o[i].period,caught:k.interval*o[i].value-o[i].period,now:e},left:l%2===0,gravity:h,position:m};c(d.figure,n)}}),j.layer.draw()})},b.prototype.removePattern=function(){var a=this;a.attrs.animation.stop(),a.attrs.layer.remove()},b.prototype.play=function(){var a=this.attrs.animation;a&&a.play()},b.prototype.pause=function(){var a=this.attrs.animation;a&&a.pause()},b.prototype.mute=function(){var a=this.attrs.animation;a&&a.mute()},b.prototype.stop=function(){var a=this.attrs.animation;a&&a.stop(),this.attrs.layer.remove()},b.prototype.speed=function(a){var b=this.attrs.animation;b&&b.speed(a)},b.prototype.colors=function(a){this.stop(),this.attrs.juggling.balls.colors=[].concat(a)},b}();b.exports=f},{"./extend.js":9,kinemajs:6}],11:[function(a){function b(a,b){for(var c=[],d=a;b>=d;++d)c.push(d);return c}function c(a,b,c){var d=$.Event(a);d.target=c,b.trigger(d)}function d(a,b){var c=a.split("?"),d=c[0],e={};if(c[1]){var f=c[1].split("&");for(var g in f)c=f[g].split("="),e[c[0]]=c[1]}return{fragment:d||b.fragment,queryString:e}}function e(a){return!isNaN(a)&&a===Math.floor(a)}function f(a){return a[0].toUpperCase(a)+a.substring(1)}function g(a,b,c,d){var f=a[b],g=f[c];if(!e(g))return j.isNotAInt(g);if(("all"===d||"range"===d)&&f.min>f.max)return j.invalidRange(f,b);if("all"===d){var h=a.balls.min,i=a.heights.max,k=a.periods.min;if(h>=i&&k>1)return j.emptyWithBigPeriod();if(1===k&&h>i)return j.emptyWithLittlePeriod()}return""}var h=a("siteswap-generator"),i=a("./Juggler/juggler.js");$.fn.keyboard=function(a,b){b=b||function(a){return a},$(this).html("<ul>"+a.map(function(a){return"<li>"+b(a)+"</li>"}).join("")+"</ul>")};var j={isNotAInt:function(a){return a+"no és un nombre enter"},invalidRange:function(a,b){return b={balls:"el nombre de boles",periods:"el període",heights:"l'alçada"}[b],f(b)+" menor ("+a.min+") no pot sobrepassar "+b+" major ("+a.max+")"},emptyWithBigPeriod:function(){return"No existeixen patrons vàlids dintre del rang indicat. Prova que l'alçada màxima sigui major al nombre mínim de boles"},emptyWithLittlePeriod:function(){return"No existeixen patrons vàlids dintre del rang indicat. Prova que l'alçada màxima sigui major o igual al nombre mínim de boles"}},k={balls:function(a,b,c){a.error=!1,void 0!==b.min&&void 0!==b.max&&b.min<=b.max&&b.min>0?b.min===b.max?a.balls="de "+b.max+" boles":1===b.min?a.balls="de màxim "+b.max+" boles":b.min<b.max&&(a.balls="de "+b.min+" a "+b.max+" boles"):a.error="L'interval de boles que demanes no es correcte",c.text(a.balls)},periods:function(a,b,c){a.error=!1,void 0!==b.min&&void 0!==b.max&&b.min<=b.max&&b.min>0?b.min===b.max?a.period="de període "+b.max:1===b.min?a.period="amb periodes no més grans de "+b.max:b.min<b.max&&(a.period="amb períodes entre "+b.min+" i "+b.max):a.error="L'interval de períodes que demanes no es correcte",c.text(a.period)},heights:function(a,b,c){a.error=!1,void 0===b.min&&void 0===b.max?a.height="":(void 0===b.min||b.min<=1)&&b.max>=0?a.height="amb llançaments no més alts de "+b.max:void 0===b.max&&b.min>=0?a.height="amb llançaments que continguin alguna alçada major o igual a "+b.min:b.min<=b.max&&b.min>=0?a.height=b.min===b.max?"amb algun llançament de "+b.min+" i no més alt":"amb llançaments majors o iguals a "+b.min+" i mai superiors a "+b.max:a.error="L'interval de periodes que demanes no es correcte",c.text(a.height)}},l={},m={},n=!1,o="0123456789abcdefghijklmnopqrstuvxyz",p={values:{},href:{queryString:{}}};$(document).ready(function(){function a(){var b=$("li",p.$samples).slice(0,1);p.$samples.animate({"margin-left":-b.width()},u,"swing",function(){p.$samples.css("margin-left",0),b.detach(),p.$samples.append(b)}),setTimeout(a,1e4)}function e(a,b){b=b||a.data;var c=(b.$keyboard,b.$simulator),d=(b.$generator,[B.$balls,B.$periods,B.$heights]),e=$.map(d,function(a){return{min:parseInt(a.data("$min").text())||void 0,max:parseInt(a.data("$max").text())||void 0}}),f=h.apply(null,e);return f=f.map(function(a){return a.map(function(a){return o[a]}).join("")}),c.data("patterns",f),w.$patterns.keyboard(f,function(a){return'<a class="keyboard-btn" href="#simulator?play='+a+'">'+a+"</a>"}),b.juggler&&b.juggler.stop(),b.jugglerPlaying=!1,w.$patterns.data("active",!1),w.$patterns.data("position",0),w.$patterns.css("left",0),w.$patterns.data("width",null),f}function f(a,b){a.addClass("select"),b.data("$select",a);var c=b.data("width"),d=.5*($(window).outerWidth()-a.outerWidth())-a.offset().left,e=b.data("position")+d;-c>e?e=-c:e>0&&(e=0),b.data("position",e),b.css("left",e)}function j(a){a.removeClass("select")}function q(a,b){b.removeClass(a),$(".collapsed",b).each(function(a,b){var c=$(b),d=c.data("width");c.css("width",d)})}function r(a,b){b.addClass(a)}function s(a){var b=a.data,c=$(this),d=c.data("type"),e=c.data("minmax");m[d][e]=parseInt(c.text())||void 0;var f=g(m,d,e,"all");n&&console.log(n),k[d](l,m[d],b.outputs[d]),!n&&f?(b.message.$success.addClass("hide"),b.message.$error.text(f),b.message.$error.removeClass("hide"),n=!0):n&&!f&&(b.message.$error.addClass("hide"),b.message.$success.removeClass("hide"),n=!1),console.log("error",n),n?(b.$create.addClass("disabled"),b.$wrapper.addClass("simulator-disabled")):(b.$create.removeClass("disabled"),b.$wrapper.removeClass("simulator-disabled"))}function t(a){a.preventDefault();var b=a.data,c=b.$keyboard,f=b.$simulator,g=d($(this).attr("href"),{fragment:"#header"}),h=b.href.queryString,j=g.queryString,k=$(g.fragment).offset().top;if(b.$root.animate({scrollTop:k},u,"swing"),"#header"===g.fragment){c.addClass("hide");var l=c.data("$shown");l&&l.removeClass("select")}else if("#simulator"===g.fragment){var m=f.data("patterns");m||(m=e({},b)),g.queryString.play=g.queryString.play||m[0],console.log("play",g.queryString.play),b.juggler||(b.juggler=new i({stage:{container:"juggler-simulator",width:f.width(),height:f.height()}})),h.play!==j.play&&(b.juggler.stop(),b.juggler.setPattern(g.queryString.play),b.juggler.play(),b.jugglerPlaying=!0)}b.href=g}p.$root=$("body, html");var u=300;$(".collapsed").each(function(a,b){var c=$(b);c.removeClass("hide");var d=c.outerWidth();console.log(d),c.data("width",d),c.css("width",0),c.addClass("hide")}),$(".expanded").each(function(a,b){var c=$(b),d=c.outerWidth();c.data("width",d),c.css("width",d)});var v=p.$keyboard=$("#keyboard"),w={};v.data("$shown",null),$.each(["balls","periods","heights","patterns"],function(a,b){var c=w["$"+b]=$("#keyboard-"+b);c.data("position",0),c.data("active",!1)}),v.data("buttons",w);var x=$("#keyboard-left"),y=$("#keyboard-right");v.data("$left",x),v.data("$right",y),p.outputs={balls:$("#description-balls"),periods:$("#description-periods"),heights:$("#description-heights")},p.message={$success:$("#success"),$error:$("#error")},p.$header=$("#header");var z=p.$generator=$("#generator"),A=null,B={};z.data("active",!1),z.data("top",z.offset().top),z.data("$focus",A),$.each(["balls","periods","heights"],function(a,c){var d=B["$"+c]=$("#"+c),e=$("#keyboard-"+c);"periods"===c?e.keyboard(b(1,10),function(a){return'<span class="numbers keyboard-btn number-'+a+'">'+a+"</span>"}):e.keyboard(b(1,25),function(a){return'<span class="numbers keyboard-btn number-'+a+'">'+a+"</span>"}),$.each(["min","max"],function(a,b){var f=$("#"+c+"-"+b);d.data("$"+b,f),f.data("$parent",d);var g=f.width();f.width(g);var h="40px";f.data("width",g),f.data("min-width",h),f.data("type",c),f.data("minmax",b),f.data("$keys",e)})});var C=p.$simulator=$("#simulator");C.data("active",!1),z.data("inputs",B),p.$create=$("#create"),p.topCreate=p.$create.offset().top,p.$samples=$("#samples");var D=p.$wrapper=$("#wrapper");a(),p.$create.on("click",p,e),p.$root.on("click",z,function(a){var b=a.data,d=b.data("$focus");d&&(c("blureditable",b,d[0]),b.data("$focus",null))}),z.on("click",".editable",z,function(a){a.stopPropagation();var b=a.data,d=b.data("$focus");d&&c("blureditable",b,d[0]),d=$(".contenteditable",this).first(),b.data("$focus",d),c("focuseditable",b,d[0])}),z.on("click",".contenteditable",z,function(a){a.stopPropagation();var b=a.data,d=b.data("$focus");d&&c("blureditable",b,d[0]),d=$(this),b.data("$focus",d),c("focuseditable",b,this)}),z.on("focuseditable",".contenteditable",v,function(){{var a=$(this),b=a.data("$keys"),c=a.data("$parent");v.data("$shown")}c.hasClass("minEqMax")&&q("minEqMax",c),c.hasClass("minLessOrEq1")&&q("minLessOrEq1",c),a.addClass("select");var d=b.data("width");d||(d=b.width()-$(window).outerWidth()+120,b.data("width",d)),v.removeClass("hide"),v.data("$shown",b),b.addClass("select"),b.data("active",!0);var e=b.data("$select");e&&!e.hasClass(h)&&j(e);var g=a.text().trim();if(g){var h="number-"+g;f($("."+h,b),b)}}),z.on("blureditable",".contenteditable",p,function(a){console.log("blureditable");var b=$(this),c=a.data,d=c.$keyboard,e=b.data("$keys"),f=d.data("$shown"),g=b.data("$parent"),h=g.data("$min").text(),i=g.data("$max").text();1>=h||void 0===h?r("minLessOrEq1",g):q("minLessOrEq1",g),h===i?r("minEqMax",g):q("minEqMax",g),b.removeClass("select"),f&&(d.addClass("hide"),e.removeClass("select")),e.data("active",!1)}),z.on("inputeditable",".contenteditable",p,s);$.each(["balls","periods","heights"],function(a,b){var c,d=B["$"+b],e=d.data("$min"),f=d.data("$max");m[b]={min:parseInt(e.text())||void 0,max:parseInt(f.text())||void 0},c=g(m,b,"min"),!n&&c&&(p.message.$error.text(c),p.message.$success.addClass("hide"),n=!0),console.log("min",m[b].min),c=g(m,b,"max",2===a?"all":"range"),!n&&c&&(p.message.$error.text(c),p.message.$success.addClass("hide"),n=!0),console.log("max",m[b].max),k[b](l,m[b],p.outputs[b]),n?(p.$create.addClass("disabled"),p.$wrapper.addClass("simulator-disabled")):(p.$create.removeClass("disabled"),p.$wrapper.removeClass("simulator-disabled"))}),v.on("click",function(a){a.stopPropagation()}),x.on("click",v,function(a){var b=a.data,c=b.data("$shown"),d=b.width()-100,e=c.data("position")+d;e=Math.min(e,0),c.data("position",e),c.css("left",e)}),y.on("click",v,function(a){var b=a.data,c=b.data("$shown"),d=b.width()-100,e=c.data("position")-d;e=Math.max(e,-c.data("width")),c.data("position",e),c.css("left",e)}),p.$root.on("click","a.disabled",function(a){a.preventDefault()}),p.$root.on("click","a:not(.disabled)",p,t),w.$patterns.on("click","a:not(.disabled)",p,t);for(var E in w){var F=w[E];F.on("click",".keyboard-btn",F,function(a){var b=$(this),c=a.data,d=c.data("$select");d&&j(d),c.data("$select",b),f(b,c)})}v.on("click",".keyboard-btn.numbers",z,function(a){var b=parseInt($(this).text()),d=a.data,e=d.data("$focus");e.text(b),c("inputeditable",d,e[0])}),$(window).on("scroll",p,function(a){var b=a.data,c=b.$generator,d=b.$simulator,e=$(window).scrollTop(),f=c.offset().top,g=d.offset().top;f-50>e?b.$header.removeClass("reduce"):b.$header.addClass("reduce");var h=c.data("active");h&&(f-50>e||e>=b.topCreate)?(c.trigger("off"),c.data("active",!1)):!h&&e>=f-50&&e<b.topCreate&&(c.trigger("on"),c.data("active",!0)),h=d.data("active"),h&&g-50>e?(d.trigger("off"),d.data("active",!1)):!h&&!D.hasClass("simulator-disabled")&&e>=g-50&&(d.trigger("on"),d.data("active",!0))}),C.on("off",v,function(a){var b=a.data,c=b.data("$shown"),d=b.data("buttons");d.$patterns.removeClass("select"),c&&(c.removeClass("select"),b.data("$shown",null)),b.addClass("hide")}),z.on("off",v,function(a){var b=a.data,c=b.data("$shown");c&&(c.removeClass("select"),b.data("$shown",null)),b.addClass("hide")}),C.on("on",p,function(a){console.log("ON simulator");var b=a.data,c=b.$keyboard,d=c.data("$shown"),f=c.data("buttons"),g=b.href,h=b.$simulator,j=h.data("patterns");j||(j=e({},b)),b.jugglerPlaying||(g.queryString.play=g.queryString.play||j[0],b.juggler||(b.juggler=new i({stage:{container:"juggler-simulator",width:h.width(),height:h.height()}})),b.juggler.stop(),b.juggler.setPattern(g.queryString.play),b.juggler.play(),b.jugglerPlaying=!0),d&&d.removeClass("select"),d=f.$patterns,c.data("$shown",d),d.addClass("select"),c.removeClass("hide");var k=f.$patterns.data("width");k||(k=f.$patterns.width()-$(window).outerWidth()+120,f.$patterns.data("width",k))}),z.on("on",p,function(a){{var b=a.data,c=b.$generator.data("$focus"),d=b.$keyboard,e=d.data("$shown");d.data("buttons")}e&&(e.removeClass("select"),d.data("$shown",null)),c&&(e=c.data("$keys"),d.data("$shown",e),e.addClass("select"),d.removeClass("hide"))})})},{"./Juggler/juggler.js":10,"siteswap-generator":7}]},{},[11]);