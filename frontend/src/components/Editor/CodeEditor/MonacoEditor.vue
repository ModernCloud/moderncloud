<template>
  <div ref="editor"></div>
</template>

<script>
import {CodeEditorEvents} from '@/lib/code_editor_events';
import * as monaco from 'monaco-editor';
import ReconnectingWebSocket from "reconnecting-websocket";
import { listen } from 'vscode-ws-jsonrpc';
import {MonacoLanguageClient, ErrorAction, CloseAction, createConnection, MonacoServices} from "monaco-languageclient";

export default {
  data() {
    return {
      monacoEditor: null,
      webSocket: null
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
    if (this.webSocket) {
      this.webSocket.close();
    }
  },
  methods: {
    setUpMonacoEditor() {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true
      });
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowJs: true,
        allowNonTsExtensions: true,
        experimentalDecorators: true,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        noEmit: true,
        lib: ['es6']
      });
      monaco.languages.register({
        id: 'javascript',
        aliases: ['JavaScript', 'javascript', 'js'],
        extensions: ['.js'],
        mimetypes: ['text/javascript']
      });
      monaco.languages.register({
        id: 'python',
        aliases: ['Python', 'python', 'py'],
        extensions: ['.py'],
        mimetypes: ['text/x-python']
      });
      this.monacoEditor = monaco.editor.create(this.$refs.editor, {
        model: null,
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
      this.webSocket = this.createWebsocket();
      listen({
        webSocket: this.webSocket,
        onConnection: connection => {
          const languageClient = this.createLanguageClient(connection);
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());
        }
      });
    },
    createWebsocket() {
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
    createLanguageClient(connection) {
      return new MonacoLanguageClient({
        name: "ModernCloud Language Client",
        clientOptions: {
          documentSelector: ['javascript', 'python', 'go'],
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