import * as React from 'react';
import * as ReactDOM from 'react-dom';

const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

const classByStatus = status => {
    switch(status) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            return `p${status}`;
        default: return 'no';
    }
}

const platformsDivs = platforms => {
    let pf = Object.create(null);

    platforms.map(platform => {
        if(platform != 0) {
            pf[platform] = (pf[platform] || 0) + 1;
        }
    });

    let records = Object.keys(pf).sort((k1, k2) => pf[k2] - pf[k1]).map(k => ({platform: parseInt(k), records: pf[k]}));

    return <div>
        {
            records.slice(0, 4).map(record => (
                <div className={`status-chip ${classByStatus(record.platform)}`}>{record.records}</div>
            ))
        }
    </div>;
}
class Statistics extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            topRecords: [],
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
        const {recordsCount, usersCount, accounts, log, topRecords} = this.state;

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

            <p>По записям:</p>

            <div className="text-center">
                <div className="status-chip p1">m.vk.com</div>
                <div className="status-chip p2">iPhone</div>
                <div className="status-chip p3">iPad</div>
                <div className="status-chip p4">Android</div>
                <div className="status-chip p5">WP</div>
                <div className="status-chip p6">Win10</div>
                <div className="status-chip p7">vk.com</div>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Записей</th>
                        <th>Платформы</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        topRecords.map(({_id, name, count, platforms}) => (
                            <tr>
                                <td><a href={`/dashboard/${_id}`}>{_id}</a></td>
                                <td>{name}</td>
                                <td>{count}</td>
                                <td>{platformsDivs(platforms)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <table className='table'>
                <thead>
                    <tr>
                        <th>Время</th>
                        <th>IP</th>
                        <th>Путь</th>
                        <th>Пользователь</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        log.map(({time, ip, path, user_id}) => (
                            <tr>
                                <td>{(new Date(time)).toLocaleString("ru", dateOptions)}</td>
                                <td>{ip}</td>
                                <td>{path}</td>
                                <td><a target='_blank' href={`https://vk.com/id${user_id}`}>/id{user_id}</a></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>;
    }
}

export default Statistics;