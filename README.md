# Angular/Solana Chat

## Configuración del entorno

#### Dependencias necesarias

- `npm i @solana/web3.js`
- `npm i @project-serum/anchor`


#### Dependencias para evitar posibles errores

- `npm i --save-dev @types/bn.js`
- `npm i --save-dev assert`


#### Edit `tsconfig.json`

```json
"compileOptions": {
  ...
  "allowSyntheticDefaultImports": true
}
```

#### Edit `angular.json`

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    ...
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

#### Otros errores

- [process is not defined...](https://github.com/twilio/twilio-client.js/issues/284)
