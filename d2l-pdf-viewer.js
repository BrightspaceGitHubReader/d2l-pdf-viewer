/* global pdfjsViewer, pdfjsLib */

import { css, html, LitElement } from 'lit-element';
import '@brightspace-ui/core/components/colors/colors.js';

import { D2LPdfViewerProgressBarElement } from './d2l-pdf-viewer-progress-bar.js';
import './d2l-pdf-viewer-toolbar.js';
import { FullscreenService } from './services/fullscreen.js';

/**
 * `<d2l-pdf-viewer>`
 */
class D2LPdfViewerElement extends LitElement {
	static get styles() {
		return css`
			:host {
				display: inline-block;
				position: relative;
				width: 100%;
				height: 100%;
				background-color: grey;
			}

			#viewerContainer {
				position: relative;
				overflow: auto;
				width: 100%;
				height: 100%;
			}

			d2l-pdf-viewer-toolbar {
				position: absolute;
				bottom: 18px;
				transition-property: opacity;
				transition-duration: 500ms;
				z-index: 1;
			}

			d2l-pdf-viewer-toolbar[show] {
				opacity: 1;
				pointer-events: auto;
			}

			d2l-pdf-viewer-toolbar:not([show]) {
				opacity: 0;
				pointer-events: none;
			}

			d2l-pdf-viewer-progress-bar {
				--d2l-pdf-viewer-progress-bar-primary-color: var(--d2l-color-celestine);
			}

			/*
			* External PDF.js styles, from PDF.js version 2.0.943
			*/
			.textLayer {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				overflow: hidden;
				opacity: 0.2;
				line-height: 1.0;
			}

			.textLayer > div {
				color: transparent;
				position: absolute;
				white-space: pre;
				cursor: text;
				-webkit-transform-origin: 0% 0%;
				transform-origin: 0% 0%;
			}

			.textLayer .highlight {
				margin: -1px;
				padding: 1px;

				background-color: rgb(180, 0, 170);
				border-radius: 4px;
			}

			.textLayer .highlight.begin {
				border-radius: 4px 0px 0px 4px;
			}

			.textLayer .highlight.end {
				border-radius: 0px 4px 4px 0px;
			}

			.textLayer .highlight.middle {
				border-radius: 0px;
			}

			.textLayer .highlight.selected {
				background-color: rgb(0, 100, 0);
			}

			.textLayer ::-moz-selection {
				background: rgb(0, 0, 255);
			}

			.textLayer ::selection {
				background: rgb(0, 0, 255);
			}

			.textLayer .endOfContent {
				display: block;
				position: absolute;
				left: 0px;
				top: 100%;
				right: 0px;
				bottom: 0px;
				z-index: -1;
				cursor: default;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}

			.textLayer .endOfContent.active {
				top: 0px;
			}


			.annotationLayer section {
				position: absolute;
			}

			.annotationLayer .linkAnnotation>a,
			.annotationLayer .buttonWidgetAnnotation.pushButton>a {
				position: absolute;
				font-size: 1em;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.annotationLayer .linkAnnotation>a:hover,
			.annotationLayer .buttonWidgetAnnotation.pushButton>a:hover {
				opacity: 0.2;
				background: #ff0;
				box-shadow: 0px 2px 10px #ff0;
			}

			.annotationLayer .textAnnotation img {
				position: absolute;
				cursor: pointer;
			}

			.annotationLayer .textWidgetAnnotation input,
			.annotationLayer .textWidgetAnnotation textarea,
			.annotationLayer .choiceWidgetAnnotation select,
			.annotationLayer .buttonWidgetAnnotation.checkBox input,
			.annotationLayer .buttonWidgetAnnotation.radioButton input {
				background-color: rgba(0, 54, 255, 0.13);
				border: 1px solid transparent;
				box-sizing: border-box;
				font-size: 9px;
				height: 100%;
				margin: 0;
				padding: 0 3px;
				vertical-align: top;
				width: 100%;
			}

			.annotationLayer .choiceWidgetAnnotation select option {
				padding: 0;
			}

			.annotationLayer .buttonWidgetAnnotation.radioButton input {
				border-radius: 50%;
			}

			.annotationLayer .textWidgetAnnotation textarea {
				font: message-box;
				font-size: 9px;
				resize: none;
			}

			.annotationLayer .textWidgetAnnotation input[disabled],
			.annotationLayer .textWidgetAnnotation textarea[disabled],
			.annotationLayer .choiceWidgetAnnotation select[disabled],
			.annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
			.annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
				background: none;
				border: 1px solid transparent;
				cursor: not-allowed;
			}

			.annotationLayer .textWidgetAnnotation input:hover,
			.annotationLayer .textWidgetAnnotation textarea:hover,
			.annotationLayer .choiceWidgetAnnotation select:hover,
			.annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
			.annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
				border: 1px solid #000;
			}

			.annotationLayer .textWidgetAnnotation input:focus,
			.annotationLayer .textWidgetAnnotation textarea:focus,
			.annotationLayer .choiceWidgetAnnotation select:focus {
				background: none;
				border: 1px solid transparent;
			}

			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after,
			.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
				background-color: #000;
				content: '';
				display: block;
				position: absolute;
			}

			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
				height: 80%;
				left: 45%;
				width: 1px;
			}

			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before {
				-webkit-transform: rotate(45deg);
				transform: rotate(45deg);
			}

			.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
				-webkit-transform: rotate(-45deg);
				transform: rotate(-45deg);
			}

			.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
				border-radius: 50%;
				height: 50%;
				left: 30%;
				top: 20%;
				width: 50%;
			}

			.annotationLayer .textWidgetAnnotation input.comb {
				font-family: monospace;
				padding-left: 2px;
				padding-right: 0;
			}

			.annotationLayer .textWidgetAnnotation input.comb:focus {
			/*
			* Letter spacing is placed on the right side of each character. Hence, the
			* letter spacing of the last character may be placed outside the visible
			* area, causing horizontal scrolling. We avoid this by extending the width
			* when the element has focus and revert this when it loses focus.
			*/
				width: 115%;
			}

			.annotationLayer .buttonWidgetAnnotation.checkBox input,
			.annotationLayer .buttonWidgetAnnotation.radioButton input {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				padding: 0;
			}

			.annotationLayer .popupWrapper {
				position: absolute;
				width: 20em;
			}

			.annotationLayer .popup {
				position: absolute;
				z-index: 200;
				max-width: 20em;
				background-color: #FFFF99;
				box-shadow: 0px 2px 5px #333;
				border-radius: 2px;
				padding: 0.6em;
				margin-left: 5px;
				cursor: pointer;
				font: message-box;
				word-wrap: break-word;
			}

			.annotationLayer .popup h1 {
				font-size: 1em;
				border-bottom: 1px solid #000000;
				margin: 0;
				padding-bottom: 0.2em;
			}

			.annotationLayer .popup p {
				margin: 0;
				padding-top: 0.2em;
			}

			.annotationLayer .highlightAnnotation,
			.annotationLayer .underlineAnnotation,
			.annotationLayer .squigglyAnnotation,
			.annotationLayer .strikeoutAnnotation,
			.annotationLayer .lineAnnotation svg line,
			.annotationLayer .squareAnnotation svg rect,
			.annotationLayer .circleAnnotation svg ellipse,
			.annotationLayer .polylineAnnotation svg polyline,
			.annotationLayer .polygonAnnotation svg polygon,
			.annotationLayer .inkAnnotation svg polyline,
			.annotationLayer .stampAnnotation,
			.annotationLayer .fileAttachmentAnnotation {
				cursor: pointer;
			}

			.pdfViewer .canvasWrapper {
				overflow: hidden;
			}

			.pdfViewer .page {
				direction: ltr;
				width: 816px;
				height: 1056px;
				margin: 1px auto -8px auto;
				position: relative;
				overflow: visible;
				border: 9px solid transparent;
				background-clip: content-box;
				-o-border-image: url('https://s.brightspace.com/lib/pdf.js/2.0.943/web/images/shadow.png') 9 9 repeat;
				border-image: url('https://s.brightspace.com/lib/pdf.js/2.0.943/web/images/shadow.png') 9 9 repeat;
				background-color: white;
			}

			.pdfViewer.removePageBorders .page {
				margin: 0px auto 10px auto;
				border: none;
			}

			.pdfViewer.singlePageView {
				display: inline-block;
			}

			.pdfViewer.singlePageView .page {
				margin: 0;
				border: none;
			}

			.pdfViewer.scrollHorizontal,
			.pdfViewer.scrollWrapped,
			.spread {
				margin-left: 3.5px;
				margin-right: 3.5px;
				text-align: center;
			}

			.pdfViewer.scrollHorizontal,
			.spread {
				white-space: nowrap;
			}

			.pdfViewer.removePageBorders,
			.pdfViewer.scrollHorizontal .spread,
			.pdfViewer.scrollWrapped .spread {
				margin-left: 0;
				margin-right: 0;
			}

			.spread .page,
			.pdfViewer.scrollHorizontal .page,
			.pdfViewer.scrollWrapped .page,
			.pdfViewer.scrollHorizontal .spread,
			.pdfViewer.scrollWrapped .spread {
				display: inline-block;
				vertical-align: middle;
			}

			.spread .page,
			.pdfViewer.scrollHorizontal .page,
			.pdfViewer.scrollWrapped .page {
				margin-left: -3.5px;
				margin-right: -3.5px;
			}

			.pdfViewer.removePageBorders .spread .page,
			.pdfViewer.removePageBorders.scrollHorizontal .page,
			.pdfViewer.removePageBorders.scrollWrapped .page {
				margin-left: 5px;
				margin-right: 5px;
			}

			.pdfViewer .page canvas {
				margin: 0;
				display: block;
			}

			.pdfViewer .page canvas[hidden] {
				display: none;
			}

			.pdfViewer .page .loadingIcon {
				position: absolute;
				display: block;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				background: url('https://s.brightspace.com/lib/pdf.js/2.0.943/web/images/loading-icon.gif') center no-repeat;
			}

			.pdfPresentationMode .pdfViewer {
				margin-left: 0;
				margin-right: 0;
			}

			.pdfPresentationMode .pdfViewer .page,
			.pdfPresentationMode .pdfViewer .spread {
				display: block;
			}

			.pdfPresentationMode .pdfViewer .page,
			.pdfPresentationMode .pdfViewer.removePageBorders .page {
				margin-left: auto;
				margin-right: auto;
			}

			.pdfPresentationMode:-ms-fullscreen .pdfViewer .page {
				margin-bottom: 100% !important;
			}

			.pdfPresentationMode:-webkit-full-screen .pdfViewer .page {
				margin-bottom: 100%;
				border: 0;
			}

			.pdfPresentationMode:-moz-full-screen .pdfViewer .page {
				margin-bottom: 100%;
				border: 0;
			}

			.pdfPresentationMode:fullscreen .pdfViewer .page {
				margin-bottom: 100%;
				border: 0;
			}

			[hidden] {
				display: none !important;
			}`;
	}

