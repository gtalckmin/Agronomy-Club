import Link from 'next/link'
import {
  Sprout,
  Users,
  Gamepad2,
  MapPin,
  Trophy,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Leaf,
  Microscope,
  Globe2,
} from 'lucide-react'

const features = [
  {
    icon: Sprout,
    title: 'Purpose',
    description: 'Learn about our mission to champion sustainable agriculture and innovative agronomy research.',
    href: '/about',
  },
  {
    icon: Users,
    title: 'Community Posts',
    description: 'Share updates, ask questions, and celebrate wins with agronomy peers around the globe.',
    href: '/community',
  },
  {
    icon: Gamepad2,
    title: 'Educational Games',
    description: 'Interactive games that make crop science, soil health, and climate-smart farming fun to learn.',
    href: '/games',
  },
  {
    icon: MapPin,
    title: 'Chapters',
    description: 'Browse university chapters, meet local leaders, and start a new branch in your region.',
    href: '/chapters',
  },
  {
    icon: Trophy,
    title: 'Competitions',
    description: 'Join agronomic challenges, research showcases, and field trials with national visibility.',
    href: '/competitions',
  },
  {
    icon: BookOpen,
    title: 'Study Materials',
    description: 'Download curated guides, lab templates, and lecture decks for coursework and outreach.',
    href: '/resources',
  },
  {
    icon: GraduationCap,
    title: 'Alumni Network',
    description: 'Connect with alumni mentors working in agribusiness, research institutions, and NGOs.',
    href: '/alumni',
  },
  {
    icon: MessageSquare,
    title: 'User Accounts',
    description: 'Sign in to personalize your dashboard, track progress, and manage chapter involvement.',
    href: '/account',
  },
]

const impactMetrics = [
  { label: 'Chapters launched', value: '48', icon: MapPin },
  { label: 'Active members', value: '2,300+', icon: Users },
  { label: 'Field trials supported', value: '125', icon: Microscope },
  { label: 'Countries represented', value: '17', icon: Globe2 },
]

const testimonials = [
  {
    quote:
      'The Agronomy Club helped our team secure research funding and connect with agribusiness mentors. We turned classroom theory into a viable regenerative farming pilot.',
    name: 'Amelia Torres',
    role: 'Chapter President, UC Davis',
  },
  {
    quote:
      'Our alumni mentors guided us through our first soil health hackathon, leading to internships with partners tackling climate resilience in the corn belt.',
    name: 'Noah Adjei',
    role: 'Research Fellow, Midwest Alliance',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="uppercase tracking-widest text-green-200 font-semibold mb-4">
            Cultivating Tomorrow&apos;s Agricultural Leaders
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Agronomy Club
          </h1>
          <p className="text-lg md:text-2xl text-green-100 mb-10">
            We equip students, researchers, and professionals with the tools, community, and inspiration to
            transform global food systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-lg font-semibold text-green-800 shadow-sm transition hover:bg-green-50"
            >
              Explore Our Mission
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Grow with Eight Core Experiences</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Every Agronomy Club experience is designed to blend scientific rigor with hands-on learning and
            collaborative leadership opportunities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-green-700 group-hover:text-green-800">
                Discover more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Why Agronomy Club?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We champion interdisciplinary collaboration and equip members with leadership, research, and
                communication skills. From soil science to data-driven agritech, our programming grows alongside the
                needs of modern agriculture.
              </p>
              <ul className="mt-6 space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                  Mentor-led pathways for research and professional development.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                  Access to national competitions, scholarships, and internship placements.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                  Inclusive community built on sustainable values and scientific curiosity.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-green-50 p-6 shadow-inner">
              <h3 className="text-2xl font-semibold text-green-900">Upcoming Highlights</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-green-100 bg-white p-4">
                  <p className="text-sm uppercase tracking-wide text-green-600">November</p>
                  <p className="mt-1 font-semibold text-gray-900">Regenerative Agriculture Hackathon</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Collaborate with agritech mentors to design data-driven soil health solutions.
                  </p>
                </div>
                <div className="rounded-lg border border-green-100 bg-white p-4">
                  <p className="text-sm uppercase tracking-wide text-green-600">January</p>
                  <p className="mt-1 font-semibold text-gray-900">Winter Agronomy Webinar Series</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Weekly expert-led sessions on precision irrigation, crop genetics, and market trends.
                  </p>
                </div>
                <div className="rounded-lg border border-green-100 bg-white p-4">
                  <p className="text-sm uppercase tracking-wide text-green-600">Year-round</p>
                  <p className="mt-1 font-semibold text-gray-900">Field Immersion Scholarships</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Apply for sponsored travel to partner farms and research centers across the country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-700/95">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center">Impact that scales from campus to field</h2>
          <p className="mt-4 text-center text-brand-100">
            Our network pairs scientific rigor with community priorities to accelerate better growing seasons around the world.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-brand-500/40 bg-brand-800/50 p-6 text-center shadow-card"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/60 text-brand-100">
                  <metric.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-white">{metric.value}</p>
                <p className="mt-2 text-sm uppercase tracking-wide text-brand-200">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">What members are saying</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="relative overflow-hidden rounded-2xl border border-brand-200 bg-white/90 p-8 shadow-sm"
              >
                <Leaf className="absolute -top-6 -right-6 h-16 w-16 text-brand-100" aria-hidden="true" />
                <blockquote className="relative text-base text-gray-700">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-brand-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-tight text-brand-600">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to design the future of agriculture?</h2>
          <p className="mt-4 text-lg text-green-100">
            Join the Agronomy Club to access exclusive programs, meet mentors in the agri-food sector, and build a
            portfolio that impacts global food security.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-800 shadow-md transition hover:bg-green-50"
            >
              Create an Account
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Visit Community Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}