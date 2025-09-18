export default function TimerDisplay({ countdown }) {
  return <p className="status-message">{countdown > 0 ? `⏱ Expires in ${countdown}s` : "⏱ QR not started"}</p>;
}