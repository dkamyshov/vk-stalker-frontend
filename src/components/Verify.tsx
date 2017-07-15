import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';

const { BrowserRouter, Route, Switch, browserHistory } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

import Home from 'components/Home';
import Loading from 'components/Loading';

import combineClassNames from 'helpers/combineClassNames';

class Verify extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: null,
            users: [],
            filter: "",
            placeholder: "поиск...",
            focused: false,
            user_id: -1
        }

        this.toggleSelection = this.toggleSelection.bind(this);
        this.setAll = this.setAll.bind(this);
        this.proceed = this.proceed.bind(this);
        this.selectedCount = this.selectedCount.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.filterFocused = this.filterFocused.bind(this);
    }

    filterFocused(flag) {
        this.setState({
            focused: flag
        });
    }

    updateFilter(v) {
        this.setState({
            filter: v.trim()
        });
    }

    setAll(mode) {
        this.setState({
            users: this.state.users.map(user => ({
                ...user,
                selected: mode
            }))
        });
    }

    toggleSelection(uid) {
        const {users} = this.state;

        const user = users.find(({id}) => id === uid);
        const rest = users.filter(({id}) => id !== uid);

        console.log(uid, user.selected, !user.selected);

        this.setState({
            users: [
                ...rest,
                {
                    ...user,
                    selected: !user.selected
                }
            ]
        });
    }

    proceed() {
        if(this.selectedCount() < 1) {
            alert("Выберите хотя бы одного пользователя!");
            return;
        }

        const {users, user_id} = this.state;
        const {history} = this.props;

        this.setState({ loading: true }, () => fetch('/api/token.create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                owner_id: user_id,
                users: users.filter(user => user.selected === true).map(user => ({
                   id: user.id,
                   name: user.name
                })),
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                localStorage['token'] = json.token;
                history.push('/dashboard');
            } else {
                throw new Error(json.error);
            }
        }).catch(e => {
            this.setState({
                error: e.message
            });
        }));
    }

    selectedCount() {
        return this.state.users.reduce(($, user) => $ + user.selected ? 1 : 0, 0);
    }

    async componentDidMount() {
        const {history} = this.props;

        try {
            const parameters = window.location.search.match(/\w*=[\w\+]*/g).reduce(
                ($, pair) => {
                    let p = pair.split('=');
                    return {...$, [p[0]]: p[1]};
                }, Object.create(null));

            if('code' in parameters) {
                fetch('/api/prefetch', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: parameters.code })
                })
                .then(response => response.json())
                .then(json => {
                    if(json.status === true) {
                        this.setState({
                            error: false,
                            loading: false,
                            user_id: json.user_id,
                            users: json.users.map((user, i) => ({
                                ...user,
                                order: i
                            }))
                        });
                    } else {
                        throw new Error(json.error);
                    }
                })
                .catch(e => {
                    this.setState({ error: e.message });
                });
            } else {
                throw new Error('invalid code');
            }
        } catch(e) {
            this.setState({
                error: `Авторизация не удалась. (${e.message})`
            });
        }
    }

    render() {
        const {error, loading, users, filter, placeholder, focused} = this.state;

        return error ? (
            <Home message={error} />
        ) : (
            loading ? (
                <Loading />
            ) : (
                <div className="container">
                    <h1>Выберите пользователей для отслеживания:</h1>

                    <div className="date-nav">
                        <a className="no-href-a" onClick={this.setAll.bind(null, true)}>Поставить все отметки</a>
                        <a className="no-href-a" onClick={this.setAll.bind(null, false)}>Снять все отметки</a>
                        <input value={focused ? filter : (filter || placeholder)} onFocus={() => this.filterFocused(true)} onBlur={() => this.filterFocused(false)} onChange={(e) => this.updateFilter(e.target.value)} />
                    </div>

                    <div className="users-select">
                        {
                            users.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => a.order - b.order).map(({id, name, selected}) => (
                                <div onClick={this.toggleSelection.bind(null, id)} className={combineClassNames("user-select", "active", selected)}>
                                    <h4>{name}</h4>
                                </div>
                            ))
                        }
                    </div>

                    <div className="text-center proceed">
                        <button disabled={this.selectedCount() < 1} type="button" className="btn btn-primary btn-lg" onClick={this.proceed}>
                            Продолжить
                        </button>
                    </div>
                </div>
            )
        );
    }
}

export default Verify;