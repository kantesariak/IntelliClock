package coffeemaker;

import com.google.gson.Gson;

import base.AbstractMessage;

class OnMessage extends AbstractMessage {

	public boolean isOn() {
		return (boolean) payload.get("isOn");
	}
	
	public OnMessage(boolean isOn) {
		super();
		payload.put("isOn", isOn);
	}

	public static OnMessage fromJSON(String json) {
		return (new Gson()).fromJson(json, OnMessage.class);
	}

}
