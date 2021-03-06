import { join } from 'desm';
import { execaCommandSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { beforeAll, expect, test } from 'vitest';

import lionFixture from '~/index.js';

const tempDir = join(import.meta.url, '../temp');
const { fixture, fixtureSync } = lionFixture({
	fixturesDir: join(import.meta.url, '../fixtures'),
	tempDir,
});

beforeAll(() => {
	fs.rmSync(tempDir, { recursive: true, force: true });
});

test('creates a fixture synchronously', () => {
	const tempMyProjectSyncDir = fixtureSync('my-project', 'my-project-sync');

	expect(
		execaCommandSync('node index.js', {
			cwd: tempMyProjectSyncDir,
		}).stdout
	).toEqual('1,2');
});

test('creates a fixture asynchronously', async () => {
	const tempMyProjectDir = await fixture('my-project');

	expect(
		execaCommandSync('node index.js', {
			cwd: tempMyProjectDir,
		}).stdout
	).toEqual('1,2');
});

test('default options', () => {
	const { fixtureSync } = lionFixture(import.meta.url);

	const tempFixtureDefaultDir = fixtureSync('my-project', 'my-project-default');
	expect(
		execaCommandSync('node index.js', {
			cwd: tempFixtureDefaultDir,
		}).stdout
	).toEqual('1,2');

	const myWorkspaceTempDir = fixtureSync('my-workspace');
	expect(
		fs.existsSync(path.join(myWorkspaceTempDir, 'subpackage1/node_modules'))
	).toBe(true);
});

test('skips install when `runInstall` is false', () => {
	const myProjectTempDir = fixtureSync(
		'my-project',
		'my-project-run-install-false',
		{ runInstall: false }
	);
	expect(fs.existsSync(path.join(myProjectTempDir, 'node_modules'))).toBe(
		false
	);
});
