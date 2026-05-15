import { motion } from "framer-motion";
import { Leaf, Heart, TruckIcon, Award } from "lucide-react";

 function About() {
  const values = [
    {
      icon: Leaf,
      title: "Farmer-first linkage",
      description:
        "We spotlight cooperatives and smallholders with transparent listings, regions, and harvest context.",
    },
    {
      icon: Heart,
      title: "Quality you can trace",
      description:
        "Every listing is structured for clarity — price in ETB, unit, organic flag, and seller identity.",
    },
    {
      icon: TruckIcon,
      title: "Logistics-ready MVP",
      description:
        "Checkout captures phone and delivery location so partners can pilot real fulfilment when you connect APIs.",
    },
    {
      icon: Award,
      title: "Organic filter",
      description:
        "Buyers can narrow to organic-tagged crops to reward soil-health practices and premium markets.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About AgriLink Ethiopia
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A lightweight digital marketplace linking Ethiopian farmers, cooperatives, and buyers.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-12 text-white mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-green-50 leading-relaxed">
          Improve price discovery and reduce post-harvest loss by connecting harvest supply with
          structured demand — starting as a clean React MVP you can extend with payments and logistics APIs.
        </p>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Our Values
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>

                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-12 rounded-2xl shadow-md mb-16"
      >
        <h2 className="text-3xl text-center mb-8">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="9+" label="Categories" />
          <Stat value="ETB" label="Local pricing" />
          <Stat value="4" label="Languages" />
          <Stat value="MVP" label="Ship fast" />
        </div>
      </motion.div>

      {/* Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl mb-6">Our Story</h2>

        <p className="text-gray-600 mb-4">
          AgriLink Ethiopia is designed as an open, readable codebase: Vite, React, Tailwind, and local state
          so your team can swap in real auth, inventory, and payments without fighting the UI layer.
        </p>

        <p className="text-gray-600">
          Farmers can self-list; buyers browse with filters; admins get a snapshot dashboard — all on-device for demos.
        </p>
      </motion.div>
    </div>
  );
}

/* Small reusable component */
function Stat({ value, label }) {
  return (
    <div>
      <div className="text-4xl font-bold text-green-600 mb-2">
        {value}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
export default About;