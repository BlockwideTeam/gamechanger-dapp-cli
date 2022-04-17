export type NetworkType = 'testnet' | 'mainnet' | string;
export type TemplateType = 'default' | 'boxed' | 'printable';
export type HandlerInputType = {
	network: NetworkType;
	inputData: string;
};

export type SourceType = {
	[name: string]: () => Promise<any>;
};
export type ActionHandlerType = {
	[action: string]: {
		[name: string]: (input: HandlerInputType) => any;
	};
};

export type ExecuteType = {
	network: NetworkType;
	action: Function;
	source: Function;
};

export type ObjectType = { [name: string]: any };
