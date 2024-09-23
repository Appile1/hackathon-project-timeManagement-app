"use client"
import React, { useState } from "react";
import "./page.css";
import { z } from "zod";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).min(1, "Email address is required"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, clearErrors, setError, reset } = useForm<FormData>(
    {
      resolver: zodResolver(schema)
    }
  );
  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    const res = await fetch('/api/waiting', {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify({
        email: data.email
      })
    })
    if (!res.ok || res.status === 500 || res.status === 409) {
      console.log("error saving email");
      const result = await res.json();
      setError("email", { type: "manual", message: result.message });
    }
    else {

      console.log("email saved to waiting list");
      const result = await res.json();
      setSuccessMessage(result.message)
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
      reset();
    }
    setTimeout(() => {
      clearErrors("email")
    }, 2000)
  }
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Connect with Fellows. Grow Together.</h1>
          <p>
            Join our exclusive community of professionals, build meaningful
            connections, and elevate your career.
          </p>
          <div className="cta-buttons">
            <a href="/signup" className="btn-primary">
              Get Started
            </a>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center">
          <div className=" border-2 py-6 px-4 shadow-md shadow-slate-300 border-white max-w-fit items-center">
            <h1 className="mb-2 font-semibold text-xl ">Join the waiting list</h1>
            <form action="#" onSubmit={handleSubmit(onSubmit)} className=" flex justify-center ">
              <label htmlFor="email"></label>
              <input type="text" {...register("email")} className="py-1 pl-1 border-2 rounded-lg border-slate-400 focus:outline-none focus:border-orange-800 text-black bg- " />
              <button type="submit" className="bg-orange-600 px-2 py-1 ml-1 rounded-md hover:bg-orange-700">Notify Me</button>
            </form>
            {errors.email && <div className='text-red-600 text-sm font-semibold mr-20'>{errors.email.message}</div>}
            {successMessage && <div className='text-green-700 text-sm font-semibold mr-14 mt-1'>{successMessage}</div>}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Why Choose Our Networking Hub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Tailored Connections</h3>
            <p>Find fellows with shared interests, skills, and goals.</p>
          </div>
          <div className="feature-card">
            <h3>Professional Growth</h3>
            <p>Access resources and opportunities to advance your career.</p>
          </div>
          <div className="feature-card">
            <h3>Community Support</h3>
            <p>Engage in meaningful discussions and mentorship.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Fellows Say</h2>
        <div className="testimonials-carousel">
          {/* Add testimonial cards here */}
          <div className="testimonial-card">
            <p>"This platform has been a game-changer for my career!"</p>
            <span>- Jane Doe</span>
          </div>
          <div className="testimonial-card">
            <p>
              "I've made invaluable connections through the Networking Hub."
            </p>
            <span>- John Smith</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <h3>Step 1: Create Your Profile</h3>
            <p>Tell us about your skills, interests, and goals.</p>
          </div>
          <div className="step">
            <h3>Step 2: Connect with Fellows</h3>
            <p>Search and connect with professionals in your field.</p>
          </div>
          <div className="step">
            <h3>Step 3: Collaborate & Grow</h3>
            <p>Engage in projects and discussions to enhance your skills.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
