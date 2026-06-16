// utils/crtHum.ts
class CRTHum {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private baseVolume: number = 0.05;
  private targetVolume: number = 0.05;
  private animationFrameId: number | null = null;
  private inactivityTimeout: NodeJS.Timeout | null = null;
  private isInactive: boolean = false;
  private inactivityFadeStart: number = 0;
  private lastActivityTime: number = Date.now();
  private readonly INACTIVITY_DELAY = 2000; // 2 seconds
  private readonly INACTIVITY_FADE_DURATION = 3000; // 3 seconds to fade out

  async start() {
  if (this.isPlaying) return;

  try {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = this.audioContext;

    const masterGain = ctx.createGain();
    masterGain.gain.value = this.baseVolume;
    masterGain.connect(ctx.destination);
    this.gainNode = masterGain;

    // --- 60Hz power hum + harmonics ---
    const humFreqs = [60, 120, 180, 240];
    const humGains = [1.0, 0.4, 0.2, 0.1];
    humFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = humGains[i] * 0.4;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
    });

    // --- 15.7kHz horizontal scan whine ---
    const whine = ctx.createOscillator();
    const whineGain = ctx.createGain();
    whine.type = 'sine';
    whine.frequency.value = 15734;
    whineGain.gain.value = 0.08;
    whine.connect(whineGain);
    whineGain.connect(masterGain);
    whine.start();

    // Slight pitch wobble on the whine (CRTs weren't perfectly stable)
    const wobble = ctx.createOscillator();
    const wobbleGain = ctx.createGain();
    wobble.frequency.value = 0.3;
    wobbleGain.gain.value = 18;
    wobble.connect(wobbleGain);
    wobbleGain.connect(whine.frequency);
    wobble.start();

    // --- Noise floor (static buzz) ---
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Band-pass around 60Hz to make noise feel electrical, not hissy
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 120;
    bandpass.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    // Keep a reference to stop later if needed
    this.oscillator = whine; // reuse existing field for lifecycle

    this.isPlaying = true;

    if (ctx.state === 'suspended') await ctx.resume();

    this.startVolumeAnimation();

  } catch (error) {
    console.error('Failed to start CRT Hum:', error);
  }
  }

  private startVolumeAnimation() {
    const animate = () => {
      if (!this.gainNode || !this.isPlaying) return;
      
      let finalTargetVolume = this.targetVolume;
      
      // Apply inactivity fade if inactive
      if (this.isInactive && this.inactivityFadeStart > 0) {
        const now = Date.now();
        const fadeProgress = Math.min(1, (now - this.inactivityFadeStart) / this.INACTIVITY_FADE_DURATION);
        
        // Exponential fade curve - starts slow then fades faster
        const fadeFactor = Math.pow(fadeProgress, 1.5);
        
        // Fade from current target volume down to almost 0
        finalTargetVolume = this.targetVolume * (1 - fadeFactor);
        
        // If fully faded, set to near zero
        if (fadeProgress >= 1) {
          finalTargetVolume = 0.001;
        }
      }
      
      // Smooth interpolation
      const currentVolume = this.gainNode.gain.value;
      const diff = finalTargetVolume - currentVolume;
      const newVolume = currentVolume + diff * 0.2;
      
      this.gainNode.gain.value = newVolume;
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Called on every mouse movement
  recordActivity() {
    const now = Date.now();
    this.lastActivityTime = now;
    
    // If we were inactive, resume immediately
    if (this.isInactive) {
      this.isInactive = false;
      this.inactivityFadeStart = 0;
      console.log('🖱️ Activity resumed - volume restoring');
    }
    
    // Reset the inactivity timer
    this.resetInactivityTimer();
  }

  setProximity(distance: number, maxDistance: number = 200) {
    if (!this.isPlaying) return;
    
    // Record activity on proximity change
    this.recordActivity();
    
    const rawProximity = 1 - Math.min(1, Math.max(0, distance / maxDistance));
    const exponentialProximity = Math.pow(rawProximity, 0.4);
    const maxVolume = 0.45;
    this.targetVolume = this.baseVolume + (exponentialProximity * (maxVolume - this.baseVolume));
    
    if (this.oscillator && rawProximity > 0.3) {
      const freqProximity = Math.pow(Math.max(0, rawProximity - 0.3) / 0.7, 1.5);
      const freqTarget = 120 + (freqProximity * 80);
      this.oscillator.frequency.value = freqTarget;
    } else if (this.oscillator) {
      this.oscillator.frequency.value = 120;
    }
  }

  resetProximity() {
    if (!this.isPlaying) return;
    
    // Don't reset inactivity here - mouse might still be moving elsewhere
    this.targetVolume = this.baseVolume;
    if (this.oscillator) {
      this.oscillator.frequency.value = 120;
    }
  }

  private resetInactivityTimer() {
    // Clear existing timeout
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    
    // Set new timeout
    this.inactivityTimeout = setTimeout(() => {
      // Check if there's been ANY activity in the last INACTIVITY_DELAY ms
      const timeSinceLastActivity = Date.now() - this.lastActivityTime;
      
      if (timeSinceLastActivity >= this.INACTIVITY_DELAY && !this.isInactive && this.isPlaying) {
        console.log('💤 No mouse movement for 2 seconds - starting fade out');
        this.isInactive = true;
        this.inactivityFadeStart = Date.now();
      }
    }, this.INACTIVITY_DELAY);
  }

  forceStop() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
    this.stop();
  }

  stop() {
    this.isPlaying = false;
    
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (!this.oscillator || !this.gainNode || !this.audioContext) {
      this.cleanup();
      return;
    }
    
    // Fade out
    try {
      this.gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        this.audioContext.currentTime + 0.5
      );
    } catch (error) {
      console.error('Error during fade out:', error);
    }
    
    // Close after fade out
    setTimeout(() => {
      try {
        this.oscillator?.stop();
        if (this.audioContext) {
          this.audioContext.close().catch((error: Error) => {
            console.error('Error closing audio context:', error);
          });
        }
      } catch (error) {
        console.error('Error stopping oscillator:', error);
      } finally {
        this.cleanup();
      }
    }, 500);
  }

  private cleanup() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isInactive = false;
    this.inactivityFadeStart = 0;
  }
}

export const crtHum = new CRTHum();