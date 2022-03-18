import brandService from '../_services/brand.service';

function checkBrand(subdomain) {
    return dispatch => {
        brandService.checkBrand(subdomain)
            .then((response) => {
                dispatch({
                    type: 'BRAND_SET',
                    response
                });
                return response;
            }, (error) => {
                console.log(error);
            });
    }

}

function clearBrand() {
    return dispatch => {
        dispatch({
            type: 'BRAND_CLEAR'
        })
    }
}

export const brandActions = {
    checkBrand,
    clearBrand,
};