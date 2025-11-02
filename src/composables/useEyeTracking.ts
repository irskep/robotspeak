import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable for tracking mouse position and calculating eye pupil transforms
 * @param movementRange - Maximum offset in pixels for pupil movement
 * @returns Computed transform strings for left and right pupils
 */
export function useEyeTracking(movementRange = 12) {
  const rawMouseX = ref(0)
  const rawMouseY = ref(0)
  const mouseX = ref(0.5) // Normalized 0-1
  const mouseY = ref(0.5) // Normalized 0-1
  let animationFrameId: number | null = null

  const handleMouseMove = (e: MouseEvent) => {
    // Store raw mouse position
    rawMouseX.value = e.clientX
    rawMouseY.value = e.clientY
  }

  // Smooth animation loop for 60fps updates
  const updateEyePosition = () => {
    // Normalize and update smooth position
    mouseX.value = rawMouseX.value / window.innerWidth
    mouseY.value = rawMouseY.value / window.innerHeight

    animationFrameId = requestAnimationFrame(updateEyePosition)
  }

  // Calculate pupil offsets using simple linear interpolation
  const leftPupilTransform = computed(() => {
    // Map mouse position to pupil movement range
    const xOffset = (mouseX.value - 0.5) * movementRange
    const yOffset = (mouseY.value - 0.5) * movementRange
    return `translate(${xOffset}, ${yOffset})`
  })

  const rightPupilTransform = computed(() => {
    // Same mapping for right eye
    const xOffset = (mouseX.value - 0.5) * movementRange
    const yOffset = (mouseY.value - 0.5) * movementRange
    return `translate(${xOffset}, ${yOffset})`
  })

  onMounted(() => {
    // Add mouse listener and start animation loop
    window.addEventListener('mousemove', handleMouseMove)
    updateEyePosition() // Start the animation loop
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    leftPupilTransform,
    rightPupilTransform,
  }
}
