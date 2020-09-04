![test coverage](https://github.com/Aliath/use-fs-storage/workflows/test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Aliath/use-fs-storage/badge.svg?branch=master)](https://coveralls.io/github/Aliath/use-fs-storage?branch=master)
![npm bundle size](https://img.shields.io/bundlephobia/min/use-fs-storage)
![npm](https://img.shields.io/npm/dw/use-fs-storage?style=plastic)

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


// first use
(async () => {
  const [users, setUsers] = await useStorage('users.json', {
    defaultValue: [],
    immediatelySync: true, // sync right after create store
    overrideDefault: true, // if specified path exists it will override default value
  });

  console.log(users); // []
  await setUsers([1, 2, 3]); // save value of "users" variable to "users.json"
  console.log(users); // [1, 2, 3]
  await setUsers(previousValue => previousValue.map(item => item * 2));
  console.log(users); /// [2, 4, 6] - same as "users.json" value
})();


// second use
(async () => {
  const [users, setUsers] = await useStorage('users.json', {
    defaultValue: [],
    immediatelySync: true,
    overrideDefault: true,
  });

  console.log(users); // [2, 4, 6]
  await setUsers(previousValue => previousValue.map(item => item * 2));
  console.log(users); /// [4, 8, 12] - same as "users.json" value
})();
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)