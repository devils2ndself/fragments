const memory = require('../../src/model/data/memory');

describe('memory', () => {
  test('writeFragment() returns nothing', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    const result = await memory.writeFragment(validFragment);
    expect(result).toBe(undefined);
  });

  test('readFragment() after writeFragment() returns the fragment', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    await memory.writeFragment(validFragment);
    const result = await memory.readFragment('a', 'b');
    expect(result).toEqual(validFragment);
  });

  test('readFragment() with incorrect key returns nothing', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    await memory.writeFragment(validFragment);
    const result = await memory.readFragment('a', 'c');
    expect(result).toBe(undefined);
  });

  test('readFragmentData() after writeFragmentData() returns fragment metadata', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    await memory.writeFragmentData(validFragment.ownerId, validFragment.id, validFragment.data);
    const result = await memory.readFragmentData('a', 'b');
    expect(result).toEqual(validFragment.data);
  });

  test('readFragment() returns nothing after deletion', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    await memory.writeFragment(validFragment);
    await memory.writeFragmentData(validFragment.ownerId, validFragment.id, validFragment.data);
    await memory.deleteFragment('a', 'b');
    const result = await memory.readFragment('a', 'b');
    expect(result).toBe(undefined);
    const result2 = await memory.readFragmentData('a', 'b');
    expect(result2).toBe(undefined);
  });

  test('listFragments() returns added fragments', async () => {
    const validFragment = { ownerId: 'a', id: 'b', data: { value: 123 } };
    const validFragment2 = { ownerId: 'a', id: 'c', data: { value: 123 } };
    await memory.writeFragment(validFragment);
    await memory.writeFragment(validFragment2);
    const result = await memory.listFragments('a');
    expect(result).toEqual(['b', 'c']);
  });
});
