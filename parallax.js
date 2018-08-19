

//https://codepen.io/rachsmith/post/how-to-move-elements-on-scroll-in-a-way-that-doesn-t-suck-too-bad
//https://codepen.io/anon/pen/dRPgpx

var gHeight, gWidth, gScrollHeight, gScrollOffset, gScrollPercent;
var gScrollCounter = 0;
var gLastMousePosition = {};
var gLastClickPosition = {};

var TOTAL_ROWS = 7;
var scaleElements = [];
var scaleElementsBottom;
var pacmanSection;
var bubbleBackgroundElement;
var bubbleBackgroundRect;

var translateYFactors = [100, 20, -10];

var elDarkenDiv;

var elBubbles1;
var elBubbles2;
var elBubbles3;

var pre = prefix();
var gJsPrefix  = pre.lowercase;
if ( gJsPrefix == 'moz') {
	gJsPrefix = 'Moz'
}

var elFish, elFishDir, elFishChat;
var gFish = {};

var testEl;
var gTestNo = true;

var gRequestId;
const STOP_LOOP_SCROLL_THRESHOLD = window.innerHeight * 0.85;

export function kickStartAnimateScales(){
	resize();
	
	elDarkenDiv = document.getElementById("parallaxDarken");
	
	buildScaleElements();
	
	elBubbles1 = document.getElementById('bubbles1');
	elBubbles2 = document.getElementById('bubbles2');
	elBubbles3 = document.getElementById('bubbles3');
	
	/*document.addEventListener("scroll", detectScrollPositionToStartFish);*/
	document.addEventListener("scroll", firewatchParallax);
	
	testEl = document.getElementById('btnHome');

	// block for firewatch
	// Hide fish initially
	//elFish.style.display = 'none'
}


var gradientBottomDiv = document.getElementById('bottomWaveDarkMargin');
var speeds = [-26, -16, 11, 16, 26, 36, 49, 69, 100];
function firewatchParallax(){
	var top = window.pageYOffset;
	var speed, yPos;
	for (var i=0; i<TOTAL_ROWS; i++){
		for (var j=0; j<scaleElements[i].length; j++){
			
			speed = speeds[i];
			yPos = -(top * speed / 100);
			scaleElements[i][j].setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
		}
	}
	
	scaleElementsBottom.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
	pacmanSection.setAttribute('style', 'transform: translate3d(0px, ' + -yPos + 'px, 0px)');
}
	
export function detectScrollPositionToStartFish(event){
	gScrollOffset = window.pageYOffset || window.scrollTop;
	
	// TODO: also stop animation if modal is showing
	
	if (gScrollOffset >= STOP_LOOP_SCROLL_THRESHOLD){
		// Stop animation loop for scales
		stopAnimationLoop();
		
		// Show and animate fish only when user scrolls into view
		initialiseFish();
		
	}else{
		startAnimationLoop();
		
		// Hide and stop animating fish when scroll up 
		// To avoid unnecessary processing
		stopFish();
	}
}

function initialiseFish(){
	elFish = document.getElementById('fish');
	elFishDir = document.getElementById('fish-direction');
	elFishChat = document.getElementById('chat-fish');
	elFish.addEventListener("mouseover", hoverFish);
	elFish.addEventListener("mouseout", moveFish);
	
	elFish.style.display = 'block';
	
	moveFish();
	blowBubble();
}

function stopFish(){
	clearTimeout(gFish.timeout);
	clearTimeout(gFish.bubbleTimeout);
	
	var elToDestroy = document.getElementById('fish-bubble');
	if (elToDestroy){
		document.body.removeChild(elToDestroy);
	}
}

function startAnimationLoop(){
	if (!gRequestId) {
       gRequestId = window.requestAnimationFrame(loop);
    }
}

function stopAnimationLoop(){
	if (gRequestId) {
       window.cancelAnimationFrame(gRequestId);
       gRequestId = undefined;
    }
}

function hoverFish(event) {
	//this is the original element the event handler was assigned to
	var e = event.toElement || event.relatedTarget;
	if (e.parentNode == this || e == this) {
	   return;
	}
		
    // handle mouse event here!
	elFish.style['transition'] = 'transform 10000s';
	
	clearTimeout(gFish.timeout);
}


