import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/typography/styles.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import './d2l-pdf-viewer-toolbar-button.js';

import { FocusManagementService } from './services/focus-management.js';

class D2LPdfViewerToolbar extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			fullscreenAvailable: {
				type: Boolean,
				attribute: 'fullscreen-available',
			},
			isFullscreen: {
				type: Boolean,
				attribute: 'is-fullscreen',
			},
			minPageScale: {
				type: Number,
				attribute: 'min-page-scale',
			},
			maxPageScale: {
				type: Number,
				attribute: 'max-page-scale',
			},
			pagesCount: {
				type: Number,
				attribute: 'pages-count',
			},
			pageNumber: {
				type: Number,
				attribute: 'page-number',
			},
			pageScale: {
				type: Number,
				attribute: 'page-scale',
			},
		};
	}

	static get styles() {
		return css`
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

/* @TODO(AP): Replace CSS mixin
				.toolbar-label {
					@apply --d2l-body-compact-text;
				}
*/

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
				}`;
	}

	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
			case 'ar':
				translations = await import('./lang/ar.js');
				break;
			case 'de':
				translations = await import('./lang/de.js');
				break;
			case 'fr':
			  translations = await import('./lang/fr.js');
			  break;
			case 'ja':
				translations = await import('./lang/ja.js');
				break;
			case 'ko':
				translations = await import('./lang/ko.js');
				break;
			case 'nb':
				translations = await import('./lang/nb.js');
				break;
			case 'nl':
				translations = await import('./lang/nl.js');
				break;
			case 'pt':
				translations = await import('./lang/pt.js');
				break;
			case 'sv':
				translations = await import('./lang/sv.js');
				break;
			case 'tr':
				translations = await import('./lang/tr.js');
				break;
			case 'zh-tw':
				translations = await import('./lang/zh-tw.js');
				break;
			case 'zh':
				translations = await import('./lang/zh.js');
				break;
			case 'en':
			default:
				translations = await import('./lang/en.js');
				break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}
	}

	render() {
		const fullscreenIcon = this.isFullscreen
			? 'd2l-tier1:smallscreen'
			: 'd2l-tier1:fullscreen';

		return html`
			<div class="outer-container">
				<div class="toolbar-container">
					<div class="info-container">
						<span
							id="pageNumber"
							class="toolbar-label"
							aria-label=${this.localize('pageLabel')}>
							${this.localize('pageOfPages', 'pageNumber', this.pageNumber, 'pagesCount', this.pagesCount)}
						</span>
					</div>
					<div class="control-container" role="group">
						<d2l-pdf-viewer-toolbar-button
							id="zoomOutButton"
							title=${this.localize('zoomOutTitle')}
							icon="d2l-tier1:zoom-out"
							@click=${this._onZoomOutButtonTapped}
							@keydown=${this._onToolbarButtonKeyDown}
							?disabled=${this._zoomOutButtonDisabled(this.pageScale, this.minPageScale)}
							tabindex=${0}>
						</d2l-pdf-viewer-toolbar-button>
						<d2l-pdf-viewer-toolbar-button
							id="zoomInButton"
							@click=${this._onZoomInButtonTapped}
							@keydown=${this._onToolbarButtonKeyDown}
							title=${this.localize('zoomInTitle')}
							icon="d2l-tier1:zoom-in"
							?disabled=${this._zoomInButtonDisabled(this.pageScale, this.maxPageScale)}
							tabindex=${-1}>
						</d2l-pdf-viewer-toolbar-button>
						<d2l-pdf-viewer-toolbar-button
							toggle=""
							id="fullscreenButton"
							@click=${this._onToggleFullscreenButtonTapped}
							@keydown=${this._onToolbarButtonKeyDown}
							title=${this.localize('presentationModeTitle')}
							icon=${fullscreenIcon}
							pressed=${this.isFullscreen ? 'true' : false}
							?disabled=${!this.fullscreenAvailable}
							tabindex=${-1}>
						</d2l-pdf-viewer-toolbar-button>
					</div>
				</div>
			</div>`;
	}

	constructor() {
		super();

		this.fullscreenAvailable = false;
		this.isFullscreen = false;
		this.minPageScale = 0;
		this.maxPageScale = 0;
		this.pagesCount = 0;
		this.pageNumber = 0;
		this.pageScale = 0;

		this.setAttribute('role', 'toolbar');

		this._focusManagementService = new FocusManagementService({
			focusContainer: this,
			focusablesProvider: () => this.focusablesProvider(),
			onBeforeFocus: (el) => this.onBeforeFocus(el),
		});
	}

	onBeforeFocus(newFocus) {
		const focusedButton = this.shadowRoot.querySelector('d2l-pdf-viewer-toolbar-button[tabindex="0"]');
		focusedButton.tabIndex = -1;

		newFocus.tabIndex = 0;
	}

	connectedCallback() {
		super.connectedCallback();
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

	async focusablesProvider() {
		const toolbarControls = this.shadowRoot.querySelectorAll('d2l-pdf-viewer-toolbar-button');
		const toolbarButtons = Array.prototype.slice.call(toolbarControls);

		this.arrowKeyFocusablesContainer = this.shadowRoot.querySelector('.control-container');

		const activeButtons = toolbarButtons.filter(button => !button.disabled);

		return [...activeButtons];
	}

	_initRovingTabIndex() {
		const toolbarControls = this.shadowRoot.querySelectorAll('d2l-pdf-viewer-toolbar-button');
		const toolbarButtons = Array.prototype.slice.call(toolbarControls);

		this.arrowKeyFocusablesContainer = this.shadowRoot.querySelector('.control-container');

		this.arrowKeyFocusablesProvider = () => {
			return new Promise((resolve) => {
				const activeButtons = toolbarButtons.filter(button => !button.disabled);

				resolve(activeButtons);
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
