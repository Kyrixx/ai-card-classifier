import * as fs from 'fs';
import axios from 'axios';
import * as cliProgress from 'cli-progress';
import * as readline from 'readline'



async function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function doesFileExistsFromEnvVar(envVarName) {
  const path = process.env[envVarName];
  if (!path) {
    console.log(`Environment variable ${envVarName} is not set or is empty.`);
    return false;
  }
  if (!fs.existsSync(path)) {
    console.log(`File does not exist at path: ${path}`);
    return false;
  }

  return true
}

async function checkCardsDatabase() {
  if(!doesFileExistsFromEnvVar('CARDS_DB_PATH')) {
    console.log(`Issue with CARDS_DB_PATH. Value: ${process.env.CARDS_DB_PATH}`);

    const answer = await askQuestion(`Do you want to download the cards database from mtgjson.com? (y/n) [n]`);
    if(answer !== 'y') {
      return;
    }
    const bar = new cliProgress.SingleBar({
      format: 'Downloading card database | {bar} | {percentage}% | {eta}s || {value}/{total} Mo',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    bar.start();
    const file = (await axios.get('https://mtgjson.com/api/v5/AllPrintings.sqlite', {
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable && progressEvent.total) {
          bar.setTotal(progressEvent.total / 1_000_000);
        }
        bar.update(progressEvent.loaded / 1_000_000);
      }
    })).data;
    fs.writeFileSync(process.env.CARDS_DB_PATH ?? './src/assets/cards.sqlite', file);
    console.log('\n\n ✅Cards database downloaded from https://mtgjson.com/api/v5/AllPrintings.sqlite at src/assets/cards.sqlite.');
  }
}

async function checkCardPricesDatabase() {
  if(!doesFileExistsFromEnvVar('CARD_PRICES_DB_PATH')) {
    console.log(`Issue with CARD_PRICES_DB_PATH. Value: ${process.env.CARD_PRICES_DB_PATH}`);

    const answer = await askQuestion(`Do you want to download the prices database from mtgjson.com? (y/n) [n]`);
    if(answer !== 'y') {
      return;
    }
    const bar = new cliProgress.SingleBar({
      format: 'Downloading prices database | {bar} | {percentage}% | {eta}s || {value}/{total} Mo',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    bar.start();
    const file = (await axios.get('https://mtgjson.com/api/v5/AllPricesToday.sqlite', {
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable && progressEvent.total) {
          bar.setTotal(progressEvent.total / 1_000_000);
        }
        bar.update(progressEvent.loaded / 1_000_000);
      }
    })).data;
    bar.stop();
    fs.writeFileSync(process.env.CARD_PRICES_DB_PATH ?? './src/assets/prices.sqlite', file);

    console.log('\n\n ✅Prices database downloaded from https://mtgjson.com/api/v5/AllPricesToday.sqlite at src/assets/price.sqlite.');
  }
}

function checkCollectionDatabase() {
  if(!doesFileExistsFromEnvVar('COLLECTION_DB_PATH')) {
    console.log(`Issue with COLLECTION_DB_PATH. Value: ${process.env.COLLECTION_DB_PATH}`);
    fs.copyFileSync('./src/assets/empty_collection.sqlite', process.env.COLLECTION_DB_PATH ?? './src/assets/collection.sqlite');
  }
}

function checkCertificates() {
  if(!doesFileExistsFromEnvVar('KEY_PATH')) {
    console.log(`Issue with KEY_PATH. Value: ${process.env.KEY_PATH}`);
  }
  if(!doesFileExistsFromEnvVar('CERT_PATH')) {
    console.log(`Issue with CERT_PATH. Value: ${process.env.CERT_PATH}`);
  }
  if (!doesFileExistsFromEnvVar('KEY_PATH') || !doesFileExistsFromEnvVar('CERT_PATH')) {
    console.log('💡 You can disable certificate handling by setting USE_HTTPS to false in your .env file');
  }
}

export const assertAssetsArePresent = async () => {
  await checkCardsDatabase();
  await checkCardPricesDatabase();
  checkCollectionDatabase();
  if(process.env.USE_HTTPS) {
    checkCertificates();
  }
}

assertAssetsArePresent();
