<template>
  <div>
    <PackageModal ref="modal" @added="added" @updated="updated" />
    <sui-accordion-title is="sui-menu-header">
      <sui-icon name="dropdown" />
      Packages
    </sui-accordion-title>
    <sui-accordion-content style="font-size: 12px; padding-left: 10px;">
      <div style="margin-bottom: 10px;"><a href="javascript:;" @click="openNewModal"><sui-icon name="plus square" outline /> Add Package</a></div>
      <sui-icon name="spinner" loading v-if="loading" />
      <div v-if="loading === false">
        <div style="display: flex; align-items: center; margin-bottom: 4px; font-size: 11px;" v-for="item in items" :key="item.id">
          <sui-button size="mini" basic style="flex-grow: 1; text-align: left; padding: 8px;">
            {{item.name}}: {{item.version}}
          </sui-button>
          <sui-dropdown icon="ellipsis vertical" pointing="right top">
            <sui-dropdown-menu style="right: 0;left: auto;">
              <sui-dropdown-item @click="openEditModal(item.id)">Edit</sui-dropdown-item>
              <sui-dropdown-item @click="deleteItem(item.id)">Delete</sui-dropdown-item>
            </sui-dropdown-menu>
          </sui-dropdown>
        </div>
      </div>
    </sui-accordion-content>
  </div>
</template>

<script>
import PackageModal from './PackageModal.vue';
import axios from "axios";


export default {
  components: {
    PackageModal
  },
  data() {
    return {
      loading: false,
      items: []
    }
  },
  watch: {
    '$store.state.project.selected'() {
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
            project_id: this.$store.state.project.selected.id
          }
        });
        this.items = response.data.packages;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    openNewModal() {
      this.$refs.modal.showAdd();
    },
    openEditModal(id) {
      this.$refs.modal.showEdit(id);
    },
    added() {
      this.loadItems();
    },
    updated() {
      this.loadItems();
    },
    async deleteItem(id) {
      if (confirm('Are you sure?') === false) {
        return;
      }
      this.loading = true;
      try {
        await axios.delete('/api/packages/' + id);
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    }
  }
}
</script>