	render() {
		this._showToolbar = this._isLoaded && this._hasRecentInteraction;

		return html`
			<span id="pdfName" hidden="">${this._pdfName}</span>

			<d2l-pdf-viewer-progress-bar id="progressBar"></d2l-pdf-viewer-progress-bar>
			<d2l-pdf-viewer-toolbar
				id="toolbar"
				page-number=${this._pageNumber}
				pages-count=${this._pagesCount}
				page-scale=${this._pageScale}
				min-page-scale=${this.minPageScale}
				max-page-scale=${this.maxPageScale}
				?fullscreen-available=${this._isFullscreenAvailable}
				?is-fullscreen=${this._isFullscreen}
				?show=${this._showToolbar}>
			</d2l-pdf-viewer-toolbar>
			<div id="viewerContainer">
				<div id="viewer" class="pdfViewer" tabindex="0"></div>
			</div>`;
	}

	static get properties() {
		return {
			loader: {
				type: String,
			},
			minPageScale: {
				type: Number,
				attribute: 'min-page-scale',
			},
			maxPageScale: {
				type: Number,
				attribute: 'max-page-scale',
			},
			pdfjsBasePath: {
				type: String,
				attribute: 'pdfjs-base-path',
			},
			pdfJsWorkerSrc: {
				type: String,
				attribute: 'pdfjs-worker-src',
			},
			src: {
				type: String,
			},
			useCdn: {
				type: Boolean,
				attribute: 'use-cdn',
			},
			_isFullscreen: {
				type: Boolean,
			},
			_isFullscreenAvailable: {
				type: Boolean,
			},
			_isLoaded: {
				type: Boolean,
			},
			_hasRecentInteraction: {
				type: Boolean,
			},
			_pageNumber: {
				type: Number,
			},
			_pagesCount: {
				type: Number,
			},
			_pageScale: {
				type: Number,
			},
			_pdfName: {
				type: String,
			},
			_showToolbar: {
				type: Boolean,
			},
		};
	}

