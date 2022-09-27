export default function(instance) {
  return {
    getEvents(payload) {
      return instance.get("events", {
        params: {
          type: payload
        }
      });
    },
    createEvent(payload) {
      return instance.post("event", payload);
    },
    updateEvent({ id, body }) {
      return instance.put("event", body, {
        params: {
          id
        }
      });
    },
    deleteEvent(id) {
      return instance.delete("event", {
        params: {
          id
        }
      });
    }
  };
}
