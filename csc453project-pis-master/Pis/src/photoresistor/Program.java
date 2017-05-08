package photoresistor;

import java.io.IOException;

import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import base.*;

public class Program extends MqttProgram implements IMqttMessageListener {

	public static void main(String[] args) throws IOException {
		Program photoresistorProgram = new Program();
		do {
			System.out.println("Attempting to connect to broker...");
		} while (!photoresistorProgram.connect());

		while (true) {
			photoresistorProgram.readPhotoresistor();

			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	private AnalogInputDevice device;
	private double lastLDRVal;
	private double threshold;

	private Program() throws IOException {
		super("photoresistor");

		// initialize with default values
		lastLDRVal = -1;
		threshold = 0.07;

		// initialize device to read photo-resistor values
		device = new AnalogInputDevice();
	}

	@Override
	protected void subscribe() throws MqttException {
		client.subscribe("photoresistor/threshold", this);
	}

	@Override
	public void messageArrived(String topic, MqttMessage mqtt) throws Exception {
		String payload = new String(mqtt.getPayload());

		switch (topic) {
		case "photoresistor/threshold":
			ThresholdMessage thresholdMsg = ThresholdMessage.fromJSON(payload);

			threshold = thresholdMsg.getThreshold();
			break;
		}
	}

	public void readPhotoresistor() throws IOException {
		// check light sensor
		double newLDRVal = device.sampleLDRNormalized();

		if (Math.abs(newLDRVal - lastLDRVal) > threshold) {
			// there was a significant difference
			sendMessage(new LightSensorMessage(newLDRVal), "photoresistor/lightvalue", false);
			// store new value
			lastLDRVal = newLDRVal;
		}
	}

}
