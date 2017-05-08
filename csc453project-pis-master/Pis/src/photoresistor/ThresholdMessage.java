package photoresistor;

import com.google.gson.Gson;

import base.AbstractMessage;

class ThresholdMessage extends AbstractMessage {

	public double getThreshold() {
		return (double) payload.get("normalizedLevel");
	}

	public static ThresholdMessage fromJSON(String json) {
		return (new Gson()).fromJson(json, ThresholdMessage.class);
	}

}