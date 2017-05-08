package coffeemaker;

import java.time.Instant;

class Brew implements Runnable {

	private volatile boolean shutdown;

	private int secondsToBrew;
	private DoneBrewingCallback callback;

	public Brew(int seconds, DoneBrewingCallback callback) {
		secondsToBrew = seconds;
		this.callback = callback;

		shutdown = false;
	}

	public void shutdown() {
		this.shutdown = true;
	}

	@Override
	public void run() {
		Instant finishTime = Instant.now().plusSeconds(secondsToBrew);
		
		try {
			while (!shutdown) {
				if (Instant.now().isAfter(finishTime)) {
					callback.done();
					break;
				}
				Thread.sleep(10);
			}
		} catch (InterruptedException e) {
			callback.done();
		}
	}

	public interface DoneBrewingCallback {
		public void done();
	}
}
