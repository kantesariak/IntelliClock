package base;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public abstract class MqttProgram {

	protected MqttClient client;

	// mqtt config
	private String broker;
	private String clientId;
	private MemoryPersistence persistence;
	private MqttConnectOptions connOpts;

	public MqttProgram(String id) {
		// initialize the configuration for the broker
		broker = "tcp://169.46.26.244:1883";
		clientId = id;
		persistence = new MemoryPersistence();

		connOpts = new MqttConnectOptions();
		connOpts.setKeepAliveInterval(30);
		connOpts.setCleanSession(true);
		connOpts.setWill("status/" + id, (new StatusMessage(false)).toJSON().getBytes(), 2, true);
		connOpts.setAutomaticReconnect(true);
	}

	public boolean connect() {
		// connect to broker
		try {
			client = new MqttClient(broker, clientId, persistence);
			client.connect(connOpts);

			// subscribe
			subscribe();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Error connecting and subscribing to broker!");
			return false;
		}

		// send online message
		sendMessage(new StatusMessage(true), "status/" + clientId, true);
		return true;
	}

	protected void subscribe() throws MqttException {
	}

	protected void sendMessage(AbstractMessage messageInfo, String topic, boolean retained) {
		MqttMessage message = new MqttMessage(messageInfo.toJSON().getBytes());
		message.setRetained(retained);
		message.setQos(2);
		try {
			client.publish(topic, message);
		} catch (MqttException e) {
			e.printStackTrace();
			System.out.println("Error publishing message to " + topic + " topic!");
		}
	}

}