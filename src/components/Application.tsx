import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter, Route, Redirect, Switch, browserHistory } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

import Statistics from 'components/Statistics';
import Loading from 'components/Loading';
import Home from 'components/Home';
import Verify from 'components/Verify';
import Dashboard from 'components/Dashboard';

const Application = () => (
    <Router history={browserHistory}>
        <Switch>
            <Route exact path='/'               component={Home} />
            <Route path='/dashboard/:userId?'   component={Dashboard} />
            <Route path='/verify'               component={Verify} />
            <Route path='/statistics'           component={Statistics} />

            <Route path='/logout' render={(e) => {
                localStorage.clear();
                return <Redirect to='/' />;
            }} />
        </Switch>
    </Router>
);

export default Application;