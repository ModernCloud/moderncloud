import axios from "axios";
import router from '@/router';

const state = {
    selected: null,
    projects: []
};

const mutations = {
    selectProject(state, projectId) {
        for (let i = 0; i < state.projects.length; i++) {
            if (projectId === state.projects[i].id) {
                state.selected = state.projects[i];
                if (router.currentRoute.path !== '/') {
                    router.push('/');
                }
                break;
            }
        }
    },
    clearSelectedProject(state) {
        state.selected = null;
    },
    async loadProjects(state) {
        let response = await axios.get('/api/projects');
        state.projects = response.data.projects;
        if (state.projects.length > 0 && state.selected == null) {
            state.selected = state.projects[0];
        }
    }
}

export default {
    state,
    mutations
}