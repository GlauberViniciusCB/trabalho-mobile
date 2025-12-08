## Compilando APK
### Pré-requisitos
- Node e npm.
- JDK 21.
- Android SDK.
- Variáveis de ambiente JAVA_HOME e ANDROID_HOME configuradas.

### 1. Instalar dependências
```
npm install
```
### 2. Compilar projeto web
```
npm run build
```
### 3. Sincronizar Capacitor com Android
```
npx cap sync android
```
### 4. Accessar a pasta /android
```
cd android
```
### 5. Compilar o APK
- Debug:
```
./gradlew assembleDebug
```
- Release:
```
./gradlew assembleRelease
```
O arquivo .apk gerado estará em `app\android\app\build\outputs\apk`.