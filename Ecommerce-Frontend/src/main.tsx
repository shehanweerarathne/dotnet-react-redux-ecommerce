import React from 'react'
import App from './App'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import {StoreProvider} from "./context/StoreContext";
import {Provider} from "react-redux";
import {store} from "./store/configureStore";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>

    </React.StrictMode>
)

