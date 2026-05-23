"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [success, setSuccess] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactValues>();

  async function onSubmit(values: ContactValues) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    setSuccess(`Thanks ${values.name}, your message was recorded for the demo.`);
    reset();
  }

  return (
    <form className="glass rounded-lg p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Name</span>
          <input
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name ? <p className="mt-2 text-sm text-[#f5b84b]">{errors.name.message}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Email</span>
          <input
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 outline-none focus:border-[#f5b84b]"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email ? <p className="mt-2 text-sm text-[#f5b84b]">{errors.email.message}</p> : null}
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#d7d9de]">Message</span>
        <textarea
          className="min-h-36 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 outline-none focus:border-[#f5b84b]"
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters",
            },
          })}
        />
        {errors.message ? <p className="mt-2 text-sm text-[#f5b84b]">{errors.message.message}</p> : null}
      </label>
      <button
        className="mt-5 flex h-12 items-center gap-2 rounded-lg bg-[#f5b84b] px-5 font-bold text-[#08090d] hover:bg-white disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        <Send size={18} />
        Send message
      </button>
      {success ? <p className="mt-4 text-sm text-[#4fb0c6]">{success}</p> : null}
    </form>
  );
}
