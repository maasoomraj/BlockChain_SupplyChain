import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import './index.css';
import sendTransaction from './components/sendTransaction';
import receiveTransaction from './components/receiveTransaction';


render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks' component={Blocks} />
            <Route path='/conduct-transaction' component={ConductTransaction} />
            <Route path='/send-transaction' component={sendTransaction} />
            <Route path='/receive-transaction' component={receiveTransaction} />

        </Switch>
    </Router>,
    document.getElementById('root')
);