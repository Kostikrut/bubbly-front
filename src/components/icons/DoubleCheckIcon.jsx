function DoubleCheckIcon({ color = "white", size = 18 }) {
  const bubbleColor = color?.split(" ")[1]?.split("-")[1];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={bubbleColor || color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 8 9 16 5 12" />
      <polyline points="22 8 14 16 11 13" />
    </svg>
  );
}

export default DoubleCheckIcon;
