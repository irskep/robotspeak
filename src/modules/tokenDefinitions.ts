import type { SoundToken, TokenDefinition } from '@/types/sound'

/**
 * Token definitions for robot sound generation
 * Each token represents a distinct sound type that can be combined into phrases
 */
export const TOKEN_DEFINITIONS: Record<SoundToken, TokenDefinition> = {
  S: {
    token: 'S',
    name: 'Upward Sweep',
    params: {
      wave_type: 0, // Square wave for classic chip sound

      // Envelope - quick attack, medium sustain
      p_env_attack: 0.0,
      p_env_sustain: 0.15,
      p_env_decay: 0.25,
      p_env_punch: 0.2,

      // Frequency - start mid-range, sweep up by about a musical fourth/fifth
      p_base_freq: 0.3,
      p_freq_limit: 0.0,
      p_freq_ramp: 0.08, // Much smaller ramp for controlled sweep (about a fifth)
      p_freq_dramp: 0.0,

      // No vibrato for clean sweep
      p_vib_strength: 0.0,
      p_vib_speed: 0.0,

      // No arpeggiation
      p_arp_mod: 0.0,
      p_arp_speed: 0.0,

      // Square wave duty
      p_duty: 0.5,
      p_duty_ramp: 0.0,

      // No repeat
      p_repeat_speed: 0.0,

      // No phaser
      p_pha_offset: 0.0,
      p_pha_ramp: 0.0,

      // Slight low-pass filter for warmth
      p_lpf_freq: 1.0,
      p_lpf_ramp: 0.0,
      p_lpf_resonance: 0.0,

      // No high-pass filter
      p_hpf_freq: 0.0,
      p_hpf_ramp: 0.0,

      // Volume
      sound_vol: 0.5,
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
