import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Statistics extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            recordsCount: '---',
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
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState(json);
        })
    }

    render() {
        const {recordsCount, usersCount, accounts, log} = this.state;

        return <div className='wrap'>
            <div className='section'>
                Отслеживается пользователей: {usersCount}
            </div>

            <div className='section'>
                Записей о состоянии: {(recordsCount/1000000).toFixed(2)} млн.
            </div>

            <div className='section'>
                Аккаунты: 
                <table>
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
                                    <td>{account.users.length}</td>
                                    <td>{account.settings.balance}</td>
                                    <td>{account.settings.pause ? 'нет' : 'да'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className='section'>
                Журнал: 
                <table>
                    <thead>
                        <tr>
                            <th>Время</th>
                            <th>Пояснение</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            log.map(entry => (
                                <tr>
                                    <td>{(new Date(entry.time)).toString()}</td>
                                    <td>{entry.payload}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

export default Statistics;