import axios from "axios";
import router from '@/router';
import find from "lodash/find";
import findIndex from "lodash/findIndex";

const state = {
    selected: null,
    projects: [],
    files: [],
    currentFile: {id: null, name: null, type: null, sourceCode: null}
};

const mutations = {
    openFile(state, file) {
        if (find(state.files, {id: file.id, type: file.type}) === undefined) {
            state.files.push(file);
        }
        state.currentFile = file;
    },
    closeFile(state, file) {
        let index = findIndex(state.files, {id: file.id, type: file.type});
        state.files.splice(index, 1);
        if (file.id === state.currentFile.id) {
            if (state.files.length === 0) {
                state.currentFile = {id: null, name: null, type: null, sourceCode: null};
            } else {
                state.currentFile = state.files[index > 0 ? index-- : index++];
            }
        }
    },
    updateSourceCode(state, sourceCode) {
        state.currentFile.sourceCode = sourceCode;
    },
    selectProject(state, projectId) {
        state.files = [];
        state.currentFile = {id: null, name: null, type: null, sourceCode: null};
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
        state.files = [];
        state.currentFile = {id: null, name: null, type: null, sourceCode: null};
    },
    async loadProjects(state) {
        let response = await axios.get('/api/projects');
        state.projects = response.data.projects;
        if (state.projects.length > 0 && state.selected == null) {
            state.files = [];
            state.currentFile = {id: null, name: null, type: null, sourceCode: null};
            state.selected = state.projects[0];
        }
    }
}

export default {
    state,
    mutations
}