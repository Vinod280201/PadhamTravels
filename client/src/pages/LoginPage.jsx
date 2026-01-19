import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginPageImg from "@/assets/loginpageimg1.jpg";

export const LoginPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";

  /* Defining the schema for form validation using Zod */
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  /* Initialising the Form */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* Handling form submission of Form */
  const handleForm = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.status) {
        toast("Login Status!", {
          description: data.message,
          style: {
            background: "#3ac435",
            color: "white",
          },
        });

        // If backend returns role, redirect based on role
        const role = data.user?.role;
        const user = { email: data.email, role: data.role };
        localStorage.setItem("authUser", JSON.stringify(user));

        // redirect logic using `from`
        if (role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast("Login Status!", {
          description: data.message,
          style: {
            background: "#eb5449",
            color: "white",
          },
        });
      }
    } catch (error) {
      toast("Login Status!", {
        description: "Network error. Please check server connection.",
        style: {
          background: "#eb5449",
          color: "white",
        },
      });
    }
  };

  return (
    // MAIN CONTAINER: Flex layout, full height
    <div className="min-h-screen w-full flex bg-sky-100 overflow-hidden">
      {/* LEFT SIDE: Image Section 
          - Hidden on mobile (hidden)
          - Visible on tablet/desktop (md:block)
          - Width 50% on desktop (w-1/2)
      */}
      <div className="hidden md:block md:w-1/2 relative">
        <div
          className="absolute inset-0 h-full w-full object-cover bg-cover bg-no-repeat bg-center md:rounded-r-[3rem] border-r-4 border-white shadow-2xl z-10"
          style={{ backgroundImage: `url(${LoginPageImg})` }}
        >
          {/* Text Overlay on Image */}
          <div className="h-full flex flex-col pt-8 px-12 lg:px-20">
            <div className="font-semibold text-slate-800 drop-shadow-md space-y-2">
              <p className="text-3xl lg:text-5xl text-shadow-md">Unlock Your</p>
              <p className="text-3xl lg:text-5xl text-shadow-md">
                Travel Dreams
              </p>
              <p className="text-3xl lg:text-5xl text-shadow-md">With Us!!</p>
              <div className="w-55 border-b-2 border-teal-500 mt-3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Section 
          - Full width on mobile (w-full)
          - Half width on desktop (md:w-1/2)
          - Uses flexbox to center content vertically and horizontally
      */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-6 px-12 sm:p-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Header Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600">
              Please login to your account to continue
            </p>
          </div>

          {/* Login Card */}
          <Card className="w-full shadow-lg shadow-gray-300/50 border">
            <CardContent className="pt-2 sm:pt-4 px-6 sm:px-8 pb-4">
              <h2 className="text-xl font-semibold mb-6 text-center text-slate-800">
                Login Now
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleForm)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button className="w-full h-10 text-md bg-slate-900 hover:bg-slate-800">
                      Login
                    </Button>
                  </div>

                  <div className="flex justify-center text-sm mt-4 text-gray-600">
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                      >
                        Register now
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
