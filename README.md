# what is this application all about?

PG Finder is a digital platform designed to simplify the process of finding and managing Paying Guest (PG) accommodations. The application connects people who are looking for comfortable and affordable places to stay with PG owners who want to list and manage their properties efficiently.

Users can search for PG accommodations across different locations, compare available options, view detailed information about rooms and facilities, read reviews from other tenants, and book a room directly through the platform. The application also enables tenants to make monthly rent payments, submit feedback, and raise maintenance or service issues easily.

For PG owners, the platform provides a centralized system to add and manage their PG listings, update room availability, track bookings, monitor payments, and respond to tenant concerns. This helps streamline property management while improving communication with residents.

Overall, PG Finder aims to make the PG accommodation experience more transparent, convenient, and efficient for both tenants and property owners.

# wanna contribute? then follow the below steps

## prerequisites

- node (v22.18.0 or above)

- pocketbase


## how to setup the pocketbase?

Install pocketbase form [here](https://pocketbase.io/docs/). Once installed extract the zip folder. You could start the application by running ./pocketbase serve in the extracted directory. if you are using mac and if you get "command not found" when you run ./pocketbase serve then

```sh
# run the below command to give execute permission to the pocketbase file
xattr -d com.apple.quarantine pocketbase

# after that you can run the pocketbase server
./pocketbase serve
```
The started web server has the following default routes:

- http://127.0.0.1:8090 - if pb_public directory exists, serves the static content from it (html, css, images, etc.)
- http://127.0.0.1:8090/_/ - superusers dashboard (open this to access the dashboard)
- http://127.0.0.1:8090/api/ - REST-ish API

And that's it! The first time it will generate an installer link that should be automatically opened in the browser to set up your first superuser account (you can also create the first superuser manually via ./pocketbase superuser create EMAIL PASS).

Once the superuser account is created(save the credentials we will have put them in .env while setting up the ui) you will land in superusers dashboard page. There, go to import collections (http://127.0.0.1:8090/_/#/settings/import-collections) under settings and paste the content the is avaliable [in this file.](https://github.com/maninageswar/pocketbase-collection-for-pg-form-project/blob/main/pgPropertiesCollection_schema_3MAR26.json) Hit review and import. Now if you go to collection tab in the dashboard you can see pgProperties and users collections.

## how to setup the ui?

fork this repo then clone your fork

Open .env file (which is under pg-finder folder) and then replace POCKETBASE_USER_NAME and POCKETBASE_PASSWORD with yours credentials then

```sh
# get inside project folder which has package.json file
cd pg-finder

# install dependencies
npm i
```

## run the application

- run ui

```sh
# get inside project folder which has package.json file
cd pg-finder

# run the application
npm run dev
```

- run pocketbase

(if you follow the above steps to setup the pocketbase then you can skip this step as it will be already running, but if you have stopped it then you can start it again by running the below command)

```sh
# get inside pocket base extracted folder
cd your-pocketbase-extracted-folder

# run pocketbase
pocketbase serve
```
