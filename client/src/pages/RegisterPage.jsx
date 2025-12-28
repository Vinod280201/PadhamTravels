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
<<<<<<< HEAD
  const baseUrl = "https://padham-travels-api.onrender.com"; //http://localhost:3000
=======
  const baseUrl = "https://padham-travels-api.onrender.com"; //"http://localhost:3000";
>>>>>>> 0c757cfde29f0cbf6dc57e282b86e72388a64d91

  const navigate = useNavigate();

  {
    /* Defining the schema for form validation using Zod */
  }
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
    });

  {
    /* Initialising the Form */
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  {
    /* Handling form submission of Form */
  }
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
        // User already registered scenario
        toast("Registration Failed", {
          description: data.message || "User already registered.",
          style: {
            background: "#eb5449",
            color: "white",
          },
        });
        return; // Stop execution
      }

      if (data.status) {
        toast("Registration Status!", {
          //for successful registration
          description: data.message,
          style: {
            background: "##3ac435",
            color: "white",
          },
        });
        navigate("/login");
      } else {
        toast("Registration Status!", {
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
    <div className="grid grid-cols-2 space-x-5 h-screen bg-sky-100 overflow-x-hidden">
      <div className="rounded-r-4xl border-r-5 ">
        <div
          className="w-full h-full object-cover bg-cover bg-no-repeat bg-center rounded-r-4xl"
          style={{ backgroundImage: `url(${LoginPageImg})` }}
        >
          {" "}
          {/*<img src={LogoImg} className="w-20 h-20 ml-10 pt-5" />*/}
          <div className="font-semibold text-slate-800 pt-20 ml-10">
            <p className="text-3xl sm:text-5xl sm:mb-1 text-shadow-md">
              Travel
            </p>
            <p className="text-lg sm:text-2xl sm:mb-1 text-shadow-md">
              And Explore the World!!
            </p>
            <div className="border-b-2 border-b-teal-500 mr-113"></div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center border-l-3 my-20">
        <div className="pb-4">
          <h1 className="ml-72 font-bold text-xl sm:text-2xl">Welcome To</h1>
          <h2 className="ml-67 font-bold text-xl sm:text-2xl">
            Padham Travels
          </h2>
          <p className="ml-55 mt-2 text-xs sm:text-sm text-gray-600">
            Let's get you started on your journey with us!
          </p>
        </div>
        <div className="w-full flex items-center ml-40">
          <Card className="w-[275px] sm:w-[400px] shadow-lg shadow-gray-700">
            <CardContent>
              <h2 className="text-lg sm:text-xl font-semibold mb-5 text-center">
                Register Here
              </h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleForm)}>
                  <div className="mb-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your name"
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
                              placeholder="Create your password"
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
                  <div className="mb-3">
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
                    <Button className="w-full text-sm sm:text-md">
                      Register Now
                    </Button>
                  </div>
                  <div className="flex justify-center text-xs sm:text-sm mt-4">
                    <p>
                      Already have an account? &nbsp;
                      <Link to="/login" className="underline text-blue-500">
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
