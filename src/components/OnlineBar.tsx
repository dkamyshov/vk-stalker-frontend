import * as React from 'react';
import * as ReactDOM from 'react-dom';

import combineClassNames from 'helpers/combineClassNames';

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

const fmtTime = date => {
    const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();

    const h = date.getHours();
    const min = date.getMinutes();
    const s = date.getSeconds();

    return `${h < 10 ? '0'+h : h}:${min < 10 ? '0' + min : min}`;
}

const fmtLabel = (s, e) => {
    const mins = Math.floor(((new Date(e)).getTime()-(new Date(s)).getTime())%(60*60000)/60000);
    const hrs = Math.floor(((new Date(e)).getTime()-(new Date(s)).getTime())/(60*60000));

    let msg;

    if(hrs == 0) {
        msg = `${mins} мин.`;
    } else {
        msg = `${hrs} ч.${mins != 0 ? `, ${mins} мин.` : ''}`;
    }

    return `${fmtTime(new Date(s))} - ${msg}`;
}

const OnlineBar = ({intervals}) => {
    return <div className="online-bar">
        {
            intervals.map(interval => (
                <div className={combineClassNames("interval", classByStatus(interval.status))}
                     title={fmtLabel(interval.start, interval.end)}
                     style={{width: (interval.width*100*0.999)+'%'}}/>
            ))
        }
    </div>;
}

export default OnlineBar;