# NetKAN-status
Display Status information generated from NetKAN-bot

## Development

To run locally:
```sh
npm install
npm run build
mkdir dist/status && wget http://status.ksp-ckan.space/status/netkan.json -O dist/status/netkan.json
python3 -m http.server --directory dist
```

The local development server is available at <http://localhost:8000>.

You can also install the [http-server](https://www.npmjs.com/package/http-server) npm package, or any other simple web server that just serves local files.

`netkan.json` is downloaded locally to avoid CORS issues.
