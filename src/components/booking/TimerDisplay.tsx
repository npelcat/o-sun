interface TimerDisplayProps {
  timeLeft: number;
  isTimeRunningOut: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isTimeRunningOut,
}) => {
  return (
    <div
      className={`mb-6 p-4 rounded-lg border-2 ${
        isTimeRunningOut
          ? "bg-orange-50 border-orange-400 animate-pulse"
          : "bg-blue-50 border-blue-400"
      }`}
    >
      <p className="font-bold text-center">
        ⏱️ Temps restant : {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </p>
      {isTimeRunningOut && (
        <p className="text-sm text-orange-700 text-center mt-1">
          ⚠️ Dépêchez-vous, le créneau sera bientôt libéré !
        </p>
      )}
    </div>
  );
};
