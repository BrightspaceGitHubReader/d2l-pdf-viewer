/**
`d2l-pdf-viewer-progress-bar`
Polymer-based web component progress bar

@demo demo/d2l-pdf-viewer-progress-bar.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { css, html, LitElement } from 'lit-element/lit-element.js';
import '@brightspace-ui/core/components/colors/colors.js';

const indeterminateStates = Object.freeze({
	RESET: 0,
	IN_PROGRESS: 1,
	COMPLETE: 2
});

export class D2LPdfViewerProgressBarElement extends LitElement {
	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-color-sylvite);
				display: block;
				overflow: hidden;
			}
			:host, .progress-bar {
				height: 4px;
			}
			.progress-bar {
				background-color: var(--d2l-pdf-viewer-progress-bar-primary-color, var(--d2l-color-corundum));
				transform: translate(-100%, 0);
				will-change: transform;
			}
			.determinate {
				transition: transform 50ms ease-out;
			}
			.indeterminate-in-progress {
				transition: transform 10s cubic-bezier(.16,1,.4,1);
			}
			.indeterminate-complete {
				transition: transform 300ms ease-in;
			}`;
	}

	static get properties() {
		return {
			/**
			* Whether the progress bar should automatically begin loading. (indeterminate only)
			*/
			autostart: {
				type: Boolean,
				reflect: true,
			},
			/**
			* If true, indicates the process is indeterminate.
			*/
			indeterminate: {
				type: Boolean,
				reflect: true,
			},
			/**
			* Value which indicates the action is 100% complete. (determinate only)
			*/
			max: {
				type: Number,
			},
			/**
			* The current progress of the action. (determinate only)
			*/
			value: {
				type: Number,
			}
		};
	}

	render() {
		return html`
			<div>
				<div id="progressBar" class="progress-bar"></div>
			</div>
		`;
	}

	updated(changed) {
		if (changed.has('indeterminate') || changed.has('autostart')) {
			this._onConfigChanged(this.indeterminate, this.autostart);
		}

		if (changed.has('value') || changed.has('max')) {
			this._onProgressChanged(this.value, this.max);
		}
	}

	constructor() {
		super();

		this.indeterminate = false;
		this.autostart = false;
		this.max = 1;
		this.value = 0;

		this.setAttribute('role', 'progressbar');

		this._indeterminateState = indeterminateStates.RESET;
		this._onTransitionEndEvent = this._onTransitionEndEvent.bind(this);
	}

	firstUpdated() {
		this.progressBar = this.shadowRoot.getElementById('progressBar');
		this.progressBar.addEventListener('transitionend', this._onTransitionEndEvent);

		this._progress = 0;
		this._updateProgressBar(this.indeterminate, this.autostart);
		this._onProgressChanged(this.value, this.max);
	}

	/**
	* For indeterminate progress bars, starts or restarts the progress bar animation.
	*/
	start() {
		if (!this.indeterminate) {
			return;
		}

		this._setIndeterminateState(indeterminateStates.RESET);

		setTimeout(function() {
			if (this._indeterminateState === indeterminateStates.RESET) {
				this._setIndeterminateState(indeterminateStates.IN_PROGRESS);
			}
		}.bind(this), 100);
	}

	/**
	* For indeterminate progress bars, completes the progress bar animation, moving it quickly to 100%.
	*/
	finish() {
		this._setIndeterminateState(indeterminateStates.COMPLETE);
	}

	_setIndeterminateState(state) {
		if (!this.indeterminate || !this.progressBar) {
			return;
		}

		var inProgress = state === indeterminateStates.IN_PROGRESS;
		var complete = state === indeterminateStates.COMPLETE;

		this._indeterminateState = state;

		this.progressBar.classList.toggle('indeterminate-in-progress', inProgress);
		this.progressBar.classList.toggle('indeterminate-complete', complete);

		let progress = 0;

		if (inProgress || complete) {
			progress = inProgress ? 99 : 100;
		}

		this._progress = progress;
	}

	_onConfigChanged(indeterminate, autostart) {
		if (!this.isConnected) {
			return;
		}

		this._updateProgressBar(indeterminate, autostart);
	}

	_updateProgressBar(indeterminate, autostart) {
		if (!this.progressBar) {
			return;
		}

		this.progressBar.classList.toggle('determinate', !indeterminate);

		if (indeterminate) {
			this.removeAttribute('aria-valuemax');
			this.removeAttribute('aria-valuenow');

			if (autostart) {
				this.start();
			}
		} else {
			this.progressBar.classList.remove('indeterminate-in-progress');
			this.progressBar.classList.remove('indeterminate-complete');
		}
	}

	_onProgressChanged(value, max) {
		if (this.indeterminate) {
			return;
		}

		if (max <= 0) {
			this.max = 1;
			return;
		}

		value = Math.max(0, Math.min(value, max));

		this._progress = (value / max) * 100;

		this.setAttribute('aria-valuemax', max);
		this.setAttribute('aria-valuenow', value);
	}

	_onTransitionEndEvent() {
		if (this._progress === 100) {
			// Delay for a moment in case eg. consumer is using event to hide on completion
			setTimeout(function() {
				this.dispatchEvent(new CustomEvent('d2l-pdf-viewer-progress-bar-animation-complete'));
			}.bind(this), 200);
		}
	}

	set _progress(val) {
		this.__progress = Math.max(0, Math.min(val, 100));

		this.progressBar.style.transform = `translate(-${100 - this.__progress}%,0)`;
	}

	get _progress() {
		return this.__progress;
	}
}

customElements.define('d2l-pdf-viewer-progress-bar', D2LPdfViewerProgressBarElement);
