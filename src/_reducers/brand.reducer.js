const initialState = {
}

export function brand(state = initialState, action) {
    switch (action.type) {

        case "BRAND_SET":
            return {
                brand: action.response.data,
            }

        case "BRAND_CLEAR":
            return {

            }
        case "BRAND_FAILURE":
            return {
                brand: {

                },
            }
        default:
            return state;
    }
}