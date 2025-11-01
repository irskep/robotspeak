# Robot Sounds Generator - Implementation Plan

## Project Overview

A tool that generates robot sound phrases based on emotional intent (like R2-D2's excited/sad beeps), using Tracery grammar library for pattern generation and sfxr.js for sound synthesis. The UI will feature emotion-based buttons that trigger procedurally generated robot sounds.

## Tech Stack (already set up)

- **Framework**: Vue 3 + TypeScript
- **State Management**: Pinia
- **Sound Synthesis**: sfxr.js
- **Grammar Generation**: tracery-grammar
- **Build Tool**: Vite

## Implementation Steps

### Phase 1: Sound Token Module

**Goal**: Create a module to generate sound signatures and play sounds given a token

**Tasks**:

- Create `src/modules/soundEngine.ts`
  - Define token interface (e.g., 'S' = upward sweep, 's' = downward sweep)
  - Implement sfxr.js integration
  - Create function to map tokens to sfxr parameters
  - Implement playback functionality

**Token Types to Implement**:

- Basic sweeps: 'S' (up), 's' (down)
- Blips: 'b' (short), 'B' (long)
- Chirps: 'c' (low), 'C' (high)
- Warbles: 'w' (slow), 'W' (fast)
- Pauses: '.' (short), '\_' (long)

### Phase 2: Expand Token Variety

**Goal**: Create a wide variety of expressive token types

**Tasks**:

- Extend token vocabulary with more nuanced sounds:
  - Pitch variations (ascending/descending sequences)
  - Rhythm patterns (staccato, legato)
  - Timbral variations (harsh, soft, metallic)
  - Compound tokens (combinations of basic sounds)
- Create parameter presets for consistency
- Test and refine sound quality

### Phase 3: Token Sequence Storage

**Goal**: Store and reuse sound signatures for consistency

**Tasks**:

- Create `src/modules/soundCache.ts`
  - Implement cache for generated sound signatures
  - Map tokens to consistent sound parameters
  - Enable sequence playback with timing
  - Handle repeated tokens with slight variations for organic feel

**Features**:

- Sound signature persistence per session
- Variation system (same token, slight parameter shifts)
- Sequence timing and rhythm management

### Phase 4: Emotion-to-Token Grammar

**Goal**: Use Tracery to generate token sequences from emotions

**Tasks**:

- Create `src/grammars/emotionGrammar.ts`
  - Define emotion categories (happy, sad, excited, angry, curious, etc.)
  - Create Tracery grammar rules for each emotion
  - Map emotion intensity to token selection
  - Implement variation within emotion types

**Grammar Structure Example**:

```javascript
{
  "happy": ["S#upbeat##upbeat#", "C#chirp##chirp#.#chirp#"],
  "upbeat": ["b", "B", "C"],
  "chirp": ["c", "C"],
  // ... more rules
}
```

### Phase 5: Grammar Expansion & UI

**Goal**: Build comprehensive grammar system and user interface

**Tasks**:

- Expand grammar complexity:
  - Add context-aware variations
  - Implement phrase structure (intro-body-outro)
  - Create emotion blending (happy-excited, sad-angry)
  - Add personality traits (timid, bold, quirky)

- Build Vue UI components:
  - Create `src/components/EmotionButton.vue`
  - Design `src/views/SoundBoard.vue` main interface
  - Implement visual feedback during playback
  - Add controls for sound parameters/personality

**UI Features**:

- Grid of emotion buttons
- Visual waveform or animation during playback
- Settings panel for robot personality
- History of recent sounds
- Save/export favorite sounds

## File Structure Plan

```
src/
├── modules/
│   ├── soundEngine.ts      # Core sound synthesis
│   ├── soundCache.ts        # Sound signature storage
│   └── tokenMapper.ts       # Token to sound parameter mapping
├── grammars/
│   ├── emotionGrammar.ts    # Tracery emotion rules
│   └── grammarEngine.ts     # Grammar processing
├── components/
│   ├── EmotionButton.vue    # Individual emotion trigger
│   ├── SoundVisualizer.vue  # Visual feedback
│   └── SettingsPanel.vue    # Configuration UI
├── views/
│   └── SoundBoard.vue       # Main application view
├── stores/
│   └── soundStore.ts        # Pinia store for app state
└── types/
    └── sound.ts             # TypeScript interfaces

```

## Development Approach

1. **Iterative Development**: Start with basic tokens and emotions, expand gradually
2. **Sound-First**: Focus on getting quality sounds before complex UI
3. **Test-Driven**: Create test patterns for each emotion type
4. **User Feedback Loop**: Test with users to refine emotion mappings
5. **Performance**: Optimize sound generation to be responsive

## Success Metrics

- Each emotion produces distinct, recognizable sound patterns
- Sounds feel cohesive within an emotion category
- System generates variety while maintaining consistency
- UI is intuitive and responsive
- Performance allows real-time generation without lag

## Future Enhancements

- **Advanced Features**:
  - Conversation mode (back-and-forth robot dialogue)
  - Emotion transitions (morphing between states)
  - Learning mode (adapt to user preferences)
  - Export/share functionality

- **Technical Improvements**:
  - Web Audio API integration for advanced effects
  - MIDI export capability
  - Voice modulation effects
  - Multi-robot personalities

## Next Steps

1. Set up basic project structure and modules
2. Implement Phase 1 sound token system
3. Create minimal UI with test buttons
4. Iterate on sound quality and token variety
5. Build out grammar system progressively
