import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center">
      <div className="w-full max-h-screen overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  )
}
