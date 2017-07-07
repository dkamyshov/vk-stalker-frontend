import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as ReactRouterDOM from 'react-router-dom';

const { BrowserRouter, Route, Redirect, Switch, browserHistory, Link } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

import Loading from 'components/Loading';
import OnlineBar from 'components/OnlineBar';

const onlineScore = user => user.intervals.reduce(($, x) => $ + (x.status == 1 ? x.width*2 : x.status == 2 ? x.width : 0), 0);

class DashboardList extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            filter: "",
            users: []
        };

        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(value) {
        this.setState({
            filter: value.trim()
        });
    }

    componentDidMount() {
        this.setState({ loading: true }, () =>
            fetch('/api/users.get', {
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
                        users: json.users.sort((a, b) => onlineScore(b) - onlineScore(a))
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
        const {error, loading, filter, users} = this.state;

        return loading ? (
            <Loading />
        ) : (
            !error ? (
                <table className="table dashboard-table">
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Данные (3 часа)</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>
                                <div className="btn-group group-filter">
                                    <input value={filter} onChange={(e) => this.updateFilter(e.target.value)} />
                                    <span className="glyphicon glyphicon-remove-circle" onClick={(e) => this.updateFilter("")}></span>
                                </div>
                            </td>
                            <td>
                                <div className="text-center">
                                    <div className="status-chip offline">Не в сети</div>
                                    <div className="status-chip online">В сети с ПК</div>
                                    <div className="status-chip mobile">В сети с моб.</div>
                                    <div className="status-chip no-data">Нет данных</div>
                                </div>
                            </td>
                        </tr>

                        {
                            users.filter(user => user.name.toLowerCase().indexOf(filter.toLowerCase()) != -1).map(user => (
                                <tr>
                                    <td>
                                        <Link to={`/dashboard/${user.id}`}>{user.name}</Link>
                                    </td>
                                    <td>
                                        <OnlineBar intervals={user.intervals} />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            ) : (
                <div className="bs-callout bs-callout-danger bs-callout-centered">
                    <h4>Ошибка</h4>
                    <p>{error}</p>
                </div>
            )
        );
    }
}

export default DashboardList;