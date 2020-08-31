import * as assert from 'assert';
import useStorage from '..';

describe('useStorage', () => {
  const path = './example.json';
  const random = Math.random();

  it('saves value of store to file', async () => {

    await useStorage(path, {
      defaultValue: { random },
      immediatelySync: true,
      overrideDefault: false
    });

    const [storage] = await useStorage<any>(path, {
      defaultValue: { random },
      immediatelySync: true,
      overrideDefault: true
    });

    assert.equal(storage.random, random);
  });

  it('overrides saved value', async () => {
    const [storage, setStorage] = await useStorage<any>(path, {
      defaultValue: { abc: 'def' },
      immediatelySync: true,
      overrideDefault: false
    });

    await setStorage((currentValue: any) => {
      return {
        abc: currentValue.abc.split('').reverse().join('')
      };
    });

    const [oStorage] = await useStorage<any>(path, {
      immediatelySync: true,
      overrideDefault: true
    });

    assert.equal(oStorage.abc, 'fed');
  });
});