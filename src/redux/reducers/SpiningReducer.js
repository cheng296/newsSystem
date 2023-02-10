export const SpiningReducer = (preState = {
    spining: false
}, action) => {
    let {type,payload} = action

    switch (type) {
        case 'change_loading':
            let newState = {...preState}
            newState.spining = payload
            return newState;
    
        default:
            return preState;;
    }
}