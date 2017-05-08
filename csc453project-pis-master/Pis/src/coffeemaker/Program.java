package coffeemaker;

import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.RaspiPin;

import base.MqttProgram;

public class Program extends MqttProgram implements IMqttMessageListener, Brew.DoneBrewingCallback {

	public static void main(String[] args) throws MqttException {
		Program coffeeMakerProgram = new Program();
		do {
			System.out.println("Attempting to connect to broker...");
		} while (!coffeeMakerProgram.connect());
	}

	private final GpioController controller;

	private Button onButton;
	private Button offButton;

	private int brewTime;
	private Brew brew;

	public Program() throws MqttException {
		super("coffeemaker");
		
		// set default brew time of 1800 seconds or 30 minutes
		brewTime = 1800;

		// initialize device controller
		controller = GpioFactory.getInstance();
		
		// initialize buttons
		onButton = new Button(controller, RaspiPin.GPIO_06);
		offButton = new Button(controller, RaspiPin.GPIO_05);
	}

	@Override
	protected void subscribe() throws MqttException {
		client.subscribe("coffeemaker/#", this);
	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		String payload = new String(message.getPayload());
		
		switch (topic) {
		case "coffeemaker/on":
			// read the coffee maker on message
			OnMessage onMsg = OnMessage.fromJSON(payload);

			if (onMsg.isOn()) {
				turnOn();
			} else {
				turnOff();
			}
			break;
		case "coffeemaker/brewtime":
			BrewTimeMessage brewTimeMsg = BrewTimeMessage.fromJSON(payload);
			
			brewTime = (int)brewTimeMsg.getSeconds();
			break;
		}
	}

	@Override
	public void done() {
		turnOff();
		sendMessage(new OnMessage(false), "coffeemaker/on", true);
	}
	
	private void turnOn() {
		if (brew == null) {
			brew = new Brew(brewTime, this);
			new Thread(brew).start();
			onButton.press();
		}
	}

	private void turnOff() {
		if (brew != null) {
			brew.shutdown();
			brew = null;
			offButton.press();
		}
	}
}
