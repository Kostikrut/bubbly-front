import React from "react";

function MessageBubbleContent({ message, onImageClick, onVideoClick }) {
  return (
    <div className="flex flex-col gap-2 max-w-xs sm:max-w-sm w-full">
      {/* image */}
      {message.image && (
        <img
          src={message.image}
          alt="Attachment"
          className="w-full rounded-md cursor-pointer hover:brightness-90 transition"
          onClick={() => onImageClick?.(message.image)}
        />
      )}

      {/* video */}
      {message.video && (
        <video
          src={message.video}
          controls
          className="w-full rounded-md cursor-pointer hover:brightness-90 transition"
          onClick={() => onVideoClick?.(message.video)}
        />
      )}

      {/* voice */}
      {message.voice && <audio src={message.voice} controls className="w-full rounded-md shadow" />}

      {/* file */}
      {message.file && (
        <a
          href={message.file}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
        >
          📄 Download File
        </a>
      )}

      {/* text */}
      {message.text && <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>}
    </div>
  );
}

export default MessageBubbleContent;
