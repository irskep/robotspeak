import type { SoundToken, TokenRangeDefinition } from '@/types/sound'

/**
 * Token range definitions for robot sound generation
 * Each token has parameter ranges that are randomized when baking a specific instance
 */
export const TOKEN_RANGES: Record<SoundToken, TokenRangeDefinition> = {
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
      p_freq_dramp: { min: 0.0, max: 0.0 }, // No dramp for sweeps

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
      p_repeat_speed: { min: 0.0, max: 0.2 },

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
  // Future tokens will be added here:
  // s: downward sweep
  // b: short blip
  // B: long blip
  // c: low chirp
  // C: high chirp
  // w: slow warble
  // W: fast warble
  // .: short pause
  // _: long pause
}
