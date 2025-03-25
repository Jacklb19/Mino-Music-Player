Reproductor de música
Repositorio: https://github.com/Jacklb19/Mino-Music-Player.git 
REPRODUCTOR DE MUSICA
JOSE LUIS BURBANO BUCHELLY
TECNOLOGIAS USADAS
-node.js (Version lts (En mi caso tengo la v22.14.0))
-react
-tailwind
-typescript
-music-metadata-browser
PARA CORRER LA APLICACIÓN SE DEBE:
-npm install
-npm run dev
FUNCIONES PLUS:
SE NECESITA AGREGAR LAS CANCIONES DESDE UNA CARPETA QUE TENGAS EN TU DISPOSITVO (Nota: No se pueden agregar carpetas enteras)
SE PUEDE CAMBIAR DE POSICION CADA CANCION ARRASTRANDOLA Y SOLTANDOLA DONDE QUIERAS. 
BOTON DE REPITIR LISTA 🔁
BARRA DE VOLUMEN Y DE REPRODUCCION


```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
