const state = {
    token: null,
    user: null
};

const mutations = {
    logout(state) {
        state.token = null;
        state.user = null;
    },

    login(state, data) {
        state.token = data.token;
        state.user = data.user;
    },

    updateUser(state, data) {
        state.user = data.user;
    }
}

export default {
    state,
    mutations
}