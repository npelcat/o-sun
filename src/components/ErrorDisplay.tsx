import { Button } from "@/src/components/Button";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h2 className="text-2xl font-bold text-dark-beige text-center">
        Oups, une erreur est survenue !
      </h2>
      <p className="text-gray-700">{message}</p>
      {onRetry && (
        <Button
          titleButton="Réessayer"
          onClick={onRetry}
          className="px-4 py-2 bg-dark-green text-white rounded-md hover:bg-dark-beige"
        />
      )}
    </div>
  );
};

export default ErrorDisplay;
