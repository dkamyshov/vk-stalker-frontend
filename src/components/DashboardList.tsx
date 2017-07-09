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
        this.fetchUsers = this.fetchUsers.bind(this);
    }

    updateFilter(value) {
        this.setState({
            filter: value.trim()
        });
    }

    fetchUsers(reload) {
        this.setState({ loading: reload }, () =>
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

    componentDidMount() {
        setInterval(() => this.fetchUsers(false), 60000);

        this.fetchUsers(true);
    }

    render() {
        const {error, loading, filter, users} = this.state;

        return loading ? (
            <Loading />
        ) : (
            !error ? (
                <div className="container">
                    <table className="table dashboard-table">
                        <thead>
                            <tr>
                                <th>Пользователи</th>
                                <th className='hidden-xs'>Данные (3 часа)</th>
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
                                <td className='hidden-xs'>
                                    <div className="text-center">
                                        <div className="status-chip no">Нет данных</div>
                                        <div className="status-chip p0">Офф.</div>
                                        <div className="status-chip p1">m.vk.com</div>
                                        <div className="status-chip p2">iPhone</div>
                                        <div className="status-chip p3">iPad</div>
                                        <div className="status-chip p4">Android</div>
                                        <div className="status-chip p5">WP</div>
                                        <div className="status-chip p6">Win10</div>
                                        <div className="status-chip p7">vk.com</div>
                                    </div>
                                </td>
                            </tr>

                            {
                                users.filter(user => user.name.toLowerCase().indexOf(filter.toLowerCase()) != -1).map(user => (
                                    <tr>
                                        <td>
                                            <Link to={`/dashboard/${user.id}`}>{user.name}</Link>
                                        </td>
                                        <td className='hidden-xs'>
                                            <OnlineBar intervals={user.intervals} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
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