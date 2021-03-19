<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected package will be deleted. Do you want to continue?" @yes="deleteItem" />
    <PackageModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent=!showContent" :class="{active: showContent}">
      <IconPackage :width="18" :height="18" />
      Packages
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto">
        <IconChevronRight v-if="showContent === false" :width="12" :height="12" :stroke-width="2" />
        <IconChevronDown v-if="showContent" :width="12" :height="12" :stroke-width="2" />
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <div class="item">
            <a href="javascript:;"  @click="openNewModal();">
              <IconSquarePlus :width="18" :height="18" />
              Add Package
            </a>
          </div>
          <div v-for="item in items" :key="item.id">
            <div class="item">
              <div class="item-name">
                {{item.name}}
                <div style="font-size: 10px; color: #aaa;">version: {{item.version}}</div>
              </div>
              <div class="action-menu">
                <a href="javascript:;" @click="openEditModal(item.id)">
                  <IconEdit :width="14" :height="14" :stroke-width="1" />
                </a>
                <a href="javascript:;" @click="$refs.confirmModal.show({id: item.id})">
                  <IconDelete :width="14" :height="14" :stroke-width="1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import Confirm from '@/components/Confirm.vue';
import PackageModal from './PackageModal.vue';
import axios from "axios";
import IconPackage from "@/components/Icons/IconPackage";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconEdit from "@/components/Icons/IconEdit";
import IconDelete from "@/components/Icons/IconDelete";

export default {
  components: {
    IconDelete,
    IconEdit,
    IconChevronDown,
    IconChevronRight,
    IconSquarePlus,
    IconPackage,
    Confirm,
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
  .item-name {
    flex-grow: 1;
  }
</style>