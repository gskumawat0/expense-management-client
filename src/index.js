import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './container/App';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>, document.getElementById('root'));
serviceWorker.unregister();
