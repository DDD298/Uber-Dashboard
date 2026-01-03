import { motion } from "framer-motion";
import { useUser } from "@/context/useUserContext";

interface DashboardHeaderProps {
  title: string;
  description: string;
  username?: string;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardHeader({
  title,
  username: propUsername,
}: DashboardHeaderProps) {
  const { profile } = useUser();
  const username = propUsername || profile?.data?.user?.name || "User";

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="relative bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 py-8 min-h-[100px] overflow-visible"
    >
      {/* Robot Image */}
      <img
        src="/images/robot1.webp"
        alt="Robot"
        width={1000}
        height={1000}
        draggable={false}
        loading="eager"
        className="absolute bottom-0 right-0 h-[200px] w-auto object-contain z-10"
      />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{title}</h1>
          <p className="text-gray-700">
            Welcome, Admin{" "}
            <span className="font-semibold text-green-700">{username}</span> -
            System Overview & Analytics
          </p>
        </div>
      </div>
    </motion.div>
  );
}
