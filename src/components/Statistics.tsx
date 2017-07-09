import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Statistics extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            recordsCount: 0,
            usersCount: '---',
            accounts: [],
            log: []
        };
    }

    componentDidMount() {
        fetch('/api/stats.get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${localStorage['token']}`
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState(json);
        })
    }

    render() {
        const {recordsCount, usersCount, accounts, log} = this.state;

        return <div className='container'>
            <p>
                <a href='/dashboard'>Назад</a>
            </p>

            <p>
                Отслеживается пользователей: {usersCount.toLocaleString('ru')}
            </p>

            <p>
                Записей о состоянии: {recordsCount.toLocaleString('ru')}.
            </p>

            <p>
                Аккаунты: 
            </p>

            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Отслеживается пользователей</th>
                        <th>Баланс</th>
                        <th>В работе</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        accounts.sort((a, b) => b.users.length - a.users.length).map(account => (
                            <tr>
                                <td>{account.id}</td>
                                <td>{account.users.length.toLocaleString('ru')}</td>
                                <td>{account.settings.balance.toLocaleString('ru')}</td>
                                <td>{account.settings.pause ? 'нет' : 'да'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>;
    }
}

export default Statistics;