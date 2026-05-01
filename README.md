# What Is This Application All About? 🏠

> Note: This is not a fully vibe-coded project. I originally started it as a practice project to put my Svelte and SvelteKit learnings into action. Only the Accordion and Vertical Stepper components were implemented with Copilot; the rest of the project was coded manually. It feels important to state that clearly in the age of AI. 🤖

PG Finder is a digital platform built to simplify the process of finding and managing Paying Guest (PG) accommodations. It connects people looking for comfortable and affordable places to stay with PG owners who want to list and manage their properties efficiently.

Users can search for PG accommodations across different locations, compare available options, view detailed information about rooms and facilities, read reviews from other tenants, and book a room directly through the platform. The application also allows tenants to make monthly rent payments with ease.

For PG owners, the platform provides a centralized system to add and manage PG listings, update room availability, track bookings, monitor payments, and respond to tenant concerns. This helps streamline property management while improving communication with residents.

Overall, PG Finder aims to make the PG accommodation experience more transparent, convenient, and efficient for both tenants and property owners.

# Want To Contribute? Follow These Steps 🤝

## Prerequisites ✅

- Node.js v22.18.0 or above
- PocketBase

To run the project, you need to set up two things: PocketBase and the UI. Let's go through how to set up each of them.

## How To Set Up PocketBase? 🗄️

Install PocketBase from [here](https://pocketbase.io/docs/). Once it is installed, extract the zip file. You can start the application by running `./pocketbase serve` inside the extracted directory.

If you are using macOS and get a "command not found" or permission-related error when running `./pocketbase serve`, use the following command first:

```sh
# Remove the quarantine attribute from the PocketBase binary
xattr -d com.apple.quarantine pocketbase

# Start the PocketBase server
./pocketbase serve
```

The web server starts with the following default routes:

- `http://127.0.0.1:8090` - Serves static content if the `pb_public` directory exists
- `http://127.0.0.1:8090/_/` - Superuser dashboard
- `http://127.0.0.1:8090/api/` - REST-style API

The first time you run PocketBase, it generates an installer link that should open automatically in your browser so you can create your first superuser account. You can also create the first superuser manually with `./pocketbase superuser create EMAIL PASS`.

Once the superuser account is created, save the credentials because you will need them in the `.env` file while setting up the UI. After logging in, open the Import Collections page under Settings:

- `http://127.0.0.1:8090/_/#/settings/import-collections`

Paste the schema content available [in this file](https://github.com/maninageswar/pocketbase-collection-for-pg-form-project/blob/main/pg_properties_collection_schema_30_april_26.json), then click Review and Import.

> Note: The schema content may change as development progresses, so make sure to copy it form the latest file avaliable [in this repository.](https://github.com/maninageswar/pocketbase-collection-for-pg-form-project)

After the import is complete, go to the Collections tab in the dashboard. You should see the `users`, `bookingDetails`, and `pgProperties` collections.

## How To Set Up The UI? 💻

Fork this repository, then clone your fork.

Open the `.env` file in the `pg-finder` folder and replace `POCKETBASE_USER_NAME` and `POCKETBASE_PASSWORD` with your own credentials.

```sh
PUBLIC_GOOGLE_MAP_API_KEY="AIzaSyDpw1rEUHvNPh1dxNnErPM_y5kMZtCBQQM"
PUBLIC_POCKETBASE_SERVER_URL="http://127.0.0.1:8090"
PUBLIC_POCKETBASE_REST_API="http://127.0.0.1:8090/api"
POCKETBASE_USER_NAME="testpocketbase@gmail.com" # replace it with yours
POCKETBASE_PASSWORD="pocketbaseYouSavedMyDay" # replace it with yours
```
then

```sh
# Move into the project folder that contains package.json
cd pg-finder

# Install dependencies
npm i
```

## Run The Application 🚀

### Run The UI

```sh
# Move into the project folder that contains package.json
cd pg-finder

# Start the application
npm run dev
```
the application will run at port 5173 so you can open the application at http://localhost:5173

### Run PocketBase

If you followed the PocketBase setup steps above, you can skip this because it should already be running. If you stopped it, start it again with the following command:

```sh
# Move into the extracted PocketBase folder
cd your-pocketbase-extracted-folder

# Start PocketBase
./pocketbase serve
```

## Optional setup ⚙️

If you have followed the steps above, you can start implementing new features. However, if you want `OAuth` for user authorization and `Payment Gateway` [Cashfree Payment Gateway] for collecting payments (currently as of 01/05/2026 the application is not using payment gateway yet but the code for it is in place) to work, you need to set them up. 

### Cashfree payment gateway 💳

Creat your `cash free app id` and `cash free secret key` from Cashfree Payment Gateway website and paste them in `.env` file.

```sh
# replace the below vlues of keys with yours
PUBLIC_CASHFREE_APP_ID=""
PUBLIC_CASHFREE_SECRET_KEY=""
```
> Note: Do not commit your credentials or secrets to the repository.

### Google OAuth 🔐

Creat your `client id` and `client secret` form Google. Now you have to paste them in pocketbase users collection. For that just follow the below steps

1. Open the PocketBase dashboard.
2. Go to the `users` collection.
3. Click the collection settings icon.
4. Open the `Options` tab.
5. Click `OAuth2`.
6. Click `Add provider`.
7. Select `Google`.
8. Paste your `client id` and `client secret`.
9. Click `Set provider config`.
10. Click `Save changes`.

## Useful debugging tip 💡

When you run the application in dev mode click and hold option + x (for mac) or alt + x (for windows) then you will see a orange border around the elements, just click on the element to open the file in the editor that is responsible for that element in the browser.