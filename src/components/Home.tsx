import * as React from 'react';

import VK from 'helpers/constants';
import buildURI from 'helpers/uri';

import Loading from 'components/Loading';

class Home extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: this.props.message || false,
            verifying: false
        };
    }

    componentDidMount() {
        if(!this.state.errorMessage && localStorage['token']) {
            this.setState({ verifying: true });

            fetch('/api/token.verify', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${localStorage['token']}`
                },
            })
            .then(response => response.json())
            .then(json => {
                if(json.status === true) {
                    this.props.history.push('/dashboard');
                }
            })
            .catch(e => {
                this.setState({ errorMessage: `Ошибка при проверке токена ${e.message}` });
            })
            .then(() => {
                this.setState({ verifying: false });
            });
        }
    }

    render() {
        const {errorMessage, verifying} = this.state;

        if(verifying) {
            return <Loading />;
        } else {
            return <div className="container">
                {errorMessage ? (
                    <div className="bs-callout bs-callout-danger">
                        <h4>Ошибка</h4>
                        <p>{errorMessage}</p>
                    </div>
                ): (
                    ''
                )}

                <h1>VKStalker</h1>
                <h2>Что это?</h2>
                <p>Сервис для мониторинга активности ваших друзей в социальной сети ВКонтакте.</p>
                <h2>Зачем?</h2>
                <p>Просто так.</p>
                <h2>Это платно?</h2>
                <p>Вообще да, но прямо сейчас каждый новый пользователь получает 10 млн. кредитов совершенно бесплатно!</p>
                <h2>Что еще за кредиты? И почему так много?</h2>
                <p>Это внутренняя валюта. Такова наша ценовая политика.</p>
                <h2>Расскажите про вашу ценовую политику</h2>
                <p>Все очень просто: одна проверка статуса одного пользователя стоит ровно 1 кредит. Учитывая, что сервис делает запросы каждую минуту, нетрудно посчитать, что имея, скажем, 200 друзей, 10 млн. кредитов вам хватит на (10 000 000 / 200 / 60 / 24) ~= <b>35 дней</b> ~= <b>месяц</b> работы.</p>
                <p>В будущем цена составит 100 рублей за 10 млн. кредитов.</p>
                <h2>Почему бы просто не продавать доступ на месяц за фиксированную цену?</h2>
                <p>Я считаю, что так проще.</p>
                <h2>Ну ладно... Что нужно для старта?</h2>
                <p>Нажмите эту кнопку:</p>

                <div className="text-center">
                    <button type="button" className="btn btn-primary btn-lg" onClick={
                        (e) => {window.location.href=buildURI(
                                VK.auth_uri,
                                { client_id: VK.app_id,
                                  redirect_uri: VK.redirect_uri,
                                  scope: 'friends',
                                  v: VK.api_version,
                                  display: 'page' }
                        )}
                    }>
                        Войти с помощью ВК
                    </button>
                </div>

                <div className="text-center mt-1">
                    <p><a href='https://vk.com/alhayat'>Danil Kamyshov</a>, 2017</p>
                    <a href='https://github.com'>GitHub</a>
                </div>
            </div>;
        }
    }
}

export default Home;