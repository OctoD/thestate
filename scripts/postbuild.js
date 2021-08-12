const fs = require('fs');
const path = require('path');
const packagejson = require('../package.json');

// project dir
const projectdir = path.join(__dirname, '..');
// source dir
const srcdir = path.join(__dirname, '..', 'src');
// output dir
const outdir = path.join(__dirname, '..', 'lib');
// cjs output dir
const cjsoutdir = path.join(outdir, 'js');
// es6 output dir
const es6outdir = path.join(outdir, 'es6');
// out maps
const outmap = {
  js: cjsoutdir,
  es6: es6outdir,
};

//#region fns

const isdirectory = arg => fs.statSync(arg).isDirectory();
const isfile = arg => fs.statSync(arg).isFile();

const ensuredir = dir => {
  const chunks = dir.replace(projectdir, '').split(path.sep);
  let current = chunks[0];

  for (let i = 1; i < chunks.length; i++) {
    current = path.join(current, chunks[i]);
    if (!fs.existsSync(current)) {
      fs.mkdirSync(current);
    }
  }
}

const readdirectoryrecursive = (dir, files = []) => {
  if (isdirectory(dir)) {
    return fs.readdirSync(dir)
      .map(content => readdirectoryrecursive(path.join(dir, content), files))
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
      const destfile = typedef.replace('src', path.join('lib', key));
      ensuredir(path.dirname(destfile));
      fs.copyFileSync(typedef, destfile);
    });
  }
});

// cycle througt outmap and copy files
Object.keys(outmap).forEach(key => {
  const outdirbase = outmap[key];
  const files = readdirectoryrecursive(outdirbase).filter(a => !a.endsWith('.d.ts'));
  
  files.forEach(filename => {
    const destfile = filename.replace('src', '');
    ensuredir(path.dirname(destfile));
    fs.renameSync(filename, destfile);
  })
});

// copy package.json
fs.writeFileSync(path.join(outdir, 'package.json'), JSON.stringify(packagejson, null, 2));

fs.copyFileSync(path.join(projectdir, 'README.md'), path.join(outdir, 'README.md'));
fs.copyFileSync(path.join(projectdir, 'LICENSE'), path.join(outdir, 'LICENSE'));
fs.copyFileSync(path.join(projectdir, '.gitignore'), path.join(outdir, '.gitignore'));
fs.copyFileSync(path.join(projectdir, '.npmignore'), path.join(outdir, '.npmignore'));