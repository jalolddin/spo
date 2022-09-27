import Vue from "vue";
import Vuex from "vuex";
import api from "../api/index";

import {
  TOGGLE_APP_LAYOUT,
  CHANGE_HEAD_TITLE,
  OPEN_POPUP,
  CLOSE_POPUP,
  ADD_EDIT_ITEM,
  REMOVE_EDIT_ITEM,
  ADD_ROOM,
  REMOVE_ROOM,
  SELECT_ROOM,
  SELECT_TIME,
  UPDATE_EVENTS,
  UPDATE_GENERAL_EVENTS,
  UPDATE_CHOOSEN_EVENTS_TYPE,
  UPDATE_FOUNDED_HEARINGS,
  UPDATE_FOUNDED_HEARINGS_NUMBERS,
} from "./type";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    default: "default",
    appsectionLayout: false,
    titlePage: "",
    activePopup: false,
    lastActivePopup: false,
    editItemId: null,
    rooms: [],
    selectedRoomName: "",
    selectedTime: "",
    hearings: [],
    roles: [],
    events: [],
    users: [],
    cases: [],
    all_events: [],
    choosen_events_type: null,
    founded_hearings: [],
    founded_hearings_numbers: [],
  },
  mutations: {
    [TOGGLE_APP_LAYOUT](state, payload) {
      state.appsectionLayout = payload;
    },
    [CHANGE_HEAD_TITLE](state, payload) {
      state.titlePage = payload;
    },
    [OPEN_POPUP](state, payload) {
      state.lastActivePopup = state.activePopup;
      state.activePopup = payload;
    },
    [CLOSE_POPUP](state, payload) {
      state.activePopup = payload;
    },
    [ADD_EDIT_ITEM](state, payload) {
      state.editItemId = payload;
    },
    [REMOVE_EDIT_ITEM](state) {
      state.editItemId = null;
    },
    [ADD_ROOM](state, payload) {
      payload.type = payload.type.type;
      this.state.rooms.push(payload);
      api.rooms.createRoom(payload).then();
    },
    [REMOVE_ROOM](state, payload) {
      state.rooms.splice(state.rooms.indexOf(payload), 1);

      api.rooms.removeRooms({ name: payload.name }).then((res) => {
        state.rooms = res.data;
      });
    },
    [SELECT_ROOM](state, payload) {
      state.selectedRoomName = payload;
    },
    [SELECT_TIME](state, payload) {
      state.selectedTime = payload;
    },
    updateCases(state, cases) {
      state.cases = cases;
    },
    [UPDATE_EVENTS](state, events) {
      state.events = events;
    },
    [UPDATE_GENERAL_EVENTS](state, events) {
      state.all_events = events;
    },
    [UPDATE_CHOOSEN_EVENTS_TYPE](state, type) {
      state.choosen_events_type = type;
    },
    [UPDATE_FOUNDED_HEARINGS](state, hearings) {
      state.founded_hearings = hearings;
    },
    [UPDATE_FOUNDED_HEARINGS_NUMBERS](state, numbers) {
      state.founded_hearings_numbers = numbers;
    },
  },
  actions: {
    fetchRooms({ state }) {
      api.rooms.getRooms().then((res) => {
        state.rooms = res.data.body.rooms;
      });
    },
    fetchRoles({ state }) {
      api.roles.getRoles().then((res) => {
        state.roles = res.data.body.roles;
      });
    },
    fetchHearings({ state }) {
      const date = new Date();
      const [onlyDate] = date.toISOString().split("T");

      api.hearings
        .getHearings({
          date: state.selectedTime || onlyDate,
          room: state.selectedRoomName,
        })
        .then((res) => {
          state.hearings = res.data.body.hearings;
        });
    },
    changeChoosenEventsType({ commit }, type) {
      commit(UPDATE_CHOOSEN_EVENTS_TYPE, type);
    },
    async fetchEvents({ commit }, val) {
      try {
        const res = await api.createEvents.getEvents(val);
        commit(UPDATE_EVENTS, res.data.body.events);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchGeneralEvents({ commit }) {
      try {
        const res = await api.createEvents.getEvents(10);
        commit(UPDATE_GENERAL_EVENTS, res.data.body.events);
      } catch (error) {
        console.error(error);
      }
    },
    async addNewEvent({ commit, state, dispatch }, { event, type }) {
      try {
        const res = await api.createEvents.createEvent({ ...event, type });
        commit(UPDATE_GENERAL_EVENTS, [
          ...state.all_events,
          res.data.body.event,
        ]);
        dispatch("fetchEvents", state.choosen_events_type);
        dispatch("fetchGeneralEvents");
      } catch (error) {
        console.error(error);
      }
    },
    async updateEvent({ commit, state, dispatch }, data) {
      try {
        const res = await api.createEvents.updateEvent({
          id: data.id,
          body: {
            name: data.body.name,
            note: data.body.note,
          }
        });
        commit(UPDATE_GENERAL_EVENTS, [
          ...state.all_events.filter((event) => event.id !== data.id),
          res.data.body.event,
        ]);
      } catch (error) {
        console.error(error);
      }
      dispatch("fetchGeneralEvents");
    },
    async deleteEvent({ state, dispatch }, id) {
      try {
        await api.createEvents.deleteEvent(id);
        dispatch("fetchGeneralEvents");
        dispatch("fetchEvents", state.choosen_events_type);
      } catch (error) {
        console.error(error);
      }
    },
    fetchUsers({ state }) {
      api.users.getUSers().then((res) => {
        state.users = res.data.body.users;
      });
    },
    fetchCases({ commit }, obj = {}) {
      api.cases.getCases(obj).then((res) => {
        commit("updateCases", res.data.body.cases);
      });
    },
    clearCases({ commit }) {
      commit("updateCases", []);
    },
    async searchHearingsNumbers({ commit }, number) {
      const res = await api.hearings.getHearings({ case: number });
      const hearings = res.data.body.hearings;
      if (hearings && hearings.length) {
        const hearingsNumbers = hearings.map((hearing) => hearing.case);
        commit(UPDATE_FOUNDED_HEARINGS, hearings);
        commit(UPDATE_FOUNDED_HEARINGS_NUMBERS, hearingsNumbers);
      } else {
        commit(UPDATE_FOUNDED_HEARINGS, []);
        commit(UPDATE_FOUNDED_HEARINGS_NUMBERS, []);
      }
    },
  },
  getters: {
    currentTypeEvents(state) {
      return state.events;
    },
    allUsers(state) {
      return state.users;
    },
    filteredCases(state) {
      return state.cases;
    },
    allEvents(state) {
      return state.all_events;
    },
    choosenEventsType(state) {
      return state.choosen_events_type;
    },
    hearings(state) {
      return state.hearings;
    },
    foundedHearings(state) {
      return state.founded_hearings;
    },
    foundedHearingsNumbers(state) {
      return state.founded_hearings_numbers;
    },
    selectedFromFoundedHearing: (state) => (caseNumber) => {
      return state.founded_hearings.find(
        (hearing) => hearing.case === caseNumber
      );
    },
  },
  modules: {},
});
