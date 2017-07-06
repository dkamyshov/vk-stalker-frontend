import * as React from 'react';
import * as ReactDOM from 'react-dom';

/*class OnlineBar extends React.Component<any, any> {
    con
}*/

const colorByStatus = status => {
    if(status == 0) return '#C6C6C6';
    if(status == 1) return '#00CD19';
    if(status == 2) return '#FFBF00';
    if(status == 3) return '#FFF';

    return '#FFF';
}

const fmtTime = date => {
    const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();

    const h = date.getHours();
    const min = date.getMinutes();
    const s = date.getSeconds();

    return /*`${d}.${m}.${y} */`${h < 10 ? '0'+h : h}:${min < 10 ? '0' + min : min}`;
}

const fmtLabel = (s, e) => {
    const mins = Math.floor((e-s)%(60*60000)/60000);
    const hrs = Math.floor((e-s)/(60*60000));

    let msg;

    if(hrs == 0) {
        msg = `${mins} мин.`;
    } else {
        msg = `${hrs} ч.${mins != 0 ? `, ${mins} мин.` : ''}`;
    }

    return `${fmtTime(new Date(s))} - ${msg}`;
}

const OnlineBar = ({intervals}) => {
    return <div className="bar">
        {
            intervals.map(interval => (
                <div className="point"
                     title={fmtLabel(interval.start, interval.end)}
                     style={{width: (interval.width*100*0.999)+'%', backgroundColor: colorByStatus(interval.status)}}/>
            ))
        }
    </div>;
}

export default OnlineBar;