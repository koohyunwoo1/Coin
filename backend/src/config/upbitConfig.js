// 업비트 api 키

const config = {
  ACCESS_KEY: process.env.UPBIT_API_KEY,
  SECRET_KEY: process.env.UPBIT_SECRET_KEY,
  BASE_URL: "https://api.upbit.com/v1",
};

console.log(config);

module.exports = config;
