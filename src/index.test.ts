import * as Stream from 'event-stream';
import * as File from 'vinyl';
import * as PluginError from 'plugin-error';

import plugin, { PluginOptions, CompilerOptions } from './index';

interface TestCase {
  pluginOptions: PluginOptions;
  path: string | undefined;
  input: string;
  expected: string;
}

// tslint:disable-next-line:object-literal-key-quotes
const compilerOptions: CompilerOptions = { paths: { 'MyAlias': ['MyAliasFolder/MyAliasClass'] } };

const run = (test: TestCase): void => {
  const input = new File({ contents: Buffer.from(test.input), path: test.path });

  Stream.readArray([input])
    .pipe(plugin(test.pluginOptions))
    .pipe(Stream.mapSync((file: File, cb: (error: any, file?: any) => void) => {
      const contents: Buffer | NodeJS.ReadableStream | null = file.contents;

      if (contents === null) {
        return cb(null, file);
      }

      console.log(contents.toString());
  }));
};

it('should throw with no config', (done) => {
  let error;

  try {
    run({
      pluginOptions: { configuration: undefined! },
      path: undefined,
      input: '',
      expected: '',
    });
  } catch (e) {
    error = e;
  }

  if (!(error instanceof PluginError)) {
    fail('Test should have failed but did not!');
  }

  done();
});

it('should throw with no path', (done: jest.DoneCallback) => {
  let error;

  try {
    run({
      pluginOptions: { configuration: compilerOptions },
      path: undefined,
      input: '',
      expected: '',
    });
  } catch (e) {
    error = e;
  }

  if (!(error instanceof PluginError)) {
    fail('Test should have failed but did not!');
  }

  done();
});
