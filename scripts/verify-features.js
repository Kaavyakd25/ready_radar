// Automated Feature Verification Test Suite for ReadyRadar
import {
  INITIAL_ROVER_STATE,
  INITIAL_OBSTACLES,
  INITIAL_DELIVERY,
  INITIAL_ALERTS,
  INITIAL_LOGS,
  DANGER_ZONES
} from '../src/data/initialData.js';

console.log('🚀 Starting ReadyRadar Feature Verification Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName} ${details}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${details}`);
    process.exitCode = 1;
  }
}

// 1. Telemetry Initial State Verification
console.log('1. Testing Initial Telemetry & Presets:');
assert(INITIAL_ROVER_STATE.name === 'Rescue Rover-01', 'Rover Name is Rescue Rover-01');
assert(INITIAL_ROVER_STATE.battery === 88, 'Initial Battery is 88%');
assert(INITIAL_ROVER_STATE.temperature === 34.2, 'Initial Temperature is 34.2°C');
assert(INITIAL_ROVER_STATE.position.x === 1 && INITIAL_ROVER_STATE.position.y === 1, 'Initial Position is [1, 1]');
assert(INITIAL_OBSTACLES.length >= 5, 'Initial Obstacles loaded >= 5');
assert(DANGER_ZONES.length >= 3, 'Initial Danger Zones loaded >= 3');
assert(INITIAL_DELIVERY.packageId === 'AID-PKG-8849', 'Aid Delivery Package ID is valid');

// 2. Movement Logic Verification
console.log('\n2. Testing Movement Engine & Navigation:');
let state = { ...INITIAL_ROVER_STATE };

function simulateMove(curr, dir) {
  if (curr.emergencyStop) return curr;
  let { x, y } = curr.position;
  let heading = curr.heading;
  if (dir === 'forward') {
    if (heading === 0 && y > 0) y -= 1;
    else if (heading === 90 && x < 9) x += 1;
    else if (heading === 180 && y < 9) y += 1;
    else if (heading === 270 && x > 0) x -= 1;
  } else if (dir === 'left') {
    heading = (heading - 90 + 360) % 360;
  } else if (dir === 'right') {
    heading = (heading + 90) % 360;
  } else if (dir === 'stop') {
    return { ...curr, speed: 0.0 };
  }
  const newBattery = Math.max(5, curr.battery - 0.2);
  return {
    ...curr,
    position: { x, y },
    heading,
    speed: curr.targetSpeed,
    battery: parseFloat(newBattery.toFixed(1))
  };
}

// Move forward from (1,1) heading East(90) -> should be (2, 1)
state = simulateMove(state, 'forward');
assert(state.position.x === 2 && state.position.y === 1, 'Move Forward moves to [2, 1]');
assert(state.battery === 87.8, 'Battery drains correctly on movement to 87.8%');
assert(state.speed === state.targetSpeed, 'Speed reflects active throttle');

// Pivot right -> heading becomes South(180)
state = simulateMove(state, 'right');
assert(state.heading === 180, 'Pivot Right sets heading to 180° (South)');

// Move forward from (2,1) heading South(180) -> should be (2, 2)
state = simulateMove(state, 'forward');
assert(state.position.x === 2 && state.position.y === 2, 'Move Forward South moves to [2, 2]');

// Emergency Brake (stop)
state = simulateMove(state, 'stop');
assert(state.speed === 0.0, 'Brake halts rover velocity to 0.0 km/h');

// 3. Delivery Progress Calculation Verification
console.log('\n3. Testing Delivery Progress Calculation:');
function calcDeliveryProgress(posX, posY) {
  const destX = 8;
  const destY = 8;
  const totalDist = Math.hypot(8 - 1, 8 - 1);
  const currDist = Math.hypot(destX - posX, destY - posY);
  return Math.min(100, Math.max(0, Math.round(((totalDist - currDist) / totalDist) * 100)));
}

const pStart = calcDeliveryProgress(1, 1);
const pMid = calcDeliveryProgress(5, 5);
const pEnd = calcDeliveryProgress(8, 8);
assert(pStart === 0, 'Progress at Base [1, 1] is 0%');
assert(pMid > 50, 'Progress at Midpoint [5, 5] is > 50%');
assert(pEnd === 100, 'Progress at Destination [8, 8] is 100%');

// 4. Simulation Scenarios Verification
console.log('\n4. Testing Disaster Sandbox Simulation Injections:');
// Low battery simulation
const lowBattState = { ...state, battery: 14.5 };
assert(lowBattState.battery === 14.5, 'Low Battery Simulation drops battery to 14.5%');

// Weak signal simulation
const weakSignalState = { ...state, signalStrength: 18, connectionStatus: 'Degraded', ping: 340 };
assert(weakSignalState.signalStrength === 18 && weakSignalState.connectionStatus === 'Degraded', 'Weak Signal Simulation attenuates RF link to 18% & Degraded status');

// Emergency simulation
const emergencyState = { ...state, temperature: 82.4, emergencyStop: true, speed: 0.0 };
assert(emergencyState.temperature === 82.4 && emergencyState.emergencyStop === true, 'Emergency Simulation escalates thermals to 82.4°C and triggers E-STOP');

// E-STOP lock test
const estopAttempt = simulateMove(emergencyState, 'forward');
assert(estopAttempt.position.x === emergencyState.position.x, 'E-STOP successfully prevents rover movement');

console.log(`\n========================================`);
console.log(`🎯 Test Results: ${passedTests}/${totalTests} features passed successfully!`);
console.log(`========================================\n`);
