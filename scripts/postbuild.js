import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'fs';
import { dirname, join, sep } from 'path';
// import packagejson from '../package.json';

const __dirname = dirname(import.meta.url).replace('file://', '');
console.log(__dirname)
// project dir
const projectdir = join(__dirname, '..');
// source dir
const srcdir = join(__dirname, '..', 'src');
// output dir
const outdir = join(__dirname, '..', 'lib');
// cjs output dir
const cjsoutdir = join(outdir, 'js');
// es6 output dir
const es6outdir = join(outdir, 'es6');
// out maps
const outmap = {
  js: cjsoutdir,
  es6: es6outdir,
};

//#region fns

const isdirectory = arg => statSync(arg).isDirectory();
const isfile = arg => statSync(arg).isFile();

const ensuredir = dir => {
  const chunks = dir.replace(projectdir, '').split(sep);
  let current = chunks[0];

  for (let i = 1; i < chunks.length; i++) {
    current = join(current, chunks[i]);
    if (!existsSync(current)) {
      mkdirSync(current);
    }
  }
}

const readdirectoryrecursive = (dir, files = []) => {
  if (isdirectory(dir)) {
    return readdirSync(dir)
      .map(content => readdirectoryrecursive(join(dir, content), files))
      .reduce((s, c) => s.concat(c), files);
  }

  return files.concat(dir);
}

//#endregion

const typedefs = readdirectoryrecursive(srcdir, []).filter(a => a.endsWith('.d.ts'));

// copy typings
typedefs.forEach(typedef => {
  if (isfile(typedef)) {
    Object.keys(outmap).forEach(key => {
      const destfile = typedef.replace('src', join('lib', key));
      ensuredir(dirname(destfile));
      copyFileSync(typedef, destfile);
    });
  }
});

// cycle througt outmap and copy files
Object.keys(outmap).forEach(key => {
  const outdirbase = outmap[key];
  const files = readdirectoryrecursive(outdirbase).filter(a => !a.endsWith('.d.ts'));
  
  files.forEach(filename => {
    const destfile = filename.replace('src', '');
    ensuredir(dirname(destfile));
    renameSync(filename, destfile);
  })
});

// copy package.json
// writeFileSync(join(outdir, 'package.json'), JSON.stringify(packagejson, null, 2));

copyFileSync(join(projectdir, 'README.md'), join(outdir, 'README.md'));
copyFileSync(join(projectdir, 'LICENSE'), join(outdir, 'LICENSE'));
copyFileSync(join(projectdir, '.gitignore'), join(outdir, '.gitignore'));
copyFileSync(join(projectdir, '.npmignore'), join(outdir, '.npmignore'));