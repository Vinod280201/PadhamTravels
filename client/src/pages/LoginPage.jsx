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

export const LoginPage = () => {
  const baseUrl = "http://localhost:3000";

  const navigate = useNavigate();

  {
    /* Defining the schema for form validation using Zod */
  }
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  {
    /* Initialising the Form */
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  {
    /* Handling form submission of Form */
  }
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
          //for successful registration
          description: data.message,
          style: {
            background: "#3ac435",
            color: "white",
          },
        });
        // If backend returns role, redirect based on role
        const role = data.user?.role;
        if (data.status) {
          if (data.user.role === "admin") {
            navigate("/admin-dashboard"); //Admin dashboard
          } else {
            navigate("/home"); // normal user home
          }
        }
      } else {
        toast("Login Status!", {
          //other non-409 backend failures (e.g., Mongoose Validation Error if 500)
          description: data.message,
          style: {
            background: "#eb5449",
            color: "white",
          },
        });
      }
    } catch (error) {
      // Network/fetch error (e.g., server down)
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
    <div className="grid grid-rows-3 h-screen bg-blue-300">
      <div className="mt-20 sm:mt-50 lg:mt-32 text-center font-bold">
        <h1 className="text-xl sm:text-2xl sm:mb-1">Welcome to</h1>
        <h2 className="text-2xl sm:text-3xl">Padham Travels</h2>
      </div>
      <div className="w-full flex items-center justify-center">
        <Card className="pt-5 w-[275px] sm:w-[400px] shadow-lg shadow-gray-700">
          <CardContent>
            <h2 className="text-lg sm:text-xl font-semibold mb-5 text-center">
              Login Now
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleForm)}>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
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
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-5">
                  <Button className="w-full text-sm sm:text-md">Login</Button>
                </div>
                <div className="flex justify-center text-xs sm:text-sm mt-4">
                  <p>
                    Don't have an account? &nbsp;
                    <Link to="/register" className="underline text-blue-500">
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
  );
};
