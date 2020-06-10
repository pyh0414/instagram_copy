module.exports = {
	roots: ["<rootDir>/src"],
	testMatch: ["**/test/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
	transform: {
		"^.+\\.(ts)$": "ts-jest",
	},
};
