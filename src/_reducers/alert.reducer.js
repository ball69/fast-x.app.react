export function alert(state = {}, action) {
    switch (action.type) {
        case "ALERT_SUCCESS":
            return {
                type: 'alert-success',
                message: action.message
            }
        case "ALERT_ERROR":
            return {
                type: 'alert-success',
                message: action.message
            }
        case "ALERT_CLEAR":
            return {

            }
        default:
            return state;
    }
}