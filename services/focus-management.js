const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
});

export class FocusManagementService {

	constructor(opts) {
		this.opts = opts;

		this.opts.focusContainer.addEventListener('keydown', (e) => this._handleArrowKeys(e));
	}

	async focusablesProvider() {
		return await this.opts.focusablesProvider();
	}

	_handleArrowKeys(e) {
		const target = e.path[0];
		const dir = getComputedStyle(this.opts.focusContainer).direction;

		if (e.keyCode === keyCodes.LEFT) {
			if (dir === 'rtl') {
				this._focusNext(target);
			} else {
				this._focusPrevious(target);
			}
		} else if (e.keyCode === keyCodes.RIGHT) {
			if (dir === 'rtl') {
				this._focusPrevious(target);
			} else {
				this._focusNext(target);
			}
		} else if (e.keyCode === keyCodes.HOME) {
			this._focusFirst();
		} else if (e.keyCode === keyCodes.END) {
			this._focusLast();
		} else {
			return;
		}
		e.preventDefault();
	}

	async _focus(elem) {
		if (elem) {
			if (this.opts.onBeforeFocus) {
				await this.opts.onBeforeFocus(elem);
			}

			elem.focus();
		}
	}

	async _focusFirst() {
		const elems = await this.focusablesProvider();
		if (elems && elems.length > 0) return this._focus(elems[0]);
	}

	async _focusLast() {
		const elems = await this.focusablesProvider();
		if (elems && elems.length > 0) return this._focus(elems[elems.length - 1]);
	}

	async _focusNext(elem) {
		const elems = await this.focusablesProvider();
		const next = this._tryGetNextFocusable(elems, elem);
		return this._focus(next);
	}

	async _focusPrevious(elem) {
		const elems = await this.focusablesProvider();
		const previous = this._tryGetPreviousFocusable(elems, elem);
		return this._focus(previous);
	}

	_tryGetNextFocusable(elems, elem) {
		if (!elems || elems.length === 0) return;

		const index = elems.indexOf(elem);
		if (index === elems.length - 1) {
			return elems[0];
		}
		return elems[index + 1];
	}

	_tryGetPreviousFocusable(elems, elem) {
		if (!elems || elems.length === 0) return;

		const index = elems.indexOf(elem);
		if (index === 0) {
			return elems[elems.length - 1];
		}
		return elems[index - 1];
	}
};
