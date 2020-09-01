import { promises as fs } from 'fs';

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

const copyObject = <T>(object: StorageValue<T>) => JSON.parse(JSON.stringify(object));

export const useStorage = async <T>(filePath: string, argsConfig?: StorageConfig): Promise<StorageOutput<T>> => {
	const config = Object.assign({}, defaultConfig, argsConfig);
	let defaultValue = copyObject(config.defaultValue);

	if (config.immediatelySync) {
		if (config.overrideDefault) {
			try {
				const fileContent = (await fs.readFile(filePath, { encoding: 'utf8' })).toString();
				defaultValue = JSON.parse(fileContent);
			} catch {
				console.warn(`File "${filePath}" does not exists - take default value instead.`);
			}
		} else {
			const fileContent = JSON.stringify(defaultValue);
			await fs.writeFile(filePath, fileContent, { encoding: 'utf8' });
		}
	}

	return [defaultValue, async (payloadCallback) => {
		let result: StorageValue<T>;

		if (payloadCallback instanceof Function) {
			result = payloadCallback(copyObject(defaultValue));
		} else {
			result = payloadCallback;
		}

		const fileContent = JSON.stringify(result);
		await fs.writeFile(filePath, fileContent, { encoding: 'utf8' });

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