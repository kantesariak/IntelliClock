package base;

import java.time.Instant;
import java.util.Hashtable;

import com.google.gson.Gson;

public abstract class AbstractMessage {

	/**
	 * milliseconds UTC
	 */
	@SuppressWarnings("unused")
	private long timestamp;

	protected Hashtable<String, Object> payload;

	protected AbstractMessage() {
		timestamp = Instant.now().toEpochMilli();
		payload  = new Hashtable<String, Object>();
	}

	public String toJSON() {
		return (new Gson()).toJson(this);
	}

}