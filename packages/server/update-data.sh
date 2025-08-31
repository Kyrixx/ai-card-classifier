source .env

# Check Postgres connection
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -c "\q"
if [ $? -ne 0 ]; then
  echo "Failed to connect to Postgres database. Please check your credentials."
  exit 1
fi

wget https://mtgjson.com/api/v5/AllPrintings.psql.zip
wget https://mtgjson.com/api/v5/AllPricesToday.psql.zip
if [ $? -ne 0 ]; then
  echo "Failed to download AllPrintings.psql.zip"
  exit 1
fi

unzip ./AllPrintings.psql.zip
unzip ./AllPricesToday.psql.zip
if [ $? -ne 0 ]; then
  echo "Failed to unzip AllPrintings.psql.zip"
  exit 1
fi
rm AllPrintings.psql.zip
rm AllPricesToday.psql.zip

PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -c "DROP Database IF EXISTS mtgjson"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -c "CREATE DATABASE mtgjson"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d mtgjson < ./AllPrintings.psql
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d mtgjson < ./AllPricesToday.psql
if [ $? -ne 0 ]; then
  echo "Failed to execute SQL script"
  exit 1
fi
rm -rf ./AllPrintings.psql
rm -rf ./AllPricesToday.psql
echo "Database updated successfully."
npm run prisma:db:pull && npm run prisma:generate
if [ $? -ne 0 ]; then
  echo "Failed to run Prisma commands"
  exit 1
fi
echo "Prisma schema updated successfully."
