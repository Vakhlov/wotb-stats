// @flow
export class LocalStorageMock {
	store = {};

	constructor () {
		this.store = {};
	}

	clear () {
		this.store = {};
	}

	getItem (key: string): string | null {
		return this.store[key] || null;
	}

	removeItem (key: string): void {
		delete this.store[key];
	}

	setItem (key: string, value: string): void {
		this.store[key] = value;
	}
}
