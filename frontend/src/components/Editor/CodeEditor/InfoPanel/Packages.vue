<template>
  <div class="packages">
    <Confirm ref="confirmModal" message="Selected package will be deleted. Do you want to continue?" @yes="deleteItem" />
    <PackageModal ref="modal" @added="added" @updated="updated" />
    <div class="new-package">
      <button class="btn btn-primary" @click="openNewModal(file);">
        <IconSquarePlus :width="18" :height="18" />
        Add Package
      </button>
    </div>
    <div v-for="item in items" :key="item.id">
      <div class="package">
        <div class="package-name" @click="openEditModal(file, item.id)">
          {{item.name}}
          <div style="font-size: 10px; color: #aaa;">version: {{item.version}}</div>
        </div>
        <div class="action-menu">
          <a href="javascript:;" @click="$refs.confirmModal.show({id: item.id})">
            <IconDelete :width="14" :height="14" :stroke-width="1" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm.vue';
import PackageModal from '@/components/Editor/CodeEditor/InfoPanel/PackageModal.vue';
import axios from "axios";
import IconDelete from "@/components/Icons/IconDelete";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";

export default {
  components: {
    IconSquarePlus,
    IconDelete,
    Confirm,
    PackageModal
  },
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      items: []
    }
  },
  watch: {
    file() {
      this.loadItems();
    }
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    async loadItems() {
      this.loading = true;
      try {
        let response = await axios.get('/api/packages',{
          params: {
            project_id: this.$store.state.project.selected.id,
            file_id: this.file.id,
            file_type: this.file.type
          }
        });
        this.items = response.data.packages;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    openNewModal(file) {
      this.$refs.modal.showAdd(file);
    },
    openEditModal(file, id) {
      this.$refs.modal.showEdit(file, id);
    },
    async added() {
      await this.loadItems();
    },
    async updated() {
      await this.loadItems();
    },
    async deleteItem(selectedItem) {
      this.loading = true;
      try {
        await axios.delete('/api/packages/' + selectedItem.id);
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item-name {
  flex-grow: 1;
}
</style>