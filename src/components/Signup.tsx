import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { browserHistory, Link } from 'react-router-dom';

class Signup extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    componentDidMount() {
        const {code} = this.props.match;

        if(code && code.length == 16) {

        } else {
            
        }
    }

    render() {
        return <div>
            Home.<br/>

            <Link to="/dashboard">Dashboard</Link>
        </div>;
    }
}

export default Signup;