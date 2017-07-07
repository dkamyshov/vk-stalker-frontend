function combineClassNames() {
    var result = [];

    for(var i = 0, l = arguments.length; i < l; ++i) {
        var arg = arguments[i];
        if(typeof arg === 'string') {
            if(i + 1 < l && typeof arguments[i + 1] === 'boolean') {
                if(arguments[i + 1]) {
                    result.push(arg);
                }
            } else {
                result.push(arg);
            }
        }
    }

    return result.join(' ');
}

export default combineClassNames;