"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="relative z-50">

      {/* 🌈 glowing top border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse"></div>

      <div className="backdrop-blur-xl bg-white/70 shadow-lg px-6 py-3 flex justify-between items-center border-b border-white/20">

        {/* LEFT SIDE (LOGO) */}
        <div className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
          ✨ AdFlow Pro
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-6 items-center text-sm font-medium">

          <Link
            href="/dashboard"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Dashboard
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/login"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Login
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/register"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Register
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <button
            onClick={handleLogout}
            className="relative px-4 py-1 rounded-lg text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition shadow-md"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

// "use client";

// import Link from "next/link";
// import { supabase } from "../lib/supabase";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push("/login");
//   };

//   return (
//     <div className="w-full flex justify-center mt-4 fixed top-0 z-50">

//       {/* 🌟 FLOATING GLASS NAVBAR */}
//       <nav className="relative flex items-center gap-6 px-6 py-3 rounded-full 
//         bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden">

//         {/* ✨ animated shine effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
//           -translate-x-full animate-[shine_3s_infinite]"></div>

//         {/* BRAND */}
//         <div className="font-extrabold text-sm md:text-base bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
//           ✨ AdFlow Pro
//         </div>

//         {/* LINKS */}
//         <NavItem href="/dashboard" label="Dashboard" active={pathname === "/dashboard"} />
//         <NavItem href="/login" label="Login" active={pathname === "/login"} />
//         <NavItem href="/register" label="Register" active={pathname === "/register"} />

//         {/* LOGOUT */}
//         <button
//           onClick={handleLogout}
//           className="ml-2 px-4 py-1 rounded-full text-xs font-semibold 
//           bg-gradient-to-r from-red-500 to-pink-500 text-white 
//           hover:scale-105 transition shadow-md"
//         >
//           Logout
//         </button>

//         {/* animation keyframes */}
//         <style jsx>{`
//           @keyframes shine {
//             0% { transform: translateX(-100%); }
//             100% { transform: translateX(100%); }
//           }
//         `}</style>

//       </nav>
//     </div>
//   );
// }

// /* 🔥 NAV ITEM COMPONENT */
// function NavItem({ href, label, active }) {
//   return (
//     <Link href={href} className="relative group text-xs md:text-sm font-medium">

//       {/* dot indicator */}
//       <span className={`absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full 
//         ${active ? "bg-purple-400" : "bg-transparent group-hover:bg-purple-300"}`}>
//       </span>

//       <span className={`transition 
//         ${active ? "text-purple-300" : "text-white/80 group-hover:text-white"}`}>
//         {label}
//       </span>

//       {/* underline glow */}
//       <span className={`absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all 
//         ${active ? "w-full bg-purple-400" : "bg-purple-400/70"}`}>
//       </span>

//     </Link>
//   );
// }