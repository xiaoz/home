/******************************************
*	Custom namespace - CarnationGroup
*
*	globally used elements, options
*
******************************************/

var C =  {
	
	options: {},
	colorList: ['red', 'purple', 'blue', 'yellow'], // 4 base colors of the site - #fd4239, #490e6f, #00c4df, #ffd500
	altPressed: false,
	ctrlPressed: false,
	isMouseDown: false,
	shiftPressed: false,
	
	init: function () {
		C.initGlobalListeners();
	},
	
	initGlobalListeners: function () {
		$(window).mousedown(function () {	
			C.isMouseDown = true;
		}).mouseup(function () {
			C.isMouseDown = false;
		
		});
		$(window).keydown(function (e) {
			if (e.which === 16) { C.shiftPressed = true; }
			if (e.which === 17) { C.ctrlPressed = true; }
			if (e.which === 18) { C.altPressed = true; }
		});
		$(window).keyup(function (e) {
			if (e.which === 16) { C.shiftPressed = false; }
			if (e.which === 17) { C.ctrlPressed = false; }
			if (e.which === 18) { C.altPressed = false; }
		});
	}
	
};

/******************************************
*	Site SCROLLER
*
*	handling scroll events, custom scrolling
*
******************************************/

C.SCROLLER = {
	
	options: {
		globalSpeed: 8
	},
	currentPos: 0,
	disabled: false,
	dir: 'down',
	easing: 'easeOutExpo',
	lastTimeMoved: 0,
	pageEnd: false,
	globalSections: {
		background: { elm: $('#container'), pos: 0, speed: -10 },
		header: { elm: $('#container header.page-header'), pos: 0, speed: 5 },
		logo: { elm: $('#logo'), pos: 40, speed: 16 },
		searchRes: { elm: $('#search-result'), pos: 240, speed: 16 }
	},
	scrolling: false,
	sections: {
		'contact': {
			contact: { elm: $('#contact'), pos: 40, speed: 16 },
			footer: { elm: $('#footer'), pos: 2000, speed: 16, extraspace: 0 }
		}
		
	},
	targetPos: 0,
	
	init: function (opt) {
		C.SCROLLER.options = $.extend({}, C.SCROLLER.options, opt);
		if ((typeof (C.SCROLLER.sections[C.SITE.page]) !== 'undefined')) {
			C.SCROLLER.setPositions('scroller init');
			C.SCROLLBAR.init();
			C.SCROLLER.initListeners();
		}
	},
	
	setPositions: function () {
		var s = C.SCROLLER.sections[C.SITE.page],
			footerPos = s.footer.speed * C.SCROLLER.currentPos,
			footerHeight = (parseInt(s.footer.elm.css('padding-top'), 10) !== 0 ? s.footer.elm.height() : s.footer.elm.outerHeight(true));
			if (footerHeight > 400) {
				footerHeight = 400;
			}
		
			switch (C.SITE.page) {
			case 'index':
				s.aboutUs.pos = s.recentWorks.pos + s.recentWorks.elm.height() - 320;
				s.feedBox.pos = s.aboutUs.pos + s.aboutUs.elm.outerHeight(true) - parseInt(s.aboutUs.elm.find('header').css('padding-top'), 10);
				s.picsBox.pos = s.feedBox.pos + s.feedBox.elm.outerHeight(true);
				s.map.pos = s.picsBox.pos + s.picsBox.elm.outerHeight(true);
				s.footer.pos = s.map.pos + s.map.elm.outerHeight(true);
				s.footer.elm.css({top: s.footer.pos});
				C.SCROLLER.limit = parseInt(-s.footer.pos + (600 - footerHeight) - s.footer.extraspace, 10);
				break;
			case 'contact':
				s.footer.pos = s.contact.pos + s.contact.elm.outerHeight(true);
				s.footer.elm.css({top: s.footer.pos});
				
				C.SCROLLER.limit = parseInt(-s.footer.pos + (600 - footerHeight) - s.footer.extraspace, 10);
				
				break;
			}

		if (C.SCROLLER.limit > 0) {	C.SCROLLER.limit = 0; }
		C.SCROLLER.updateSections(false);
		if (C.SCROLLER.limit > footerPos && C.SCROLLER.limit < 0) {
			C.SCROLLER.refreshPositions(9999);
		}		
		C.SCROLLBAR.refreshScrollBar();
	},
	
	initListeners: function () {
		$(document).keydown(function (e) {
			if (e.which === 38 || e.which === 40) {
				e.preventDefault();
				C.SCROLLER.dir = e.which === 40 ? 'down' : 'up';
				C.SCROLLER.refreshPositions(e.which === 40 ? -1 * C.SCROLLER.options.globalSpeed : C.SCROLLER.options.globalSpeed);
			} 
		});
		KISSY.Event.on(document,'mousewheel',function(e){
			e.preventDefault();
			var delta = e.deltaY
			C.SCROLLER.dir = delta < 0 ?  'down' : 'up';
			C.SCROLLER.refreshPositions(delta < 0 ? -1 * C.SCROLLER.options.globalSpeed : C.SCROLLER.options.globalSpeed);
		})
		$(window).resize(function () {
			C.SCROLLER.setPositions('resize');
		});
		C.SCROLLER.globalSections.header.elm.addClass('anim').mouseover(function () {
			$(this).removeClass('anim');
		}).mouseleave(function () {
			setTimeout(function () { C.SCROLLER.globalSections.header.elm.addClass('anim'); }, 200);
		});
	},
	
	refreshPositions: function (delta) {
		if (!C.SCROLLER.disabled) {
			var tempTarget = C.SCROLLER.currentPos + delta < 0 ? C.SCROLLER.currentPos + delta : 0;
			if (tempTarget * C.SCROLLER.sections[C.SCROLLER.options.page].footer.speed <= C.SCROLLER.limit) {
				tempTarget = C.SCROLLER.limit / C.SCROLLER.sections[C.SCROLLER.options.page].footer.speed;
			}
			if (tempTarget !== C.SCROLLER.targetPos) {
				C.SCROLLER.targetPos = tempTarget;
				C.SCROLLER.smoothScroll();
			}
		}
	},
	
	smoothScroll: function () {
		var from = {pos: C.SCROLLER.currentPos},
			to = {pos: C.SCROLLER.targetPos},
			eventCounter = 0;
		
		if (!C.SCROLLBAR.inited) {
			C.SCROLLBAR.inited = true;
			clearTimeout(C.SCROLLBAR.initTimerIn);			
			clearTimeout(C.SCROLLBAR.initTimerOut);
		}		
		clearTimeout(C.SCROLLBAR.timerFadeOut);		
		C.SCROLLBAR.fadeButtonIn();		
		C.SCROLLER.scrolling = true;
		
		$(from).stop().animate(to, {
		    duration: 1000,
		    step: function (now, fx) {
				if ((fx.start > fx.end && now < fx.start && now < C.SCROLLER.currentPos) || (fx.start < fx.end && now > fx.start && now > C.SCROLLER.currentPos) && (!C.SCROLLBAR.dragging)) {
					C.SCROLLER.currentPos = now;
					C.SCROLLER.updateSections();
					C.SCROLLBAR.refreshPosition();
					if (eventCounter % 4 === 0) {
						if ($('#container .pager-control').length > 0) { C.PAGER.getActiveSection(); }
					}
					eventCounter += 1;
				}
		    },
			easing: C.SCROLLER.easing,
			complete: function () {
				if (C.SCROLLER.currentPos == C.SCROLLER.targetPos) {
					C.SCROLLBAR.fadeButtonOut();
					C.SCROLLER.scrolling = false;
				}
				C.SCROLLER.lastTimeMoved = new Date().getTime();
			}
		});
	},
	
	updateSections: function (updateHeader) {
		
		C.SCROLLER.globalSections.background.elm.css({backgroundPosition: '0px ' + C.SCROLLER.currentPos * C.SCROLLER.globalSections.background.speed + 'px'});
		var	corr = 0,
			expcorrection = 0,
			faceBarPos = 0,
			padding = 0,
			peoplePos = 0,
			posImgLeft = 0,
			posImgCenter = 0,
			posImgRight = 0,
			s = C.SCROLLER.sections[C.SITE.page],
			top = 0;		
			switch (C.SITE.page) {
				case 'contact':
					s.contact.elm.css({top: s.contact.pos + C.SCROLLER.currentPos * s.contact.speed});
					
					break;
			}
	
	}
	

	
};

