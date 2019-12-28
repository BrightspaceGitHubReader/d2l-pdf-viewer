import { css, html, LitElement } from 'lit-element/lit-element.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';

class D2LPdfViewerToolbarButtonElement extends LitElement {
	static get properties() {
		return {
			ariaLabel: {
				type: String,
				reflect: true
			},
			disabled: {
				type: Boolean,
				reflect: true
			},
			icon: {
				type: String
			},
			toggle: {
				type: Boolean,
			},
			pressed: {
				type: Boolean,
			},
			title: {
				type: String
			}
		};
	}

	static get styles() {
		return css`
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
			}`;
	}

	constructor() {
		super();

		this.icon = '';
		this.pressed = false;
		this.disabled = false;
		this.toggle = false;

		this.setAttribute('role', 'button');

		this.addEventListener('focusin', () => this._onInteraction());
		this.addEventListener('focusout', () => this._onInteraction());
	}

	render() {
		return html`
			<d2l-icon icon=${this.icon}></d2l-icon>`;
	}

	updated(changedProperties) {
		if (typeof changedProperties.toggle === 'boolean') {
			if (!this.toggle) {
				this.removeAttribute('aria-pressed');
			} else {
				this.setAttribute('aria-pressed', pressed ? 'true' : 'false');
			}
		}
	}

	_onInteraction() {
		this.dispatchEvent(new CustomEvent('d2l-pdf-viewer-button-interaction', {
			bubbles: true,
			composed: true
		}));
	}
}

customElements.define('d2l-pdf-viewer-toolbar-button', D2LPdfViewerToolbarButtonElement);
