import * as React from 'react';
import { useStableCallback } from './use-stable-callback';

export function useCancellationTimer(onTimerEnding: () => void, time: number = 800) {
	const timerIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const start = useStableCallback(() => {
		timerIdRef.current = setTimeout(() => {
			onTimerEnding();
		}, time);
	});

	const end = useStableCallback(() => {
		if (timerIdRef.current) {
			clearTimeout(timerIdRef.current);
		}
	});

	React.useEffect(() => {
		return () => {
			if (timerIdRef.current) {
				clearTimeout(timerIdRef.current);
			}
		};
	}, []);

	return { start, end };
}