/******************************************
*	Site SCROLLBAR
*
*	custom scrollbar connected to page scroll
*
******************************************/

C.SCROLLBAR = {
	
	options: {
		globalSpeed: 8
	},
	button: $('#scrollbar .button'),
	diff: 0,
	disabled: false,
	dragging: false,	
	hitAreaPadding: 40,
	inited: false,
	initTimerIn: 0,
	initTimerOut: 0,
	ratio: 1,
	scrollbar: $('#scrollbar'),
	state: 0,
	timerFadeOut: 0,
	timerFadeIn: 0,
	
	init: function (opt) {
		C.SCROLLBAR.options = $.extend({}, C.SCROLLBAR.options, opt);		
		C.SCROLLBAR.initListeners();		
		C.SCROLLBAR.initDragging();
		C.SCROLLBAR.initScrollBar();		
	},
	
	initListeners: function() {
		$(document).mousemove(function(e) {
			if ((e.pageX >= $(window).width() - C.SCROLLBAR.hitAreaPadding) && (!C.SCROLLBAR.disabled)) {
				if (!C.SCROLLBAR.inited) {
					clearTimeout(C.SCROLLBAR.initTimerIn);
					clearTimeout(C.SCROLLBAR.initTimerOut);
					C.SCROLLBAR.inited = true;					
				}
				C.SCROLLBAR.fadeButtonIn();
			} else if ((e.pageX < $(window).width() - C.SCROLLBAR.hitAreaPadding) && (!C.SCROLLBAR.dragging) && (!C.SCROLLBAR.disabled) && (C.SCROLLBAR.inited) && (!C.SCROLLER.scrolling)) {
				if (!C.SCROLLBAR.inited) {
					clearTimeout(C.SCROLLBAR.initTimerIn);					
					clearTimeout(C.SCROLLBAR.initTimerOut);
					C.SCROLLBAR.inited = true;
				}					
				C.SCROLLBAR.fadeButtonOut();
			}
		});
	},
	
	initDragging: function() {
		C.SCROLLBAR.button.draggable({
			addClasses: false,
			axis: 'y',
			containment: 'parent',
			start: function() {
				C.SCROLLER.targetPos = C.SCROLLER.currentPos;
				C.SCROLLER.scrolling = false;	
				C.SCROLLBAR.dragging = true;
				if (!C.SCROLLBAR.inited) {
					clearTimeout(C.SCROLLBAR.initTimerIn);
					clearTimeout(C.SCROLLBAR.initTimerOut);
				}				
				clearTimeout(C.SCROLLBAR.timerFadeOut);
			},
			drag: function() {
				C.SCROLLBAR.scrollByDrag();				
			},
			stop: function() {
				C.SCROLLBAR.dragging = false;
				C.SCROLLBAR.fadeButtonOut();
			}			
		});
	},
	
	initScrollBar: function() {
		if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
			C.SCROLLBAR.button.append('<span class="cap top"></span>');
			C.SCROLLBAR.button.append('<span class="cap body"></span>');			
			C.SCROLLBAR.button.append('<span class="cap bottom"></span>');
			C.SCROLLBAR.button.find('.cap.body').height(parseInt(600 * C.SCROLLBAR.ratio, 10) - 10);
		}
		C.SCROLLBAR.initTimerIn = setTimeout(function() {
			if (!C.SCROLLBAR.inited) {
				C.SCROLLBAR.fadeButtonIn();
			}
		}, 2000);		
		C.SCROLLBAR.initTimerOut = setTimeout(function() {
			if (!C.SCROLLBAR.inited) {
				C.SCROLLBAR.fadeButtonOut();
			}
		}, 3000);		
	},
	
	refreshScrollBar: function() {
		C.SCROLLBAR.ratio = $(window).height() / (Math.abs(C.SCROLLER.limit) + 600);
		if (C.SCROLLBAR.ratio >= 1) {
			C.SCROLLBAR.disabled = true;
		} else {
			C.SCROLLBAR.disabled = false;
			var h = 600 * C.SCROLLBAR.ratio;
			if (h < 80) {
				C.SCROLLBAR.diff = 80 - h;
				C.SCROLLBAR.ratio = (600 - C.SCROLLBAR.diff) / (Math.abs(C.SCROLLER.limit) + 600);				
				h = 80;
			}
			C.SCROLLBAR.button.stop().animate({
				height: h
			}, 300);
			if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
				C.SCROLLBAR.button.find('.cap.body').stop().animate({
					height: parseInt(h - 10, 10)
				}, 300);				
			}			
			C.SCROLLBAR.refreshPosition();
		}
	},
	
	refreshPosition: function() {
		if (!C.SCROLLBAR.dragging) {
			var top = Math.abs(C.SCROLLER.currentPos * C.SCROLLER.sections[C.SITE.page].footer.speed) * C.SCROLLBAR.ratio;
			if (top < 4) { top = 4; }
			if (top > (600 - C.SCROLLBAR.button.outerHeight(true) - 2)) {
				top = 600 - C.SCROLLBAR.button.outerHeight(true) - 2;
			}
			C.SCROLLBAR.button.css({ top: top });
		}
	},
	
	scrollByDrag: function() {
		if (!C.SCROLLBAR.inited) {
			C.SCROLLBAR.inited = true;
			clearTimeout(C.SCROLLBAR.initTimerIn);
			clearTimeout(C.SCROLLBAR.initTimerOut);
		}			
		var currentPosition = (-1 * ((C.SCROLLBAR.button.position().top) / C.SCROLLBAR.ratio) / C.SCROLLER.sections[C.SITE.page].footer.speed);
		if (currentPosition > 0) { currentPosition = 0;	}
		if (600 - C.SCROLLBAR.button.position().top - C.SCROLLBAR.button.outerHeight(true) == 0) {
			currentPosition = (C.SCROLLER.limit / C.SCROLLER.sections[C.SITE.page].footer.speed);
		}
		if (currentPosition < C.SCROLLER.currentPos) {
			C.SCROLLER.dir = 'down';
		} else if (currentPosition > C.SCROLLER.currentPos) {
			C.SCROLLER.dir = 'up';
		}
		if ($('#container .pager-control').length > 0) { C.PAGER.getActiveSection(); }
		C.SCROLLER.currentPos = currentPosition;
		C.SCROLLER.updateSections();
	},
	
	fadeButtonIn: function() {
		clearTimeout(C.SCROLLBAR.timerFadeOut);		
		if (!C.SCROLLBAR.scrollbar.is(':visible')) {
			C.SCROLLBAR.scrollbar.css({opacity: 0}).show().stop().animate({
				opacity: 1
			}, 300, function() {
				C.SCROLLBAR.state = 1;
			});
		}
	},
	
	fadeButtonOut: function() {
		clearTimeout(C.SCROLLBAR.timerFadeOut);
		C.SCROLLBAR.timerFadeOut = setTimeout(function() {
			C.SCROLLBAR.scrollbar.stop().animate({
				opacity: 0
			}, 300, function() {
				$(this).hide();
				C.SCROLLBAR.state = 0;
			});
		}, 1000);
	}
	
};




