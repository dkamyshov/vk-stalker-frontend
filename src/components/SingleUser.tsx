import * as React from 'react';

import Loading from 'components/Loading';
import ErrorMessage from 'components/ErrorMessage';
import SingleUserDaily from 'components/SingleuserDaily';
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
                            <Link className='hidden-sm hidden-lg hidden-xl' to='/dashboard'>К полному списку</Link>

                            <h2><a href={`https://vk.com/id${info.id}`} target='_blank'>{info.name}</a></h2> 

                            <div>
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

                            <Switch>
                                <Route exact path='/dashboard/:userId'>
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
                                                            <Link to={`/dashboard/${info.id}/${(new Date(interval.offset)).getTime()}`}>{fmtDate(new Date(interval.offset))}</Link>
                                                        </td>
                                                        <td>
                                                            <OnlineBar intervals={interval.intervals} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </Route>

                                <Route path='/dashboard/:userId/:offset' render={e => <SingleUserDaily history={e.history} match={e.match} />}/>
                            </Switch>
                        </div>
                    ) : (
                        <div className="bs-callout bs-callout-danger bs-callout-centered">
                            <h4>Ошибка</h4>
                            <p>{error}. <Link to='/dashboard'>К списку.</Link></p>
                        </div>
                    )
                )
            }
        </div>;
    }
}

export default SingleUser;