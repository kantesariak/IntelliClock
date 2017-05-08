package coffeemaker;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.Pin;
import com.pi4j.io.gpio.PinState;

class Button {

	private final GpioPinDigitalOutput pin;

	public Button(GpioController controller, Pin gpioPin) {
		pin = controller.provisionDigitalOutputPin(gpioPin, PinState.HIGH);
		pin.setShutdownOptions(true, PinState.HIGH);
		pin.high();
	}

	public void press() {
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				pin.low();
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				pin.high();
			}
			
		}).start();
	}

}
