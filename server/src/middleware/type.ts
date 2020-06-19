import express from "express";

export type Resolver = (
	parent: any,
	args: any,
	context: {
		reqeust: express.Request;
	},
	info: any
) => any;
