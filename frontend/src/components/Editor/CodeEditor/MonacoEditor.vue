<template>
  <div ref="editor"></div>
</template>

<script>
import {CodeEditorEvents} from '@/lib/code_editor_events';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import ReconnectingWebSocket from "reconnecting-websocket";
import { listen } from 'vscode-ws-jsonrpc';
import {MonacoLanguageClient, ErrorAction, CloseAction, createConnection, MonacoServices} from "monaco-languageclient";

export default {
  data() {
    return {
      monacoEditor: null,
      nodejsWebSocket: null,
      pythonWebSocket: null,
    }
  },
  watch: {
    '$store.state.project.currentFile'() {
      this.openFile();
    }
  },
  mounted() {
    this.setUpMonacoEditor();
    this.setUpMonacoServices();
  },
  destroyed() {
    if (this.nodejsWebSocket) {
      this.nodejsWebSocket.close();
    }
    if (this.pythonWebSocket) {
      this.pythonWebSocket.close();
    }
  },
  methods: {
    setUpMonacoEditor() {
      this.monacoEditor = monaco.editor.create(this.$refs.editor, {
        model: null,
        language: 'javascript',
        theme: this.$store.state.account.settings.theme === 'dark' ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        folding: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      });
      this.openFile();
    },
    openFile() {
      let currentFile = this.$store.state.project.currentFile;
      let language = 'javascript';
      let fileExtension = 'js';
      if (currentFile.runtime.indexOf('python') > -1) {
        language = 'python';
        fileExtension = 'py';
      }
      let fileName = `${currentFile.function_name}.${fileExtension}`;
      let filePath = monaco.Uri.parse(`${process.env.VUE_APP_ROOT_DIR}/${fileName}`);
      let currentModel = null;
      if ((currentModel = monaco.editor.getModel(filePath)) == null) {
        currentModel = monaco.editor.createModel(currentFile.sourceCode, language, filePath);
        let keyupTimer = null;
        currentModel.onDidChangeContent(() => {
          let value = currentModel.getValue();
          currentFile.sourceCode = value;
          this.$store.commit('updateSourceCode', value);
          if (keyupTimer) {
            clearTimeout(keyupTimer);
            keyupTimer = null;
          }
          keyupTimer = setTimeout(() => {
            CodeEditorEvents.$emit('sourceCodeUpdated', {
              ...currentFile
            });
          }, 700);
        });
      }
      this.monacoEditor.setModel(currentModel);
    },
    setUpMonacoServices() {
      try {
        MonacoServices.get();
      } catch (e) {
        MonacoServices.install(monaco, {rootUri: process.env.VUE_APP_ROOT_DIR});
      }
      this.nodejsWebSocket = this.createNodejsWebsocket();
      this.pythonWebSocket = this.createPythonWebsocket();
      listen({
        webSocket: this.nodejsWebSocket,
        onConnection: connection => {
          const languageClient = this.createNodejsLanguageClient(connection);
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());
        }
      });
      listen({
        webSocket: this.pythonWebSocket,
        onConnection: connection => {
          const languageClient = this.createPythonLanguageClient(connection);
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());
        }
      });
    },
    createNodejsWebsocket() {
      let url = process.env.VUE_APP_LSP_PROXY_SERVER
          + '/js?token='
          + this.$store.state.account.token
          + '&project_id='
          + this.$store.state.project.selected.id;
      const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
      };
      return new ReconnectingWebSocket(url, [], socketOptions);
    },
    createNodejsLanguageClient(connection) {
      return new MonacoLanguageClient({
        name: "ModernCloud Javascript Language Client",
        clientOptions: {
          documentSelector: ['javascript'],
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart
          }
        },
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
          }
        }
      });
    },
    createPythonWebsocket() {
      let url = process.env.VUE_APP_LSP_PROXY_SERVER
          + '/python?token='
          + this.$store.state.account.token
          + '&project_id='
          + this.$store.state.project.selected.id;
      const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
      };
      return new ReconnectingWebSocket(url, [], socketOptions);
    },
    createPythonLanguageClient(connection) {
      return new MonacoLanguageClient({
        name: "ModernCloud Python Language Client",
        clientOptions: {
          documentSelector: ['python'],
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart
          }
        },
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  #editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>