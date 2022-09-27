<template>
  <vue-modaltor :visible="show" @hide="hideModal" class="block-popup">
    <template slot="close-icon"></template>
    <h2>{{ title }}</h2>

    <vue-autosuggest
      :suggestions="[{ data: foundedHearingsNumbers }]"
      :input-props="{
        id: 'autosuggest__input',
        placeholder: 'Номер дела',
        class: 'autosuggest-input'
      }"
      :component-attr-class-autosuggest-results-container="
        'autosuggest-results-container'
      "
      @input="onInputHearingNumberChange"
      @selected="selectHandler"
    >
      <template slot-scope="{ suggestion }">
        <span class="my-suggestion-item">{{ suggestion.item }}</span>
      </template>
    </vue-autosuggest>

    <!--Data/Time-->
    <div class="group">
      <BaseInputCalendar
        class-names="--full"
        :value.sync="dateTime.date"
      ></BaseInputCalendar>

      <BaseSelect
        :list="hoursList"
        placeholder="Часов"
        :value.sync="dateTime.hour"
        class-names="--full --border --small --list-min redact__session-input"
      ></BaseSelect>

      <BaseSelect
        :list="minutesList"
        placeholder="Минут"
        :value.sync="dateTime.minute"
        class-names="--full --border --small --list-min redact__session-input"
      ></BaseSelect>
    </div>

    <BaseSelect
      :list="typesList"
      placeholder="Вид производства"
      :widthSelected="topPlaceholder"
      :value.sync="redactSession.type"
      class-names="--full --border --small --list-min redact__session-input"
    ></BaseSelect>

    <BaseInput
      placeholder="Истец"
      :small="true"
      :border="true"
      :value.sync="redactSession.plaintiffs[0]"
      class-names="--full redact__session-input"
    ></BaseInput>

    <BaseSelect
      :list="plaintiffsList"
      :min="true"
      placeholder="Добавить участника"
      selectAdd="Добавить участника"
      :select-add="true"
      :arrow="true"
      class="redact__session-input"
    ></BaseSelect>
    <br />
    <BaseInput
      placeholder="Ответчик"
      :small="true"
      :border="true"
      :value.sync="redactSession.lawyers[0]"
      class-names="--full redact__session-input"
    ></BaseInput>

    <BaseSelect
      :list="defendantsList"
      :min="true"
      placeholder="Добавить участника"
      selectAdd="Добавить участника"
      :select-add="true"
      :arrow="true"
      class-names="redact__session-input"
    ></BaseSelect>
    <br />
    <BaseSelect
      :list="secretariesList"
      placeholder="Секретарь"
      :widthSelected="topPlaceholder"
      :value.sync="redactSession.secretary"
      class-names="--full --border --small --list-min redact__session-input"
    ></BaseSelect>

    <BaseSelect
      :list="judgesList"
      placeholder="Судья"
      :widthSelected="topPlaceholder"
      :value.sync="redactSession.judge"
      class-names="--full --border --small --list-min --top redact__session-input"
    ></BaseSelect>

    <BaseSelect
      :list="rooms"
      placeholder="Помещение"
      :widthSelected="topPlaceholder"
      :value.sync="redactSession.room"
      class-names="--full --border --small --list-min --top redact__session-input"
    ></BaseSelect>

    <div class="btn-group">
      <BaseButton
        @eventclick="createRedactSession"
        :text="buttonText"
      ></BaseButton>
      <BaseButton text="Отмена" class="--silver"></BaseButton>
    </div>
  </vue-modaltor>
</template>

<script>
import BaseButton from "@/components/global/BaseButton";
import BaseInputCalendar from "@/components/global/BaseInputCalendar";
import BaseSelect from "@/components/global/BaseSelect";
import BaseInput from "@/components/global/BaseInput";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { REMOVE_EDIT_ITEM } from "@/store/type";

import { HOURS_MINUTES_LIST } from "@/utils/constants";

