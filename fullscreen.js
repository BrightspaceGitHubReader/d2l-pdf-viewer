/**
 * Toggle between full screen and normal display mode.
 * MUST be triggered directly by user interaction
 */
export class FullscreenAPI {
	constructor(opts) {
		this.target = opts.target;
		this.onFullscreenChangedCallback = opts.onFullscreenChangedCallback;
		this.__onFullscreenChanged = this.onFullscreenChanged.bind(this);
	}

	init() {
		if (this.__init) {
			return;
		}

		if (this.isFullscreenAvailable()) {
			document.addEventListener('fullscreenchange', this.__onFullscreenChanged);
			document.addEventListener('webkitfullscreenchange', this.__onFullscreenChanged);
			document.addEventListener('mozfullscreenchange', this.__onFullscreenChanged);
			document.addEventListener('MSFullscreenChange', this.__onFullscreenChanged);
		}

		if (this.onFullscreenChangedCallback) {
			this.onFullscreenChangedCallback();
		}

		this.__init = true;
	}

	dispose() {
		if (!this.__init) {
			return;
		}

		this.__init = false;

		document.removeEventListener('fullscreenchange', this.__onFullscreenChanged);
		document.removeEventListener('webkitfullscreenchange', this.__onFullscreenChanged);
		document.removeEventListener('mozfullscreenchange', this.__onFullscreenChanged);
		document.removeEventListener('MSFullscreenChange', this.__onFullscreenChanged);
	}

	toggleFullscreen() {
		if (this.isFullscreenAvailable()) {
			if (!this.isFullscreenToggled()) {
				// We are not in full screen mode, let's request it
				// But first let's grad a hold on the target
				var targetElement = typeof this.target !== 'string' ? this.target :
					document.querySelector(this.target);
				targetElement = targetElement || document.documentElement;
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
		if (this.isFullscreenToggled()) {
			this.toggleFullscreen();
		}
	}

	isFullscreenAvailable() {
		return (document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled) ? true : false;
	}

	isFullscreenToggled() {
		const fullscreenElement = document.fullscreenElement ||
		document.webkitFullscreenElement ||
		document.mozFullScreenElement ||
		document.msFullscreenElement;

		return fullscreenElement === this.target;
	}

	onFullscreenChanged() {
		if (this.onFullscreenChangedCallback) {
			this.onFullscreenChangedCallback(this.isFullscreenToggled());
		}
	}
}
