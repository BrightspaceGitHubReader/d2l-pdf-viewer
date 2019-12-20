const FULLSCREEN_CHANGE_EVENTS = [
	'fullscreenchange',
	'webkitfullscreenchange',
	'mozfullscreenchange',
	'MSFullscreenChange',
];

/**
 * Toggle between full screen and normal display mode.
 * MUST be triggered directly by user interaction
 */
export class FullscreenAPI {
	constructor(opts) {
		this.target = opts.target;
		this.onFullscreenChangedCallback = opts.onFullscreenChangedCallback;
		this.__onFullscreenChanged = this.onFullscreenChanged.bind(this);

		if (this.isFullscreenAvailable) {
			FULLSCREEN_CHANGE_EVENTS.forEach(changeEvent => {
				document.addEventListener(changeEvent, this.__onFullscreenChanged);
			});
		}

		if (this.onFullscreenChangedCallback) {
			this.onFullscreenChangedCallback();
		}
	}

	toggleFullscreen() {
		if (this.isFullscreenAvailable) {
			if (!this.isFullscreenToggled) {
				// We are not in full screen mode, let's request it
				// But first let's grad a hold on the target
				const targetElement = this.target || document.documentElement;

				if (targetElement.requestFullscreen) {
					targetElement.requestFullscreen();
				} else if (targetElement.webkitRequestFullscreen) {
					targetElement.webkitRequestFullscreen();
				} else if (targetElement.mozRequestFullScreen) {
					targetElement.mozRequestFullScreen();
				} else if (targetElement.msRequestFullscreen) {
					targetElement.msRequestFullscreen();
				}
			} else {
				// We are in full screen mode, let's exit
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
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
