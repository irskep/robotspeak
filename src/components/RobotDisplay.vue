<script setup lang="ts">
defineProps<{
  leftPupilTransform: string
  rightPupilTransform: string
}>()
</script>

<template>
  <div class="Robot">
    <svg viewBox="-100 -10 200 210">
      <!-- Define clip path for angular body -->
      <defs>
        <clipPath id="body-clip">
          <path d="M -85 55 L 95 55 L 95 185 L 85 195 L -85 195 L -95 185 L -95 65 Z" />
        </clipPath>
      </defs>

      <!-- Antenna with base socket -->
      <g class="robot-antenna">
        <!-- Antenna base/socket -->
        <rect
          x="-10"
          y="40"
          width="20"
          height="15"
          fill="var(--robot-detail)"
          stroke="var(--robot-antenna)"
          stroke-width="2"
        />
        <!-- Single continuous line from socket to tip -->
        <path
          d="M 0 40 L 0 20 Q 15 10 30 5"
          stroke="var(--robot-antenna)"
          stroke-width="3"
          fill="none"
        />
        <!-- Antenna tip -->
        <circle cx="30" cy="5" r="6" fill="var(--robot-antenna)" />
      </g>

      <!-- Body using path for angular corners -->
      <path
        d="M -85 55 L 95 55 L 95 185 L 85 195 L -85 195 L -95 185 L -95 65 Z"
        fill="var(--robot-body)"
        stroke="var(--robot-body-stroke)"
        stroke-width="3"
      />

      <!-- Top panel line -->
      <line x1="-95" y1="75" x2="95" y2="75" stroke="var(--robot-detail)" stroke-width="1" />

      <!-- Eyes Group -->
      <g class="robot-eyes">
        <!-- Left eye outer -->
        <circle
          cx="-45"
          cy="95"
          r="22"
          fill="var(--robot-eye)"
          stroke="var(--robot-eye-stroke)"
          stroke-width="3"
        />
        <!-- Left eye pupil -->
        <rect
          x="-52"
          y="88"
          width="14"
          height="14"
          fill="var(--robot-eye-stroke)"
          :transform="leftPupilTransform"
        />

        <!-- Right eye outer -->
        <circle
          cx="45"
          cy="95"
          r="22"
          fill="var(--robot-eye)"
          stroke="var(--robot-eye-stroke)"
          stroke-width="3"
        />
        <!-- Right eye pupil -->
        <rect
          x="38"
          y="88"
          width="14"
          height="14"
          fill="var(--robot-eye-stroke)"
          :transform="rightPupilTransform"
        />
      </g>

      <!-- Tech details -->
      <g class="robot-details">
        <!-- Side vents -->
        <rect x="-90" y="85" width="8" height="3" fill="var(--robot-detail)" />
        <rect x="-90" y="92" width="8" height="3" fill="var(--robot-detail)" />
        <rect x="-90" y="99" width="8" height="3" fill="var(--robot-detail)" />

        <rect x="82" y="85" width="8" height="3" fill="var(--robot-detail)" />
        <rect x="82" y="92" width="8" height="3" fill="var(--robot-detail)" />
        <rect x="82" y="99" width="8" height="3" fill="var(--robot-detail)" />

        <!-- Bottom bolts -->
        <circle cx="-75" cy="185" r="3" fill="var(--robot-detail)" />
        <circle cx="75" cy="185" r="3" fill="var(--robot-detail)" />
      </g>
    </svg>
    <div class="Robot__Mouth">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.Robot {
  width: var(--width-robot);
  max-width: var(--max-width-robot);
  margin: 0 auto;
  position: relative;
  aspect-ratio: var(--aspect-ratio-robot);
}

.Robot svg {
  width: 100%;
  height: 100%;
}

.Robot__Mouth {
  --mouth-bottom-offset: 10%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: var(--mouth-bottom-offset);
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

/* Robot eyes - no animation, just bright */
.robot-eyes circle {
  --eye-brightness: 1.2;
  filter: brightness(var(--eye-brightness)); /* Always bright */
}

/* Eye tracking - no transition needed with requestAnimationFrame */
.robot-eyes rect {
  will-change: transform; /* Hint for GPU acceleration */
}

/* Antenna always glowing */
.robot-antenna circle {
  --antenna-glow-size: 8px;
  filter: drop-shadow(0 0 var(--antenna-glow-size) var(--color-primary));
}
</style>
