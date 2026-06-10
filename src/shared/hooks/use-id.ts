import * as React from 'react';

export function useId(externalId: string | undefined) {
	const localId = React.useId();

	return externalId ?? localId;
}
