export const getErrorMessage = (e) => {
    console.error(e);
    if (e.response && e.response.data && e.response.data.error) {
        if (e.response.data.error.message === 'ValidationError') {
            return e.response.data.error.details[0].message;
        } else {
            return e.response.data.error.message;
        }
    } else {
        return 'An error occurred!';
    }
}