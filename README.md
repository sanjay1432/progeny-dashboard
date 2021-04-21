# How to run the project on your local

Open file `.env.local` and update the content:

```sh
PORT=3000
NODE_PATH=./src
REACT_APP_DEBUG=true
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_URL_MOCK=http://localhost:8000/api
REACT_APP_LOSTCOOK_API_URL=http://localhost:8000/api
REACT_APP_SSO_WEB_LOGIN=http://localhost:8000/opex/login
REACT_APP_BASE_NAME=/dmp/#
REACT_APP_VERSION=$npm_package_version
```

### Step1: Start frontend

1. Run `npm install` to install the packages, then to start the frontend, please run `npm start`

### Step2: Start mock server

1. Go to mock server folder `{YOUR_ROOT_FOLER}/server`
2. In folder server, run `npm install` to install the package, then to start the mock server, please run `npm start`

# Create the Redux Reducer correctly
1. Add initialize state of reducer in ./redux/StateLoader.js:
   ```ssh
    const InitializeState = {
    ...
    yourReducerKey: {
        key: "value",
        key: "value"
        ...
    },
    ...
   ```
2. Define your reducer:
   ```sh
    import StateLoader from "../StateLoader"
    const stateLoader = new StateLoader()
    const YourReducer = (
    state = stateLoader.loadStateByReducer("yourReducerKey"),
    action
   )
   ```
   
