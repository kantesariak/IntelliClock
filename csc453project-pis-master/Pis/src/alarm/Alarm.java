package alarm;

import java.io.File;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.LineEvent;

public class Alarm implements Runnable {
	
	private volatile boolean alarmOn;
	
	public Alarm() {
		alarmOn = true;
	}
	
	public void stop() {
		alarmOn = false;
	}
	
	@Override
	public void run() {
		while (alarmOn) {
			playAlarmSound();
		}
	}

	private void playAlarmSound() {
		try {
			AudioInputStream audioInputStream = AudioSystem
					.getAudioInputStream(new File("./bikehorn2.wav").getAbsoluteFile());
			Clip clip = AudioSystem.getClip();
			clip.addLineListener(event -> {
				if (LineEvent.Type.STOP.equals(event.getType())) {
					clip.close();
				}
			});
			clip.open(audioInputStream);
			clip.start();
			Thread.sleep(1000);
		} catch (Exception ex) {
			System.out.println("Error with playing sound.");
			ex.printStackTrace();
		}
	}
}
