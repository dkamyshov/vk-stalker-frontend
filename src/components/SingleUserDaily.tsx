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

const fmtHr = date => {
    console.log(date);

    const h = date.getHours();

    return `${h}:00`;
}

class SingleUserDaily extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            rows: []
        };

        this.viewTable = this.viewTable.bind(this);
    }

    componentDidMount() {
        this.viewTable();
    }

    componentWillReceiveProps(props) {
        this.viewTable();
    }

    viewTable() {
        this.setState({ loading: true }, () => fetch('/api/user.hourly.get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify({
                userId: parseInt(this.props.match.params.userId),
                offset: parseInt(this.props.match.params.offset)
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                this.setState({
                    rows: json.info.intervals
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
        }));
    }

    render() {
        const {loading, error, rows} = this.state;
        const {offset, userId} = this.props.match.params;
        const day = 24*3600*1000;

        return <div>
            <div className='date-nav' id='date-select'>
                <Link to={`/dashboard/${userId}`}>К списку дней</Link>
                <Link to={`/dashboard/${userId}/${parseInt(offset)-day}/#date-select`}>← {fmtDate(new Date(parseInt(offset)-day))}</Link>
                <b>{fmtDate(new Date(parseInt(offset)))}</b>
                <Link to={`/dashboard/${userId}/${parseInt(offset)+day}/#date-select`}>{fmtDate(new Date(parseInt(offset)+day))} →</Link>
            </div>
            
            {
                loading ? (
                    <Loading />
                ) : (
                    !error ? (
                        <table className='table dashboard-table'>
                            <thead>
                                <tr>
                                    <th>{fmtDate(new Date(parseInt(offset)))}</th>
                                    <th>
                                        Данные (1 час)
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    rows.map(row => (
                                        <tr>
                                            <td>
                                                {fmtHr(new Date(row.offset))}
                                            </td>
                                            <td>
                                                <OnlineBar intervals={row.intervals} />
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
                )
            }
        </div>;
    }
}

export default SingleUserDaily;