package photoresistor;

import base.AbstractMessage;

class LightSensorMessage extends AbstractMessage {

	public LightSensorMessage(double normalizedLDRValue) {
		super();
		payload.put("normalizedValue", normalizedLDRValue);
	}

}