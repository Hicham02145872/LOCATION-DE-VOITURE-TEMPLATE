import {
  Search,
  Calendar,
  Car,
  Shield,
  Headphones,
  Clock,
  CreditCard,
  type LucideProps,
} from "lucide-react"

type IconType = React.ComponentType<LucideProps>

export interface Car {
  slug: string
  name: string
  price: number
  seats: number
  fuel: string
  badge: string
  gradient: string
  color: string
  image: string
  images: string[]
}

export interface Step {
  icon: IconType
  title: string
  desc: string
}

export interface Feature {
  icon: IconType
  title: string
  desc: string
  gradient: string
  iconColor: string
}

export interface Testimonial {
  name: string
  role: string
  avatar: string
  rating: number
  text: string
}

export interface Stat {
  value: string
  label: string
}

export interface PricingPlan {
  name: string
  desc: string
  monthly: number
  yearly: number
  features: string[]
  popular: boolean
}

export interface FaqItem {
  q: string
  a: string
}

export const cars: Car[] = [
  {
    slug: "tesla-model-3",
    name: "Tesla Model 3",
    price: 890,
    seats: 5,
    fuel: "Électrique",
    badge: "Populaire",
    gradient: "from-blue-500/20 to-blue-600/10",
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=85",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=85",
      "https://images.unsplash.com/photo-1536700503339-0e4f1b8e9f3a?w=600&q=85",
    ],
  },
  {
    slug: "bmw-serie-3",
    name: "BMW Série 3",
    price: 750,
    seats: 5,
    fuel: "Essence",
    badge: "Premium",
    gradient: "from-indigo-500/20 to-indigo-600/10",
    color: "#6366f1",
    image: "https://images.unsplash.com/photo-1556189250-72a3a32b1e3e?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1556189250-72a3a32b1e3e?w=600&q=85",
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=85",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&q=85",
    ],
  },
  {
    slug: "mercedes-classe-c",
    name: "Mercedes Classe C",
    price: 820,
    seats: 5,
    fuel: "Diesel",
    badge: "Premium",
    gradient: "from-violet-500/20 to-violet-600/10",
    color: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=85",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&q=85",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=85",
    ],
  },
  {
    slug: "audi-q5",
    name: "Audi Q5",
    price: 950,
    seats: 5,
    fuel: "Hybride",
    badge: "SUV",
    gradient: "from-emerald-500/20 to-emerald-600/10",
    color: "#10b981",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=85",
      "https://images.unsplash.com/photo-1603584173870-7f23fd4c0a67?w=600&q=85",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f64?w=600&q=85",
    ],
  },
  {
    slug: "volkswagen-golf",
    name: "Volkswagen Golf",
    price: 450,
    seats: 5,
    fuel: "Essence",
    badge: "Économique",
    gradient: "from-amber-500/20 to-amber-600/10",
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=85",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=85",
    ],
  },
  {
    slug: "porsche-911",
    name: "Porsche 911",
    price: 2200,
    seats: 2,
    fuel: "Essence",
    badge: "Sport",
    gradient: "from-rose-500/20 to-rose-600/10",
    color: "#f43f5e",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=85",
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85",
      "https://images.unsplash.com/photo-1619682817481-e994891cd75b?w=600&q=85",
    ],
  },
]

export const howItWorks: Step[] = [
  {
    icon: Search,
    title: "Choisissez",
    desc: "Parcourez notre sélection et trouvez le véhicule idéal pour votre trajet.",
  },
  {
    icon: Calendar,
    title: "Réservez",
    desc: "Sélectionnez dates et lieu, finalisez en 2 minutes sans engagement.",
  },
  {
    icon: Car,
    title: "Conduisez",
    desc: "Récupérez votre clé et profitez de la route en toute liberté.",
  },
]

