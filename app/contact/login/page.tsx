import LoginForm from "@/src/components/LoginForm";
import TestEmailSender from "../../../tests/TestEmailSender";

const LoginIndex: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-beige mt-24 py-10">
      <main className="flex flex-col items-center justify-center w-5/6 p-6 bg-white  rounded-lg">
        <h2 className="text-3xl text-center p-4 font-subtitle font-bold">
          Connexion
        </h2>
        <LoginForm />
      </main>
      <h1 className="text-2xl mb-4">Test Email Sender</h1>
      <TestEmailSender />
    </div>
  );
};

export default LoginIndex;
