import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 30000,
});

export const detectAudio = async ({ filename, durationSeconds, source, sizeBytes, mimeType }) => {
  const { data } = await client.post("/detect", {
    filename,
    duration_seconds: durationSeconds || 0,
    source: source || "upload",
    size_bytes: sizeBytes || 0,
    mime_type: mimeType || null,
  });
  return data;
};

export const getHistory = async (limit = 50, label) => {
  const params = { limit };
  if (label) params.label = label;
  const { data } = await client.get("/history", { params });
  return data;
};

export const getDetection = async (id) => {
  const { data } = await client.get(`/history/${id}`);
  return data;
};

export const deleteDetection = async (id) => {
  const { data } = await client.delete(`/history/${id}`);
  return data;
};

export const clearHistory = async () => {
  const { data } = await client.delete("/history");
  return data;
};

export const getStats = async () => {
  const { data } = await client.get("/stats");
  return data;
};

export default client;
