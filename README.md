# Documentation for Extending Templates

## Update instructions
1. Update `src/data/source/country_files.csv`;
2. Inlcude agreement and actor csv for the updated country in `src/data/source/` folder;
3. Run the notebook `prep4dashboard.ipynb`;
4. Update country name and file name in `src/views/Homeview.vue` and `src/components/network.vue`

## vis-badge web component (local dev)
The `<vis-badge>` element is provided by the `badge-lib` project as an ES module bundle (`vis-badge.js`).
On GitHub Pages deployments, the CI workflow sets `VUE_APP_VIS_BADGE_WC_URL` so the app loads the hosted bundle from `badge-lib` GitHub Pages.
For local development, this repo sets a default in `.env.development` so `npm run serve` also loads the hosted bundle.
If you want to override the URL on your machine, create `.env.local` and set `VUE_APP_VIS_BADGE_WC_URL=...` (this file is gitignored).
If the app cannot import the bundle, it will log the attempted URLs and you can either fix the environment variable or provide a local `public/vis-badge.js` fallback.


## Explanation
This dashboard uses:
- country data file in `json` format, named as `{abbr}_agt.json`.
- `{abbr}_actor.json` used in `src/components/network.vue`; 
- `actor_definitions.json` used in `src/components/legends.vue`.


Original data files are stored in: `src/data/source/`
In this folder, we store original data for countries' agreement links and actor information, recorded in `country_files.csv`.

There's a jupyter notebook `prep4dashboard.ipynb`. Run the scripts it will output all country files to the upper folder.

Please note: The output file contains only information used to construct networks (NetPanoraoma sepcs), support peace process selection, provide additional information in the dashboard.

### Read in countryData
Country data is imported in `src/views/Homeview.vue` as `countryData`. It is parsed and passed to child component `src/component/peaceprocess.vue`, where we make the selection for peace process and render all the visualizations.
Actor data is imported in `src/components/network.vue`. 



## Pending Fixes
- Timeline beeswarm graph lacks full responsiveness
- ...