import * as React from 'react';

import Loading from 'components/Loading';
import ErrorMessage from 'components/ErrorMessage';

import OnlineBar from 'components/OnlineBar';

import * as ReactRouterDOM from 'react-router-dom';

const { BrowserRouter, Route, Redirect, Switch, browserHistory, Link } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

const fmtDate = date => {
    const y = date.getFullYear(),
          m = date.getMonth()+1,
          d = date.getDate();

    return `${d}.${m}.${y}`;
}

class SingleUser extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            info: null
        };
    }

    componentDidMount() {
        fetch('/api/user.get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify({
                userId: parseInt(this.props.match.params.user_id)
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                this.setState({
                    info: json.info
                });
            } else {
                throw new Error(json.error);
            }
        })
        .catch(e => {
            this.setState({
                error: e.message == 'unauthorized' ? 'Авторизируйтесь!' : (e.message == 'nonexistent' ? 'Пользователь не найден' : e.message)
            });
        })
        .then(() => {
            this.setState({ loading: false })
        });
    }

    render() {
        const {error, loading, info} = this.state;

        const dateOpts = {
            month: 'long',
            day: 'numeric'
        };

        return <div>
            {
                loading ? (
                    <Loading />
                ) : (
                    !error ? (
                        <div className="container">
                            <Link to='/dashboard'>← Назад</Link>

                            <h2><a href={`https://vk.com/id${info.id}`} target='_blank'>{info.name}</a></h2> 

                            <div>
                                <div className="status-chip offline">Не в сети</div>
                                <div className="status-chip online">В сети с ПК</div>
                                <div className="status-chip mobile">В сети с моб.</div>
                                <div className="status-chip no-data">Нет данных</div>
                            </div>

                            <table className='table dashboard-table'>
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>
                                            Данные (00:00 - 24:00)
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        info.intervals.map(interval => (
                                            <tr>
                                                <td>
                                                    {fmtDate(new Date(interval.offset))}
                                                </td>
                                                <td>
                                                    <OnlineBar intervals={interval.intervals} />
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
                )
            }
        </div>;
    }
}

export default SingleUser;