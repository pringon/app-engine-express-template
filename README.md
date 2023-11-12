# App Engine EJS Template

This is a Node.js fullstack template based off an express REST API and static front-end files templated with ejs.

The docs are still WIP but the aim is for this to be a self-contained set of resources to allow people to deploy
full-stack Google App Engine projects in a self-service manner.

## Scripts

- Run locally: `npm start`
- Deploy to app engine: `npm run deploy`

## Configuration

### Storage

Copy `.env` and `app.yaml` exampled to their respective files and set `FIREBASE_KEY`.

*Make sure to modify the firebase cofig in `index.js` to match your store's config.*

### Deployment

Install `gcloud` cli tool and initialize it in order to be able to deploy to Google App Engine.
