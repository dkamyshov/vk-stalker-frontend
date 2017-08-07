import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as ReactRouterDOM from 'react-router-dom';

const { BrowserRouter, Route, Redirect, Switch, browserHistory, Link } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

import Loading from 'components/Loading';
import OnlineBar from 'components/OnlineBar';
import SingleUser from 'components/SingleUser';
import DashboardList from 'components/DashboardList';

import Message from 'components/Message';
import ErrorMessage from 'components/ErrorMessage';

class Dashboard extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            balance: 0,
            paused: false
        }

        this.pauseSwitch = this.pauseSwitch.bind(this);
    }

    pauseSwitch() {
        fetch('/api/pause', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify({
                paused: !this.state.paused
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                this.setState({ paused: json.paused });
            } else {
                throw new Error(json.error);
            }
        })
        .catch(e => {
            this.setState({ error: e.message });
        });
    }

    componentDidMount() {
        this.setState({ loading: true }, () =>
            fetch('/api/dashboard.get', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${localStorage['token']}`
                },
            })
            .then(response => response.json())
            .then(json => {
                if(json.status === true) {
                    this.setState({
                        balance: json.balance,
                        paused: json.paused
                    });
                } else {
                    throw new Error(json.error);
                }
            })
            .catch(e => {
                if(e.message == 'unauthorized') this.props.history.push('/');

                this.setState({ error: e.message });
            })
            .then(() => {
                this.setState({ loading: false });
            }));
    }

    render() {
        const {users, balance, filter, error, loading, paused} = this.state;

        const userId = this.props.match.params.userId || this.state.userId;

        return loading ? (
            <Loading />
        ) : (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Скрыть/раскрыть</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand" to="/dashboard">VKStalker</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li><p className="navbar-text">Баланс: {balance.toLocaleString('ru')}</p></li>
                                <li><Link to="/pay">Пополнить</Link></li>
                                <li>
                                    <Route exact path='/dashboard/**/'>
                                        <Link className='hidden-xs' to='/dashboard'>К полному списку</Link>
                                    </Route>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Действия <span className="caret"></span></a>
                                <ul className="dropdown-menu">
                                    <li><Link to="/statistics">Статистика</Link></li>
                                    <li>
                                        <a href="#" onClick={() => {this.pauseSwitch(); return false;}}>
                                            {paused ? 'Возобновить сбор данных' : 'Остановить сбор данных'}
                                        </a>
                                    </li>
                                </ul>
                                </li>
                                <li><Link to="/logout">Выйти</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="dashboard-content">
                    {
                        error ? (
                            <div className="bs-callout bs-callout-danger bs-callout-centered">
                                <h4>Ошибка</h4>
                                <p>{error}</p>
                            </div>
                        ) : (
                            balance > 0 ? (
                                !paused ? (
                                    <Switch>
                                        <Route exact path="/dashboard"      component={DashboardList} />
                                        <Route path="/dashboard/:user_id?"  component={SingleUser} />
                                    </Switch>
                                ) : (
                                    <div className="bs-callout bs-callout-info bs-callout-centered">
                                        <h4>Сбор данных остановлен</h4>
                                        <p>Возобновите сбор данных</p>
                                    </div>
                                )
                            ) : (
                                <div className="bs-callout bs-callout-info bs-callout-centered">
                                    <h4>Недостаточно средств</h4>
                                    <p><Link to='/pay'>Пополните</Link> баланс</p>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Dashboard;