import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as ReactRouterDOM from 'react-router-dom';

class AddUser extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            link: "",
            placeholder: "ссылка или id",
            hasFocus: false
        };

        this.updateLink = this.updateLink.bind(this);
        this.updateFocus = this.updateFocus.bind(this);
        this.proceed = this.proceed.bind(this);
    }

    updateLink(v) {
        this.setState({
            link: v.trim()
        });
    }

    proceed() {
        const {link} = this.state;

        let id;

        if(/\^d+$/.test(link)) {
            id = link;
        } else if(/\/?(id(\d+))|(\w+)$/.test(link)) {
            id = link.split('/').pop();
        }

        fetch('/api/user.add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(json => {
            if(json.status === true) {
                this.props.fetchUsers();

                this.setState({
                    link: ""
                });
            } else {
                this.setState({
                    link: "",
                    placeholder: "ошибка!",
                    hasFocus: false
                });
            }
        })
        .catch(e => {
            this.setState({
                link: "",
                placeholder: "неизвестная ошибка!",
                hasFocus: false
            });
        });
    }

    updateFocus(focus) {
        this.setState({
            hasFocus: focus
        });
    }

    render() {
        const {link, placeholder, hasFocus} = this.state;

        const correctLink = /^(https?:\/\/)?(m\.)?vk.com\/((id(\d+))|\w+)$/.test(link) || /^\d+$/.test(link);

        return <tr>
            <td>
                <input value={hasFocus || link.length > 0 ? link : placeholder}
                       onChange={(e) => this.updateLink(e.target.value)}
                       onFocus={() => this.updateFocus(true)}
                       onBlur={() => this.updateFocus(false)}/>
            </td>
            <td>
                <input type="button"
                       value="Добавить"
                       disabled={!correctLink}
                       onClick={this.proceed} />
            </td>
        </tr>;
    }
}

export default AddUser;