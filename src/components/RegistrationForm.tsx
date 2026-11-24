"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Availability = {
  count: number;
  max: number;
  remaining: number;
  full: boolean;
};

export default function RegistrationForm() {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    fetch("/api/count")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === "number") setAvailability(data);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push(`/ticket/${data.ticketId}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const full = availability?.full;

  return (
    <form onSubmit={onSubmit} className="reg-form">
      {availability && (
        <p className="slots">
          {full
            ? "Registration closed — all spaces taken"
            : `${availability.remaining} of ${availability.max} spaces left`}
        </p>
      )}

      <div className="grid-2">
        <label>
          <span>First name</span>
          <input
            required
            autoComplete="given-name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            disabled={!!full || loading}
            placeholder="Ada"
          />
        </label>
        <label>
          <span>Last name</span>
          <input
            required
            autoComplete="family-name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            disabled={!!full || loading}
            placeholder="Okon"
          />
        </label>
      </div>

      <label>
        <span>Email</span>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!full || loading}
          placeholder="you@email.com"
        />
      </label>

      <label>
        <span>Phone</span>
        <input
          required
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!!full || loading}
          placeholder="+234..."
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={!!full || loading} className="cta">
        {loading ? "Securing your seat…" : full ? "Sold out" : "Register now"}
      </button>
    </form>
  );
}
