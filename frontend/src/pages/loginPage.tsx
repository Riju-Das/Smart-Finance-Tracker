import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { useEffect } from 'react'

function LoginPage() {

  useEffect(() => {
    document.title = 'Login - Budget Buddy';

  }, []); 

  const navigate = useNavigate()

  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const user = useAuthStore((state) => state.user)

  interface LoginFormType {
    username: string,
    password: number
  }

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<LoginFormType>()

  async function onSubmit(data: LoginFormType) {
    try {
      const res = await api.post("/login", data);
      setAccessToken(res.data.accessToken);
      const userRes = await api.get("/user-detail");
      setUser(userRes.data);
      console.log(userRes.data)
      navigate("/dashboard")
    }
    catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.message || "Login failed";
        if (msg.toLowerCase().includes("password")) {
          setError("password", { type: "manual", message: msg })
        }
        else if (msg.toLowerCase().includes("username")) {
          setError("username", { type: "manual", message: msg })
        }
        else {
          alert(msg)
        }
      }
    }
  }

  return (
    <div className=" min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-2 overflow-y-auto">
      <div className="shadow-input mx-auto w-110 rounded-none bg-white p-4 md:rounded-2xl md:p-10  dark:bg-black">
        <h1 className="text-2xl font-bold text-center my-5 text-neutral-800 dark:text-neutral-200">
          Welcome to Budget Buddy
        </h1>

        <form className="my-8" onSubmit={handleSubmit(onSubmit)}>

          <LabelInputContainer className="mb-7">
            <Label htmlFor="username">username</Label>
            <Input
              required
              id="username"
              placeholder="Username"
              type="text"
              {...register("username",
                {
                  maxLength: { value: 20, message: "Max 20 characters" },
                  minLength: { value: 3, message: "Min 3 characters" },
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9]*$/,
                    message: "Start with a letter, only letters and numbers"
                  }
                })
              }
            />
            {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
          </LabelInputContainer>



          <LabelInputContainer className="mb-7">
            <Label htmlFor="password">Password</Label>
            <Input
              required
              id="password"
              placeholder="••••••••" type="password"
              {...register("password",
                {

                  maxLength: { value: 20, message: "Max 20 characters" },
                  minLength: { value: 8, message: "Min 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Must contain at least one letter and one number"
                  }
                }
              )
              }
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </LabelInputContainer>



          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          <div className="w-full text-center">
            <Link to="/register" className=" text-white hover:text-gray-300 transition ">
              Don't have an account? Sign Up
            </Link>
          </div>

        </form>
      </div>
    </div>

  )
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default LoginPage