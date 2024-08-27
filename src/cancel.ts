class AbortHttp {
	cancelMaps = new Map();

	getAbortKey(url: string) {
		return url.split('?')[0];
	}

	setAbortController(key: string, controller: AbortController) {
		this.cancelMaps.set(key, controller);
	}

	abort(key: string, type: 'check' | 'remove' = 'check') {
		switch (type) {
			case 'remove':
				this.cancelMaps.delete(key);
				break;
			case 'check':
			default:
				if (this.cancelMaps.has(key)) {
					this.cancelMaps.get(key).abort();
				}
				break;
		}
	}

	clear() {
		this.cancelMaps.clear();
	}
}

export default new AbortHttp();