	static get observers() {
		return [
			'_srcChanged(src)',
		];
	}

	constructor() {
		super();

		this.loader = 'import';
		this.minPageScale = 0.1;
		this.maxPageScale = 5;
		this.useCdn = false;
		this._isFullscreen = false;
		this._isFullscreenAvailable = false;
		this._isLoaded = false;
		this._hasRecentInteraction = false;
		this._pdfName = '';

		/**
         * @type {Partial<D2LPdfViewerProgressBarElement> | null}
         */
		this.progressBar = null;

		/**
		 * @type string?
		 */
		this.pdfJsWorkerSrc = null;

		/**
		 * @type string?
		 */
		this.pdfjsBasePath = null;

		// Set host attributes
		this.setAttribute('role', 'document');
		this.setAttribute('aria-describedby', 'pdfName');

		// Set host event listeners
		this.addEventListener('mouseenter', () => this._onMouseEnter());
		this.addEventListener('mouseleave', (e) => this._onMouseLeave(e));
		this.addEventListener('touchstart', () => this._onInteraction());
		this.addEventListener('touchend', () => this._onInteraction());
		this.addEventListener('touchmove', () => this._onInteraction());
		this.addEventListener('focusin', () => this._onInteraction());
		this.addEventListener('focusout', (e) => this._onFocusOut(e));
		this.addEventListener('d2l-pdf-viewer-button-interaction', () => this._onInteraction());

		this._boundResize = this._resize.bind(this);

		this.fullscreenService = new FullscreenService({
			target: this,
			onFullscreenChangedCallback: this._onFullscreenChanged.bind(this),
		});
	}

