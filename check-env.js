const { config } = require('@dotenvx/dotenvx');
const env = config({ path: '.env' }).parsed;
console.log("=== .env ===");
console.log("DB_HOST:", env.DB_HOST);
console.log("DB_PORT:", env.DB_PORT);
console.log("SPRING_PROFILES_ACTIVE:", env.SPRING_PROFILES_ACTIVE);
console.log("PORT:", env.PORT);

const envDev = config({ path: '.env.development' }).parsed;
console.log("=== .env.development ===");
console.log("DB_HOST:", envDev.DB_HOST);
console.log("DB_PORT:", envDev.DB_PORT);