function blowBubble(){
	
	clearTimeout(gFish.bubbleTimeout);
	
	var elToDestroy = document.getElementById('fish-bubble');
	if (elToDestroy){
		document.body.removeChild(elToDestroy);
	}
	
	var fishRect = elFish.getBoundingClientRect();
	var elFishBub = document.createElement('div');
	elFishBub.id = 'fish-bubble';
	elFishBub.className = 'fish-bubble';
	elFishBub.style.left = fishRect.left + 'px';
	elFishBub.style.top = fishRect.top + gHeight + 'px';
	
	if (hasClassName(elFishDir.className, 'flip-left')){
		elFishBub.className = addClassToString(elFishBub.className, 'bubble-left');
	}else{
		elFishBub.className = removeClassFromString(elFishBub.className, 'bubble-left');
	}
	
	document.body.appendChild(elFishBub);
	
	var fishTimeout = setTimeout(blowBubble, getRandom(5000));
	gFish.bubbleTimeout = fishTimeout;
}

function moveFish(){
	
	clearTimeout(gFish.timeout);
	
	var x = getRandom(gWidth) - 150;
	var y = getRandom(gHeight);
	
	if (x < gFish.previousX){
		elFishDir.className = addClassToString(elFishDir.className, 'flip-left');
		elFishDir.className = removeClassFromString(elFishDir.className, 'flip-right');
		elFishChat.className = addClassToString(elFishChat.className, 'left');
	}else{
		elFishDir.className = addClassToString(elFishDir.className, 'flip-right');
		elFishDir.className = removeClassFromString(elFishDir.className, 'flip-left');
		elFishChat.className = removeClassFromString(elFishChat.className, 'left');
	}
	
	elFish.style['transform'] = 'translateX('+x+'px) translateY('+y+'px)';
	elFish.style['transition'] = 'transform 10s';
	
	var fishTimeout = setTimeout(moveFish, getRandom(10000));
	gFish.timeout = fishTimeout;
	
	gFish.previousX = x;
	gFish.previousY = y;
}


function loop() {
	gScrollOffset = window.pageYOffset || window.scrollTop;
	gScrollPercent = gScrollOffset/gScrollHeight * 1.3 || 0;
  
    //gTestNo = !gTestNo;
	//testEl.innerHTML = gScrollOffset + " " + gTestNo;
  
	for (var i=0; i<TOTAL_ROWS; i++){
		for (var j=0; j<scaleElements[i].length; j++){
			
			var translateYFactor = 0;
			//var scaleFactor;
			if (i<3){
				translateYFactor = (i+1) * translateYFactors[i] * gScrollPercent;
				//scaleFactor = 1-(gScrollPercent/2);
			}else if (i==3){
				//scaleFactor = 1;
			}else{
				//scaleFactor = 1+(gScrollPercent/2);
			}
			
			//scaleElements[i][j].style['webkitTransform'] = 'translateY('+translateYFactor+'px) scale('+scaleFactor+')';
			scaleElements[i][j].style['webkitTransform'] = 'translateY('+translateYFactor+'px)';
		}
	}
	
	gRequestId = undefined;
	startAnimationLoop();
	//requestAnimationFrame(loop);
}


function buildScaleElements(){
	for (var i=0; i<TOTAL_ROWS; i++){
		
		var elCount = (i % 2 == 0) ? 6 : 7; 
		scaleElements[i] = Array();
		
		for (var j=0; j<elCount; j++){
			var scaleElement = document.getElementById('scaleCol'+(i+1)+'_'+(j+1));
			scaleElements[i].push(scaleElement);
		}
	}
	
	scaleElementsBottom = document.getElementById('contentBackground');
	
	pacmanSection = document.getElementById('pacmanSection');
}

function resize() {
  gWidth = window.innerWidth;
  gHeight = window.innerHeight;
  gScrollHeight = gHeight;
}

/* prefix detection http://davidwalsh.name/vendor-prefix */

function prefix() {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
}

function getRandom(upper) {
  return Math.random() * upper;
}


function hasClassName(className, searchClassName){
	return (className.indexOf(searchClassName)>-1);
}
function addClassToString(className, classNameToAdd){
	var classes = className.split(classNameToAdd);
	for (var i=0; i<classes.length; i++){
		classes[i] = classes[i].trim();
	}
	classes.push(classNameToAdd)
	
	return classes.join(' ');
}

function removeClassFromString(className, classNameToRemove){
	var classes = className.split(classNameToRemove);
	for (var i=0; i<classes.length; i++){
		classes[i] = classes[i].trim();
	}
	return classes.join(' ');
}
