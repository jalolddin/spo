<template>
  <draggable
    class="drag-group"
    tag="ul"
    v-model="items"
    v-bind="dragOptions"
    handle=".handle"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
      <!-- <DragDropItem
        v-for="item in items"
        :key="item.name"
        :list="item"
        @deleteItem="deleteEventHandler"
      ></DragDropItem> -->
      <DragDropPopupItem
        v-for="(item, index) in items"
        :key="'transition-' + index"
        :data="item"
        :checkable="false"
        @editItem="redactItemHandler(item)"
        @update:name="setNewItemName"
        @update:description="setNewItemNote"
        @updateItem="updateItemHandler"
        @deleteItem="deleteEventHandler"
      ></DragDropPopupItem>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import DragDropPopupItem from "@/components/Popup/DragDropPopupItem";
import { mapActions, mapGetters } from "vuex";

// const message = [
//   "Открытие судебного заседания",
//   "draggable",
//   "component",
//   "for",
//   "vue.js 2.0",
//   "based",
//   "on",
//   "Sortablejs",
//   "vue.draggable",
//   "draggable",
//   "component",
//   "for",
//   "vue.js 2.0",
//   "based",
//   "on",
//   "Sortablejs"
// ];

export default {
  name: "DragDrop",
  components: {
    DragDropPopupItem,
    draggable
  },
  data() {
    return {
      // list: message.map((name, index) => {
      //   return { name, order: index + 1 };
      // }),
      drag: false,
      editableItem: {}
    };
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapActions(["deleteEvent", "fetchEvents", "updateEvent"]),
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    },
    deleteEventHandler(id) {
      console.log(id);
      this.deleteEvent(id);
      this.fetchEvents(this.choosenEventsType);
    },
    redactItemHandler(item) {
      this.editableItem = { ...item };
    },
    setNewItemName(name) {
      this.editableItem.name = name;
    },
    setNewItemNote(note) {
      this.editableItem.note = note;
    },
    updateItemHandler(data) {
      const { body } = data;
      const { id } = data;
      this.updateEvent({ body: { ...body, type: body.type + 1 }, id });
    }
  },
  computed: {
    ...mapGetters(["choosenEventsType"]),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
