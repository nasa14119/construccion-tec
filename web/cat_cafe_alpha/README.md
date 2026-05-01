# Cat cafe website

## A project from Nicolas Amaya and Pablo Paz

### Install instructions

This is proyects need to have a mysql server running. You could use bash base system for the following commands.

mysql database scrips this will create the db and define the table schema. Run this from the root of the project

```bash
mysql -u root < ./db/schema.sql
mysql -u root CatCafeFinal < ./db/data.sql
```

> [!NOTE]
> If your server has a password you must also pass the -p flag or MYSQL_PWD env var.\
> `MYSQL_PWD=YOURPASS mysql -u root < ./db/schema.sql`

> [!TIP]
> If you whant to manualy set up the mysql instance the scripts are in ./db the schema and data files.

```bash
npm install
npx drizzle-kit pull
```

### Commands

Dev enviroment:

```bash
npm run dev
```

Production:

```bash
npm run start
```

or simply run

```bash
node ./index.js
```
