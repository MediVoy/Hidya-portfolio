import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import AOS from "aos";
import { TypeAnimation } from "react-type-animation";
import hidayaAsset from "@/assets/hidaya-doctor.jpg";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { format } from "date-fns";
import { apiGet, APPSCRIPT_URL, normalizeBlogPost } from "../lib/api";
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
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

type BlogPost = Record<string, unknown>;

const stats = [
  { value: "3,256", label: "Procedures Logged" },
  { value: "2,073", label: "Glaucoma Laser Interventions" },
  { value: "870", label: "Cataract Surgeries" },
  { value: "12+", label: "Years of Clinical Practice" },
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
    desc: "Systematic evaluation, diagnostic testing and discussion of management options.",
  },
];

const experience = [
  {
    role: "Consultant Ophthalmologist",
    org: "Aravind Eye Hospital, Madurai",
    period: "Oct 2025 – Jun 2026",
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

const faqs = [
  {
    q: "What conditions does Dr. Hidaya treat?",
    a: "Dr. Hidaya's clinical focus is glaucoma (including POAG, PACG and pseudoexfoliation), cataract, and other anterior segment conditions.",
  },
  {
    q: "How do I request an appointment?",
    a: "Use the enquiry form on this page to submit your preferred date and time. A member of the practice will contact you to confirm. The form is for appointment requests only and is not monitored for clinical advice.",
  },
  {
    q: "Do you provide second-opinion consultations for glaucoma?",
    a: "Yes. Please bring your previous reports — OCT, visual fields, IOP readings and current medication list — so the assessment can be repeated from your records.",
  },
  {
    q: "Which surgical procedures are performed?",
    a: "The procedures relevant to your condition are discussed at your consultation and, where surgery is indicated, are performed at a DHA-licensed healthcare facility. This may include phacoemulsification with PCIOL, manual SICS, trabeculectomy, MIGS, glaucoma drainage devices, YAG laser iridotomy and Nd:YAG capsulotomy.",
  },
  {
    q: "Where does the consultation take place?",
    a: "Consultations take place in Dubai, UAE, at a DHA-licensed healthcare facility. This website is an information and appointment-request site and is not itself a healthcare facility. The clinic name, address and booking route are confirmed when your appointment is confirmed.",
  },
  {
    q: "Are post-operative follow-ups included?",
    a: "Yes. A structured follow-up schedule is part of every surgical plan. The schedule and any additional visits are discussed with you before discharge.",
  },
  {
    q: "Can I get medical advice through this website?",
    a: "No. This site does not provide medical advice, diagnosis or treatment, and no clinical decision should be based on information published here. If you have urgent symptoms, contact a DHA-licensed healthcare facility or the Dubai ambulance service on 998.",
  },
];

function Portfolio() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic", offset: 80 });
    AOS.refresh();
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
      <FAQ />
      <BlogSection />
      <Booking />
      <LegalNotice />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["About", "#about"],
    ["Services", "#services"],
    ["Experience", "#experience"],
    ["Blog", "/blog"],
    ["FAQ", "#faq"],
    ["Book", "#book"],
  ] as const;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-xl shadow-soft py-3" : "py-5"
      }`}
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
      <div className="absolute top-20 -left-20 w-96 h-96 gradient-hero opacity-20 animate-blob blur-3xl" />
      <div
        className="absolute bottom-10 right-0 w-[28rem] h-[28rem] bg-gold/30 animate-blob blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div data-aos="fade-right">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            DHA Professional Registration · 81268607
          </span>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] mb-4">
            Dr. Noorul <br />
            <span className="text-gradient">Hidaya</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground font-display mb-4">
            Specialist Ophthalmology
          </p>

          <div className="text-base md:text-lg text-muted-foreground mb-8 h-12 font-display italic">
            <TypeAnimation
              sequence={[
                "Glaucoma",
                1800,
                "Cataract",
                1800,
                "Anterior Segment",
                1800,
                "Ophthalmic Surgery",
                1800,
              ]}
              wrapper="span"
              speed={45}
              repeat={Infinity}
              cursor
            />
          </div>

          <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-xl mb-10">
            More than 12 years of clinical practice in ophthalmology, including fellowship training in
            Glaucoma at Aravind Eye Care System, Madurai. The focus of this practice is the assessment
            and management of glaucoma, cataract and other anterior segment conditions.
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
              alt="Dr. Noorul Hidaya, Specialist Ophthalmology"
              className="relative w-[20rem] md:w-[26rem] aspect-square object-cover rounded-[40%_60%_60%_40%/50%_50%_50%_50%] shadow-elegant animate-float"
            />
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
              <Eye className="w-4 h-4 text-primary" /> 3,256 Logged Procedures
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
              I am a physician registered with the Dubai Health Authority under the title{" "}
              <span className="text-foreground font-medium">Specialist Ophthalmology</span> (DHA
              Unique ID 81268607), practising in Dubai, UAE.
            </p>
            <p>
              My clinical focus is glaucoma, cataract and other anterior segment conditions.
              Fellowship training in Glaucoma was completed at{" "}
              <span className="text-foreground font-medium">Aravind Eye Care System</span>, Madurai,
              where I also trained and worked in general ophthalmology.
            </p>
            <p>
              I hold an MS Ophthalmology with a{" "}
              <span className="text-foreground font-medium">Gold Medal</span> from Madurai Medical
              College, a Fellowship in General Ophthalmology, a Fellowship in Glaucoma, and
              peer-reviewed publications.
            </p>
            <p>
              My personal surgical logbook records 3,256 procedures, including 2,073 glaucoma laser
              interventions, 870 cataract surgeries and 102 combined trabeculectomy procedures.
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
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            The clinical areas below describe Dr. Hidaya's practice. Treatment is planned
            individually, and any procedure is performed at a DHA-licensed healthcare facility in
            Dubai.
          </p>
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
              className={`relative mb-10 md:mb-12 md:w-1/2 ${
                i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"
              }`}
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await fetch(APPSCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, project: "hidaya", action: "create" }),
      });
    } catch {
      //
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
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Request a consultation and a member of the practice will contact you to confirm the date,
            time and location.
          </p>

          <div className="flex gap-3 p-4 rounded-2xl border border-border/60 bg-accent/40 mb-8 text-xs leading-relaxed text-muted-foreground">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <p>
              This website is not a healthcare facility and this form does not provide medical advice
              or an online consultation. It is for appointment requests only. If you have urgent
              symptoms, contact a DHA-licensed healthcare facility or call the Dubai ambulance
              service on <span className="text-foreground font-medium">998</span>.
            </p>
          </div>

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
                <div className="text-muted-foreground">Dubai, UAE — DHA-licensed facility</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 text-xs leading-relaxed text-muted-foreground">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <p>
                Clinical care is delivered at a DHA-licensed healthcare facility. The specific clinic
                and its address are confirmed at the time your appointment is confirmed.
              </p>
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

          <div className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              name="consent"
              required
              id="consent"
              className="mt-0.5 w-4 h-4 rounded border-input accent-primary shrink-0"
            />
            <label htmlFor="consent" className="cursor-pointer">
              I consent to the practice using these details to arrange and confirm my appointment.
              Please do not include detailed medical information in the message field — this form
              cannot provide medical advice, and it is not monitored for urgent requests.
            </label>
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
}: { label: string; name: string; type?: string } & InputHTMLAttributes<HTMLInputElement>) {
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
                    className={`w-5 h-5 text-primary transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const json = await apiGet("?action=getBlogs");
        const all = Array.isArray(json.blogs) ? json.blogs.map(normalizeBlogPost) : [];

        const filtered = all
          .filter(
            (post) =>
              String(post.Project || "").toLowerCase() === "hidya" &&
              String(post.Status || "").toLowerCase() === "published",
          )
          .sort((a, b) => {
            const aTime = new Date(String(a["Published Date"] || "")).getTime() || 0;
            const bTime = new Date(String(b["Published Date"] || "")).getTime() || 0;
            return bTime - aTime;
          })
          .slice(0, 3);

        if (!cancelled) setPosts(filtered);
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) AOS.refresh();
  }, [loading]);

  if (loading) {
    return (
      <section id="blog" className="py-20 px-6">
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
          {posts.map((p, i) => (
            <Link
              key={String(p.Slug || p.Title || i)}
              to="/blog/$slug"
              params={{ slug: String(p.Slug) }}
              className="group block bg-card border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              {!!p["Cover Image URL"] && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={String(p["Cover Image URL"])}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                  />
                </div>
              )}

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  {!!p.Author && (
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {String(p.Author)}
                    </span>
                  )}
                  {!!p["Published Date"] && (
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(String(p["Published Date"]))}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold group-hover:text-primary transition">
                  {String(p.Title)}
                </h3>

                {!!p.Excerpt && (
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

function LegalNotice() {
  return (
    <section id="notice" className="py-16 px-6">
      <div className="max-w-4xl mx-auto" data-aos="fade-up">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-8">Important information</h2>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-foreground font-medium mb-1.5">Not a healthcare facility</h3>
            <p>
              This website is published by Dr. Noorul Hidaya for general information and appointment
              requests. It is not a healthcare facility, and it does not provide teleconsultation,
              diagnosis, treatment or medical advice. Clinical care is provided at a DHA-licensed
              healthcare facility in Dubai, UAE.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-medium mb-1.5">Professional registration</h3>
            <p>
              Dr. Noorul Hidaya is registered with the Dubai Health Authority as a Physician under the
              title <span className="text-foreground">Specialist Ophthalmology</span>, DHA Unique ID
              81268607. A professional registration is not in itself a permit to practise; clinical
              practice takes place at a DHA-licensed healthcare facility. Information published here
              should not be relied on to verify an individual's registration status — please verify
              directly with the Dubai Health Authority.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-medium mb-1.5">No guarantees of outcome</h3>
            <p>
              Information on this site is general and does not constitute a promise, guarantee or
              indication of any particular result, recovery time or visual outcome. Every patient's
              condition and management differs, and decisions about your care are made only after a
              consultation at the facility.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-medium mb-1.5">Urgent care</h3>
            <p>
              This site is not monitored for urgent or emergency requests. If you have urgent
              symptoms, contact a DHA-licensed healthcare facility or call the Dubai ambulance
              service on <span className="text-foreground">998</span>.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-medium mb-1.5">Your details</h3>
            <p>
              Details submitted through the appointment form are used only to arrange and confirm your
              appointment, and are not stored on this device or used for marketing. See the{" "}
              <Link
                to="/privacy"
                className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              for how your data is handled, how to request a copy or deletion, and the terms governing
              use of this site.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-medium mb-1.5">Third-party references</h3>
            <p>
              Aravind Eye Care System, Vasan Eye Care Hospital, Dr J A Batcha Polyclinic and Madurai
              Medical College are named as prior places of training and work only. Their branding and
              names are not used to imply endorsement or affiliation with this website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="font-display text-lg text-foreground">
          Dr. Noorul Hidaya<span className="text-gradient">.</span>
        </div>
        <div className="text-center md:text-right">
          <div>
            Specialist Ophthalmology · DHA Unique ID 81268607
          </div>
          <div className="text-xs mt-1">
            © {new Date().getFullYear()} · Dubai, UAE ·{" "}
            <a href="#notice" className="underline underline-offset-2 hover:text-foreground">
              Important information
            </a>{" "}
            ·{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy
            </Link>{" "}
            ·{" "}
            <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
