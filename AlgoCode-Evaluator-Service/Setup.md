## How to setup a new Typescript Express project

1. 
```
npm init -y
```

2.
```
npm install typescript -g
npm install concurrently
npm install dotenv
```

3. 
```
tsc --init
```

4. 
```
Add the following scrips in package.json

"scripts": {
    "build": "npx tsc",
    "watch": "tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently \"npm run watch\" \"npm start\""
  }
```

```
Node: make relevant config changes in tsconfig.json
```


5.
```
npm run dev
```
