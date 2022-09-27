<template>
  <vue-modaltor :visible="show" @hide="hideModal" class="block-popup --events">
    <template slot="close-icon"></template>
    <h2>События</h2>

    <button
      :disabled="hasNewEmptyEvent"
      type="button"
      class="btn-add --min"
      @click="addItem"
      style="margin-bottom: 1rem"
    >
      <BaseIcon ico="plus"></BaseIcon>
      <span>Создать событие</span>
    </button>

    <div class="block-popup__dragdrop">
      <draggable
        class="drag-events"
        tag="ul"
        v-model="items"
        v-bind="dragOptions"
        handle=".handle"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <DragDropPopupItem
            v-for="(item, index) in items"
            :key="'transition-' + index"
            :data="item"
            @update:name="setNewEventName"
            @update:description="setNewEventNote"
            @createItem="createNewEventHandler"
            @updateItem="updateEventHandler"
            @deleteEmptyItem="deleteEmptyEventHandler"
            @deleteItem="deleteEventHandler"
            @checkItem="checkEventHandler"
          ></DragDropPopupItem>
        </transition-group>
      </draggable>
    </div>

    <!--    <BaseSelect-->
    <!--      :list="[-->
    <!--        'Добавить событие',-->
    <!--        'Добавить событие 2',-->
    <!--        'Добавить событие 3',-->
    <!--        'Добавить событие 4',-->
    <!--        'Добавить событие 5'-->
    <!--      ]"-->
    <!--      :min="true"-->
    <!--      placeholder="Добавить событие"-->
    <!--      selectAdd="Добавить событие"-->
    <!--      :select-add="true"-->
    <!--    ></BaseSelect>-->

    <div class="btn-group">
      <BaseButton
        text="Добавить"
        @eventclick="addChoosenEventsToType"
      ></BaseButton>
      <BaseButton text="Отмена" class="--silver"></BaseButton>
    </div>
  </vue-modaltor>
</template>

<script>
import BaseIcon from "@/components/global/BaseIcon";
import BaseButton from "@/components/global/BaseButton";
import draggable from "vuedraggable";
import DragDropPopupItem from "@/components/Popup/DragDropPopupItem";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PopupEvents",
  components: { DragDropPopupItem, BaseButton, BaseIcon, draggable },
  props: {
    show: {
      type: Boolean,
      default: false
    }
    // items: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
  },
  data() {
    return {
      date: new Date().toLocaleDateString(),
      // list: message.map((name, index) => {
      //   return { name, order: index + 1 };
      // }),
      drag: false,
      items: [],
      newItem: null,
      choosenEvents: []
    };
  },
  computed: {
    ...mapGetters(["allEvents", "choosenEventsType"]),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    hasNewEmptyEvent() {
      return this.newItem;
    }
  },
  methods: {
    ...mapActions([
      "addNewEvent",
      "updateEvent",
      "deleteEvent",
      "fetchEvents",
      "fetchGeneralEvents"
    ]),
    hideModal() {
      this.$emit("hidePopup");
    },
    addItem() {
      this.newItem = { name: "", note: "" };
      this.items = [...this.items, this.newItem];
    },
    setNewEventName(val) {
      this.newItem.name = val;
    },
    setNewEventNote(val) {
      this.newItem.note = val;
    },
    createNewEventHandler(event) {
      this.addNewEvent({ event, type: 10 });
      this.deleteEmptyEventHandler();
    },
    updateEventHandler(data) {
      this.updateEvent(data);
    },
    deleteEmptyEventHandler() {
      this.newItem = null;
      this.items.length = this.items.length - 1;
    },
    deleteEventHandler(id) {
      this.deleteEvent(id);
    },
    checkEventHandler({ checked, item }) {
      if (checked) {
        this.choosenEvents.push({ name: item.name, id: item.id });
      } else {
        this.choosenEvents = this.choosenEvents.filter(
          event => event.id !== item.id
        );
      }
    },
    addChoosenEventsToType() {
      if (this.choosenEvents.length && this.choosenEventsType !== null) {
        this.choosenEvents.forEach(event => {
          this.addNewEvent({ event, type: this.choosenEventsType });
        });
        this.choosenEvents = [];
        this.hideModal();
      }
    }
  },
  created() {},
  watch: {
    allEvents() {
      this.items = this.allEvents;
    }
  }
};
</script>

<style scoped>
/*.flip-list-move {*/
/*  transition: transform 0.5s;*/
/*}*/
/*.no-move {*/
/*  transition: transform 0s;*/
/*}*/
/*.ghost {*/
/*  opacity: 0.5;*/
/*  background: #c8ebfb;*/
/*}*/
/*.list-group {*/
/*  min-height: 20px;*/
/*}*/
/*.list-group-item {*/
/*  cursor: move;*/
/*}*/
.list-group-item i {
  cursor: pointer;
}
</style>
