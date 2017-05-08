package coffeemaker;

import com.google.gson.Gson;

import base.AbstractMessage;

class BrewTimeMessage extends AbstractMessage {

	public double getSeconds() {
		return (double) payload.get("seconds");
	}

	public static BrewTimeMessage fromJSON(String json) {
		return (new Gson()).fromJson(json, BrewTimeMessage.class);
	}
}
