package base;

public class StatusMessage extends AbstractMessage {

	public StatusMessage(boolean online) {
		super();
		payload.put("online", online);
	}

}
