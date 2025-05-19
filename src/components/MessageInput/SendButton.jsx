import { Send, Loader2 } from "lucide-react";

function SendButton({ isDisabled, isSending }) {
  return (
    <button type="submit" className="btn bg-blue-600 h-10 min-h-0" disabled={isDisabled}>
      {isSending ? <Loader2 className="animate-spin size-5" /> : <Send size={22} />}
    </button>
  );
}

export default SendButton;
