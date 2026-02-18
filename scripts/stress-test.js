// scripts/stress-test.js
// 🔥 Ghost-Buster Stress-Test
// Simuliert künstliche Last auf die API, um Red-Alert-Glow und Safe-Mode zu testen

const axios = require('axios');
const chalk = require('chalk');

// Konfiguration
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const REQUESTS_PER_SECOND = parseInt(process.env.RPS || '500');
const DURATION_SECONDS = parseInt(process.env.DURATION || '30');
const PARALLEL_REQUESTS = 10;

// Stats Tracking
let successCount = 0;
let errorCount = 0;
let rateLimitCount = 0;
let startTime;

console.log(chalk.red.bold('\n🔥 STRESS-TEST INITIALISIERT\n'));
console.log(chalk.yellow('⚠️  WARNUNG: Beobachte den Metallic-Glow deines Frontends!'));
console.log(chalk.cyan(`📊 Target: ${TARGET_URL}`));
console.log(chalk.cyan(`⚡ Rate: ${REQUESTS_PER_SECOND} Requests/Sekunde`));
console.log(chalk.cyan(`⏱️  Duration: ${DURATION_SECONDS} Sekunden\n`));

// Test-Endpunkte
const TEST_ENDPOINTS = [
  '/',
  '/api/health',
  '/api/posts',
  '/api/comments',
];

// Zufälliger Endpunkt auswählen
function getRandomEndpoint() {
  return TEST_ENDPOINTS[Math.floor(Math.random() * TEST_ENDPOINTS.length)];
}

// Einzelne Request ausführen
async function fireRequest() {
  const endpoint = getRandomEndpoint();
  const url = `${TARGET_URL}${endpoint}`;
  
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Ghost-Buster-Stress-Test/1.0',
        'X-Test-Mode': 'stress',
      }
    });
    
    if (response.status === 200) {
      successCount++;
    }
  } catch (error) {
    errorCount++;
    
    // Rate-Limiting erkennen
    if (error.response?.status === 429) {
      rateLimitCount++;
      console.log(chalk.red('🚫 RATE-LIMIT erreicht! Ghost-Buster RLS ist aktiv.'));
    }
  }
}

// Batch von parallelen Requests
async function fireBatch() {
  const promises = Array.from({ length: PARALLEL_REQUESTS }, () => fireRequest());
  await Promise.allSettled(promises);
}

// Stats anzeigen
function printStats() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const total = successCount + errorCount;
  const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;
  
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  const statsLine = [
    chalk.green(`✅ ${successCount}`),
    chalk.red(`❌ ${errorCount}`),
    chalk.yellow(`🚫 ${rateLimitCount}`),
    chalk.cyan(`📊 ${successRate}%`),
    chalk.white(`⏱️ ${elapsed}s`)
  ].join(' | ');
  
  process.stdout.write(statsLine);
}

// Hauptfunktion
async function runStressTest() {
  startTime = Date.now();
  
  console.log(chalk.green.bold('🚀 STRESS-TEST GESTARTET\n'));
  
  // Stats-Interval (jede Sekunde)
  const statsInterval = setInterval(printStats, 1000);
  
  // Test-Interval
  const testInterval = setInterval(async () => {
    await fireBatch();
  }, 1000 / (REQUESTS_PER_SECOND / PARALLEL_REQUESTS));
  
  // Nach DURATION_SECONDS stoppen
  setTimeout(() => {
    clearInterval(testInterval);
    clearInterval(statsInterval);
    
    console.log('\n\n' + chalk.green.bold('✅ STRESS-TEST ABGESCHLOSSEN\n'));
    
    // Final Stats
    const totalRequests = successCount + errorCount;
    const avgRPS = (totalRequests / DURATION_SECONDS).toFixed(1);
    
    console.log(chalk.cyan('📊 FINAL STATISTICS:'));
    console.log(chalk.white(`   Total Requests: ${totalRequests}`));
    console.log(chalk.green(`   Successful: ${successCount}`));
    console.log(chalk.red(`   Failed: ${errorCount}`));
    console.log(chalk.yellow(`   Rate-Limited: ${rateLimitCount}`));
    console.log(chalk.cyan(`   Avg RPS: ${avgRPS}`));
    
    // Bewertung
    console.log('\n' + chalk.magenta.bold('🎯 SYSTEM-BEWERTUNG:'));
    
    if (rateLimitCount > 0) {
      console.log(chalk.green('   ✅ Rate-Limiting funktioniert korrekt'));
    }
    
    if (successCount > 0) {
      console.log(chalk.green('   ✅ System verarbeitet Requests unter Last'));
    }
    
    if (errorCount > successCount) {
      console.log(chalk.yellow('   ⚠️  Hohe Fehlerrate - prüfe Server-Kapazität'));
    }
    
    console.log('\n' + chalk.blue.bold('🧊 PRÜFE JETZT:'));
    console.log(chalk.white('   1. Metallic-Frame sollte von rot zu blau wechseln (Safe-Mode)'));
    console.log(chalk.white('   2. DancingText sollte wieder ruhig werden'));
    console.log(chalk.white('   3. SystemHeartbeat sollte langsamer pulsieren'));
    console.log(chalk.white('   4. Log-Dashboard sollte "SYSTEM COOLING DOWN" anzeigen\n'));
    
    process.exit(0);
  }, DURATION_SECONDS * 1000);
}

// Error Handling
process.on('SIGINT', () => {
  console.log('\n\n' + chalk.yellow.bold('⚠️  STRESS-TEST MANUELL ABGEBROCHEN\n'));
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n❌ UNHANDLED ERROR:'), error.message);
});

// Start
console.log(chalk.cyan('⏳ Starte in 3 Sekunden...\n'));

setTimeout(() => {
  runStressTest();
}, 3000);
