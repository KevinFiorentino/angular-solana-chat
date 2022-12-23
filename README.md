# Angular/Solana dapp

- https://angular-solana-chat.vercel.app/

## Config environment

### Install project

- `npm install`
- `ng serve`

#### Required dependencies

- `npm i @solana/web3.js`
- `npm i @project-serum/anchor`


#### Dependencies to avoid possible errors

- `npm i --save-dev @types/bn.js`
- `npm i --save-dev assert`


#### Edit `tsconfig.json`

```json
"compileOptions": {
  "allowSyntheticDefaultImports": true
}
```

#### Edit `angular.json`

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "allowedCommonJsDependencies": [
      "@project-serum/borsh",
      "@solana/buffer-layout",
      "assert",
      "borsh",
      "bs58",
      "buffer",
      "jayson/lib/client/browser",
      "rpc-websockets"
    ],
  }
}
```

#### Possible mistakes

- [process is not defined...](https://github.com/twilio/twilio-client.js/issues/284)
- [Buffer is not defined](https://stackoverflow.com/questions/50371593/angular-6-uncaught-referenceerror-buffer-is-not-defined)
- [Error window.solana](https://stackoverflow.com/questions/66120513/property-does-not-exist-on-type-window-typeof-globalthis)
