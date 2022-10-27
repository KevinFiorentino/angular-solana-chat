# Angular/Solana Chat

## Configuración del entorno

#### Dependencies

- `npm i @solana/web3.js`
- `npm i @project-serum/anchor`

#### Dependencias para evitar errores

- `npm i --save-dev @types/bn.js`
- `npm i --save-dev assert`

### TS Config

- Edit `tsconfig.json`
```json
"compileOptions": {
  ...
  "allowSyntheticDefaultImports": true
}
```
