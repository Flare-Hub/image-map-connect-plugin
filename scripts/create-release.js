const walk = require('ignore-walk');
const { resolve, dirname } = require('path');
const { copyFile } = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const { log, error } = require('console');

const destination = './releases/trunk/';

function ensureDirectoryExistence(filePath) {
	const dir = dirname(filePath);
	if (existsSync(dir)) {
		return true;
	}
	ensureDirectoryExistence(dir);
	mkdirSync(dir);
}

const files = walk.sync({ ignoreFiles: ['.distignore'] });

const result = [];

for (const file of files) {
	const fileDest = resolve(destination, file);
	ensureDirectoryExistence(fileDest);
	const moved = copyFile(file, fileDest);
	moved.then(() => log('Copied ' + fileDest));
	result.push(moved);
}

Promise.all(result)
	.then(() => log('All files copied'))
	.catch((e) => error(e));
