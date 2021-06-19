const state = {
    token: null,
    user: null,
    settings: {
        theme: 'light',
        accordion: {}
    }
};

const mutations = {
    logout(state) {
        state.token = null;
        state.user = null;
        state.settings = {
            theme: 'light',
            accordion: {}
        };
    },

    login(state, data) {
        state.token = data.token;
        state.user = data.user;
    },

    updateUser(state, data) {
        state.user = data.user;
    },

    changeTheme(state, theme) {
        if (theme) {
            state.settings.theme = theme;
        }
        document.getElementsByTagName('body').item(0).setAttribute('data-theme', state.settings.theme);
    },

    accordionStatus(state, payload) {
        state.settings.accordion[payload.name] = payload.status;
    }
}

export default {
    state,
    mutations
}