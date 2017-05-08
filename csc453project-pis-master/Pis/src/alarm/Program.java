package alarm;

import java.time.LocalDateTime;

import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalInput;
import com.pi4j.io.gpio.PinPullResistance;
import com.pi4j.io.gpio.RaspiPin;
import com.pi4j.io.gpio.event.GpioPinDigitalStateChangeEvent;
import com.pi4j.io.gpio.event.GpioPinListenerDigital;

import base.MqttProgram;

public class Program extends MqttProgram implements GpioPinListenerDigital, IMqttMessageListener, Runnable {

	public static void main(String[] args) {
		Program alarmProgram = new Program();
		do {
			System.out.println("Attempting to connect to broker...");
		} while (!alarmProgram.connect());
	}

	private Alarm alarm;
	private int backupHour;
	private int backupMinutes;

	private final GpioController gpio;
	private final GpioPinDigitalInput myButton;

	public Program() {
		super("alarmclock");

		// default alarm clock value
		backupHour = 7;
		backupMinutes = 0;
		
		// initialize device
		gpio  = GpioFactory.getInstance();

		// set up button
		myButton = gpio.provisionDigitalInputPin(RaspiPin.GPIO_02, PinPullResistance.PULL_DOWN);
		myButton.setShutdownOptions(true);
		myButton.addListener(this);
	}

	@Override
	public void handleGpioPinDigitalStateChangeEvent(GpioPinDigitalStateChangeEvent arg0) {
		if (alarm != null) {
			alarm.stop();
			alarm = null;
		}
	}

	@Override
	protected void subscribe() throws MqttException {
		client.subscribe("alarmclock/#", 2, this);
	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		String payload = new String(message.getPayload());

		switch (topic) {
		case "alarmclock/on":
			if (alarm == null) {
				alarm = new Alarm();
				new Thread(alarm).start();
			}
			break;
		case "alarmclock/backup":
			BackupTimeMessage backupMsg = BackupTimeMessage.fromJSON(payload);

			backupHour = (int) backupMsg.getHour();
			backupMinutes = (int) backupMsg.getMinutes();
			break;
		}
	}

	@Override
	public void run() {
		while (true) {
			if (client.isConnected() == false) {
				LocalDateTime now = LocalDateTime.now();
				// if it is time to set off backup alarm
				if (backupHour == now.getHour() && backupMinutes == now.getMinute()) {
					// set it off, only if it is not already off
					if (alarm == null) {
						alarm = new Alarm();
						new Thread(alarm).start();
					}
				}
			}

			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
			}
		}
	}
}
