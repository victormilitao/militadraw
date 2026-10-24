import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAutosave } from '../src/autosave.ts';

test('rapid canvas updates persist the latest scene including image data', async () => {
  const writes: unknown[] = [];
  const saver = createAutosave(async (data) => { writes.push(data); }, assert.fail);
  saver.schedule({ elements: ['old'] });
  const latest = { elements: ['new'], files: { image: 'data:image/png;base64,example' } };
  saver.schedule(latest);
  await saver.flush();
  assert.deepEqual(writes, [latest]);
});

test('a slow older save cannot overwrite a newer scene', async () => {
  const writes: number[] = [];
  const saver = createAutosave<number>(async (value) => {
    await new Promise(resolve => setTimeout(resolve, value === 1 ? 20 : 0));
    writes.push(value);
  }, assert.fail);
  saver.schedule(1);
  void saver.flush();
  saver.schedule(2);
  await saver.flush();
  assert.deepEqual(writes, [1, 2]);
});

test('storage failures are reported and subsequent saves recover', async () => {
  const errors: unknown[] = [];
  const writes: number[] = [];
  const saver = createAutosave<number>(async value => {
    if (value === 1) throw new Error('quota');
    writes.push(value);
  }, error => errors.push(error));
  saver.schedule(1);
  await saver.flush();
  saver.schedule(2);
  await saver.flush();
  assert.equal(errors.length, 1);
  assert.deepEqual(writes, [2]);
});