	firstUpdated() {
		this.viewerContainer = this.shadowRoot.getElementById('viewerContainer');
		this.toolbar = this.shadowRoot.getElementById('toolbar');
		this.progressBar = this.shadowRoot.getElementById('progressBar');

		this.viewerContainer.addEventListener('pagesinit', (e) => this._onPagesInitEvent(e));
		this.viewerContainer.addEventListener('pagechange', (e) => this._onPageChangeEvent(e));

		this.toolbar.addEventListener('d2l-pdf-viewer-toolbar-zoom-in', () => this._onZoomInEvent());
		this.toolbar.addEventListener('d2l-pdf-viewer-toolbar-zoom-out', () => this._onZoomOutEvent());
		this.toolbar.addEventListener('d2l-pdf-viewer-toolbar-toggle-fullscreen', () => this._onFullscreenEvent());

		this.progressBar.addEventListener('d2l-pdf-viewer-progress-bar-animation-complete', () => this._onProgressAnimationCompleteEvent());

		this._loadPdfJs();

		if (!this._pdfViewer) {
			this.progressBar.hidden = false;
			this.progressBar.indeterminate = true;
			this.progressBar.start();
		}
	}

	connectedCallback() {
		super.connectedCallback();

		this.fullscreenService.init();

		this._isFullscreenAvailable = this.fullscreenService.isFullscreenAvailable;

		window.addEventListener('resize', this._boundResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.fullscreenService.dispose();

		window.removeEventListener('resize', this._boundResize);
	}

	_loadPdfJs() {
		let initializeTask;

		this._workerSrc = this.pdfJsWorkerSrc;

		// Currently the loader implies useCdn, but ideally isn't in the future
		switch (this.loader) {
			case 'import':
				initializeTask = this._loadDynamicImports();
				break;
			case 'script':
				initializeTask = this._loadScripts();
				break;
			default:
				initializeTask = Promise.reject(`unknown loader: ${this.loader}`);
		}

		this._initializeTask = initializeTask
			.then(libraries => {
				return this._onPdfJsLoaded(libraries);
			})
			.catch(e => {
				this.progressBar.hidden = true;

				if (this.dispatchEvent(new CustomEvent(
					'd2l-pdf-viewer-load-failed', {
						bubbles: true,
						composed: true,
						detail: e,
						cancelable: true
					},
				))) {
					console.error(e); //eslint-disable-line
				}
			});
	}

	_loadDynamicImports() {
		if (this.useCdn || this.pdfjsBasePath) {
			return Promise.reject('loader `import` does not have CDN/base path support');
		}

		if (!this._workerSrc) {
			this._workerSrc = `${import.meta.url}/../node_modules/pdfjs-dist-modules/pdf.worker.min.js`;
		}

		return Promise.all([
			import('pdfjs-dist-modules/pdf.js'),
			import('pdfjs-dist-modules/pdf_link_service.js'),
			import('pdfjs-dist-modules/pdf_viewer.js')
		]).then(([pdfImport, pdfLinkServiceImport, pdfViewerImport]) => {
			return {
				pdfjsLib: pdfImport.default,
				LinkTarget: pdfImport.LinkTarget,
				PDFLinkService: pdfLinkServiceImport.PDFLinkService,
				PDFViewer: pdfViewerImport.PDFViewer
			};
		});
	}

	_loadScripts() {
		const basePath = this.useCdn
			? 'https://s.brightspace.com/lib/pdf.js/2.0.943'
			: this.pdfjsBasePath || `${import.meta.url}/../node_modules/pdfjs-dist`;

		if (!this._workerSrc) {
			this._workerSrc = `${basePath}/build/pdf.worker.min.js`;
		}

		return this._loadScript(`${basePath}/build/pdf.min.js`)
			.then(() => this._loadScript(`${basePath}/web/pdf_viewer.js`))
			.then(() => {
				return {
					pdfjsLib,
					LinkTarget: pdfjsLib.LinkTarget,
					PDFLinkService: pdfjsViewer.PDFLinkService,
					PDFViewer: pdfjsViewer.PDFViewer,
				};
			});
	}

	_loadScript(src) {
		const scriptTag = document.createElement('script');
		scriptTag.async = false;
		document.head.appendChild(scriptTag);

		return new Promise((resolve, reject) => {
			scriptTag.onload = resolve;
			scriptTag.onerror = reject;
			scriptTag.src = src;
		});
	}

	_onPdfJsLoaded({
		pdfjsLib,
		LinkTarget,
		PDFViewer,
		PDFLinkService,
	}) {
		if (this.__librariesLoaded) {
			return;
		}

		this.__librariesLoaded = true;

		this._pdfJsLib = pdfjsLib;

		pdfjsLib.GlobalWorkerOptions.workerSrc = this._workerSrc;

		// (Optionally) enable hyperlinks within PDF files.
		this._pdfLinkService = new PDFLinkService({
			externalLinkTarget: LinkTarget.BLANK
		});

		this._pdfViewer = new PDFViewer({
			container: this.viewerContainer,
			linkService: this._pdfLinkService,
			useOnlyCssZoom: true, // Use CSS zooming only, as default zoom rendering in (modularized?) pdfjs-dist is buggy
		});

		this._pdfLinkService.setViewer(this._pdfViewer);

		this._onSrcChanged(this.src);

		this.dispatchEvent(new CustomEvent('d2l-pdf-viewer-initialized', {
			bubbles: true,
		}));
	}

	_resize() {
		if (!this._pdfViewer) {
			return;
		}

		if (!this._resizeThrottleHandle) {
			this._resizeThrottleHandle = setTimeout(() => {
				var currentScaleValue = this._pdfViewer.currentScaleValue;

				if (currentScaleValue === 'auto' ||
					currentScaleValue === 'page-fit' ||
					currentScaleValue === 'page-width') {
					// Note: the scale is constant for 'page-actual'.
					this._pdfViewer.currentScaleValue = currentScaleValue;
				}

				this._pageScale = this._pdfViewer.currentScale;
				this._pdfViewer.update();
				this._resizeThrottleHandle = null;
			}, 100);
		}
	}

	_onSrcChanged(src) {
		if (!this._pdfViewer || !src) {
			return;
		}

		let destroyLoadingTask = this._initializeTask;

		this._resetPdfData();

		this.progressBar.indeterminate = false;
		this.progressBar.value = 0;

		if (this._loadingTask) {
			destroyLoadingTask = this._loadingTask.destroy();
			this._loadingTask = null;
		}

		this._setPdfNameFromUrl(src);

		destroyLoadingTask.then(() => {
			const loadingTask = this._loadingTask = this._pdfJsLib.getDocument({
				url: src
			});

			this.progressBar.hidden = false;

			loadingTask.onProgress = (progressData) => {
				if (this.progressBar.indeterminate) {
					return;
				}

				if (!progressData.total) {
					this.progressBar.indeterminate = true;
					this.progressBar.start();
					return;
				}

				this.progressBar.value = progressData.loaded / progressData.total;
			};

			loadingTask.promise
				.then(pdfDocument => {
					this._pdfViewer.setDocument(pdfDocument);
					this._pagesCount = pdfDocument.numPages;
					this._pageNumber = this._pdfViewer.currentPageNumber;

					this._pdfLinkService.setDocument(pdfDocument, null);
				})
				.catch(() => {
					this.progressBar.hidden = true;

					if (loadingTask.destroyed) {
						// the load was canceled because the src changed
						return;
					}

					this.dispatchEvent(new CustomEvent('d2l-pdf-viewer-load-failed', {
						bubbles: true,
						composed: true
					}));
				});
		});
	}

	_onPagesInitEvent(e) {
		this._pdfViewer.currentScaleValue = 'page-width';
		this._pageScale = this._pdfViewer.currentScale;
		this._onInteraction();
		this._isLoaded = true;

		if (this.progressBar.indeterminate) {
			this.progressBar.finish();
		}
	}

	_onPageChangeEvent(evt) {
		this._pageNumber = evt.pageNumber;

		this._onInteraction();
	}

	_onZoomInEvent() {
		this._addDeltaZoom(0.1);
		this._onInteraction();
	}

	_onZoomOutEvent() {
		this._addDeltaZoom(-0.1);
		this._onInteraction();
	}

	_onFullscreenEvent() {
		if (!this._pdfViewer) {
			return;
		}
		this.fullscreenService.toggleFullscreen();
		this._onInteraction();

		// If scale is a special type (eg. 'page-width'), ensure we maintain that
		requestAnimationFrame(() => {
			this._pageScale = this._pdfViewer.currentScale;
		});
	}

	_onProgressAnimationCompleteEvent() {
		this.progressBar.hidden = true;
	}

	_onPageNumberChangedEvent(evt) {
		var newPage = parseInt(evt.detail.page);

		this._setPageNumber(newPage);
	}

	_addDeltaZoom(delta) {
		if (!this._pdfViewer) {
			return;
		}
		var newZoom = this._pdfViewer.currentScale + delta;

		this._setScale(newZoom);
	}

	_setPageNumber(pageNumber) {
		if (!this._pdfViewer || pageNumber < 1 || pageNumber > this._pagesCount) {
			return;
		}

		this._pdfViewer.currentPageNumber = pageNumber;
		this._pageNumber = pageNumber;
	}

	_setScale(newScale) {
		if (!this._pdfViewer) {
			return;
		}
		this._pdfViewer.currentScaleValue = Math.max(
			this.minPageScale,
			Math.min(this.maxPageScale, newScale)
		);

		this._pageScale = this._pdfViewer.currentScale;
	}

	_onMouseEnter() {
		this.addEventListener('mousemove', this._onMouseMove);
	}

	_onMouseLeave(e) {
		// Handle a Chrome bug where "mouseleave" event may be sporadically fired when interacting
		// with element, with relatedTarget/toElement of "null"
		// This could also happen when switching away from the tab/window, but on re-entry
		// this element get another mouseleave/etc. event if the mouse is outside of the element
		if (e.relatedTarget || e.toElement) {
			clearTimeout(this._recentInteractionTimer);

			this.removeEventListener('mousemove', this._onMouseMove);
			this._hasRecentInteraction = false;
		}
	}

	_onMouseMove() {
		this._onInteraction();
	}

	_onInteraction() {
		this._hasRecentInteraction = true;

		clearTimeout(this._recentInteractionTimer);

		this._recentInteractionTimer = setTimeout(() => {
			this._hasRecentInteraction = false;
		}, 2000);
	}

	_onFocusOut(e) {
		if (!D2L.Dom.isComposedAncestor(this, e.relatedTarget)) {
			this._hasRecentInteraction = false;
		}
	}

	_computeShowToolbar(isLoaded, hasRecentInteraction) {
		return !!isLoaded && !!hasRecentInteraction;
	}

	_resetPdfData() {
		// Check if pdfJs has been imported
		if (this._pdfViewer && this._pdfLinkService) {
			this._pdfViewer.setDocument(null);
			this._pdfLinkService.setDocument(null);
		}
		this._pageNumber = 0;
		this._pagesCount = 0;
		this._isLoaded = false;
		this._pdfName = '';
	}

	_setPdfNameFromUrl(src) {
		if (!src) {
			this._pdfName = '';
			return;
		}

		const parts = src.split('/');
		let pdfName = '';

		if (parts.length > 0) {
			pdfName = parts[parts.length - 1];
		}

		this._pdfName = pdfName;
	}

	_onFullscreenChanged(isFullscreen) {
		this._isFullscreen = isFullscreen;
	}
}

customElements.define('d2l-pdf-viewer', D2LPdfViewerElement);
