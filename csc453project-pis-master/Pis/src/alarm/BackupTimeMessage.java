package alarm;

import com.google.gson.Gson;

import base.AbstractMessage;

public class BackupTimeMessage extends AbstractMessage {
	
	/**
	 * 
	 * @return 0-23
	 */
	public double getHour() {
		return (double) payload.get("hour");
	}

	/**
	 * 
	 * @return 0-59
	 */
	public double getMinutes() {
		return (double) payload.get("minutes");
	}
	
	public static BackupTimeMessage fromJSON(String json) {
		return (new Gson()).fromJson(json, BackupTimeMessage.class);
	}

}
