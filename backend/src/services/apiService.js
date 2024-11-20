const axios = require("axios");
const crypto = require("crypto");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { ACCESS_KEY, SECRET_KEY, BASE_URL } = require("../config/upbitConfig");

// 인증 헤더 생성
const generateAuthHeaders = (body) => {
  const query = new URLSearchParams(body).toString();
  const hash = crypto.createHash("sha512").update(query).digest("hex");
  const payload = {
    access_key: ACCESS_KEY,
    nonce: uuid.v4(),
    query_hash: hash,
    query_hash_alg: "SHA512",
  };
  const token = jwt.sign(payload, SECRET_KEY);
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// GET 요청
const getRequest = async (endpoint, params = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: generateAuthHeaders(params),
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error in GET request to ${url}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// POST 요청
const postRequest = async (endpoint, body = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await axios.post(url, body, {
      headers: generateAuthHeaders(body),
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error in POST request to ${url}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { getRequest, postRequest };
