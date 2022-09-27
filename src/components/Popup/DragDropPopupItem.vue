<template>
  <li>
    <div class="drag-events__line" :class="{ '--detail': detail }">
      <input
        type="checkbox"
        :name="'drag-events-check-' + id"
        :id="'drag-events-check-' + id"
        @change="checkItemHandler"
      />
      <i class="drag-events__handle handle">
        <BaseIcon ico="dragdrop"></BaseIcon>
      </i>

      <label
        :for="'drag-events-check-' + id"
        :class="[
          checkable ? 'drag-events__check' : 'drag-events__without-check'
        ]"
      >
        <span v-if="!detail">{{ name }}</span>
        <input
          type="text"
          v-model="name"
          v-if="detail"
          :name="'drag-events-input-' + id"
        />
      </label>

      <div class="drag-events__control">
        <button
          class="delete"
          :class="{ '--active': detail }"
          @click="deleteItemHandler"
        >
          <BaseIcon ico="delete"></BaseIcon>
        </button>

        <button
          class="check"
          :class="{ '--active': detail }"
          v-if="detail"
          @click="saveItemHandler"
        >
          <BaseIcon ico="check"></BaseIcon>
        </button>

        <button class="redact" @click="editItemHandler" v-if="!detail">
          <BaseIcon ico="redact"></BaseIcon>
        </button>
      </div>

      <div class="drag-events__textarea" v-if="detail">
        <textarea
          v-model="note"
          name="detail"
          id="detail"
          placeholder="Примечание"
        ></textarea>
      </div>
    </div>
  </li>
</template>

<script>
import BaseIcon from "@/components/global/BaseIcon";

export default {
  name: "DragDropPopupItem",
  components: { BaseIcon },
  props: {
    data: [Array, Object],
    checkable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      id: null,
      detail: false,
      name: null,
      note: null
    };
  },
  mounted() {
    this.id = this._uid;
  },
  created() {
    this.name = this.data.name;
    this.note = this.data.note;
  },
  methods: {
    editItemHandler() {
      this.detail = true;
      this.$emit("editItem", this.id);
    },
    saveItemHandler() {
      this.detail = false;
      if (!this.data.id) {
        this.$emit("createItem", {
          name: this.name,
          note: this.note
        });
      }
      if (this.data.id) {
        this.$emit("updateItem", {
          body: { name: this.name, note: this.note },
          id: this.data.id
        });
      }
    },
    deleteItemHandler() {
      if (!this.data.id) {
        this.$emit("deleteEmptyItem");
      } else {
        this.$emit("deleteItem", this.data.id);
      }
    },
    checkItemHandler(e) {
      this.$emit("checkItem", { checked: e.target.checked, item: this.data });
    }
  }
};
</script>
