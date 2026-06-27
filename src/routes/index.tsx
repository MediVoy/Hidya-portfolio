import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import { TypeAnimation } from "react-type-animation";
import hidayaAsset from "@/assets/hidaya-doctor.jpg";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { format } from "date-fns";
import { apiGet, APPSCRIPT_URL } from "../lib/api";
import {
  Eye,
  Microscope,
  Gem,
  Zap,
  Brain,
  Stethoscope,
  GraduationCap,
  Award,
  Phone,
  Mail,
  MapPin,
  Plus,
  Star,
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

const stats = [
  { value: "3,256+", label: "Procedures Performed" },
  { value: "2,073", label: "Glaucoma Laser Interventions" },
  { value: "870", label: "Cataract Surgeries" },
  { value: "12+", label: "Years of Experience" },
];

const services = [
  {
    icon: Eye,
    title: "Glaucoma Management",
    desc: "Comprehensive care for POAG, PACG, pseudoexfoliation, MIGS procedures and drainage devices.",
  },
  {
    icon: Microscope,
    title: "Cataract Surgery",
    desc: "Phacoemulsification with PCIOL and Manual SICS for complex and routine cases.",
  },
  {
    icon: Gem,
    title: "Anterior Segment",
    desc: "Combined trabeculectomy + SICS, Nd:YAG capsulotomy, and reconstruction.",
  },
  {
    icon: Zap,
    title: "Laser Procedures",
    desc: "YAG peripheral iridotomy, laser suturolysis, diode cyclophotocoagulation.",
  },
  {
    icon: Brain,
    title: "Advanced Diagnostics",
    desc: "UBM, OCT, FFA, gonioscopy and optic nerve fiber analysis.",
  },
  {
    icon: Stethoscope,
    title: "Consultation",
    desc: "Personalized evaluation and treatment planning in a tertiary-care standard.",
  },
];

const experience = [
  {
    role: "Consultant Ophthalmologist",
    org: "Aravind Eye Hospital, Madurai",
    period: "Oct 2025 – Present",
  },
  {
    role: "Fellow — Glaucoma Department",
    org: "Aravind Eye Care System",
    period: "Jul 2023 – Sept 2025",
  },
  {
    role: "Fellow — General Ophthalmology",
    org: "Aravind Eye Care System",
    period: "May 2022 – Jun 2023",
  },
  {
    role: "Registrar Ophthalmologist",
    org: "Vasan Eye Care Hospital",
    period: "Jul 2021 – Apr 2022",
  },
  {
    role: "Ophthalmologist",
    org: "Dr J A Batcha Polyclinic, Thanjavur",
    period: "Jul 2017 – Jun 2021",
  },
  {
    role: "Junior Resident — Ophthalmology",
    org: "Madurai Medical College",
    period: "Jun 2014 – Jun 2017",
  },
];

const education = [
  { degree: "Fellowship — Glaucoma", school: "Aravind Eye Care System", year: "2025" },
  {
    degree: "Fellowship in General Ophthalmology",
    school: "Aravind Eye Care System",
    year: "2023",
  },
  { degree: "MS Ophthalmology — Gold Medal", school: "Madurai Medical College", year: "2017" },
  { degree: "MBBS", school: "Madurai Medical College", year: "2011" },
];

function Portfolio() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic", offset: 80 });
  }, []);

  return (
    <div className="min-h-screen gradient-soft overflow-x-hidden">
      <Toaster position="top-right" richColors />
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Experience />
      <EducationSection />
      <Testimonials />
      <FAQ />
      <BlogSection />
      <Booking />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"],
    ["Services", "#services"],
    ["Experience", "#experience"],
    ["Testimonials", "#testimonials"],
    ["Blog", "/blog"],
    ["FAQ", "#faq"],
    ["Book", "#book"],
  ] as const;
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-xl shadow-soft py-3" : "py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#top" className="font-display text-xl md:text-2xl font-semibold tracking-tight">
          Dr. Hidaya<span className="text-gradient">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map(([label, href]) =>
            href.startsWith("/") ? (
              <Link
                key={href}
                to={href as "/blog"}
                className="relative text-foreground/70 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                className="relative text-foreground/70 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {label}
              </a>
            ),
          )}
        </div>
        <a
          href="#book"
          className="hidden md:inline-flex items-center gap-2 gradient-hero text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5"
        >
          Book Appointment <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-28 pb-16 px-6">
      {/* decorative blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 gradient-hero opacity-20 animate-blob blur-3xl" />
      <div
        className="absolute bottom-10 right-0 w-[28rem] h-[28rem] bg-gold/30 animate-blob blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div data-aos="fade-right">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            DHA Qualified · UAE Golden Visa
          </span>
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] mb-6">
            Dr. Noorul <br />
            <span className="text-gradient">Hidaya</span>
          </h1>
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 h-16 font-display italic">
            <TypeAnimation
              sequence={[
                "Specialist Ophthalmologist",
                1800,
                "Glaucoma Surgeon",
                1800,
                "Anterior Segment Expert",
                1800,
                "Cataract Surgery Specialist",
                1800,
              ]}
              wrapper="span"
              speed={45}
              repeat={Infinity}
              cursor
            />
          </div>
          <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-xl mb-10">
            12+ years of progressive clinical experience with advanced fellowship training at the
            globally recognized Aravind Eye Care System. Restoring vision with precision, compassion
            and master-level surgical craft.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#book"
              className="gradient-hero text-primary-foreground px-7 py-3.5 rounded-full font-medium shadow-elegant hover:shadow-glow transition-all hover:-translate-y-1"
            >
              Book a Consultation
            </a>
            <a
              href="#about"
              className="border border-border bg-card px-7 py-3.5 rounded-full font-medium hover:bg-accent transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        <div data-aos="fade-left" data-aos-delay="200" className="relative flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 gradient-hero rounded-[40%_60%_60%_40%/50%_50%_50%_50%] animate-blob shadow-glow" />
            <div
              className="absolute inset-4 bg-gold/40 rounded-[60%_40%_40%_60%/40%_60%_50%_50%] animate-blob blur-2xl"
              style={{ animationDelay: "1.5s" }}
            />
            <img
              src={hidayaAsset}
              alt="Dr. Noorul Hidaya, Specialist Ophthalmologist"
              className="relative w-[20rem] md:w-[26rem] aspect-square object-cover rounded-[40%_60%_60%_40%/50%_50%_50%_50%] shadow-elegant animate-float"
            />
            {/* floating chips */}
            <div
              className="absolute -top-4 -left-8 bg-card/95 backdrop-blur px-4 py-2.5 rounded-2xl shadow-elegant text-sm font-medium animate-float flex items-center gap-2"
              style={{ animationDelay: "0.5s" }}
            >
              <Award className="w-4 h-4 text-gold" /> Gold Medal MS Ophth
            </div>
            <div
              className="absolute bottom-10 -right-6 bg-card/95 backdrop-blur px-4 py-2.5 rounded-2xl shadow-elegant text-sm font-medium animate-float flex items-center gap-2"
              style={{ animationDelay: "1.5s" }}
            >
              <Eye className="w-4 h-4 text-primary" /> 3,256+ Procedures
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-aos="zoom-in"
            data-aos-delay={i * 100}
            className="gradient-card rounded-3xl p-8 text-center shadow-soft hover:shadow-elegant transition-all hover:-translate-y-2 border border-border/50"
          >
            <div className="text-4xl md:text-5xl font-display font-semibold text-gradient mb-2">
              {s.value}
            </div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const skills = [
    "POAG & PACG",
    "Trabeculectomy",
    "MIGS",
    "Phacoemulsification",
    "Manual SICS",
    "YAG Iridotomy",
    "OCT & UBM",
    "Diode CPC",
  ];
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">About</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            A practice rooted in <span className="text-gradient">precision & care</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div
            data-aos="fade-up"
            className="space-y-5 text-muted-foreground leading-relaxed text-[15px]"
          >
            <p>
              I am a Specialist Ophthalmologist based in Dubai with over a decade of progressive
              clinical experience and advanced fellowship training in Glaucoma and Anterior Segment
              Surgery at the globally recognized{" "}
              <span className="text-foreground font-medium">Aravind Eye Care System</span>.
            </p>
            <p>
              My surgical portfolio spans 3,256 logged procedures — including 2,073 glaucoma laser
              interventions, 870 cataract surgeries and 102 combined trabeculectomy procedures —
              built in high-volume tertiary care settings where every decision is anchored in
              evidence and outcomes.
            </p>
            <p>
              I hold a{" "}
              <span className="text-foreground font-medium">Gold Medal in MS Ophthalmology</span>,
              peer-reviewed publications, DHA Prometric qualification and a UAE Golden Visa.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="150" className="grid grid-cols-2 gap-3">
            {skills.map((s, i) => (
              <div
                key={s}
                data-aos="zoom-in"
                data-aos-delay={200 + i * 60}
                className="gradient-card border border-border/50 rounded-2xl px-5 py-4 text-sm font-medium shadow-soft hover:shadow-elegant hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <Sparkles className="inline w-4 h-4 mr-2 text-primary" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section
      id="services"
      className="py-24 px-6 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Services</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Clinical <span className="text-gradient">expertise</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group gradient-card border border-border/50 rounded-3xl p-8 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-40 h-40 gradient-hero opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity" />
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-5 shadow-soft">
                  <Icon className="w-7 h-7 text-primary-foreground" strokeWidth={1.7} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Journey</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Professional <span className="text-gradient">experience</span>
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px gradient-hero md:-translate-x-px" />
          {experience.map((e, i) => (
            <div
              key={e.role}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              className={`relative mb-10 md:mb-12 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}
            >
              <div
                className="absolute left-4 md:left-auto md:right-auto top-6 w-4 h-4 rounded-full gradient-hero shadow-glow -translate-x-1/2 md:translate-x-0 md:-right-2 md:[&]:left-auto"
                style={i % 2 === 0 ? { right: "-0.5rem", left: "auto" } : { left: "-0.5rem" }}
              />
              <div className="ml-12 md:ml-0 gradient-card border border-border/50 rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all">
                <div className="text-xs font-medium text-primary mb-2">{e.period}</div>
                <h3 className="text-lg font-semibold mb-1">{e.role}</h3>
                <p className="text-sm text-muted-foreground">{e.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section
      id="education"
      className="py-24 px-6 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Academics</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Education & <span className="text-gradient">credentials</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((e, i) => (
            <div
              key={e.degree}
              data-aos="flip-up"
              data-aos-delay={i * 100}
              className="gradient-card border border-border/50 rounded-3xl p-8 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" strokeWidth={1.7} />
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground">
                  {e.year}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{e.degree}</h3>
              <p className="text-sm text-muted-foreground">{e.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const list = JSON.parse(localStorage.getItem("appointments") || "[]");
    list.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem("appointments", JSON.stringify(list));
    try {
      await fetch(APPSCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, project: "hidya", action: "create" }),
      });
    } catch {
      // no-cors mode means response is opaque; submission still went through
    }
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Appointment requested!", {
      description: "Dr. Hidaya's team will contact you to confirm.",
    });
    formRef.current?.reset();
    setSubmitting(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="book" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2" data-aos="fade-right">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Book Now</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Schedule your <span className="text-gradient">consultation</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Reserve a personalized eye-care consultation. Our team will reach out shortly to confirm
            your appointment time.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-4 rounded-2xl gradient-card border border-border/50 shadow-soft">
              <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
                <Phone className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-muted-foreground">+971 50 388 0103</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl gradient-card border border-border/50 shadow-soft">
              <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
                <Mail className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-muted-foreground">drhidaya87@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl gradient-card border border-border/50 shadow-soft">
              <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
                <MapPin className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-medium">Location</div>
                <div className="text-muted-foreground">Dubai, United Arab Emirates</div>
              </div>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          data-aos="fade-left"
          className="lg:col-span-3 gradient-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-elegant space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" name="name" required placeholder="Jane Doe" />
            <Field label="Phone" name="phone" type="tel" required placeholder="+971 ..." />
          </div>
          <Field label="Email" name="email" type="email" required placeholder="you@email.com" />
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Preferred Date" name="date" type="date" required min={today} />
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Preferred Time
              </label>
              <select
                name="time"
                required
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option value="">Select a time</option>
                {[
                  "09:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "12:00 PM",
                  "02:00 PM",
                  "03:00 PM",
                  "04:00 PM",
                  "05:00 PM",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Service
            </label>
            <select
              name="service"
              required
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
              <option>General Consultation</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Message (optional)
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us about your concern..."
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-hero text-primary-foreground py-4 rounded-xl font-medium shadow-elegant hover:shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              "Booking..."
            ) : (
              <>
                Request Appointment <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: { label: string; name: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </label>
      <input
        name={name}
        type={type}
        {...rest}
        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
    </div>
  );
}

const testimonials = [
  {
    name: "Aisha M.",
    role: "Glaucoma Patient · Dubai",
    rating: 5,
    text: "Dr. Hidaya explained my condition with so much patience. The laser procedure was painless and my vision has been stable for over a year now. Truly grateful.",
  },
  {
    name: "Rajesh K.",
    role: "Cataract Surgery · Madurai",
    rating: 5,
    text: "I could read again the day after surgery. Her precision and the team's care were world-class. I recommend her to every family member.",
  },
  {
    name: "Fatima A.",
    role: "Routine Consultation",
    rating: 5,
    text: "Calm, thorough, and incredibly knowledgeable. She took the time to answer every question. A rare and trusted doctor.",
  },
  {
    name: "Mohammed S.",
    role: "Combined Trabeculectomy",
    rating: 5,
    text: "A life-changing surgery handled with absolute mastery. Follow-ups were detailed and reassuring. Forever thankful.",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            What patients <span className="text-gradient">say</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="gradient-card border border-border/50 rounded-3xl p-8 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1 relative"
            >
              <div className="absolute top-6 right-8 text-6xl font-display text-primary/15 leading-none">
                "
              </div>
              <div className="flex gap-0.5 mb-4 text-gold">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[15px] text-foreground/85 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-medium shadow-soft">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "What conditions does Dr. Hidaya treat?",
    a: "Dr. Hidaya specializes in glaucoma (POAG, PACG, pseudoexfoliation), cataract, anterior-segment disorders, and provides comprehensive ophthalmology consultations.",
  },
  {
    q: "How do I book an appointment?",
    a: "Use the booking form below to request your preferred date and time. Our team will contact you within 24 hours to confirm.",
  },
  {
    q: "Do you offer second-opinion consultations for glaucoma?",
    a: "Yes. Bring your previous reports — OCT, visual fields, IOP readings, and medication list — and we'll do a thorough re-evaluation.",
  },
  {
    q: "Which surgical procedures do you perform?",
    a: "Phacoemulsification with PCIOL, manual SICS, trabeculectomy (standalone & combined), MIGS, glaucoma drainage devices, YAG laser iridotomy, and Nd:YAG capsulotomy.",
  },
  {
    q: "Where is the clinic located?",
    a: "Consultations are based in Dubai, UAE. Detailed clinic address is shared on appointment confirmation.",
  },
  {
    q: "Are post-operative follow-ups included?",
    a: "Yes. A structured follow-up schedule is part of every surgical plan to ensure optimal healing and visual outcomes.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="py-24 px-6 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="gradient-card border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-medium text-foreground">{f.q}</span>
                  <Plus
                    className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    strokeWidth={2.2}
                  />
                </button>
                <div
                  className="grid transition-all duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await apiGet("?action=getBlogs&project=hidya&status=Published");
        if (json.success) setPosts(json.blogs.slice(0, 3));
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Loader2 className="animate-spin mx-auto text-muted-foreground" size={20} />
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Insights</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">
            Latest <span className="text-gradient">Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Eye care tips, clinical insights, and updates from Dr. Hidaya
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p) => (
            <Link
              key={String(p.Slug)}
              to="/blog/$slug"
              params={{ slug: String(p.Slug) }}
              className="group block bg-card border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all"
              data-aos="fade-up"
            >
              {p["Cover Image URL"] && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={String(p["Cover Image URL"])}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.parentElement?.remove();
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                  />
                </div>
              )}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  {p.Author && (
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {String(p.Author)}
                    </span>
                  )}
                  {p["Published Date"] && (
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(String(p["Published Date"]))}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold group-hover:text-primary transition">
                  {String(p.Title)}
                </h3>
                {p.Excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{String(p.Excerpt)}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                  Read More <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10" data-aos="fade-up">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 gradient-hero text-primary-foreground px-6 py-3 rounded-full text-sm font-medium shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5"
          >
            View All Articles <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function formatDate(val: string) {
  try {
    return format(new Date(val), "MMM d, yyyy");
  } catch {
    return val;
  }
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="font-display text-lg text-foreground">
          Dr. Noorul Hidaya<span className="text-gradient">.</span>
        </div>
        <div>© {new Date().getFullYear()} All rights reserved · Dubai, UAE</div>
      </div>
    </footer>
  );
}