export const features: Feature[] = [
  {
    icon: Shield,
    title: "Assurance tous risques",
    desc: "Couverture complète sans franchise incluse dans chaque location.",
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-600",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    desc: "Une équipe disponible jour et nuit, 7 jours sur 7.",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-600",
  },
  {
    icon: Clock,
    title: "Annulation gratuite",
    desc: "Modifiez ou annulez sans frais jusqu'à 48h avant.",
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-600",
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    desc: "Transactions 100% sécurisées, plusieurs moyens de paiement.",
    gradient: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600",
  },
]

export const testimonials: Testimonial[] = [
  {
    name: "Hicham Altit",
    role: "Voyageur régulier",
    avatar: "HA",
    rating: 5,
    text: "Service exceptionnel ! Réservation simple et rapide. Le véhicule était comme neuf. Je recommande vivement DriveEase.",
  },
  {
    name: "Anwar Moumen",
    role: "Homme d'affaires",
    avatar: "AM",
    rating: 5,
    text: "Je loue régulièrement pour mes déplacements pros. Voitures impeccables, service client réactif. Un gain de temps énorme.",
  },
  {
    name: "Rania Altit",
    role: "Voyageuse familiale",
    avatar: "RA",
    rating: 4,
    text: "Parfait pour les vacances en famille ! SUV spacieux, sièges bébé inclus sans frais. Le rapport qualité-prix est imbattable.",
  },
]

export const stats: Stat[] = [
  { value: "5000+", label: "Véhicules" },
  { value: "98%", label: "Satisfaction" },
  { value: "50+", label: "Agences" },
  { value: "10 ans", label: "d'expérience" },
]

export const pricingPlans: PricingPlan[] = [
  {
    name: "Essentiel",
    desc: "Pour les trajets courts et la ville",
    monthly: 290,
    yearly: 230,
    features: [
      "1 conducteur inclus",
      "100 km/jour inclus",
      "Assurance de base",
      "Support email",
      "Annulation gratuite J-2",
    ],
    popular: false,
  },
  {
    name: "Confort",
    desc: "Pour les voyages et le quotidien",
    monthly: 590,
    yearly: 470,
    features: [
      "2 conducteurs inclus",
      "200 km/jour inclus",
      "Assurance tous risques",
      "Support prioritaire 24/7",
      "Annulation gratuite J-1",
      "Kilométrage illimité le WE",
    ],
    popular: true,
  },
  {
    name: "Premium",
    desc: "Pour le luxe et les grandes occasions",
    monthly: 990,
    yearly: 790,
    features: [
      "3 conducteurs inclus",
      "Kilométrage illimité",
      "Assurance tous risques +",
      "Support dédié 24/7",
      "Annulation gratuite J-1",
      "Véhicule de remplacement",
      "Livraison à domicile",
    ],
    popular: false,
  },
]

export const faqItems: FaqItem[] = [
  {
    q: "Quels documents sont nécessaires pour louer ?",
    a: "Un permis de conduire valide depuis plus d'un an, une pièce d'identité en cours de validité, et un justificatif de domicile de moins de 3 mois. Le conducteur principal doit être âgé d'au moins 21 ans.",
  },
  {
    q: "Comment fonctionne l'assurance ?",
    a: "Toutes nos locations incluent une assurance de base. Avec les formules Confort et Premium, vous bénéficiez d'une couverture tous risques sans franchise. Des options de rachat de franchise sont disponibles à la réservation.",
  },
  {
    q: "Puis-je modifier ou annuler ma réservation ?",
    a: "Oui, l'annulation est gratuite jusqu'à 48h avant le début de la location. Pour les modifications, contactez notre service client qui s'adapte à votre situation.",
  },
  {
    q: "Y a-t-il des frais de kilométrage supplémentaire ?",
    a: "Chaque formule inclut un certain nombre de kilomètres par jour. En cas de dépassement, les frais sont de 1,50DH à 3DH par km supplémentaire selon la catégorie du véhicule. La formule Premium propose le kilométrage illimité.",
  },
  {
    q: "Comment récupérer et rendre le véhicule ?",
    a: "Vous pouvez récupérer votre véhicule dans l'une de nos 50+ agences. Un créneau vous sera proposé à la réservation. La restitution se fait dans la même agence sauf option retour différé.",
  },
]
