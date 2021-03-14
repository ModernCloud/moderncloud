<template>
  <div class="modal confirm-modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="body">
        <p v-html="message"></p>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-danger" @click="$emit('yes', currentData); visible = false;">Yes</button>
        <button type="button" class="btn" @click="$emit('no', currentData); visible = false;">No</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Are you sure?'
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