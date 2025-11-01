import type { SoundToken, TokenRangeDefinition } from '@/types/sound'

/**
 * Token range definitions for robot sound generation
 * Each token has parameter ranges that are randomized when baking a specific instance
 */
export const TOKEN_RANGES: Partial<Record<SoundToken, TokenRangeDefinition>> = {
  S: {
    token: 'S',
    name: 'Upward Sweep',
    waveTypes: [/*0, */ 1, 2], // Square, Sawtooth, and Sine waves (no noise)
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - with length variation from short to long
      p_env_attack: { min: 0.05, max: 0.1 },
      p_env_sustain: { min: 0.24, max: 0.48 },
      p_env_decay: { min: 0.05, max: 0.1 },
      p_env_punch: { min: 0.0, max: 0.0 },

      // Frequency - varied for organic sweeps
      // p_base_freq: { min: 0.28, max: 0.35 },
      p_base_freq: { min: 0.2, max: 0.9 },
      p_freq_limit: { min: 0.0, max: 0.0 }, // Could add slight variation if needed
      p_freq_ramp: { min: 0.06, max: 0.2 }, // Controlled sweep range (third to fifth)
      p_freq_dramp: { min: -0.1, max: 0.1 }, // No dramp for sweeps

      // Tiny vibrato for organic feel
      p_vib_strength: { min: 0.0, max: 0.02 }, // Very subtle vibrato
      p_vib_speed: { min: 0.0, max: 0.04 },

      // No arpeggiation
      p_arp_mod: { min: 0.0, max: 0.0 },
      p_arp_speed: { min: 0.0, max: 0.0 },

      // Duty cycle (only affects square wave, but adds variation when that's selected)
      p_duty: { min: 0.45, max: 0.55 },
      p_duty_ramp: { min: -0.01, max: 0.01 }, // Subtle duty cycle movement

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Tiny phaser for depth
      p_pha_offset: { min: 0.0, max: 0.002 }, // Very subtle phaser
      p_pha_ramp: { min: 0.0, max: 0.0 },

      // Slight filter variation for warmth
      p_lpf_freq: { min: 0.95, max: 1.0 }, // Subtle high-freq variation
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.05 }, // Tiny resonance

      // Minimal high-pass for clarity
      p_hpf_freq: { min: 0.0, max: 0.01 }, // Remove very low frequencies
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 }, // Natural volume variation
    },
  },
  s: {
    token: 's',
    name: 'Downward Sweep',
    waveTypes: [1, 2], // Sawtooth and Sine waves (matching upward sweep)
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - with length variation from short to long (same as upward)
      p_env_attack: { min: 0.05, max: 0.1 },
      p_env_sustain: { min: 0.24, max: 0.48 },
      p_env_decay: { min: 0.05, max: 0.1 },
      p_env_punch: { min: 0.0, max: 0.0 },

      // Frequency - start high, sweep down (inverted from upward)
      p_base_freq: { min: 0.2, max: 0.9 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.2, max: -0.06 }, // Negative for downward sweep (flipped from upward)
      p_freq_dramp: { min: -0.1, max: 0.1 },

      // Tiny vibrato for organic feel
      p_vib_strength: { min: 0.0, max: 0.02 },
      p_vib_speed: { min: 0.0, max: 0.04 },

      // No arpeggiation
      p_arp_mod: { min: 0.0, max: 0.0 },
      p_arp_speed: { min: 0.0, max: 0.0 },

      // Duty cycle (only affects square wave, but adds variation when that's selected)
      p_duty: { min: 0.45, max: 0.55 },
      p_duty_ramp: { min: -0.01, max: 0.01 },

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Tiny phaser for depth
      p_pha_offset: { min: 0.0, max: 0.002 },
      p_pha_ramp: { min: 0.0, max: 0.0 },

      // Slight filter variation for warmth
      p_lpf_freq: { min: 0.95, max: 1.0 },
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.05 },

      // Minimal high-pass for clarity
      p_hpf_freq: { min: 0.0, max: 0.01 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  A: {
    token: 'A',
    name: 'Arpeggio Up',
    waveTypes: [0, 1, 2], // Square, Sawtooth, and Sine waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - medium length for arpeggio to be audible
      p_env_attack: { min: 0.05, max: 0.1 },
      p_env_sustain: { min: 0.3, max: 0.5 },
      p_env_decay: { min: 0.1, max: 0.2 },
      p_env_punch: { min: 0.0, max: 0.1 },

      // Frequency - mid to high range with subtle sweep
      p_base_freq: { min: 0.25, max: 0.6 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: 0.03, max: 0.1 }, // Half as drastic as main sweep
      p_freq_dramp: { min: -0.05, max: 0.05 },

      // Tiny vibrato for organic feel
      p_vib_strength: { min: 0.0, max: 0.02 },
      p_vib_speed: { min: 0.0, max: 0.04 },

      // Arpeggio settings - upward 2-note arpeggio
      p_arp_mod: { min: 0.2, max: 0.6 }, // Positive for upward arpeggio
      p_arp_speed: { min: 0.3, max: 0.7 }, // When the step happens

      // Duty cycle variation
      p_duty: { min: 0.45, max: 0.55 },
      p_duty_ramp: { min: -0.01, max: 0.01 },

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Tiny phaser for depth
      p_pha_offset: { min: 0.0, max: 0.002 },
      p_pha_ramp: { min: 0.0, max: 0.0 },

      // Slight filter variation for warmth
      p_lpf_freq: { min: 0.95, max: 1.0 },
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.05 },

      // Minimal high-pass for clarity
      p_hpf_freq: { min: 0.0, max: 0.01 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  a: {
    token: 'a',
    name: 'Arpeggio Down',
    waveTypes: [0, 1, 2], // Square, Sawtooth, and Sine waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - medium length for arpeggio to be audible
      p_env_attack: { min: 0.05, max: 0.1 },
      p_env_sustain: { min: 0.3, max: 0.5 },
      p_env_decay: { min: 0.1, max: 0.2 },
      p_env_punch: { min: 0.0, max: 0.1 },

      // Frequency - mid to high range with subtle downward sweep
      p_base_freq: { min: 0.3, max: 0.7 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.1, max: -0.03 }, // Subtle downward sweep (half as drastic)
      p_freq_dramp: { min: -0.05, max: 0.05 },

      // Tiny vibrato for organic feel
      p_vib_strength: { min: 0.0, max: 0.02 },
      p_vib_speed: { min: 0.0, max: 0.04 },

      // Arpeggio settings - downward 2-note arpeggio
      p_arp_mod: { min: -0.6, max: -0.2 }, // Negative for downward arpeggio
      p_arp_speed: { min: 0.3, max: 0.7 }, // When the step happens

      // Duty cycle variation
      p_duty: { min: 0.45, max: 0.55 },
      p_duty_ramp: { min: -0.01, max: 0.01 },

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Tiny phaser for depth
      p_pha_offset: { min: 0.0, max: 0.002 },
      p_pha_ramp: { min: 0.0, max: 0.0 },

      // Slight filter variation for warmth
      p_lpf_freq: { min: 0.95, max: 1.0 },
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.05 },

      // Minimal high-pass for clarity
      p_hpf_freq: { min: 0.0, max: 0.01 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  B: {
    token: 'B',
    name: 'High Beep',
    waveTypes: [0, 1, 2], // Square, Sawtooth, and Sine waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - short to medium attack, quick decay for beep-like quality
      p_env_attack: { min: 0.0, max: 0.03 },
      p_env_sustain: { min: 0.15, max: 0.3 },
      p_env_decay: { min: 0.1, max: 0.2 },
      p_env_punch: { min: 0.1, max: 0.2 },

      // Frequency - high range for beep
      p_base_freq: { min: 0.6, max: 0.85 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.02, max: 0.04 }, // Light sweep, can go either way
      p_freq_dramp: { min: -0.02, max: 0.02 },

      // Light vibrato for character
      p_vib_strength: { min: 0.0, max: 0.03 }, // Light vibrato
      p_vib_speed: { min: 0.0, max: 0.06 },

      // Light arpeggio for interest
      p_arp_mod: { min: -0.1, max: 0.1 }, // Light arpeggio, can go either direction
      p_arp_speed: { min: 0.4, max: 0.6 }, // Near middle

      // Duty cycle variation
      p_duty: { min: 0.4, max: 0.6 },
      p_duty_ramp: { min: -0.02, max: 0.02 }, // Some movement

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Light phaser for texture
      p_pha_offset: { min: 0.0, max: 0.003 },
      p_pha_ramp: { min: -0.001, max: 0.001 },

      // Filter for clarity in high frequencies
      p_lpf_freq: { min: 0.9, max: 1.0 },
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.1 },

      // Minimal high-pass to keep it clean
      p_hpf_freq: { min: 0.0, max: 0.02 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  b: {
    token: 'b',
    name: 'Low Beep',
    waveTypes: [0, 1, 2], // Square, Sawtooth, and Sine waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - short to medium attack, quick decay for beep-like quality
      p_env_attack: { min: 0.0, max: 0.03 },
      p_env_sustain: { min: 0.15, max: 0.3 },
      p_env_decay: { min: 0.1, max: 0.2 },
      p_env_punch: { min: 0.1, max: 0.2 },

      // Frequency - low range for beep
      p_base_freq: { min: 0.15, max: 0.35 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.02, max: 0.04 }, // Light sweep, can go either way
      p_freq_dramp: { min: -0.02, max: 0.02 },

      // Light vibrato for character
      p_vib_strength: { min: 0.0, max: 0.03 }, // Light vibrato
      p_vib_speed: { min: 0.0, max: 0.06 },

      // Light arpeggio for interest
      p_arp_mod: { min: -0.1, max: 0.1 }, // Light arpeggio, can go either direction
      p_arp_speed: { min: 0.4, max: 0.6 }, // Near middle

      // Duty cycle variation
      p_duty: { min: 0.4, max: 0.6 },
      p_duty_ramp: { min: -0.02, max: 0.02 }, // Some movement

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Light phaser for texture
      p_pha_offset: { min: 0.0, max: 0.003 },
      p_pha_ramp: { min: -0.001, max: 0.001 },

      // Filter for bass frequencies
      p_lpf_freq: { min: 0.7, max: 0.9 }, // More aggressive filter for low beep
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.0, max: 0.15 }, // A bit more resonance for low frequencies

      // Minimal high-pass to keep it clean
      p_hpf_freq: { min: 0.0, max: 0.01 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  w: {
    token: 'w',
    name: 'Warble',
    waveTypes: [0, 1, 2], // Square, Sawtooth, and Sine waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - medium attack and sustain to hear the warble
      p_env_attack: { min: 0.0, max: 0.05 },
      p_env_sustain: { min: 0.2, max: 0.4 },
      p_env_decay: { min: 0.1, max: 0.2 },
      p_env_punch: { min: 0.05, max: 0.15 },

      // Frequency - low-mid range for warbling
      p_base_freq: { min: 0.2, max: 0.5 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.01, max: 0.01 }, // Very slight variation
      p_freq_dramp: { min: -0.01, max: 0.01 },

      // Strong vibrato for warbling effect
      p_vib_strength: { min: 0.15, max: 0.3 }, // Strong vibrato creates warble
      p_vib_speed: { min: 0.15, max: 0.35 }, // Medium speed for warbling (slower than original buzz)

      // No arpeggio
      p_arp_mod: { min: 0.0, max: 0.0 },
      p_arp_speed: { min: 0.0, max: 0.0 },

      // Duty cycle variation for texture
      p_duty: { min: 0.3, max: 0.5 },
      p_duty_ramp: { min: -0.03, max: 0.03 }, // Some movement for texture

      // No repeat
      p_repeat_speed: { min: 0.0, max: 0.0 },

      // Moderate phaser for depth
      p_pha_offset: { min: 0.002, max: 0.006 },
      p_pha_ramp: { min: -0.002, max: 0.002 },

      // Filter to shape the warble
      p_lpf_freq: { min: 0.7, max: 0.95 },
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.05, max: 0.15 }, // Some resonance for character

      // Minimal high-pass
      p_hpf_freq: { min: 0.0, max: 0.02 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  z: {
    token: 'z',
    name: 'Buzz',
    waveTypes: [0, 1, 3], // Square, Sawtooth, and Noise waves
    params: {
      wave_type: 0, // This will be overridden by waveTypes selection

      // Envelope - short bursts for buzzing
      p_env_attack: { min: 0.0, max: 0.02 },
      p_env_sustain: { min: 0.15, max: 0.35 },
      p_env_decay: { min: 0.05, max: 0.1 },
      p_env_punch: { min: 0.1, max: 0.2 },

      // Frequency - low range for buzzy sound
      p_base_freq: { min: 0.1, max: 0.3 },
      p_freq_limit: { min: 0.0, max: 0.0 },
      p_freq_ramp: { min: -0.02, max: 0.02 }, // Slight variation
      p_freq_dramp: { min: -0.01, max: 0.01 },

      // No vibrato (using repeat instead)
      p_vib_strength: { min: 0.0, max: 0.02 },
      p_vib_speed: { min: 0.0, max: 0.05 },

      // No arpeggio
      p_arp_mod: { min: 0.0, max: 0.0 },
      p_arp_speed: { min: 0.0, max: 0.0 },

      // Duty cycle for harshness
      p_duty: { min: 0.15, max: 0.35 }, // Thin duty for harsh buzz
      p_duty_ramp: { min: -0.1, max: 0.1 }, // Rapid changes

      // Strong repeat for buzzing/stuttering effect
      p_repeat_speed: { min: 0.4, max: 0.7 }, // Fast repeat creates buzz

      // Light phaser
      p_pha_offset: { min: 0.0, max: 0.003 },
      p_pha_ramp: { min: -0.001, max: 0.001 },

      // Heavy filtering for buzz shaping
      p_lpf_freq: { min: 0.4, max: 0.7 }, // Heavy low-pass for buzz
      p_lpf_ramp: { min: 0.0, max: 0.0 },
      p_lpf_resonance: { min: 0.15, max: 0.3 }, // Strong resonance

      // Some high-pass to clean up mud
      p_hpf_freq: { min: 0.02, max: 0.05 },
      p_hpf_ramp: { min: 0.0, max: 0.0 },

      // Volume with slight variation
      sound_vol: { min: 0.45, max: 0.55 },
    },
  },
  // Future tokens will be added here:
  // c: low chirp
  // C: high chirp
  // w: slow warble
  // W: fast warble
  // .: short pause
  // _: long pause
}
