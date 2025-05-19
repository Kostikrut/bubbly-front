import { useEffect, useRef, useState } from "react";
import { Mic, Disc } from "lucide-react";

function VoiceRecorderButton({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!isRecording) return;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          stopStream();
          clearInterval(timerRef.current);

          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecordingComplete(blob);
        };

        mediaRecorder.start();

        // Start timer
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        // Stop after 60s
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 60000);
      } catch (err) {
        console.error("Microphone access denied:", err);
        onRecordingComplete(null);
        setIsRecording(false);
      }
    };

    startRecording();
  }, [isRecording, onRecordingComplete]);

  // stop the mic streeam after the recording is done
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const cancelRecording = () => {
    clearInterval(timerRef.current);
    stopStream();

    chunksRef.current = [];
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    onRecordingComplete(null);
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
        </span>
        <button type="button" className="btn mx-3 btn-outline bg-blue-700 btn-sm" onClick={cancelRecording}>
          <Disc size={18} className="mr-1" />
          End Recording
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-circle btn-sm text-zinc-500"
      onClick={() => setIsRecording(true)}
      disabled={disabled}
    >
      <Mic size={20} />
    </button>
  );
}

export default VoiceRecorderButton;
