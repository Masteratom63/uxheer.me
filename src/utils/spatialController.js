/**
 * Spatial Frame Controller
 * 
 * High-performance, zero-allocation animation bus for 3D spatial camera & section transforms.
 * Decouples continuous 60fps scroll lerping from React component reconciliations.
 * React handles structural UI; this bus drives direct GPU transforms and opacities at 60fps.
 */

let currentScrollRatio = 0;
const subscribers = new Set();

/**
 * Register a callback to receive high-frequency smoothed scrollRatio updates.
 * Immediately invokes callback with current value.
 * Returns unsubscribe function.
 */
export function subscribeSpatial(callback) {
  subscribers.add(callback);
  callback(currentScrollRatio);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Broadcasts smoothed scrollRatio to all registered spatial sections directly.
 * Zero object creation, zero array allocation, pure numerical dispatch.
 */
export function updateSpatial(scrollRatio) {
  currentScrollRatio = scrollRatio;
  for (const callback of subscribers) {
    callback(scrollRatio);
  }
}

/**
 * Read the current scroll ratio synchronously without triggering re-renders.
 */
export function getSpatialRatio() {
  return currentScrollRatio;
}
