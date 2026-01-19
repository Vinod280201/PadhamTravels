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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginPageImg from "@/assets/loginpageimg1.jpg";

export const RegisterPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const navigate = useNavigate();

  /* Defining the schema for form validation using Zod */
  const formSchema = z
    .object({
      name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
      }),
      email: z.string().email(),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      confirm_password: z.string().min(8, {
        message: "Confirm Password must be at least 8 characters.",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"], // Point error to confirm_password field
    });

  /* Initialising the Form */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  /* Handling form submission of Form */
  const handleForm = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      // Check for the specific 409 Conflict status
      if (response.status === 409) {
        toast("Registration Failed", {
          description: data.message || "User already registered.",
          style: {
            background: "#eb5449",
            color: "white",
          },
        });
        return;
      }

      if (data.status) {
        toast("Registration Status!", {
          description: data.message,
          style: {
            background: "#3ac435",
            color: "white",
          },
        });
        navigate("/login");
      } else {
        toast("Registration Status!", {
          description: data.message,
          style: {
            background: "#eb5449",
            color: "white",
          },
        });
      }
    } catch (error) {
      toast("Registration Status!", {
        description: "Network error. Please check server connection.",
        style: {
          background: "#eb5449",
          color: "white",
        },
      });
    }
  };

  return (
    // MAIN CONTAINER: Flex layout, full height, prevents horizontal scroll
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
          {/* Text Overlay */}
          <div className="h-full flex flex-col pt-10 px-12 lg:px-20">
            <div className="font-semibold text-slate-800 drop-shadow-md space-y-2">
              <p className="text-3xl lg:text-5xl text-shadow-md">Travel</p>
              <p className="text-lg lg:text-3xl text-shadow-md">
                And Explore the World!!
              </p>
              <div className="w-80 border-b-2 border-teal-500 mt-3"></div>
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
        <div className="w-full max-w-md flex flex-col gap-5">
          {/* Header Text */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Welcome To
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Padham Travels
            </h2>
            <p className="text-sm text-gray-600 pt-1">
              Let's get you started on your journey with us!
            </p>
          </div>

          {/* Registration Card */}
          <Card className="w-full shadow-lg shadow-gray-300/50 border">
            <CardContent className="pt-2 sm:pt-4 px-6 sm:px-8 pb-4">
              <h2 className="text-xl font-semibold mb-6 text-center text-slate-800">
                Register Here
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleForm)}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create your password"
                            autoComplete="new-password"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re-enter your password"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button className="w-full h-10 text-md bg-slate-900 hover:bg-slate-800">
                      Register Now
                    </Button>
                  </div>

                  {/* Login Link */}
                  <div className="flex justify-center text-sm mt-4 text-gray-600">
                    <p>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                      >
                        Login now
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
