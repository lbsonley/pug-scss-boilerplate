/** *
 * The starting point of this code - and the idea - is from Nikita Vasilyev @ELV1S
 * http://n12v.com/focus-transition/
 * We've enhanced it so the focus only shows up on keyboard action thus
 * giving a cleaner look for those who work with a mouse or finger.
 ** */

(function () {
	const ACTIVE = true;
	const DURATION = 150;

	let hidden = true;
	let keydownTime = 0;
	let mouseWasDown = false;
	let previousFocused;
	let previousOffset = {};
	let focusTimeout;
	let hideTimeout;
	let positionTimeout;
	let staticCounter = 0;

	if (document.querySelector('#flying-focus')) {
		return;
	}
	if (!document.documentElement.addEventListener) {
		return;
	} // we don't support outdated browsers

	const flyingFocus = document.createElement('flying-focus');
	flyingFocus.id = 'flying-focus';

	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('x', '0');
	rect.setAttribute('y', '0');
	rect.setAttribute('width', '100%');
	rect.setAttribute('height', '100%');
	svg.append(rect);
	flyingFocus.append(svg);

	document.body.append(flyingFocus);

	function boundsOf(element) {
		const rect = element.getBoundingClientRect();
		const documentElement = document.documentElement;
		const win = document.defaultView;
		const { body } = document;

		const clientTop = documentElement.clientTop || body.clientTop || 0,
			clientLeft = documentElement.clientLeft || body.clientLeft || 0,
			scrollTop = win.pageYOffset || documentElement.scrollTop || body.scrollTop,
			scrollLeft = win.pageXOffset || documentElement.scrollLeft || body.scrollLeft,
			top = rect.top + scrollTop - clientTop,
			left = rect.left + scrollLeft - clientLeft;

		return {
			top,
			left,
			width: rect.width,
			height: rect.height,
			bottom: top + rect.height,
			right: left + rect.width,
		};
	}

	function getInputBounds(element) {
		return boundsOf(element);
	}

	function addEvent(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler, false);
		} else {
			element.attachEvent(`on${event}`, handler);
		}
	}

	addEvent(
		document.documentElement,
		'keydown',
		(event) => {
			if (event.keyCode < 65) {
				keydownTime = new Date();
			}
		},
		true
	);

	document.body.addEventListener('focus', handleFocus, true);
	document.body.addEventListener('blur', handleBlur, true);

	function handleFocus(event) {
		const activeElement = document.activeElement || event.target;
		clearTimeout(hideTimeout);
		clearTimeout(focusTimeout);
		focusTimeout = setTimeout(() => {
			if (!ACTIVE) {
				return;
			}
			const target = activeElement;
			if (target.id === 'flying-focus') {
				return;
			}
			const focusTime = new Date();
			if (hidden && focusTime - keydownTime > 100 && mouseWasDown) {
				// the focus was not done with a key
				return;
			}

			show();

			previousOffset = reposition(target);

			previousFocused = target;
		}, 1);
	}

	function handleBlur() {
		hide();
	}

	document.documentElement.addEventListener('mousemove', detectMouse, false);
	function detectMouse() {
		mouseWasDown = true;
		document.documentElement.removeEventListener('mousemove', detectMouse, false);
	}

	addEvent(
		document.documentElement,
		'mousedown',
		(event) => {
			if (event.detail) {
				mouseWasDown = true;
				hideReally();
			}
		},
		true
	);
	addEvent(
		document.documentElement,
		'touchstart',
		(event) => {
			if (event.detail) {
				hideReally();
			}
		},
		{
			passive: true,
		}
	);

	addEvent(window, 'resize', () => {
		reposition(previousFocused);
	});

	function hide() {
		if (!hidden) {
			clearTimeout(focusTimeout);
			clearTimeout(hideTimeout);
			hideTimeout = setTimeout(hideReally, 10);
		}
	}
	function hideReally() {
		flyingFocus.classList.remove('flying-focus_visible');
		hidden = true;
		clearTimeout(positionTimeout);
	}

	function show() {
		clearTimeout(hideTimeout);
		clearTimeout(positionTimeout);
		const duration = hidden ? 0 : DURATION / 1000;
		flyingFocus.style.transitionDuration = `${duration}s`;

		staticCounter = 0;
		positionTimeout = setTimeout(checkPosition, 100);

		if (hidden) {
			flyingFocus.classList.add('flying-focus_visible');
			hidden = false;
		}
	}

	// sometimes when we focus an element, this will trigger some kind of
	// layout change or event animation. we'll check a few times to make sure
	// size and position will stay the same (after that we stop)
	function checkPosition() {
		const offset = reposition(previousFocused);
		if (
			offset.top !== previousOffset.top ||
			offset.left !== previousOffset.left ||
			offset.width !== previousOffset.width ||
			offset.height !== previousOffset.height
		) {
			previousOffset = offset;
			staticCounter = 0;
		} else {
			staticCounter++;
		}
		positionTimeout =
			staticCounter < 3
				? // at the beginning and as long as we see position changes
				  // we will check the position/bounds more often
				  setTimeout(checkPosition, 100)
				: // we want to measure at least every 2 seconds
				  (positionTimeout = setTimeout(checkPosition, 1000));
	}

	function reposition(target) {
		if (hidden) {
			return;
		}
		const offset = getInputBounds(target);
		if (
			offset.top !== previousOffset.top ||
			offset.left !== previousOffset.left ||
			offset.width !== previousOffset.width ||
			offset.height !== previousOffset.height
		) {
			flyingFocus.style.left = `${offset.left}px`;
			flyingFocus.style.top = `${offset.top}px`;
			flyingFocus.style.width = `${offset.width}px`;
			flyingFocus.style.height = `${offset.height}px`;
		}
		return offset;
	}
})();
export default {};
