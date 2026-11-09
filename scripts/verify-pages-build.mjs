import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist');
const entryFile = path.join(outputDirectory, 'index.html');

await access(entryFile);

const html = await readFile(entryFile, 'utf8');
const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
const localReferences = references.filter(
  (reference) => !/^(?:[a-z]+:|\/\/|#)/i.test(reference),
);

const rootRelativeReferences = localReferences.filter((reference) => reference.startsWith('/'));
if (rootRelativeReferences.length > 0) {
  throw new Error(
    `GitHub Pages 子路徑不支援根目錄絕對資源網址：${rootRelativeReferences.join(', ')}`,
  );
}

for (const reference of localReferences) {
  const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const assetFile = path.resolve(outputDirectory, pathname);

  if (!assetFile.startsWith(`${outputDirectory}${path.sep}`)) {
    throw new Error(`資源網址超出 dist 目錄：${reference}`);
  }

  await access(assetFile);
}

console.log(`GitHub Pages 產物驗證完成：${localReferences.length} 個本機資源均可存取。`);
