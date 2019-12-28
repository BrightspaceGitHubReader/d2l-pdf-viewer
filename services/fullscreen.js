const FULLSCREEN_CHANGE_EVENTS = Object.freeze([
	'fullscreenchange',
	'webkitfullscreenchange',
	'mozfullscreenchange',
	'MSFullscreenChange',
]);

const REQUEST_FULLSCREEN_FUNCTIONS = Object.freeze([
	'requestFullscreen',
	'webkitRequestFullscreen',
	'mozRequestFullScreen',
	'msRequestFullscreen',
]);

const EXIT_FULLSCREEN_FUNCTIONS = Object.freeze([
	'exitFullscreen',
	'webkitExitFullscreen',
	'mozCancelFullScreen',
	'msExitFullscreen',
]);

/**
 * Toggle between full screen and normal display mode.
 * MUST be triggered directly by user interaction
 */
export class FullscreenService {
	constructor(opts) {
		this.target = opts.target;
		this.onFullscreenChangedCallback = opts.onFullscreenChangedCallback;
		this.__onFullscreenChangedBound = this.onFullscreenChanged.bind(this);

		if (this.onFullscreenChangedCallback) {
			this.onFullscreenChangedCallback();
		}
	}

	init() {
		if (this.isFullscreenAvailable) {
			FULLSCREEN_CHANGE_EVENTS.forEach(changeEvent => {
				document.addEventListener(changeEvent, this.__onFullscreenChangedBound);
			});
		}
	}

	dispose() {
		FULLSCREEN_CHANGE_EVENTS.forEach(changeEvent => {
			document.removeEventListener(changeEvent, this.__onFullscreenChangedBound);
		});
	}

	toggleFullscreen() {
		if (this.isFullscreenAvailable) {
			if (!this.isFullscreenToggled) {
				const targetElement = this.target || document.documentElement;

				for (const requestFullscreen of REQUEST_FULLSCREEN_FUNCTIONS) {
					if (targetElement[requestFullscreen]) {
						targetElement[requestFullscreen]();
						break;
					}
				}
			} else {
				for (const exitFullscreen of EXIT_FULLSCREEN_FUNCTIONS) {
					if (document[exitFullscreen]) {
						document[exitFullscreen]();
						break;
					}
				}
			}
		}
	}

	/**
	 * Exit full screen mode (if toggled)
	 */
	exitFullscreen() {
		if (this.isFullscreenToggled) {
			this.toggleFullscreen();
		}
	}

	get isFullscreenAvailable() {
		return (document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled) ? true : false;
	}

	get isFullscreenToggled() {
		const fullscreenElement = document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement;

		return fullscreenElement === this.target;
	}

	onFullscreenChanged() {
		if (this.onFullscreenChangedCallback) {
			this.onFullscreenChangedCallback(this.isFullscreenToggled);
		}
	}
}