export default {
  name: "PopupRedactSession",
  data() {
    return {
      placeholder: "Вид производства",
      topPlaceholder: "1.525rem",

      dateTime: {
        date: new Date(),
        hour: "",
        minute: ""
      },

      redactSession: {
        case: "",
        type: "",
        time: "",
        room: "",

        status: "waiting",

        plaintiffs: [],
        defendants: ["defendant_1", "defendant_2"],
        lawyers: [],
        prosecutors: ["prosecutor_1", "prosecutor_2"],
        secretary: "",
        judge: ""
      },

      hoursList: HOURS_MINUTES_LIST,
      minutesList: HOURS_MINUTES_LIST,
      typesList: [
        "Уголовное дело",
        "Гражданское дело",
        "Административное дело",
        "Административное дело КАС",
        "Уголовное дело апелляция",
        "Гражданское дело апелляция",
        "Административное дело апелляция"
      ],
      plaintiffsList: ["Истец 1", "Истец 2", "Истец 3", "Истец 4", "Истец 5"],
      defendantsList: [
        "Ответчик 1",
        "Ответчик 2",
        "Ответчик 3",
        "Ответчик 4",
        "Ответчик 5"
      ],
      secretariesList: [1, 2, 3, 4, 5, 6],
      judgesList: [
        "Судья 1",
        "Судья 2",
        "Судья 3",
        "Судья 4",
        "Судья 5",
        "Судья 6"
      ]
    };
  },
  components: { BaseInputCalendar, BaseButton, BaseSelect, BaseInput },
  props: {
    title: {
      type: String,
      default: "Редактировать"
    },
    show: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: "Сохранить"
    }
  },
  computed: {
    ...mapGetters([
      "foundedHearings",
      "foundedHearingsNumbers",
      "selectedFromFoundedHearing"
    ]),
    rooms() {
      return this.$store.state.rooms.length
        ? this.$store.state.rooms
        : ["Нет помещений"];
    },
    dateTimeFormated() {
      if (this.dateTime.date) {
        this.dateTime.date.setHours(this.dateTime.hour);
        this.dateTime.date.setMinutes(this.dateTime.minute);
        this.dateTime.date.setSeconds(0);
        return this.dateTime.date.toISOString().slice(0, -1) + "+0000";
      } else {
        const nowDateTime = new Date(Date.now());
        nowDateTime.setHours(this.dateTime.hour);
        nowDateTime.setMinutes(this.dateTime.minute);
        nowDateTime.setSeconds(0);
        return nowDateTime.toISOString().slice(0, -1) + "+0000";
      }
    }
  },
  methods: {
    ...mapMutations([REMOVE_EDIT_ITEM]),
    ...mapActions(["searchHearingsNumbers", "fetchHearings"]),

    selectHandler(target) {
      const selectedHearing = this.selectedFromFoundedHearing(target.item);
      // const fullDate = new Date(selectedHearing.time)
      // const after30Date = fullDate.getTime() + 30 * 6000;
      // const after30DateISO = new Date(after30Date);
      const newDate = new Date();
      const after30Date = newDate.getTime() + 30 * 60000;
      const after30DateISO = new Date(after30Date);
      const hearingHours = after30DateISO.getHours();
      const hearingMinutes = after30DateISO.getMinutes();
      // console.log("fullDate");
      // console.log(fullDate);
      // console.log("hearingHours");
      // console.log(hearingHours);
      // console.log("hearingMinutes");
      // console.log(hearingMinutes);
      // console.log("selectedHearing")
      // console.log(selectedHearing)

      this.dateTime.date = newDate;
      this.dateTime.hour = hearingHours;
      this.dateTime.minute = hearingMinutes;

      this.redactSession.case = selectedHearing.case;
      this.redactSession.time = selectedHearing.time;
      this.redactSession.type = selectedHearing.type;
      this.redactSession.defendants = selectedHearing.defendants;
      // console.log("this.redactSession.defendants")
      // console.log(this.redactSession.defendants)
      // console.log("selectedHearing.defendants")
      // console.log(selectedHearing.defendants)
      // console.log("this.defendantsList")
      // console.log(this.defendantsList)
      this.redactSession.status = selectedHearing.status;
      this.redactSession.plaintiffs = selectedHearing.plaintiffs;
      // this.redactSession.secretary = selectedHearing.secretary;
      // this.redactSession.judge = selectedHearing.judge;
      // this.redactSession.room = selectedHearing.room;

      // console.log("selectedHearing");
      // console.log(selectedHearing);

      // console.log("this.redactSession");
      // console.log(this.redactSession);

      // case: "123"
      // defendants: Array(1)
      // id: "ea3e80a6-7a2b-40f2-8ab4-c45282905314"
      // judge: "user4"
      // plaintiffs: Array(1)
      // room: "room1"
      // secretary: "user3"
      // status: "waiting"
      // time: "2021-12-30T08:51:51+0100"
      // type: 1

      // this.redactSession.type = "",
      // this.redactSession.time = "",
      // this.redactSession.room = "",

      // this.redactSession.status = "waiting",

      // this.redactSession.plaintiffs = ["defendant_1", "defendant_2"],
      // this.redactSession.defendants = ["defendant_1", "defendant_2"],
      // this.redactSession.lawyers = [],
      // this.redactSession.prosecutors = ["prosecutor_1", "prosecutor_2"],
      // this.redactSession.secretary = "",
      // this.redactSession.judge = "",
    },

    onInputHearingNumberChange(val) {
      this.redactSession.case = val;
      this.searchHearingsNumbers(val);
    },

    hideModal() {
      this.$emit("hidePopup");
    },

    async createRedactSession() {
      this.redactSession.time = this.dateTimeFormated;

      const todayDate = new Date();
      const choosenDate = new Date(this.redactSession.time);

      if (todayDate.setHours(0, 0, 0, 0) > choosenDate.setHours(0, 0, 0, 0)) {
        alert("Выберите корректную дату");
        return;
      }

      const fullContainedForm = Object.values(this.redactSession).filter(
        item => {
          return Boolean(
            item
              .toString()
              .toLowerCase()
              .trim()
          );
        }
      );

      this.redactSession.judge = String(this.redactSession.judge);
      this.redactSession.secretary = String(this.redactSession.judge);
      this.redactSession.type = this.redactSession.type + 1;

      if (
        fullContainedForm.length === Object.values(this.redactSession).length
      ) {
        let res = "";
        this.hideModal();
        this.redactSession.room = this.rooms[this.redactSession.room].name;
        if (this.title.toLowerCase() === "редактировать") {
          res = await this.$api.hearings.updateHearing({
            body: this.redactSession
          });
          this.fetchHearings();
        } else {
          res = await this.$api.hearings.createHearing(this.redactSession);
          this.fetchHearings();
        }

        if (res) {
          console.log(res);
        }

        this.redactSession = {
          case: "",
          type: "",
          time: "",
          room: "",

          status: "waiting",

          plaintiffs: [],
          defendants: ["defendant_1", "defendant_2"],
          lawyers: [],
          prosecutors: ["prosecutor_1", "prosecutor_2"],
          secretary: "",
          judge: ""
        };
      } else {
        alert("Заполните поля");
      }
    }
  },

  watch: {
    show(newValue) {
      if (!newValue) this.REMOVE_EDIT_ITEM();
    },
    redactSession: {
      deep: true,
      handler(val) {
        console.log("redactSession!");
        console.log(val);
        console.log("this.selectedHearing");
        console.log(this.selectedHearing);
      }
    }
  }
};
</script>

<style>
#autosuggest {
  position: relative;
}
.autosuggest-input {
  margin-bottom: 0.75rem;
  border: 1px solid #555867;
  width: 100%;
  height: 3.375rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  transition: 0.2s;
  font-weight: 300;
  font-size: 1rem;
  transition: 0.2s;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  outline: none;
  box-shadow: none;
  background-color: #fff;
}

.autosuggest-results-container {
  position: absolute;
  top: 3.375rem;
  left: 0;
  z-index: 21;
  background: #fff;
  width: 100%;
  border: 1px solid #555867;
  border-top: 0;
}

.autosuggest__results ul {
  padding: 0;
  margin: 0;
}
.autosuggest__results-item {
  list-style-type: none;
  padding: 0.75rem 1.25rem;
}
.autosuggest__results-item:hover {
  background: #dadada;
}
</style>
