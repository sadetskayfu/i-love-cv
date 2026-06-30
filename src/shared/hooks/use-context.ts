import * as React from 'react';

const PROD_ERR_MESSAGE = 'ERR_CTX';

export function useContext<Context, Required extends boolean = true>(
	context: React.Context<Context | undefined>,
	errorMessage: string,
	required: Required = true as Required
): Required extends true ? Context : Context | undefined {
	const reactContext = React.useContext(context);

	if (!reactContext && required) {
		const isProduction = false;

		throw new Error(isProduction ? PROD_ERR_MESSAGE : errorMessage);
	}

	return reactContext as Required extends true ? Context : Context | undefined;
}
