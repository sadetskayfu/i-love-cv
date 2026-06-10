import * as React from 'react';

export function useElementFocus<T extends HTMLElement>(initialFocus: boolean = false) {
	const elementRef = React.useRef<T>(null);

	React.useEffect(() => {
		if (initialFocus && elementRef.current) {
			elementRef.current.focus();
		}

		function handleVisibilityChange() {
			if (document.visibilityState === 'visible') {
				elementRef.current?.focus();
			}
		}

		window.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			window.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return { elementRef };
}
