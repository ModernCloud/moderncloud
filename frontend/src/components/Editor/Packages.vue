<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected package will be deleted. Do you want to continue?" @yes="deleteItem" />
    <PackageModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent=!showContent">
      Packages
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto">
        <svg v-if="showContent === false" xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>
        <svg v-if="showContent" xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <a href="javascript:;" class="new-link" @click="openNewModal();">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>
            Add Package
          </a>
          <div v-for="item in items" :key="item.id">
            <div class="item" style="margin-bottom: 8px;">
              <div style="flex-grow: 1; padding-left: 10px;" class="item-name">
                {{item.name}}
                <div style="font-size: 10px; color: #aaa;">version: {{item.version}}</div>
              </div>
              <popper trigger="clickToToggle" :options="{placement: 'bottom-end'}" :visible-arrow="false">
                <a href="javascript:;" slot="reference" style="color: #aaa;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="12" cy="5" r="1" /></svg>
                </a>
                <div class="popper">
                  <div class="popper-menu">
                    <a href="javascript:;" @click="openEditModal(item.id);">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z" /><path d="M16 5l3 3" /><path d="M9 7.07a7.002 7.002 0 0 0 1 13.93a7.002 7.002 0 0 0 6.929 -5.999" /></svg>
                      Edit
                    </a>
                    <a href="javascript:;" @click="$refs.confirmModal.show({id: item.id})">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                      Delete
                    </a>
                  </div>
                </div>
              </popper>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import Confirm from '../Confirm.vue';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import PackageModal from './PackageModal.vue';
import axios from "axios";

export default {
  components: {
    Confirm,
    Popper,
    PackageModal
  },
  data() {
    return {
      loading: false,
      showContent: false,
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
.new-link {
  margin-bottom: 5px;
  margin-left: 7px;
  color: rgb(131, 197, 190);
  font-size: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }

  &:hover {
    color: #fff;
  }
}

.item {
  text-decoration: none;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 2px;

  a {
    text-decoration: none;
    color: #cbd4db;
    padding: 8px;
  }

  &:hover {
    color: rgb(131, 197, 190);

    .item-name {
      color: rgb(131, 197, 190);
    }
  }
}
</style>