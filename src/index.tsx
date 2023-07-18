import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';
import reportWebVitals from './reportWebVitals';

import './index.css';
import Localizer from './providers/Localizer.provider';
import App from './containers/App.container';
import YandexMetrikaComponent from './components/YandexMetrika.component';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Localizer>
    <App />
        <BrowserRouter>
          <App />
        </BrowserRouter>
    <App />
        <YandexMetrikaComponent />
      </Localizer>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