/******************************************
*	Site elements
******************************************/

C.SITE = {

	options: {},
	page: '',

	init: function (opt) {
		C.SITE.options = $.extend({}, C.SITE.options, opt);
		C.SITE.siteController();
		setTimeout(C.SITE.fixFOUT, 300);
	},

	fixFOUT: function () {
		var foutClasses = ['.header-text p', '#container header.page-header nav ul li a'];
		$(foutClasses.join(', ')).css({opacity: 0}).addClass('afterfout').stop().animate({ opacity: 1 }, 300, function() {
			setTimeout(C.SCROLLER.setPositions, 500);
		});
	},


	siteController: function () {
		C.SITE.page = $('body').attr('data-page');
		switch (C.SITE.page) {
		case 'index':
			C.ABOUTTABS.init();
			C.PROMO.init({autoSlideDelay: 10000, debug: false});
			C.GRID.init({feedURL: '/getrecentworks/'});
			C.PAGER.init();
			C.FEEDBOX.init({flickerFeedUrl: '/ajax/flickrfeed.ashx'});
			C.PICSBOX.init();
			C.MAP.init({feedUrl: '/ajax/mapfeed.ashx'});
			C.FOOTER.init();
			C.SCROLLER.init({globalSpeed: 8, page: C.SITE.page});
			break;
		case 'contact':
			C.CONTACT.init();
			C.FOOTER.init();
			C.SCROLLER.init({globalSpeed: 8, page: C.SITE.page});
			break;
		
		}
	}

};





/******************************************
*	CONTACT BLOCK
*
*	contact page
*
******************************************/

C.CONTACT = {

	options: {
			
	},

	init: function (opt) {
		C.CONTACT.options = $.extend({}, C.CONTACT.options, opt);
	
		
	}



	
};




C.FOOTER = {

	options: {},
	footer: $('#footer .footer-wrapper'),

	init: function (opt) {
		C.FOOTER.options = $.extend({}, C.FOOTER.options, opt);
		
	}
	
};

$(document).ready(function () {
	console.time('site load');
	C.init();
	C.SITE.init();
	console.timeEnd('site load');
});