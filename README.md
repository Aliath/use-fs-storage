## use-fs-storage
Basic wrapper for file storage strongly inspired by react hooks. It allows us to storage variable passed through reference (such as object, array and other possible JSON values). Make react-like data flow with no effort!

## Installation


```bash
yarn add use-fs-storage
```

or 
```bash
npm i --save use-fs-storage
```

## Usage

```typescript
import useStorage from 'use-fs-storage';

const [storage, setStorage] = useStorage('example.json', {
    defaultValue: [],      // default value for the storage
    immediatelySync: true, // does library should sync data immediately
    overrideDefault: true, // does file content should override value above
});

// among some piece of code

await setStorage(previousValue => {
    return [...previousValue, newItem];
});

// ...  or just
await setStorage([firstItem, secondItem]);

// file saved, do whatever
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)