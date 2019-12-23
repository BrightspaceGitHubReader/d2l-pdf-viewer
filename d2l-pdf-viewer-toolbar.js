import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import 'd2l-polymer-behaviors/d2l-focusable-arrowkeys-behavior.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'fastdom/fastdom.js';
import './d2l-pdf-viewer-toolbar-button.js';
import './localize-behavior.js';

class D2LPdfViewerToolbar extends mixinBehaviors([
	D2L.PolymerBehaviors.PdfViewer.LocalizeBehavior,
	D2L.PolymerBehaviors.FocusableArrowKeysBehavior,
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					user-select: none;
					width: 100%;
				}

				.outer-container {
					display: flex;
					justify-content: center;
				}

				.toolbar-container {
					align-items: center;
					background-color: rgba(86, 90, 92, 0.8);
					border-radius: 8px;
					color: white;
					display: inline-flex;
					position: relative;
				}

				.control-container {
					align-items: center;
					display: inline-flex;
					position: relative;
				}

				.toolbar-container > *,
				.control-container > * {
					flex: 0 0 auto;
				}

				.toolbar-label {
					@apply --d2l-body-compact-text;
				}

				.control-container {
					margin: 0 12px 0 15px;
				}

				:host(:dir(rtl)) .control-container {
					margin: 0 15px 0 12px;
				}

				.info-container {
					margin: 0 15px 0 18px;
				}

				:host(:dir(rtl)) .info-container {
					margin: 0 18px 0 15px;
				}

				d2l-pdf-viewer-toolbar-button {
					margin: 6px;
				}
			</style>
			<div class="outer-container">
				<div class="toolbar-container">
					<div class="info-container">
						<span id="pageNumber" class="toolbar-label" aria-label$="[[localize('pageLabel')]]">
							[[localize('pageOfPages', 'pageNumber', pageNumber, 'pagesCount', pagesCount)]]
						</span>
					</div>
					<div class="control-container" role="group">
						<d2l-pdf-viewer-toolbar-button
							id="zoomOutButton"
							title="[[localize('zoomOutTitle')]]"
							icon="d2l-tier1:zoom-out"
							on-tap="_onZoomOutButtonTapped"
							on-keydown="_onToolbarButtonKeyDown"
							aria-label="[[localize('zoomOutLabel')]]"
							disabled="[[_zoomOutButtonDisabled(pageScale, minPageScale)]]"
							tabindex="0">
						</d2l-pdf-viewer-toolbar-button>
						<d2l-pdf-viewer-toolbar-button
							id="zoomInButton"
							on-tap="_onZoomInButtonTapped"
							on-keydown="_onToolbarButtonKeyDown"
							title="[[localize('zoomInTitle')]]"
							icon="d2l-tier1:zoom-in"
							aria-label="[[localize('zoomInLabel')]]"
							disabled="[[_zoomInButtonDisabled(pageScale, maxPageScale)]]"
							tabindex="-1">
						</d2l-pdf-viewer-toolbar-button>
						<d2l-pdf-viewer-toolbar-button
							toggle=""
							id="fullscreenButton"
							on-tap="_onToggleFullscreenButtonTapped"
							on-keydown="_onToolbarButtonKeyDown"
							title="[[localize('presentationModeTitle')]]"
							icon="[[_getFullscreenIcon(isFullscreen)]]"
							aria-label="[[localize('presentationModeLabel')]]"
							pressed="[[isFullscreen]]"
							disabled="[[!fullscreenAvailable]]"
							tabindex="-1">
						</d2l-pdf-viewer-toolbar-button>
					</div>
				</div>
			</div>`;
	}

	static get hostAttributes() {
		return {
			role: 'toolbar',
		};
	}

	static get properties() {
		return {
			fullscreenAvailable: {
				type: Boolean,
				value: false,
			},
			isFullscreen: {
				type: Boolean,
				value: false,
			},
			minPageScale: {
				type: Number,
				value: 0,
			},
			maxPageScale: {
				type: Number,
				value: 0,
			},
			pagesCount: {
				type: Number,
				value: 0,
			},
			pageNumber: {
				type: Number,
				value: 0,
			},
			pageScale: {
				type: Number,
				value: 0,
			},
		};
	}

	connectedCallback() {
		super.connectedCallback();

		afterNextRender(this, () => {
			this._initRovingTabIndex();
		});
	}

	_zoomOutButtonDisabled(pageScale, minPageScale) {
		return pageScale <= minPageScale || Math.abs(pageScale - minPageScale) < Number.EPSILON;
	}

	_zoomInButtonDisabled(pageScale, maxPageScale) {
		return pageScale >= maxPageScale || Math.abs(pageScale - maxPageScale) < Number.EPSILON;
	}

	_onZoomOutButtonTapped() {
		this.dispatchEvent(
			new CustomEvent('d2l-pdf-viewer-toolbar-zoom-out')
		);
	}

	_onZoomInButtonTapped() {
		this.dispatchEvent(
			new CustomEvent('d2l-pdf-viewer-toolbar-zoom-in')
		);
	}

	_onToggleFullscreenButtonTapped() {
		this.dispatchEvent(
			new CustomEvent('d2l-pdf-viewer-toolbar-toggle-fullscreen')
		);
	}

	_getFullscreenIcon(isFullscreen) {
		return isFullscreen
			? 'd2l-tier1:smallscreen'
			: 'd2l-tier1:fullscreen';
	}

	_initRovingTabIndex() {
		const toolbarControls = this.shadowRoot.querySelectorAll('d2l-pdf-viewer-toolbar-button');
		const toolbarButtons = Array.prototype.slice.call(toolbarControls);

		this.arrowKeyFocusablesContainer = this.shadowRoot.querySelector('.control-container');

		this.arrowKeyFocusablesProvider = () => {
			return new Promise((resolve) => {
				fastdom.measure(() => {
					const activeButtons = toolbarButtons.filter(button => !button.disabled);

					resolve(activeButtons);
				});
			});
		};
	}

	_onToolbarButtonKeyDown(e) {
		switch (e.key) {
			case 'Enter':
			case 'Space':
				e.composedPath()[0].click();
				break;
		}
	}
}

customElements.define('d2l-pdf-viewer-toolbar', D2LPdfViewerToolbar);
