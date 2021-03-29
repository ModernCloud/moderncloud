<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected function will be deleted. Do you want to continue?" @yes="deleteItem" />
    <DynamoDBModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent=!showContent" :class="{active: showContent}">
      <IconDatabase :width="18" :height="18" />
      DynamoDB
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
            <a href="javascript:;" class="new-link" @click="openNewModal">
              <IconSquarePlus :width="18" :height="18" />
              New Table
            </a>
          </div>
          <div v-for="item in items" :key="item.id">
            <div class="item">
              <a href="javascript:;">
                <div class="item-name">{{item.name}}</div>
              </a>
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
import DynamoDBModal from './DynamoDBModal.vue';
import axios from "axios";
import IconDatabase from "@/components/Icons/IconDatabase";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconEdit from "@/components/Icons/IconEdit";
import IconDelete from "@/components/Icons/IconDelete";

export default {
  components: {
    IconDelete,
    IconEdit,
    IconSquarePlus,
    IconChevronDown,
    IconChevronRight,
    IconDatabase,
    Confirm,
    DynamoDBModal
  },
  data() {
    return {
      loading: true,
      showContent: false,
      items: []
    }
  },
  watch: {
    async '$store.state.project.selected'() {
      await this.loadItems();
    }
  },
  async mounted() {
    await this.loadItems();
  },
  methods: {
    async loadItems() {
      this.loading = true;
      try {
        let response = await axios.get('/api/dynamodb',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.items = response.data.tables;
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
    async added() {
      await this.loadItems();
    },
    async updated() {
      await this.loadItems();
    },
    async deleteItem(selectedItem) {
      this.loading = true;
      try {
        await axios.delete('/api/dynamodb/' + selectedItem.id);
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    }
  }
}
</script>