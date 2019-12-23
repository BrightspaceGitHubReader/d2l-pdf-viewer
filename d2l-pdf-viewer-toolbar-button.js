import { PolymerElement, html } from '@polymer/polymer';
import 'd2l-colors/d2l-colors.js';
import 'd2l-icons/d2l-icon.js';

class D2LPdfViewerToolbarButtonElement extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					cursor: pointer;
					border: none;
					border-radius: 6px;
					outline: none;
					user-select: none;
					transition: background-color 0.5s;
					background-color: transparent;
					padding: 0;
				}

				:host([disabled]) {
					cursor: default;
					opacity: .5;
				}

				:host(:focus),
				:host(:hover:not([disabled])) {
					background-color: var(--d2l-color-celestine);
				}

				d2l-icon {
					color: white;
					padding: 6px;
				}
			</style>
			<d2l-icon icon="[[icon]]"></d2l-icon>`;
	}

	static get hostAttributes() {
		return {
			role: 'button',
			tabIndex: -1,
		};
	}

	static get listeners() {
		return {
			focusin: '_onInteraction',
			focusout: '_onInteraction',
		};
	}

	static get properties() {
		return {
			ariaLabel: {
				type: String,
				reflectToAttribute: true
			},
			disabled: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			icon: {
				type: String
			},
			toggle: {
				type: Boolean,
				value: false
			},
			pressed: {
				type: Boolean,
				value: false
			},
			title: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			'_setAriaPressed(toggle, pressed)',
		];
	}

	_onInteraction() {
		this.dispatchEvent(new CustomEvent('d2l-pdf-viewer-button-interaction', {
			bubbles: true,
			composed: true
		}));
	}

	_setAriaPressed(toggle, pressed) {
		if (!toggle) {
			this.removeAttribute('aria-pressed');
		} else {
			this.setAttribute('aria-pressed', pressed ? 'true' : 'false');
		}
	}
}

customElements.define('d2l-pdf-viewer-toolbar-button', D2LPdfViewerToolbarButtonElement);
