# Training Management Tool
##### Dev Workshop Project
### Demo: http://piotrwitek.github.io/training-management-tool/

### Features:
- using ES2016 (generators/async/await) then transpiled to ES5 cross-browser compatible code
- development server with hot-reload for quick development loop
- static dev-bundle for quick full-page reload
- automatic build of optimized production package and deployment: `npm run bd`
- unit test with simple test runner in TypeScript
- typescript node support using ts-node
- git hooks running linter before commit and tests before push
- editorconfig and tslint as code linter

### Stack:
- TypeScript - v1.8.10
- React - v15.1.0
- MobX - v2.3.1 / mobx-react
- JSPM (0.17.X) / SystemJS / systemjs-hot-reloader

---

### Installation

##### 1. Clone repo
    git clone https://github.com/zoyoto/-training-management-tool.git

##### 2. Install all dependencies
    npm i jspm@0.17.0-beta.22
    npm install

##### 3. Run development server and start developing
    npm start

### NPM commands
- `npm start` - run local development server with hot-reloader at localhost:8888
- `npm test` - run tests
- `npm run lint` - run code linter
- `npm run dev-bundle` - build & inject dev-bundle with all dependencies to index.html for faster page reload
- `npm run dev-unbundle` - remove injected dev-bundle
- `npm run build` - build production deployment package (minified)
- `npm run build-debug` - build debug deployment package (source maps)
- `npm run init-deploy` - init deployment repository
- `npm run deploy` - commit to deployment repository & push to remote
- `npm run bd` - automatic build and deployment

### Tips
- local demo page: localhost:8888/dist
- use JSPM beta -> `jspm@0.17.X`
- if you use the Windows environment,please modify Linux command and path to Windows command and path format in package.json -> `cp->copy`;`/->\\`

---

### Contributors:
 https://github.com/piotrwitek/training-management-tool
