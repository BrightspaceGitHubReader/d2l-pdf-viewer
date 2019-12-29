import { PDFJSStatic } from "pdfjs-dist";

declare var pdfjsLib: PDFJSStatic & {
	LinkTarget: any;
	PDFLinkService: any;
	PDFViewer: any;
};
