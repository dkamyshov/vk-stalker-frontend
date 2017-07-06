import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';

const { BrowserRouter, Route, Switch, browserHistory } = ReactRouterDOM,
      Router = ReactRouterDOM.BrowserRouter;

import Home from 'components/Home';
import Loading from 'components/Loading';

class Verify extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        }
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
                fetch('/api/token.create', {
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
                        localStorage['token'] = json.token;
                        history.push('/dashboard');
                    } else {
                        throw new Error(json.error);
                    }
                })
                .catch(e => {
                    this.setState({ error: e.message });
                })
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
        const {error} = this.state;

        return error ? (
            <Home message={error} />
        ) : (
            <Loading />
        );
    }
}

export default Verify;