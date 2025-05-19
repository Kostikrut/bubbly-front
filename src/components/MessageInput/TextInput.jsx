function TextInput({ value, onChange, disabled, inputRef }) {
  return (
    <input
      ref={inputRef}
      type="text"
      className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:outline-none"
      placeholder="Type a message..."
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default TextInput;
