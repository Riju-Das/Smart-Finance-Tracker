import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

function RegisterPage() {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  async function onSubmit(data) {
    try{
      const res = await api.post("/register", data)
      navigate("/login")
    }
    catch(err){
      console.error(err);
      alert(err.response?.data?.message || "Registration failed" )
    }
  }

  return (
  <div className="  min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-2 overflow-y-auto">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
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
            <Label htmlFor="fullname">fullname</Label>
            <Input
              required
              id="fullname"
              placeholder="Fullname"
              type="text"
              {...register("fullname",
                {
                  maxLength: { value: 20, message: "Max 20 characters" },
                  minLength: { value: 3, message: "Min 3 characters" },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Only letters allowed"
                  }
                })
              }
            />
            {errors.fullname && <span className="text-red-500 text-xs">{errors.fullname.message}</span>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-7">
            <Label htmlFor="email">Email Address</Label>
            <Input
              required
              id="email"
              placeholder="Enter your email"
              type="email"
              {...register("email",
                {

                  maxLength: { value: 40, message: "Max 40 characters" },
                  minLength: { value: 5, message: "Min 5 characters" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })
              }
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
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

          <LabelInputContainer className="mb-7">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              required
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              {...register("confirmPassword",
                {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match"
                }
              )
              }
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
          </LabelInputContainer>


          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          <div className="w-full text-center">
            <Link to="/login" className=" text-white">
              Already have an account? Log in
            </Link>
          </div>

        </form>
      </div>
    </div>

  )
}
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
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default RegisterPage