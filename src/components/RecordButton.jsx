import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export const RecordButton = ({ onSubmit, busy }) => {
  const { t } = useApp();
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState("idle"); // idle | granted | denied
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
      setSupported(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermission("granted");

      // iOS Safari only supports audio/mp4. Pick a supported mimeType.
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4;codecs=mp4a.40.2",
        "audio/mp4",
        "audio/aac",
      ];
      let chosen = "";
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
        chosen = candidates.find((c) => MediaRecorder.isTypeSupported(c)) || "";
      }
      const mr = chosen ? new MediaRecorder(stream, { mimeType: chosen }) : new MediaRecorder(stream);
      mediaRecRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const type = mr.mimeType || chosen || "audio/webm";
        const b = new Blob(chunksRef.current, { type });
        setBlob(b);
        setAudioUrl(URL.createObjectURL(b));
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };
      mr.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setPermission("denied");
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    setRecording(false);
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setBlob(null);
    setAudioUrl(null);
    setSeconds(0);
  };

  const analyze = () => {
    if (!blob) return;
    const ext = (blob.type || "").includes("mp4")
      ? "m4a"
      : (blob.type || "").includes("aac")
      ? "aac"
      : "webm";
    const fname = `recording-${new Date().toISOString().replace(/[:.]/g, "-")}.${ext}`;
    onSubmit?.({
      filename: fname,
      durationSeconds: seconds,
      sizeBytes: blob.size,
      mimeType: blob.type,
      source: "record",
    });
  };

  return (
    <div data-testid="record-zone" className="flex flex-col items-center justify-center py-2">
      {!supported && (
        <p className="text-sm text-zinc-400">Recording is not supported in this browser.</p>
      )}

      <div className="relative mb-4">
        {recording && (
          <span className="absolute inset-0 -m-2 rounded-full border border-rose-500/40 animate-ping" aria-hidden="true" />
        )}
        <button
          data-testid="record-button"
          type="button"
          onClick={recording ? stop : start}
          disabled={!supported || busy}
          className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            recording
              ? "bg-rose-600 shadow-[0_0_60px_rgba(244,63,94,0.5)]"
              : "bg-rose-600/90 hover:bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.35)]"
          } disabled:opacity-50`}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {recording ? (
            <Square className="h-8 w-8 text-white fill-white" />
          ) : (
            <Mic className="h-9 w-9 text-white" />
          )}
        </button>
      </div>

      {recording ? (
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-1 h-8 mb-2" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-rose-400/80 wave-bar"
                style={{
                  height: "100%",
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-rose-300">
            {t.record.live}
          </p>
          <p className="font-mono text-2xl text-white mt-1" data-testid="record-timer">
            {formatTime(seconds)}
          </p>
        </div>
      ) : blob ? (
        <div className="flex flex-col items-center w-full">
          <audio
            data-testid="record-playback"
            src={audioUrl}
            controls
            className="w-full max-w-sm rounded-full bg-white/[0.04] border border-white/10"
          />
          <p className="font-mono text-sm text-zinc-400 mt-2">
            {t.record.duration}: {formatTime(seconds)}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              data-testid="record-reset-btn"
              onClick={reset}
              type="button"
              className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-full border border-white/10"
            >
              {t.record.reset}
            </button>
            <button
              data-testid="record-analyze-btn"
              onClick={analyze}
              type="button"
              disabled={busy}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {t.record.analyze}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-heading text-base text-white">{t.record.title}</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">{t.record.subtitle}</p>
        </div>
      )}

      {permission === "denied" && (
        <p className="mt-3 text-xs text-rose-400" data-testid="record-permission-error">
          {t.record.permission_denied}
        </p>
      )}
    </div>
  );
};

const formatTime = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};
