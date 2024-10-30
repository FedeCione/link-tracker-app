# Link Tracker App

## Setup
1. Ejecuta el comando **'npm i'** en la terminal para instalar las dependencias.
2. Crea el archivo **'.env'** y con la variable de entorno **'PORT'**(usa el puerto que desees) dentro o saltea este paso si vas a utilizar el puerto 3000.
3. Ejecuta el comando **'npm run start:dev'** para correr la aplicación.
4. Dirígete a **'/docs'** para testear los endpoints en Swagger o utiliza los cURL de abajo en Postman, Insomnia o donde desees.

## Endpoints cURLs

- **POST /create**
```
curl -X POST http://localhost:8080/create \
-H "Content-Type: application/json" \
-d '{
  "url": "https://www.fierrastudio.com",
  "password": "1234",
  "expirationDate": "2024-12-31T23:59:59"
}'
```

- **GET /:link**
```
curl -X GET "http://localhost:8080/aBsJu?password=1234" \
-i
```

- **GET /:link/stats**
```
curl -X GET http://localhost:8080/aBsJu/stats
```

- **PUT /:link**
```
curl -X PUT http://localhost:8080/aBsJu
```
