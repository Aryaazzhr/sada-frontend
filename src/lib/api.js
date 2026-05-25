import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 30000,
});

export const detectAudio = async ({ file, filename, durationSeconds, source, sizeBytes, mimeType }) => {
  const form = new FormData();
  form.append("file", file, filename || file.name);
  if (durationSeconds) form.append("duration_seconds", String(durationSeconds));
  if (source) form.append("source", source);
  const { data } = await client.post("/detect", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
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
