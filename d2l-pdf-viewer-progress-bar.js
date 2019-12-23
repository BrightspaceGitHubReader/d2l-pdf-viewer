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
import { PolymerElement, html } from '@polymer/polymer';
import 'fastdom/fastdom.js';
import 'd2l-colors/d2l-colors.js';

const indeterminateStates = Object.freeze({
	RESET: 0,
	IN_PROGRESS: 1,
	COMPLETE: 2
});

class D2LPdfViewerProgressBarElement extends PolymerElement {
	static get template() {
		return html`
			<style>
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
				}
			</style>
			<div>
				<div id="progressBar" class="progress-bar"></div>
			</div>
		`;
	}

	static get properties() {
		return {
			/**
			* Whether the progress bar should automatically begin loading. (indeterminate only)
			*/
			autostart: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			/**
			* If true, indicates the process is indeterminate.
			*/
			indeterminate: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			/**
			* Value which indicates the action is 100% complete. (determinate only)
			*/
			max: {
				type: Number,
				value: 1
			},
			/**
			* The current progress of the action. (determinate only)
			*/
			value: {
				type: Number,
				value: 0
			}
		};
	}

	static get observers() {
		return [
			'_onConfigChanged(indeterminate, autostart)',
			'_onProgressChanged(value, max)',
		];
	}

	static get hostAttributes() {
		return {
			role: 'progressbar',
		};
	}

	constructor() {
		super();

		this._progress = 0;
		this._indeterminateState = indeterminateStates.RESET;
		this._onTransitionEndEvent = this._onTransitionEndEvent.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();

		this.progressBar = this.shadowRoot.getElementById('progressBar');
		this.progressBar.addEventListener('transitionend', this._onTransitionEndEvent);

		this._updateProgressBar(this.indeterminate, this.autostart);
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
		if (!this.indeterminate) {
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

		fastdom.mutate(() => {
			this.progressBar.style.transform = `translate(-${100 - this.__progress}%,0)`;
		});
	}

	get _progress() {
		return this.__progress;
	}
}

customElements.define('d2l-pdf-viewer-progress-bar', D2LPdfViewerProgressBarElement);
