const state = {
    token: null,
    user: null,
    settings: {
        theme: 'light'
    }
};

const mutations = {
    logout(state) {
        state.token = null;
        state.user = null;
        state.settings = {
            theme: 'light'
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
        state.settings.theme = theme;
        document.getElementsByTagName('body').item(0).setAttribute('data-theme', theme);
    }
}

export default {
    state,
    mutations
}