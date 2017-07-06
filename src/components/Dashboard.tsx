import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { browserHistory, Link } from 'react-router-dom';

import Loading from 'components/Loading';
import OnlineBar from 'components/OnlineBar';
import SingleUser from 'components/SingleUser';

import Message from 'components/Message';
import ErrorMessage from 'components/ErrorMessage';

const onlineCount = user => {
    return user.intervals.reduce(($, x) => $ + (x.status == 1 ? x.width*2 : x.status == 2 ? x.width : 0), 0);
}

class Dashboard extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            filter: "",
            balance: 0,
            users: null,
            paused: false,
            error: false,
            loading: true,
            userId: null
        }

        this.updateFilter = this.updateFilter.bind(this);
        this.pauseSwitch = this.pauseSwitch.bind(this);

        this.updateDashboard = this.updateDashboard.bind(this);
    }

    updateFilter(nv) {
        this.setState({
            filter: nv.trim()
        });
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
                pause: !this.state.paused
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                if(!this.state.users) this.updateDashboard();
                this.setState({ paused: json.paused });
            } else {
                throw new Error(json.error);
            }
        })
        .catch(e => {
            this.setState({ error: e.message });
        });
    }

    componentWillReceiveProps(props) {
        this.setState({ userId: props.match.params.userId });
    }

    componentDidMount() {
        this.updateDashboard();
    }

    updateDashboard() {
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
                        paused: json.paused,
                        users: json.users
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
                <div className='toolbar grid'>
                    <div className='left'>
                        Баланс: {balance}. { !error ? <a href='/pay'>Пополнить</a> : '' }
                    </div>

                    <div className='right'>
                        <a href='/logout'>Выйти</a>
                    </div>

                    {
                        !error && balance > 0 ? (
                            <div className='right'>
                                <a href='#' onClick={this.pauseSwitch}>{paused ? 'Возобновить сбор данных' : 'Остановить сбор данных'}</a>
                            </div>
                        ) : (
                            ''
                        )
                    }
                </div>

                {
                    error ? (
                        <ErrorMessage message={`Ошибка! (${error})`} />
                    ) : (
                        userId ? (
                            <SingleUser resetId={() => {
                                this.props.history.push('/dashboard');
                                this.setState({userId: undefined});
                            }} userId={userId} />
                        ) : (
                            balance > 0 ? (
                                !paused ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Имя</th>
                                                <th>Счет</th>
                                                <th>Данные (3 часа.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input value={filter} onChange={(e) => this.updateFilter(e.target.value)}/>
                                                </td>
                                                <td className='pull-center'>
                                                    <input type='button' value=' X ' onClick={(e) => this.updateFilter('')} />
                                                </td>
                                                <td className='pull-center'>
                                                    <div className='hint online'>
                                                        Онлайн с ПК
                                                    </div>

                                                    <div className='hint mobile'>
                                                        Онлайн с телефона
                                                    </div>

                                                    <div className='hint offline'>
                                                        Оффлайн
                                                    </div>

                                                    <div className='hint no-data'>
                                                        Нет данных
                                                    </div>
                                                </td>
                                            </tr>
                                            {
                                                users.filter(user => user.name.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => onlineCount(a) >= onlineCount(b) ? -1 : 1).map(user => (
                                                    <tr>
                                                        <td><Link to={`/dashboard/${user.id}`}>{user.name}</Link></td>
                                                        <td>{Math.floor(onlineCount(user)*100)}</td>
                                                        <td>
                                                            <OnlineBar intervals={user.intervals} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                ) : (
                                    <Message message="Сбор данных оставновлен." />
                                )
                            ) : (
                                <ErrorMessage message="Пополните баланс!"/>
                            )
                        )
                    )
                }
            </div>
        );
    }
}

export default Dashboard;