import { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import setErrorToast from "../../utils/errorToast";
import blobToBase64 from "../../utils/blobToBase64";

// Subcomponents
import EmojiPickerButton from "./EmojiPickerButton";
import ImageUploadButton from "./ImageUploadButton";
import FileAttachmentButton from "./FileAttachmentButton";
import FileAttachmentPreview from "./FileAttachmentPreview";
import VideoUploadButton from "./VideoUploadButton";
import VideoPreview from "./VideoPreview";
import ImagePreview from "./ImagePreview";
import VoicePreview from "./VoicePreview";
import TextInput from "./TextInput";
import SendButton from "./SendButton";
import VoiceRecorderButton from "./VoiceRecorderButton";

function MessageInput({ disabled = false }) {
  const { socket } = useAuthStore();
  const { sendMessage, selectedUser, isShowTyping } = useChatStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const fileAttachmentInputRef = useRef(null);
  const textInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    if (!disabled) setText((prev) => prev + emojiData.emoji);
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    const value = e.target.value;
    setText(value);

    if (!isShowTyping) return;

    if (value.trim()) {
      socket.emit("typing", { toUserId: selectedUser._id });
    } else {
      socket.emit("stopTyping", { toUserId: selectedUser._id });
    }
  };

  const handleImageChange = async (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return setErrorToast(null, "Invalid file type. Please select an image.");

    try {
      const base64 = await blobToBase64(file);
      setImagePreview(base64);
    } catch (err) {
      setErrorToast(err, "Failed to load image.");
    }
  };

  const handleFileChange = async (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await blobToBase64(file);
      setFileData(base64);
      setFileName(file.name);
    } catch (err) {
      setErrorToast(err, "Failed to load file.");
    }
  };

  const handleVideoChange = async (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (!file?.type.startsWith("video/")) {
      setErrorToast(null, "Invalid video file.");
      return;
    }

    try {
      const base64 = await blobToBase64(file);
      setVideoData(base64);
      setVideoUrl(URL.createObjectURL(file));
    } catch (err) {
      setErrorToast(err, "Failed to load video.");
    }
  };

  const removeVideo = () => {
    setVideoData(null);
    setVideoUrl(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    setFileData(null);
    setFileName(null);
    if (fileAttachmentInputRef.current) fileAttachmentInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (disabled || (!text.trim() && !imagePreview && !voiceBlob && !fileData && !videoData)) return;

    try {
      setIsSending(true);

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        voice: voiceBlob ? await blobToBase64(voiceBlob) : null,
        file: fileData,
        video: videoData,
      });

      setText("");
      setImagePreview(null);
      setFileData(null);
      setFileName(null);
      setVoiceBlob(null);
      setAudioURL(null);
      setVideoData(null);
      setVideoUrl(null);

      socket.emit("stopTyping", { toUserId: selectedUser._id });

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (fileAttachmentInputRef.current) fileAttachmentInputRef.current.value = "";
      if (textInputRef.current) textInputRef.current.focus();
    } catch (err) {
      setErrorToast(err, "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
      setTimeout(() => textInputRef.current?.focus(), 1);
    }
  };

  return (
    <div className={`p-4 w-full ${disabled ? "opacity-50 pointer-events-none select-none" : ""}`}>
      <FileAttachmentPreview fileName={fileName} onRemove={removeFile} isSending={isSending} />
      <ImagePreview imageUrl={imagePreview} onRemove={removeImage} isSending={isSending} />
      <VideoPreview videoUrl={videoUrl} onRemove={removeVideo} isSending={isSending} />
      <VoicePreview
        audioURL={audioURL}
        isSending={isSending}
        onRemove={() => {
          setVoiceBlob(null);
          setAudioURL(null);
        }}
      />

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <VoiceRecorderButton
            onRecordingComplete={(blob) => {
              setVoiceBlob(blob);
              if (blob) {
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
              } else {
                setAudioURL(null);
              }
            }}
            disabled={isSending || disabled}
          />

          <EmojiPickerButton onSelect={handleEmojiClick} disabled={isSending || disabled} />

          <TextInput
            inputRef={textInputRef}
            value={text}
            onChange={handleInputChange}
            disabled={isSending || disabled}
            placeholder={disabled ? "You have blocked this user" : "Type a message"}
          />

          <ImageUploadButton
            onChange={handleImageChange}
            fileInputRef={fileInputRef}
            hasImage={!!imagePreview}
            isDisabled={isSending || disabled}
          />

          <FileAttachmentButton
            onClick={() => fileAttachmentInputRef.current?.click()}
            disabled={isSending || disabled}
            hasFile={!!fileData}
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            ref={fileAttachmentInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <VideoUploadButton
          onClick={() => videoInputRef.current?.click()}
          disabled={isSending || disabled}
          hasVideo={!!videoData}
        />

        <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} className="hidden" />

        <SendButton
          isDisabled={disabled || isSending || (!text.trim() && !imagePreview && !voiceBlob && !fileData && !videoData)}
          isSending={isSending}
        />
      </form>
    </div>
  );
}

export default MessageInput;
