class EventSystem {
  constructor() {
    this._events = {};
  }
  ListenToEvent(event_id, callback) {
    if (this._events.hasOwnProperty(event_id)) {
      this._events[event_id].push(callback);
      return;
    }
    this._events[event_id] = [callback];
  }
  Notify(event_id, parameters) {
    if (this._events.hasOwnProperty(event_id)) {
      let eventLength = this._events[event_id].length;
      for (let i = 0; i < eventLength; i++) {
        this._events[event_id][i](parameters);
      }
    }
  }
}
export default EventSystem;
