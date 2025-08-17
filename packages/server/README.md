# Mettre à jour les données

Pour importer un fichier .psql :
```
psql -h localhost -U USERNAME -p PORT -d DATABASE_NAME < file.psql
```

Puis mettre à jour le client Prisma :
```
npm run prisma:db:pull && npm run prisma:generate
```
