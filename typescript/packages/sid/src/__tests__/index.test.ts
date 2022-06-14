import sid from '../index.js';
import { isHex } from '@strut/utils';

test('Requires hex device id', () => {
  expect(() => sid('zyx')).toThrow();
  expect(() => sid('01AF')).not.toThrow();
});

test('Returned value is hex', () => {
  const id = sid('01AF');
  expect(isHex(id)).toBe(true);
});

test('Returned value is 64bits (8 bytes)', () => {
  const id = sid('F1AF');
  expect(id.length).toBe(16);
});

test('Device ids are required to be 2 bytes or more', () => {
  expect(() => sid('1')).toThrow();
  expect(() => sid('12')).toThrow();
  expect(() => sid('123')).toThrow();
  expect(() => sid('1234')).not.toThrow();
});
