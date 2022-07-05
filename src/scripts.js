// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_animated-headline
// Usage: codyhouse.co/license

(function() {
  var TextAnim = function(element) {
    this.element = element;
    this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
    this.words = this.element.getElementsByClassName('js-text-anim__word');
    this.selectedWord = 0;
    // interval between two animations
    this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
    // duration of single animation (e.g., time for a single word to rotate)
    this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
    // keep animating after first loop was completed
    this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
    this.wordInClass = 'text-anim__word--in';
    this.wordOutClass = 'text-anim__word--out';
    // check for specific animations
    this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
    if(this.isClipAnim) {
      this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
      this.animPulseClass = 'text-anim__wrapper--pulse';
    }
    initTextAnim(this);
  };

  function initTextAnim(element) {
    // make sure there's a word with the wordInClass
    setSelectedWord(element);
    // if clip animation -> add pulse class
    if(element.isClipAnim) {
      Util.addClass(element.wordsWrapper[0], element.animPulseClass);
    }
    // init loop
    loopWords(element);
  };

  function setSelectedWord(element) {
    var selectedWord = element.element.getElementsByClassName(element.wordInClass);
    if(selectedWord.length == 0) {
      Util.addClass(element.words[0], element.wordInClass);
    } else {
      element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
    }
  };

  function loopWords(element) {
    // stop animation after first loop was completed
    if(!element.loop && element.selectedWord == element.words.length - 1) {
      return;
    }
    var newWordIndex = getNewWordIndex(element);
    setTimeout(function() {
      if(element.isClipAnim) { // clip animation only
        switchClipWords(element, newWordIndex);
      } else {
        switchWords(element, newWordIndex);
      }
    }, element.loopInterval);
  };

  function switchWords(element, newWordIndex) {
    // switch words
    Util.removeClass(element.words[element.selectedWord], element.wordInClass);
    Util.addClass(element.words[element.selectedWord], element.wordOutClass);
    Util.addClass(element.words[newWordIndex], element.wordInClass);
    // reset loop
    resetLoop(element, newWordIndex);
  };

  function resetLoop(element, newIndex) {
    setTimeout(function() { 
      // set new selected word
      Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
      element.selectedWord = newIndex;
      loopWords(element); // restart loop
    }, element.transitionDuration);
  };

  function switchClipWords(element, newWordIndex) {
    // clip animation only
    var startWidth =  element.words[element.selectedWord].offsetWidth,
      endWidth = element.words[newWordIndex].offsetWidth;
    
    // remove pulsing animation
    Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
    // close word
    animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      element.selectedWord = newWordIndex;

      // open word
      animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // add pulsing class
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
        loopWords(element);
      });
    });
  };

  function getNewWordIndex(element) {
    // get index of new word to be shown
    var index = element.selectedWord + 1;
    if(index >= element.words.length) index = 0;
    return index;
  };

  function animateWidth(start, to, element, duration, cb) {
    // animate width of a word for the clip animation
    var currentTime = null;

    var animateProperty = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      
      var val = Math.easeInOutQuart(progress, start, to - start, duration);
      element.style.width = val+"px";
      if(progress < duration) {
          window.requestAnimationFrame(animateProperty);
      } else {
        cb();
      }
    };
  
    //set the width of the element before starting animation -> fix bug on Safari
    element.style.width = start+"px";
    window.requestAnimationFrame(animateProperty);
  };

  window.TextAnim = TextAnim;

  // init TextAnim objects
  var textAnim = document.getElementsByClassName('js-text-anim'),
    reducedMotion = Util.osHasReducedMotion();
  if( textAnim ) {
    if(reducedMotion) return;
    for( var i = 0; i < textAnim.length; i++) {
      (function(i){ new TextAnim(textAnim[i]);})(i);
    }
  }
}());
// File#: _1_countdown
// Usage: codyhouse.co/license
(function() {
  var CountDown = function(element) {
    this.element = element;
    this.labels = this.element.getAttribute('data-labels') ? this.element.getAttribute('data-labels').split(',') : [];
    this.intervalId;
    // set visible labels
    this.setVisibleLabels();
    //create countdown HTML
    this.createCountDown();
    //store time elements
    this.days = this.element.getElementsByClassName('js-countdown__value--0')[0];
    this.hours = this.element.getElementsByClassName('js-countdown__value--1')[0];
    this.mins = this.element.getElementsByClassName('js-countdown__value--2')[0];
    this.secs = this.element.getElementsByClassName('js-countdown__value--3')[0];
    this.endTime = this.getEndTime();
    //init counter
    this.initCountDown();
  };

  CountDown.prototype.setVisibleLabels = function() {
    this.visibleLabels = this.element.getAttribute('data-visible-labels') ? this.element.getAttribute('data-visible-labels').split(',') : [];
    this.visibleLabels = this.visibleLabels.map(function(label){
      return label.trim();
    });
  };

  CountDown.prototype.createCountDown = function() {
    var wrapper = document.createElement("div");
    Util.setAttributes(wrapper, {'aria-hidden': 'true', 'class': 'countdown__timer'});

    for(var i = 0; i < 4; i++) {
      var timeItem = document.createElement("span"),
        timeValue = document.createElement("span"),
        timeLabel = document.createElement('span');
      
      timeItem.setAttribute('class', 'countdown__item');
      timeValue.setAttribute('class', 'countdown__value countdown__value--'+i+' js-countdown__value--'+i);
      timeItem.appendChild(timeValue);

      if( this.labels && this.labels.length > 0 ) {
        timeLabel.textContent = this.labels[i].trim();
        timeLabel.setAttribute('class', 'countdown__label');
        timeItem.appendChild(timeLabel);
      }
      
      wrapper.appendChild(timeItem);
    }
    // append new content to countdown element
    this.element.insertBefore(wrapper, this.element.firstChild);
    // this.element.appendChild(wrapper);
  };

  CountDown.prototype.getEndTime = function() {
    // get number of remaining seconds 
    if(this.element.getAttribute('data-timer')) return Number(this.element.getAttribute('data-timer'))*1000 + new Date().getTime();
    else if(this.element.getAttribute('data-countdown')) return Number(new Date(this.element.getAttribute('data-countdown')).getTime());
  };

  CountDown.prototype.initCountDown = function() {
    var self = this;
    this.intervalId = setInterval(function(){
      self.updateCountDown(false);
    }, 1000);
    this.updateCountDown(true);
  };
  
  CountDown.prototype.updateCountDown = function(bool) {
    // original countdown function
    // https://gist.github.com/adriennetacke/f5a25c304f1b7b4a6fa42db70415bad2
    var time = parseInt( (this.endTime - new Date().getTime())/1000 ),
      days = 0,
      hours = 0,
      mins = 0,
      seconds = 0;

    if(isNaN(time) || time < 0) {
      clearInterval(this.intervalId);
      this.emitEndEvent();
    } else {
      days = parseInt(time / 86400);
      time = (time % 86400);
      hours = parseInt(time / 3600);
      time = (time % 3600);
      mins = parseInt(time / 60);
      time = (time % 60);
      seconds = parseInt(time);
    }
    
    // hide days/hours/mins if not available 
    if(bool && days == 0 && this.visibleLabels.indexOf('d') < 0) this.days.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0 && this.visibleLabels.indexOf('h') < 0) this.hours.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0 && mins == 0 && this.visibleLabels.indexOf('m') < 0) this.mins.parentElement.style.display = "none";
    
    this.days.textContent = days;
    this.hours.textContent = this.getTimeFormat(hours);
    this.mins.textContent = this.getTimeFormat(mins);
    this.secs.textContent = this.getTimeFormat(seconds);
  };

  CountDown.prototype.getTimeFormat = function(time) {
    return ('0'+ time).slice(-2);
  };

  CountDown.prototype.emitEndEvent = function(time) {
    var event = new CustomEvent('countDownFinished');
    this.element.dispatchEvent(event);
  };

  //initialize the CountDown objects
  var countDown = document.getElementsByClassName('js-countdown');
  if( countDown.length > 0 ) {
    for( var i = 0; i < countDown.length; i++) {
      (function(i){new CountDown(countDown[i]);})(i);
    }
  }
}());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function () {
  // NOTE: you need the js code when using the --custom-dropdown/--minimal variation of the Custom Select component. Default version does nor require JS.

  var CustomSelect = function (element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.selectedOption = getSelectedOptionText(this);
    this.selectId = this.select.getAttribute('id');
    this.trigger = false;
    this.dropdown = false;
    this.customOptions = false;
    this.arrowIcon = this.element.getElementsByTagName('svg');
    this.label = document.querySelector('[for="' + this.selectId + '"]');

    this.optionIndex = 0; // used while building the custom dropdown

    initCustomSelect(this); // init markup
    initCustomSelectEvents(this); // init event listeners
  };

  function initCustomSelect(select) {
    // create the HTML for the custom dropdown element
    select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));

    // save custom elements
    select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
    select.trigger = select.element.getElementsByClassName('js-select__button')[0];
    select.customOptions = select.dropdown.getElementsByClassName('js-select__item');

    // hide default select
    Util.addClass(select.select, 'is-hidden');
    if (select.arrowIcon.length > 0) select.arrowIcon[0].style.display = 'none';

    // place dropdown
    placeDropdown(select);
  };

  function initCustomSelectEvents(select) {
    // option selection in dropdown
    initSelection(select);

    // click events
    select.trigger.addEventListener('click', function () {
      toggleCustomSelect(select, false);
    });
    if (select.label) {
      // move focus to custom trigger when clicking on <select> label
      select.label.addEventListener('click', function () {
        Util.moveFocus(select.trigger);
      });
    }
    // keyboard navigation
    select.dropdown.addEventListener('keydown', function (event) {
      if (event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if (event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      }
    });
    // native <select> element has been updated -> update custom select as well
    select.element.addEventListener('select-updated', function (event) {
      resetCustomSelect(select);
    });
  };

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
    if (bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    }
    select.trigger.setAttribute('aria-expanded', ariaExpanded);
    if (ariaExpanded == 'true') {
      var selectedOption = getSelectedOption(select);
      Util.moveFocus(selectedOption); // fallback if transition is not supported
      select.dropdown.addEventListener('transitionend', function cb() {
        Util.moveFocus(selectedOption);
        select.dropdown.removeEventListener('transitionend', cb);
      });
      placeDropdown(select); // place dropdown based on available space
    }
  };

  function placeDropdown(select) {
    // remove placement classes to reset position
    Util.removeClass(select.dropdown, 'select__dropdown--right select__dropdown--up');
    var triggerBoundingRect = select.trigger.getBoundingClientRect();
    Util.toggleClass(select.dropdown, 'select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
    // check if there's enough space up or down
    var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
    Util.toggleClass(select.dropdown, 'select__dropdown--up', moveUp);
    // check if we need to set a max width
    var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
    // set max-height based on available space
    select.dropdown.setAttribute('style', 'max-height: ' + maxHeight + 'px; width: ' + triggerBoundingRect.width + 'px;');
  };

  function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
    event.preventDefault();
    var index = Util.getIndexInArray(select.customOptions, document.activeElement);
    index = (direction == 'next') ? index + 1 : index - 1;
    if (index < 0) index = select.customOptions.length - 1;
    if (index >= select.customOptions.length) index = 0;
    Util.moveFocus(select.customOptions[index]);
  };

  function initSelection(select) { // option selection
    select.dropdown.addEventListener('click', function (event) {
      var option = event.target.closest('.js-select__item');
      if (!option) return;
      selectOption(select, option);
    });
  };

  function selectOption(select, option) {
    if (option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
      select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
    } else {
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if (selectedOption) selectedOption.setAttribute('aria-selected', 'false');
      option.setAttribute('aria-selected', 'true');
      select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
      select.trigger.setAttribute('aria-expanded', 'false');
      // new option has been selected -> update native <select> element _ arai-label of trigger <button>
      updateNativeSelect(select, option.getAttribute('data-index'));
      updateTriggerAria(select);
    }
    // move focus back to trigger
    select.trigger.focus();
  };

  function updateNativeSelect(select, index) {
    select.select.selectedIndex = index;
    select.select.dispatchEvent(new CustomEvent('change', { bubbles: true })); // trigger change event
  };

  function updateTriggerAria(select) {
    select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML + ', ' + select.label.textContent);
  };

  function getSelectedOptionText(select) {// used to initialize the label of the custom select button
    var label = '';
    if ('selectedIndex' in select.select) {
      label = select.options[select.select.selectedIndex].text;
    } else {
      label = select.select.querySelector('option[selected]').text;
    }
    return label;

  };

  function initButtonSelect(select) { // create the button element -> custom select trigger
    // check if we need to add custom classes to the button trigger
    var customClasses = select.element.getAttribute('data-trigger-class') ? ' ' + select.element.getAttribute('data-trigger-class') : '';

    var label = select.options[select.select.selectedIndex].innerHTML + ', ' + select.label.textContent;

    var button = '<button type="button" class="js-select__button select__button' + customClasses + '" aria-label="' + label + '" aria-expanded="false" aria-controls="' + select.selectId + '-dropdown"><span aria-hidden="true" class="js-select__label select__label">' + select.selectedOption + '</span>';
    if (select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
      var clone = select.arrowIcon[0].cloneNode(true);
      Util.removeClass(clone, 'select__icon');
      button = button + clone.outerHTML;
    }

    return button + '</button>';

  };

  function initListSelect(select) { // create custom select dropdown
    var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="' + select.selectId + '-description" id="' + select.selectId + '-dropdown">';
    list = list + getSelectLabelSR(select);
    if (select.optGroups.length > 0) {
      for (var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName('option'),
          optGroupLabel = '<li><span class="select__item select__item--optgroup">' + select.optGroups[i].getAttribute('label') + '</span></li>';
        list = list + '<ul class="select__list" role="listbox">' + optGroupLabel + getOptionsList(select, optGroupList) + '</ul>';
      }
    } else {
      list = list + '<ul class="select__list" role="listbox">' + getOptionsList(select, select.options) + '</ul>';
    }
    return list;
  };

  function getSelectLabelSR(select) {
    if (select.label) {
      return '<p class="sr-only" id="' + select.selectId + '-description">' + select.label.textContent + '</p>'
    } else {
      return '';
    }
  };

  function resetCustomSelect(select) {
    // <select> element has been updated (using an external control) - update custom select
    var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
    if (selectedOption) selectedOption.setAttribute('aria-selected', 'false');
    var option = select.dropdown.querySelector('.js-select__item[data-index="' + select.select.selectedIndex + '"]');
    option.setAttribute('aria-selected', 'true');
    select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
    select.trigger.setAttribute('aria-expanded', 'false');
    updateTriggerAria(select);
  };

  function getOptionsList(select, options) {
    var list = '';
    for (var i = 0; i < options.length; i++) {
      var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"',
        disabled = options[i].hasAttribute('disabled') ? ' disabled' : '';
      list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="' + options[i].value + '" ' + selected + disabled + ' data-index="' + select.optionIndex + '">' + options[i].text + '</button></li>';
      select.optionIndex = select.optionIndex + 1;
    };
    return list;
  };

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if (option) return option;
    else return select.dropdown.getElementsByClassName('js-select__item')[0];
  };

  function moveFocusToSelectTrigger(select) {
    if (!document.activeElement.closest('.js-select')) return
    select.trigger.focus();
  };

  function checkCustomSelectClick(select, target) { // close select when clicking outside it
    if (!select.element.contains(target)) toggleCustomSelect(select, 'false');
  };

  //initialize the CustomSelect objects
  var customSelect = document.getElementsByClassName('js-select');
  if (customSelect.length > 0) {
    var selectArray = [];
    for (var i = 0; i < customSelect.length; i++) {
      (function (i) { selectArray.push(new CustomSelect(customSelect[i])); })(i);
    }

    // listen for key events
    window.addEventListener('keyup', function (event) {
      if (event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        // close custom select on 'Esc'
        selectArray.forEach(function (element) {
          moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
          toggleCustomSelect(element, 'false'); // close dropdown
        });
      }
    });
    // close custom select when clicking outside it
    window.addEventListener('click', function (event) {
      selectArray.forEach(function (element) {
        checkCustomSelectClick(element, event.target);
      });
    });
  }
}());
// File#: _1_drawer
// Usage: codyhouse.co/license
(function () {
  var Drawer = function (element) {
    this.element = element;
    this.content = document.getElementsByClassName('js-drawer__body')[0];
    this.triggers = document.querySelectorAll('[aria-controls="' + this.element.getAttribute('id') + '"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.isModal = Util.hasClass(this.element, 'js-drawer--modal');
    this.showClass = "drawer--is-visible";
    this.initDrawer();
  };

  Drawer.prototype.initDrawer = function () {
    var self = this;
    //open drawer when clicking on trigger buttons
    if (this.triggers) {
      for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener('click', function (event) {
          event.preventDefault();
          if (Util.hasClass(self.element, self.showClass)) {
            self.closeDrawer(event.target);
            return;
          }
          self.selectedTrigger = event.target;
          self.showDrawer();
          self.initDrawerEvents();
        });
      }
    }

    // if drawer is already open -> we should initialize the drawer events
    if (Util.hasClass(this.element, this.showClass)) this.initDrawerEvents();
  };

  Drawer.prototype.showDrawer = function () {
    var self = this;
    this.content.scrollTop = 0;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    Util.moveFocus(this.element);
    // wait for the end of transitions before moving focus
    this.element.addEventListener("transitionend", function cb(event) {
      Util.moveFocus(self.element);
      self.element.removeEventListener("transitionend", cb);
    });
    this.emitDrawerEvents('drawerIsOpen', this.selectedTrigger);
  };

  Drawer.prototype.closeDrawer = function (target) {
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelDrawerEvents();
    this.emitDrawerEvents('drawerIsClose', target);
  };

  Drawer.prototype.initDrawerEvents = function () {
    //add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  };

  Drawer.prototype.cancelDrawerEvents = function () {
    //remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  };

  Drawer.prototype.handleEvent = function (event) {
    switch (event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  };

  Drawer.prototype.initKeyDown = function (event) {
    if (event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape') {
      //close drawer window on esc
      this.closeDrawer(false);
    } else if (this.isModal && (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab')) {
      //trap focus inside drawer
      this.trapFocus(event);
    }
  };

  Drawer.prototype.initClick = function (event) {
    //close drawer when clicking on close button or drawer bg layer 
    if (!event.target.closest('.js-drawer__close') && !Util.hasClass(event.target, 'js-drawer')) return;
    event.preventDefault();
    this.closeDrawer(event.target);
  };

  Drawer.prototype.trapFocus = function (event) {
    if (this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of drawer
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of drawer
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  Drawer.prototype.getFocusableElements = function () {
    //get all focusable elements inside the drawer
    var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
  };

  Drawer.prototype.getFirstVisible = function (elements) {
    //get first visible focusable element inside the drawer
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
        this.firstFocusable = elements[i];
        return true;
      }
    }
  };

  Drawer.prototype.getLastVisible = function (elements) {
    //get last visible focusable element inside the drawer
    for (var i = elements.length - 1; i >= 0; i--) {
      if (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
        this.lastFocusable = elements[i];
        return true;
      }
    }
  };

  Drawer.prototype.emitDrawerEvents = function (eventName, target) {
    var event = new CustomEvent(eventName, { detail: target });
    this.element.dispatchEvent(event);
  };

  //initialize the Drawer objects
  var drawer = document.getElementsByClassName('js-drawer');
  if (drawer.length > 0) {
    for (var i = 0; i < drawer.length; i++) {
      (function (i) { new Drawer(drawer[i]); })(i);
    }
  }
}());
// File#: _1_file-upload
// Usage: codyhouse.co/license
(function() {
  var InputFile = function(element) {
    this.element = element;
    this.input = this.element.getElementsByClassName('file-upload__input')[0];
    this.label = this.element.getElementsByClassName('file-upload__label')[0];
    this.multipleUpload = this.input.hasAttribute('multiple'); // allow for multiple files selection
    
    // this is the label text element -> when user selects a file, it will be changed from the default value to the name of the file 
    this.labelText = this.element.getElementsByClassName('file-upload__text')[0];
    this.initialLabel = this.labelText.textContent;

    initInputFileEvents(this);
  }; 

  function initInputFileEvents(inputFile) {
    // make label focusable
    inputFile.label.setAttribute('tabindex', '0');
    inputFile.input.setAttribute('tabindex', '-1');

    // move focus from input to label -> this is triggered when a file is selected or the file picker modal is closed
    inputFile.input.addEventListener('focusin', function(event){ 
      inputFile.label.focus();
    });

    // press 'Enter' key on label element -> trigger file selection
    inputFile.label.addEventListener('keydown', function(event) {
      if( event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {inputFile.input.click();}
    });

    // file has been selected -> update label text
    inputFile.input.addEventListener('change', function(event){ 
      updateInputLabelText(inputFile);
    });
  };

  function updateInputLabelText(inputFile) {
    var label = '';
    if(inputFile.input.files && inputFile.input.files.length < 1) { 
      label = inputFile.initialLabel; // no selection -> revert to initial label
    } else if(inputFile.multipleUpload && inputFile.input.files && inputFile.input.files.length > 1) {
      label = inputFile.input.files.length+ ' files'; // multiple selection -> show number of files
    } else {
      label = inputFile.input.value.split('\\').pop(); // single file selection -> show name of the file
    }
    inputFile.labelText.textContent = label;
  };

  //initialize the InputFile objects
  var inputFiles = document.getElementsByClassName('file-upload');
  if( inputFiles.length > 0 ) {
    for( var i = 0; i < inputFiles.length; i++) {
      (function(i){new InputFile(inputFiles[i]);})(i);
    }
  }
}());
// File#: _1_filter-navigation
// Usage: codyhouse.co/license
(function() {
  var FilterNav = function(element) {
    this.element = element;
    this.wrapper = this.element.getElementsByClassName('js-filter-nav__wrapper')[0];
    this.nav = this.element.getElementsByClassName('js-filter-nav__nav')[0];
    this.list = this.nav.getElementsByClassName('js-filter-nav__list')[0];
    this.control = this.element.getElementsByClassName('js-filter-nav__control')[0];
    this.modalClose = this.element.getElementsByClassName('js-filter-nav__close-btn')[0];
    this.placeholder = this.element.getElementsByClassName('js-filter-nav__placeholder')[0];
    this.marker = this.element.getElementsByClassName('js-filter-nav__marker');
    this.layout = 'expanded';
    initFilterNav(this);
  };

  function initFilterNav(element) {
    checkLayout(element); // init layout
    if(element.layout == 'expanded') placeMarker(element);
    element.element.addEventListener('update-layout', function(event){ // on resize - modify layout
      checkLayout(element);
    });

    // update selected item
    element.wrapper.addEventListener('click', function(event){
      var newItem = event.target.closest('.js-filter-nav__btn');
      if(newItem) {
        updateCurrentItem(element, newItem);
        return;
      }
      // close modal list - mobile version only
      if(Util.hasClass(event.target, 'js-filter-nav__wrapper') || event.target.closest('.js-filter-nav__close-btn')) toggleModalList(element, false);
    });

    // open modal list - mobile version only
    element.control.addEventListener('click', function(event){
      toggleModalList(element, true);
    });
    
    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control)) {
          toggleModalList(element, false);
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control) && !document.activeElement.closest('.js-filter-nav__wrapper')) toggleModalList(element, false);
      }
    });
  };

  function updateCurrentItem(element, btn) {
    if(btn.getAttribute('aria-current') == 'true') {
      toggleModalList(element, false);
      return;
    }
    var activeBtn = element.wrapper.querySelector('[aria-current]');
    if(activeBtn) activeBtn.removeAttribute('aria-current');
    btn.setAttribute('aria-current', 'true');
    // update trigger label on selection (visible on mobile only)
    element.placeholder.textContent = btn.textContent;
    toggleModalList(element, false);
    if(element.layout == 'expanded') placeMarker(element);
    window.dispatchEvent(new CustomEvent('navigate', { detail: btn.value }))
  };

  function toggleModalList(element, bool) {
    element.control.setAttribute('aria-expanded', bool);
    Util.toggleClass(element.wrapper, 'filter-nav__wrapper--is-visible', bool);
    if(bool) {
      element.nav.querySelectorAll('[href], button:not([disabled])')[0].focus();
    } else if(isVisible(element.control)) {
      element.control.focus();
    }
  };

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };

  function checkLayout(element) {
    if(element.layout == 'expanded' && switchToCollapsed(element)) { // check if there's enough space 
      element.layout = 'collapsed';
      Util.removeClass(element.element, 'filter-nav--expanded');
      Util.addClass(element.element, 'filter-nav--collapsed');
      Util.removeClass(element.modalClose, 'is-hidden');
      Util.removeClass(element.control, 'is-hidden');
    } else if(element.layout == 'collapsed' && switchToExpanded(element)) {
      element.layout = 'expanded';
      Util.addClass(element.element, 'filter-nav--expanded');
      Util.removeClass(element.element, 'filter-nav--collapsed');
      Util.addClass(element.modalClose, 'is-hidden');
      Util.addClass(element.control, 'is-hidden');
    }
    // place background element
    if(element.layout == 'expanded') placeMarker(element);
  };

  function switchToCollapsed(element) {
    return element.nav.scrollWidth > element.nav.offsetWidth;
  };

  function switchToExpanded(element) {
    element.element.style.visibility = 'hidden';
    Util.addClass(element.element, 'filter-nav--expanded');
    Util.removeClass(element.element, 'filter-nav--collapsed');
    var switchLayout = element.nav.scrollWidth <= element.nav.offsetWidth;
    Util.removeClass(element.element, 'filter-nav--expanded');
    Util.addClass(element.element, 'filter-nav--collapsed');
    element.element.style.visibility = 'visible';
    return switchLayout;
  };

  function placeMarker(element) {
    var activeElement = element.wrapper.querySelector('.js-filter-nav__btn[aria-current="true"]');
    if(element.marker.length == 0 || !activeElement ) return;
    element.marker[0].style.width = activeElement.offsetWidth+'px';
    element.marker[0].style.transform = 'translateX('+(activeElement.getBoundingClientRect().left - element.list.getBoundingClientRect().left)+'px)';
  };

  var filterNav = document.getElementsByClassName('js-filter-nav');
  if(filterNav.length > 0) {
    var filterNavArray = [];
    for(var i = 0; i < filterNav.length; i++) {
      filterNavArray.push(new FilterNav(filterNav[i]));
    }

    var resizingId = false,
      customEvent = new CustomEvent('update-layout');

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.onloadingdone = function (fontFaceSetEvent) {
        doneResizing();
      };
    }

    function doneResizing() {
      for( var i = 0; i < filterNavArray.length; i++) {
        (function(i){filterNavArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  }
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function () {
  var Modal = function (element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="' + this.element.getAttribute('id') + '"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null; // focus will be moved to this element when modal is open
    this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
    this.selectedTrigger = null;
    this.preventScrollEl = this.getPreventScrollEl();
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.getPreventScrollEl = function () {
    var scrollEl = false;
    var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
    if (querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  };

  Modal.prototype.initModal = function () {
    var self = this;
    //open modal when clicking on trigger buttons
    if (this.triggers) {
      for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener('click', function (event) {
          event.preventDefault();
          if (Util.hasClass(self.element, self.showClass)) {
            self.closeModal();
            return;
          }
          self.selectedTrigger = event.currentTarget;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener('openModal', function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener('closeModal', function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });

    // if modal is open by default -> initialise modal events
    if (Util.hasClass(this.element, this.showClass)) this.initModalEvents();
  };

  Modal.prototype.showModal = function () {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    if (this.moveFocusEl) {
      this.moveFocusEl.focus();
      // wait for the end of transitions before moving focus
      this.element.addEventListener("transitionend", function cb(event) {
        self.moveFocusEl.focus();
        self.element.removeEventListener("transitionend", cb);
      });
    }
    this.emitModalEvents('modalIsOpen');
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
  };

  Modal.prototype.closeModal = function () {
    if (!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelModalEvents();
    this.emitModalEvents('modalIsClose');
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = '';
  };

  Modal.prototype.initModalEvents = function () {
    //add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  };

  Modal.prototype.cancelModalEvents = function () {
    //remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch (event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function (event) {
    if (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') {
      //trap focus inside modal
      this.trapFocus(event);
    } else if ((event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }
  };

  Modal.prototype.initClick = function (event) {
    //close modal when clicking on close button or modal bg layer 
    if (!event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal')) return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function (event) {
    if (this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  Modal.prototype.getFocusableElements = function () {
    //get all focusable elements inside the modal
    var allFocusable = this.element.querySelectorAll(focusableElString);
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
    this.getFirstFocusable();
  };

  Modal.prototype.getFirstVisible = function (elements) {
    //get first visible focusable element inside the modal
    for (var i = 0; i < elements.length; i++) {
      if (isVisible(elements[i])) {
        this.firstFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getLastVisible = function (elements) {
    //get last visible focusable element inside the modal
    for (var i = elements.length - 1; i >= 0; i--) {
      if (isVisible(elements[i])) {
        this.lastFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getFirstFocusable = function () {
    if (!this.modalFocus || !Element.prototype.matches) {
      this.moveFocusEl = this.firstFocusable;
      return;
    }
    var containerIsFocusable = this.modalFocus.matches(focusableElString);
    if (containerIsFocusable) {
      this.moveFocusEl = this.modalFocus;
    } else {
      this.moveFocusEl = false;
      var elements = this.modalFocus.querySelectorAll(focusableElString);
      for (var i = 0; i < elements.length; i++) {
        if (isVisible(elements[i])) {
          this.moveFocusEl = elements[i];
          break;
        }
      }
      if (!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
    }
  };

  Modal.prototype.emitModalEvents = function (eventName) {
    var event = new CustomEvent(eventName, { detail: this.selectedTrigger });
    this.element.dispatchEvent(event);
  };

  function isVisible(element) {
    return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  };

  window.Modal = Modal;

  //initialize the Modal objects
  var modals = document.getElementsByClassName('js-modal');
  // generic focusable elements string selector
  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
  if (modals.length > 0) {
    var modalArrays = [];
    for (var i = 0; i < modals.length; i++) {
      (function (i) { modalArrays.push(new Modal(modals[i])); })(i);
    }

    window.addEventListener('keydown', function (event) { //close modal window on esc
      if (event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        for (var i = 0; i < modalArrays.length; i++) {
          (function (i) { modalArrays[i].closeModal(); })(i);
        };
      }
    });
  }
}());
// File#: _1_notice
// Usage: codyhouse.co/license
(function() {
  function initNoticeEvents(notice) {
    notice.addEventListener('click', function(event){
      if(event.target.closest('.js-notice__hide-control')) {
        event.preventDefault();
        Util.addClass(notice, 'notice--hide');
      }
    });
  };
  
  var noticeElements = document.getElementsByClassName('js-notice');
  if(noticeElements.length > 0) {
    for(var i=0; i < noticeElements.length; i++) {(function(i){
      initNoticeEvents(noticeElements[i]);
    })(i);}
  }
}());
// File#: _1_rating
// Usage: codyhouse.co/license
(function () {
  class Rating {
    constructor(element) {
      this.element = element;
      this.icons = this.element.getElementsByClassName('js-rating__control')[0];
      this.iconCode = this.icons.children[0].parentNode.innerHTML;
      this.initialRating = [];
      this.initialRatingElement = this.element.getElementsByClassName('js-rating__value')[0];
      this.ratingItems;
      this.selectedRatingItem;
      this.readOnly = Util.hasClass(this.element, 'js-rating--read-only');
      this.ratingMaxValue = 5;
      this.getInitialRating();
      this.initRatingHtml();
    }
    getInitialRating() {
      // get the rating of the product
      if (!this.initialRatingElement || !this.readOnly) {
        this.initialRating = [0, false];
        return;
      }

      var initialValue = Number(this.initialRatingElement.textContent);
      if (isNaN(initialValue)) {
        this.initialRating = [0, false];
        return;
      }

      var floorNumber = Math.floor(initialValue);
      this.initialRating[0] = (floorNumber < initialValue) ? floorNumber + 1 : floorNumber;
      this.initialRating[1] = (floorNumber < initialValue) ? Math.round((initialValue - floorNumber) * 100) : false;
    }
    initRatingHtml() {
      //create the star elements
      var iconsList = this.readOnly ? '<ul>' : '<ul role="radiogroup">';

      //if initial rating value is zero -> add a 'zero' item 
      if (this.initialRating[0] == 0 && !this.initialRating[1]) {
        iconsList = iconsList + '<li class="rating__item--zero rating__item--checked"></li>';
      }

      // create the stars list 
      for (var i = 0; i < this.ratingMaxValue; i++) {
        iconsList = iconsList + this.getStarHtml(i);
      }
      iconsList = iconsList + '</ul>';

      // --default variation only - improve SR accessibility including a legend element 
      if (!this.readOnly) {
        var labelElement = this.element.getElementsByTagName('label');
        if (labelElement.length > 0) {
          var legendElement = '<legend class="' + labelElement[0].getAttribute('class') + '">' + labelElement[0].textContent + '</legend>';
          iconsList = '<fieldset>' + legendElement + iconsList + '</fieldset>';
          Util.addClass(labelElement[0], 'is-hidden');
        }
      }

      this.icons.innerHTML = iconsList;

      //init object properties
      this.ratingItems = this.icons.getElementsByClassName('js-rating__item');
      this.selectedRatingItem = this.icons.getElementsByClassName('rating__item--checked')[0];

      //show the stars
      Util.removeClass(this.icons, 'rating__control--is-hidden');

      //event listener
      !this.readOnly && this.initRatingEvents(); // rating vote enabled
    }
    getStarHtml(index) {
      var listItem = '';
      var checked = (index + 1 == this.initialRating[0]) ? true : false, itemClass = checked ? ' rating__item--checked' : '', tabIndex = (checked || (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0)) ? 0 : -1, showHalf = checked && this.initialRating[1] ? true : false, iconWidth = showHalf ? ' rating__item--half' : '';
      if (!this.readOnly) {
        listItem = '<li class="js-rating__item' + itemClass + iconWidth + '" role="radio" aria-label="' + (index + 1) + '" aria-checked="' + checked + '" tabindex="' + tabIndex + '"><div class="rating__icon">' + this.iconCode + '</div></li>';
      } else {
        var starInner = showHalf ? '<div class="rating__icon">' + this.iconCode + '</div><div class="rating__icon rating__icon--inactive">' + this.iconCode + '</div>' : '<div class="rating__icon">' + this.iconCode + '</div>';
        listItem = '<li class="js-rating__item' + itemClass + iconWidth + '">' + starInner + '</li>';
      }
      return listItem;
    }
    initRatingEvents() {
      var self = this;

      //click on a star
      this.icons.addEventListener('click', function (event) {
        var trigger = event.target.closest('.js-rating__item');
        self.resetSelectedIcon(trigger);
      });

      //keyboard navigation -> select new star
      this.icons.addEventListener('keydown', function (event) {
        if (event.keyCode && (event.keyCode == 39 || event.keyCode == 40) || event.key && (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'arrowdown')) {
          self.selectNewIcon('next'); //select next star on arrow right/down
        } else if (event.keyCode && (event.keyCode == 37 || event.keyCode == 38) || event.key && (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'arrowup')) {
          self.selectNewIcon('prev'); //select prev star on arrow left/up
        } else if (event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') {
          self.selectFocusIcon(); // select focused star on Space
        }
      });
    }
    selectNewIcon(direction) {
      var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
      index = (direction == 'next') ? index + 1 : index - 1;
      if (index < 0)
        index = this.ratingItems.length - 1;
      if (index >= this.ratingItems.length)
        index = 0;
      this.resetSelectedIcon(this.ratingItems[index]);
      this.ratingItems[index].focus();
    }
    selectFocusIcon(direction) {
      this.resetSelectedIcon(document.activeElement);
    }
    resetSelectedIcon(trigger) {
      if (!trigger)
        return;
      Util.removeClass(this.selectedRatingItem, 'rating__item--checked');
      Util.setAttributes(this.selectedRatingItem, { 'aria-checked': false, 'tabindex': -1 });
      Util.addClass(trigger, 'rating__item--checked');
      Util.setAttributes(trigger, { 'aria-checked': true, 'tabindex': 0 });
      this.selectedRatingItem = trigger;
      // update select input value
      var select = this.element.getElementsByTagName('select');
      if (select.length > 0) {
        select[0].value = trigger.getAttribute('aria-label');
      }
    }
  }

  //initialize the Rating objects
  var ratings = document.getElementsByClassName('js-rating');
  
  console.log(ratings.length);
  if (ratings.length > 0) {
    for (var i = 0; i < ratings.length; i++) {
      (function (i) { new Rating(ratings[i]); })(i);
    }
  };
}());
// File#: _1_sub-navigation
// Usage: codyhouse.co/license
(function () {
  var SideNav = function (element) {
    this.element = element;
    this.control = this.element.getElementsByClassName('js-subnav__control');
    this.navList = this.element.getElementsByClassName('js-subnav__wrapper');
    this.closeBtn = this.element.getElementsByClassName('js-subnav__close-btn');
    this.firstFocusable = getFirstFocusable(this);
    this.showClass = 'subnav__wrapper--is-visible';
    this.collapsedLayoutClass = 'subnav--collapsed';
    initSideNav(this);
  };

  function getFirstFocusable(sidenav) { // get first focusable element inside the subnav
    if (sidenav.navList.length == 0) return;
    var focusableEle = sidenav.navList[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
      firstFocusable = false;
    for (var i = 0; i < focusableEle.length; i++) {
      if (focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length) {
        firstFocusable = focusableEle[i];
        break;
      }
    }

    return firstFocusable;
  };

  function initSideNav(sidenav) {
    checkSideNavLayout(sidenav); // switch from --compressed to --expanded layout
    initSideNavToggle(sidenav); // mobile behavior + layout update on resize
  };

  function initSideNavToggle(sidenav) {
    // custom event emitted when window is resized
    sidenav.element.addEventListener('update-sidenav', function (event) {
      checkSideNavLayout(sidenav);
    });

    // mobile only
    if (sidenav.control.length == 0 || sidenav.navList.length == 0) return;
    sidenav.control[0].addEventListener('click', function (event) { // open sidenav
      openSideNav(sidenav, event);
    });
    sidenav.element.addEventListener('click', function (event) { // close sidenav when clicking on close button/bg layer
      if (event.target.closest('.js-subnav__close-btn') || Util.hasClass(event.target, 'js-subnav__wrapper')) {
        closeSideNav(sidenav, event);
      }
    });
  };

  function openSideNav(sidenav, event) { // open side nav - mobile only
    event.preventDefault();
    sidenav.selectedTrigger = event.target;
    event.target.setAttribute('aria-expanded', 'true');
    Util.addClass(sidenav.navList[0], sidenav.showClass);
    sidenav.navList[0].addEventListener('transitionend', function cb(event) {
      sidenav.navList[0].removeEventListener('transitionend', cb);
      sidenav.firstFocusable.focus();
    });
  };

  function closeSideNav(sidenav, event, bool) { // close side sidenav - mobile only
    if (!Util.hasClass(sidenav.navList[0], sidenav.showClass)) return;
    if (event) event.preventDefault();
    Util.removeClass(sidenav.navList[0], sidenav.showClass);
    if (!sidenav.selectedTrigger) return;
    sidenav.selectedTrigger.setAttribute('aria-expanded', 'false');
    if (!bool) sidenav.selectedTrigger.focus();
    sidenav.selectedTrigger = false;
  };

  function checkSideNavLayout(sidenav) { // switch from --compressed to --expanded layout
    var layout = getComputedStyle(sidenav.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if (layout != 'expanded' && layout != 'collapsed') return;
    Util.toggleClass(sidenav.element, sidenav.collapsedLayoutClass, layout != 'expanded');
  };

  var sideNav = document.getElementsByClassName('js-subnav'),
    SideNavArray = [],
    j = 0;
  if (sideNav.length > 0) {
    for (var i = 0; i < sideNav.length; i++) {
      var beforeContent = getComputedStyle(sideNav[i], ':before').getPropertyValue('content');
      if (beforeContent && beforeContent != '' && beforeContent != 'none') {
        j = j + 1;
      }
      (function (i) { SideNavArray.push(new SideNav(sideNav[i])); })(i);
    }

    if (j > 0) { // on resize - update sidenav layout
      var resizingId = false,
        customEvent = new CustomEvent('update-sidenav');
      window.addEventListener('resize', function (event) {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for (var i = 0; i < SideNavArray.length; i++) {
          (function (i) { SideNavArray[i].element.dispatchEvent(customEvent) })(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }

    // listen for key events
    window.addEventListener('keyup', function (event) {
      if ((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) {// listen for esc key - close navigation on mobile if open
        for (var i = 0; i < SideNavArray.length; i++) {
          (function (i) { closeSideNav(SideNavArray[i], event); })(i);
        };
      }
      if ((event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab')) { // listen for tab key - close navigation on mobile if open when nav loses focus
        if (document.activeElement.closest('.js-subnav__wrapper')) return;
        for (var i = 0; i < SideNavArray.length; i++) {
          (function (i) { closeSideNav(SideNavArray[i], event, true); })(i);
        };
      }
    });
  }
}());
// File#: _1_swipe-content
(function () {
  var SwipeContent = function (element) {
    this.element = element;
    this.delta = [false, false];
    this.dragging = false;
    this.intervalId = false;
    initSwipeContent(this);
  };

  function initSwipeContent(content) {
    content.element.addEventListener('mousedown', handleEvent.bind(content));
    content.element.addEventListener('touchstart', handleEvent.bind(content), { passive: true });
  };

  function initDragging(content) {
    //add event listeners
    content.element.addEventListener('mousemove', handleEvent.bind(content));
    content.element.addEventListener('touchmove', handleEvent.bind(content), { passive: true });
    content.element.addEventListener('mouseup', handleEvent.bind(content));
    content.element.addEventListener('mouseleave', handleEvent.bind(content));
    content.element.addEventListener('touchend', handleEvent.bind(content));
  };

  function cancelDragging(content) {
    //remove event listeners
    if (content.intervalId) {
      (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
      content.intervalId = false;
    }
    content.element.removeEventListener('mousemove', handleEvent.bind(content));
    content.element.removeEventListener('touchmove', handleEvent.bind(content));
    content.element.removeEventListener('mouseup', handleEvent.bind(content));
    content.element.removeEventListener('mouseleave', handleEvent.bind(content));
    content.element.removeEventListener('touchend', handleEvent.bind(content));
  };

  function handleEvent(event) {
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        startDrag(this, event);
        break;
      case 'mousemove':
      case 'touchmove':
        drag(this, event);
        break;
      case 'mouseup':
      case 'mouseleave':
      case 'touchend':
        endDrag(this, event);
        break;
    }
  };

  function startDrag(content, event) {
    content.dragging = true;
    // listen to drag movements
    initDragging(content);
    content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
    // emit drag start event
    emitSwipeEvents(content, 'dragStart', content.delta, event.target);
  };

  function endDrag(content, event) {
    cancelDragging(content);
    // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
    var dx = parseInt(unify(event).clientX),
      dy = parseInt(unify(event).clientY);

    // check if there was a left/right swipe
    if (content.delta && (content.delta[0] || content.delta[0] === 0)) {
      var s = getSign(dx - content.delta[0]);

      if (Math.abs(dx - content.delta[0]) > 30) {
        (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);
      }

      content.delta[0] = false;
    }
    // check if there was a top/bottom swipe
    if (content.delta && (content.delta[1] || content.delta[1] === 0)) {
      var y = getSign(dy - content.delta[1]);

      if (Math.abs(dy - content.delta[1]) > 30) {
        (y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
      }

      content.delta[1] = false;
    }
    // emit drag end event
    emitSwipeEvents(content, 'dragEnd', [dx, dy]);
    content.dragging = false;
  };

  function drag(content, event) {
    if (!content.dragging) return;
    // emit dragging event with coordinates
    (!window.requestAnimationFrame)
      ? content.intervalId = setTimeout(function () { emitDrag.bind(content, event); }, 250)
      : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
  };

  function emitDrag(event) {
    emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
  };

  function unify(event) {
    // unify mouse and touch events
    return event.changedTouches ? event.changedTouches[0] : event;
  };

  function emitSwipeEvents(content, eventName, detail, el) {
    var trigger = false;
    if (el) trigger = el;
    // emit event with coordinates
    var event = new CustomEvent(eventName, { detail: { x: detail[0], y: detail[1], origin: trigger } });
    content.element.dispatchEvent(event);
  };

  function getSign(x) {
    if (!Math.sign) {
      return ((x > 0) - (x < 0)) || +x;
    } else {
      return Math.sign(x);
    }
  };

  window.SwipeContent = SwipeContent;

  //initialize the SwipeContent objects
  var swipe = document.getElementsByClassName('js-swipe-content');
  if (swipe.length > 0) {
    for (var i = 0; i < swipe.length; i++) {
      (function (i) { new SwipeContent(swipe[i]); })(i);
    }
  }
}());
// File#: _1_table
// Usage: codyhouse.co/license
(function() {
  function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout
    Util.addClass(table, 'table--loaded'); // show table

    // custom event emitted when window is resized
    table.addEventListener('update-table', function(event){
      checkTableLayour(table);
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
  };

  var tables = document.getElementsByClassName('js-table'),
    tableExpandedLayoutClass = 'table--expanded';
  if( tables.length > 0 ) {
    var j = 0;
    for( var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){initTable(tables[i]);})(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], 'table--loaded');
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < tables.length; i++) {
          (function(i){tables[i].dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
  if(flexHeader.length > 0) {
    var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
      firstFocusableElement = getMenuFirstFocusable();

    // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
    var focusMenu = false;

    resetFlexHeaderOffset();
    setAriaButtons();

    menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
      toggleMenuNavigation(event.detail);
    });

    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
          focusMenu = menuTrigger; // move focus to menu trigger when menu is close
          menuTrigger.click();
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
      }
    });

    // detect click on a dropdown control button - expand-on-mobile only
    flexHeader[0].addEventListener('click', function(event){
      var btnLink = event.target.closest('.js-f-header__dropdown-control');
      if(!btnLink) return;
      !btnLink.getAttribute('aria-expanded') ? btnLink.setAttribute('aria-expanded', 'true') : btnLink.removeAttribute('aria-expanded');
    });

    // detect mouseout from a dropdown control button - expand-on-mobile only
    flexHeader[0].addEventListener('mouseout', function(event){
      var btnLink = event.target.closest('.js-f-header__dropdown-control');
      if(!btnLink) return;
      // check layout type
      if(getLayout() == 'mobile') return;
      btnLink.removeAttribute('aria-expanded');
    });

    // close dropdown on focusout - expand-on-mobile only
    flexHeader[0].addEventListener('focusin', function(event){
      var btnLink = event.target.closest('.js-f-header__dropdown-control'),
        dropdown = event.target.closest('.f-header__dropdown');
      if(dropdown) return;
      if(btnLink && btnLink.hasAttribute('aria-expanded')) return;
      // check layout type
      if(getLayout() == 'mobile') return;
      var openDropdown = flexHeader[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
      if(openDropdown) openDropdown.removeAttribute('aria-expanded');
    });

    // listen for resize
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function getMenuFirstFocusable() {
      var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
        firstFocusable = false;
      for(var i = 0; i < focusableEle.length; i++) {
        if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }

      return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };

    function doneResizing() {
      if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
        menuTrigger.click();
      }
      resetFlexHeaderOffset();
    };
    
    function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
      Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
      Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
      menuTrigger.setAttribute('aria-expanded', bool);
      if(bool) firstFocusableElement.focus(); // move focus to first focusable element
      else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    };

    function resetFlexHeaderOffset() {
      // on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
      document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
    };

    function setAriaButtons() {
      var btnDropdown = flexHeader[0].getElementsByClassName('js-f-header__dropdown-control');
      for(var i = 0; i < btnDropdown.length; i++) {
        var id = 'f-header-dropdown-'+i,
          dropdown = btnDropdown[i].nextElementSibling;
        if(dropdown.hasAttribute('id')) {
          id = dropdown.getAttribute('id');
        } else {
          dropdown.setAttribute('id', id);
        }
        btnDropdown[i].setAttribute('aria-controls', id);	
      }
    };

    function getLayout() {
      return getComputedStyle(flexHeader[0], ':before').getPropertyValue('content').replace(/\'|"/g, '');
    };
  }
}());
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function () {
  var Slideshow = function (opts) {
    this.options = Util.extend(Slideshow.defaults, opts);
    this.element = this.options.element;
    this.items = this.element.getElementsByClassName('js-slideshow__item');
    this.controls = this.element.getElementsByClassName('js-slideshow__control');
    this.selectedSlide = 0;
    this.autoplayId = false;
    this.autoplayPaused = false;
    this.navigation = false;
    this.navCurrentLabel = false;
    this.ariaLive = false;
    this.moveFocus = false;
    this.animating = false;
    this.supportAnimation = Util.cssSupports('transition');
    this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
    this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
    this.animatingClass = 'slideshow--is-animating';
    initSlideshow(this);
    initSlideshowEvents(this);
    initAnimationEndEvents(this);
  };

  Slideshow.prototype.showNext = function () {
    showNewItem(this, this.selectedSlide + 1, 'next');
  };

  Slideshow.prototype.showPrev = function () {
    showNewItem(this, this.selectedSlide - 1, 'prev');
  };

  Slideshow.prototype.showItem = function (index) {
    showNewItem(this, index, false);
  };

  Slideshow.prototype.startAutoplay = function () {
    var self = this;
    if (this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
      self.autoplayId = setInterval(function () {
        self.showNext();
      }, self.options.autoplayInterval);
    }
  };

  Slideshow.prototype.pauseAutoplay = function () {
    var self = this;
    if (this.options.autoplay) {
      clearInterval(self.autoplayId);
      self.autoplayId = false;
    }
  };

  function initSlideshow(slideshow) { // basic slideshow settings
    // if no slide has been selected -> select the first one
    if (slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
    slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
    // create an element that will be used to announce the new visible slide to SR
    var srLiveArea = document.createElement('div');
    Util.setAttributes(srLiveArea, { 'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true' });
    slideshow.element.appendChild(srLiveArea);
    slideshow.ariaLive = srLiveArea;
  };

  function initSlideshowEvents(slideshow) {
    // if slideshow navigation is on -> create navigation HTML and add event listeners
    if (slideshow.options.navigation) {
      // check if navigation has already been included
      if (slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
        var navigation = document.createElement('ol'),
          navChildren = '';

        var navClasses = slideshow.options.navigationClass + ' js-slideshow__navigation';
        if (slideshow.items.length <= 1) {
          navClasses = navClasses + ' is-hidden';
        }

        navigation.setAttribute('class', navClasses);
        for (var i = 0; i < slideshow.items.length; i++) {
          var className = (i == slideshow.selectedSlide) ? 'class="' + slideshow.options.navigationItemClass + ' ' + slideshow.options.navigationItemClass + '--selected js-slideshow__nav-item"' : 'class="' + slideshow.options.navigationItemClass + ' js-slideshow__nav-item"',
            navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
          navChildren = navChildren + '<li ' + className + '><button class="reset"><span class="sr-only">' + (i + 1) + '</span>' + navCurrentLabel + '</button></li>';
        }
        navigation.innerHTML = navChildren;
        slideshow.element.appendChild(navigation);
      }

      slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0];
      slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

      var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

      dotsNavigation.addEventListener('click', function (event) {
        navigateSlide(slideshow, event, true);
      });
      dotsNavigation.addEventListener('keyup', function (event) {
        navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
      });
    }
    // slideshow arrow controls
    if (slideshow.controls.length > 0) {
      // hide controls if one item available
      if (slideshow.items.length <= 1) {
        Util.addClass(slideshow.controls[0], 'is-hidden');
        Util.addClass(slideshow.controls[1], 'is-hidden');
      }
      slideshow.controls[0].addEventListener('click', function (event) {
        event.preventDefault();
        slideshow.showPrev();
        updateAriaLive(slideshow);
      });
      slideshow.controls[1].addEventListener('click', function (event) {
        event.preventDefault();
        slideshow.showNext();
        updateAriaLive(slideshow);
      });
    }
    // swipe events
    if (slideshow.options.swipe) {
      //init swipe
      new SwipeContent(slideshow.element);
      slideshow.element.addEventListener('swipeLeft', function (event) {
        slideshow.showNext();
      });
      slideshow.element.addEventListener('swipeRight', function (event) {
        slideshow.showPrev();
      });
    }
    // autoplay
    if (slideshow.options.autoplay) {
      slideshow.startAutoplay();
      // pause autoplay if user is interacting with the slideshow
      if (!slideshow.options.autoplayOnHover) {
        slideshow.element.addEventListener('mouseenter', function (event) {
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('mouseleave', function (event) {
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
      if (!slideshow.options.autoplayOnFocus) {
        slideshow.element.addEventListener('focusin', function (event) {
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('focusout', function (event) {
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
    }
    // detect if external buttons control the slideshow
    var slideshowId = slideshow.element.getAttribute('id');
    if (slideshowId) {
      var externalControls = document.querySelectorAll('[data-controls="' + slideshowId + '"]');
      for (var i = 0; i < externalControls.length; i++) {
        (function (i) { externalControlSlide(slideshow, externalControls[i]); })(i);
      }
    }
    // custom event to trigger selection of a new slide element
    slideshow.element.addEventListener('selectNewItem', function (event) {
      // check if slide is already selected
      if (event.detail) {
        if (event.detail - 1 == slideshow.selectedSlide) return;
        showNewItem(slideshow, event.detail - 1, false);
      }
    });

    // keyboard navigation
    slideshow.element.addEventListener('keydown', function (event) {
      if (event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        slideshow.showNext();
      } else if (event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        slideshow.showPrev();
      }
    });
  };

  function navigateSlide(slideshow, event, keyNav) {
    // user has interacted with the slideshow navigation -> update visible slide
    var target = (Util.hasClass(event.target, 'js-slideshow__nav-item')) ? event.target : event.target.closest('.js-slideshow__nav-item');
    if (keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
      slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
      slideshow.moveFocus = true;
      updateAriaLive(slideshow);
    }
  };

  function initAnimationEndEvents(slideshow) {
    // remove animation classes at the end of a slide transition
    for (var i = 0; i < slideshow.items.length; i++) {
      (function (i) {
        slideshow.items[i].addEventListener('animationend', function () { resetAnimationEnd(slideshow, slideshow.items[i]); });
        slideshow.items[i].addEventListener('transitionend', function () { resetAnimationEnd(slideshow, slideshow.items[i]); });
      })(i);
    }
  };

  function resetAnimationEnd(slideshow, item) {
    setTimeout(function () { // add a delay between the end of animation and slideshow reset - improve animation performance
      if (Util.hasClass(item, 'slideshow__item--selected')) {
        if (slideshow.moveFocus) Util.moveFocus(item);
        emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
        slideshow.moveFocus = false;
      }
      Util.removeClass(item, 'slideshow__item--' + slideshow.animationType + '-out-left slideshow__item--' + slideshow.animationType + '-out-right slideshow__item--' + slideshow.animationType + '-in-left slideshow__item--' + slideshow.animationType + '-in-right');
      item.removeAttribute('aria-hidden');
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }, 100);
  };

  function showNewItem(slideshow, index, bool) {
    if (slideshow.items.length <= 1) return;
    if (slideshow.animating && slideshow.supportAnimation) return;
    slideshow.animating = true;
    Util.addClass(slideshow.element, slideshow.animatingClass);
    if (index < 0) index = slideshow.items.length - 1;
    else if (index >= slideshow.items.length) index = 0;
    // skip slideshow item if it is hidden
    if (bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
      slideshow.animating = false;
      index = bool == 'next' ? index + 1 : index - 1;
      showNewItem(slideshow, index, bool);
      return;
    }
    // index of new slide is equal to index of slide selected item
    if (index == slideshow.selectedSlide) {
      slideshow.animating = false;
      return;
    }
    var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
    var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
    // transition between slides
    if (!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
    Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
    slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
    if (slideshow.animationOff) {
      Util.addClass(slideshow.items[index], 'slideshow__item--selected');
    } else {
      Util.addClass(slideshow.items[index], enterItemClass + ' slideshow__item--selected');
    }
    // reset slider navigation appearance
    resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
    slideshow.selectedSlide = index;
    // reset autoplay
    slideshow.pauseAutoplay();
    slideshow.startAutoplay();
    // reset controls/navigation color themes
    resetSlideshowTheme(slideshow, index);
    // emit event
    emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
    if (slideshow.animationOff) {
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }
  };

  function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = '';
    if (bool) {
      className = (bool == 'next') ? 'slideshow__item--' + slideshow.animationType + '-out-right' : 'slideshow__item--' + slideshow.animationType + '-out-left';
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--' + slideshow.animationType + '-out-left' : 'slideshow__item--' + slideshow.animationType + '-out-right';
    }
    return className;
  };

  function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = '';
    if (bool) {
      className = (bool == 'next') ? 'slideshow__item--' + slideshow.animationType + '-in-right' : 'slideshow__item--' + slideshow.animationType + '-in-left';
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--' + slideshow.animationType + '-in-left' : 'slideshow__item--' + slideshow.animationType + '-in-right';
    }
    return className;
  };

  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if (slideshow.navigation) {
      Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
      Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
      slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
      slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
    }
  };

  function resetSlideshowTheme(slideshow, newIndex) {
    var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
    if (dataTheme) {
      if (slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
      if (slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
    } else {
      if (slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
      if (slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
    }
  };

  function emitSlideshowEvent(slideshow, eventName, detail) {
    var event = new CustomEvent(eventName, { detail: detail });
    slideshow.element.dispatchEvent(event);
  };

  function updateAriaLive(slideshow) {
    slideshow.ariaLive.innerHTML = 'Item ' + (slideshow.selectedSlide + 1) + ' of ' + slideshow.items.length;
  };

  function externalControlSlide(slideshow, button) { // control slideshow using external element
    button.addEventListener('click', function (event) {
      var index = button.getAttribute('data-index');
      if (!index || index == slideshow.selectedSlide + 1) return;
      event.preventDefault();
      showNewItem(slideshow, index - 1, false);
    });
  };

  Slideshow.defaults = {
    element: '',
    navigation: true,
    autoplay: false,
    autoplayOnHover: false,
    autoplayOnFocus: false,
    autoplayInterval: 5000,
    navigationItemClass: 'slideshow__nav-item',
    navigationClass: 'slideshow__navigation',
    swipe: false
  };

  window.Slideshow = Slideshow;

  //initialize the Slideshow objects
  var slideshows = document.getElementsByClassName('js-slideshow');
  if (slideshows.length > 0) {
    for (var i = 0; i < slideshows.length; i++) {
      (function (i) {
        var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
          autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
          autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
          autoplayOnFocus = (slideshows[i].getAttribute('data-autoplay-focus') && slideshows[i].getAttribute('data-autoplay-focus') == 'on') ? true : false,
          autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
          swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
          navigationItemClass = slideshows[i].getAttribute('data-navigation-item-class') ? slideshows[i].getAttribute('data-navigation-item-class') : 'slideshow__nav-item',
          navigationClass = slideshows[i].getAttribute('data-navigation-class') ? slideshows[i].getAttribute('data-navigation-class') : 'slideshow__navigation';
        new Slideshow({ element: slideshows[i], navigation: navigation, autoplay: autoplay, autoplayOnHover: autoplayOnHover, autoplayOnFocus: autoplayOnFocus, autoplayInterval: autoplayInterval, swipe: swipe, navigationItemClass: navigationItemClass, navigationClass: navigationClass });
      })(i);
    }
  }
}());