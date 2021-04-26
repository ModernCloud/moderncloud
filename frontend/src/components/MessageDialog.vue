<template>
  <div class="modal confirm-modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="body">
        <p v-html="message"></p>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-primary" @click="$emit('close', currentData); visible = false;">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
      currentData: null
    }
  },
  methods: {
    show(data) {
      this.currentData = data;
      this.visible = true;
    }
  }
}
</script>