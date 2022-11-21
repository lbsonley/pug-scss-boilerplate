const DEFAULT_OPTIONS = {
	mouseWheelSpeed: 20,
};

class MouseWheel {
	constructor(element, options = {}) {
		this.el = element;
		this.options = Object.assign({}, DEFAULT_OPTIONS, options);
		this.directionX = 0;
		this.directionY = 0;

		this._wheel = this.wheel.bind(this);
		this.enable();
	}

	enable() {
		this.el.addEventListener('wheel', this._wheel);
		this.el.addEventListener('mousewheel', this._wheel);
		this.el.addEventListener('DOMMouseScroll', this._wheel);
	}

	disable() {
		clearTimeout(this.wheelTimeout);
		// eslint-disable-next-line unicorn/no-null
		this.wheelTimeout = null;
		this.el.removeEventListener('wheel', this._wheel);
		this.el.removeEventListener('mousewheel', this._wheel);
		this.el.removeEventListener('DOMMouseScroll', this._wheel);
	}

	_execEvent(type, data = {}) {
		if (this.options[type]) {
			this.options[type](data);
		}
	}

	wheel(event) {
		event.preventDefault();

		let wheelDeltaX, wheelDeltaY;

		if (this.wheelTimeout === undefined) {
			this._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(() => {
			this._execEvent('scrollEnd');
			this.wheelTimeout = undefined;
		}, 400);

		if ('deltaX' in event) {
			if (event.deltaMode === 1) {
				wheelDeltaX = -event.deltaX * this.options.mouseWheelSpeed;
				wheelDeltaY = -event.deltaY * this.options.mouseWheelSpeed;
			} else {
				wheelDeltaX = -event.deltaX;
				wheelDeltaY = -event.deltaY;
			}
		} else if ('wheelDeltaX' in event) {
			wheelDeltaX = (event.wheelDeltaX / 120) * this.options.mouseWheelSpeed;
			wheelDeltaY = (event.wheelDeltaY / 120) * this.options.mouseWheelSpeed;
		} else if ('wheelDelta' in event) {
			wheelDeltaX = wheelDeltaY = (event.wheelDelta / 120) * this.options.mouseWheelSpeed;
		} else if ('detail' in event) {
			wheelDeltaX = wheelDeltaY = (-event.detail / 3) * this.options.mouseWheelSpeed;
		} else {
			return;
		}

		this._execEvent('scroll', { x: wheelDeltaX, y: wheelDeltaY });
	}

	destroy() {
		this.disable();
	}
}

export default MouseWheel;
