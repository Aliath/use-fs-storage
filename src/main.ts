import * as fs from 'fs';

export type StorageValue<T> = Array<T> | T;
export type StorageFactory<T> = (oldValue: StorageValue<T>) => StorageValue<T>;
export type StorageOutput<T> = [
	StorageValue<T>,
	(input: StorageValue<T> | StorageFactory<T>) => Promise<void>
];

export interface StorageConfig {
	immediatelySync?: boolean;
	overrideDefault?: boolean;
	defaultValue?: StorageValue<any>;
}

export const defaultConfig: StorageConfig = Object.freeze({
	immediatelySync: true,
	overrideDefault: true,
	defaultValue: {}
});

const readFile = (filePath: string): Promise<string> => new Promise((resolve, reject) => {
	fs.readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
		if (error) {
			reject(error);
		} else {
			resolve(data);
		}
	});
});

const writeFile = (filePath: string, content: string) => new Promise((resolve, reject) => {
	fs.writeFile(filePath, content, { encoding: 'utf-8' }, (error => {
		if (error) {
			reject(error);
		} else {
			resolve();
		}
	}))
});

const copyObject = <T>(object: StorageValue<T>) => JSON.parse(JSON.stringify(object));

export const useStorage = async <T>(filePath: string, argsConfig?: StorageConfig): Promise<StorageOutput<T>> => {
	const config = Object.assign({}, defaultConfig, argsConfig);
	let defaultValue = copyObject(config.defaultValue);

	if (config.immediatelySync) {
		if (config.overrideDefault) {
			try {
				defaultValue = JSON.parse(await readFile(filePath));
			} catch {
				console.warn(`File "${filePath}" does not exists - take default value instead.`);
			}
		} else {
			await writeFile(filePath, JSON.stringify(defaultValue));
		}
	}

	return [defaultValue, async (payloadCallback) => {
		let result: StorageValue<T>;

		if (payloadCallback instanceof Function) {
			result = payloadCallback(defaultValue);
		} else {
			result = payloadCallback;
		}

		await writeFile(filePath, JSON.stringify(result));

		if (Array.isArray(defaultValue)) {
			defaultValue.length = 0;
		} else {
			for (let key in defaultValue) {
				delete defaultValue[key];
			}
		}

		for (let key of Object.keys(result)) {
			defaultValue[key] = result[key];
		}
	}];
};

export default useStorage;