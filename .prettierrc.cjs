module.exports = {
	semi: true,
	trailingComma: 'es5',
	singleQuote: true,
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	bracketSpacing: true,
	arrowParens: 'avoid',

	plugins: ['prettier-plugin-tailwindcss', '@ianvs/prettier-plugin-sort-imports'],

	importOrder: [
		'^react$',
		'<BUILTIN_MODULES>', // (опционально) встроенные модули node
		'<THIRD_PARTY_MODULES>', // библиотеки
		'^@/(.*)$', // абсолютные (алиас @)
		'^(src)/(.*)$', // абсолютные (папка src)
		'^[.]', // локальные (относительные, не типы)
		'<TYPES>', // все import type ... — будут в самом конце
	],
};
