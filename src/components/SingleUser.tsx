import * as React from 'react';

import Loading from 'components/Loading';
import ErrorMessage from 'components/ErrorMessage';

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
                userId: this.props.userId
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
                error: e.message == 'unauthorized' ? 'Авторизируйтесь!' : e.message
            });
        })
        .then(() => {
            this.setState({ loading: false })
        });
    }

    render() {
        const {error, loading, info} = this.state;

        return <div>
            <div className='panel'>
                <a href='#' onClick={() => this.props.resetId()}>К полному списку</a>
            </div>

            {
                loading ? (
                    <Loading />
                ) : (
                    !error ? (
                        <div className='panel'>
                            Пользователь /id{this.props.userId}: <br/><br/>

                            Имя: {info.name}<br/>
                            Записей: {info.count}<br/>
                        </div>
                    ) : (
                        <ErrorMessage message={`Ошибка! (${error})`} />
                    )
                )
            }
        </div>;
    }
}

export default SingleUser;