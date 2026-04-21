🚀 AdFlow Pro
AdFlow Pro is a modern Sponsored Listing Marketplace built using Next.js and Supabase, designed to simplify the process of creating, managing, and promoting advertisements.
It offers a powerful system with role-based access control, ad moderation, scheduling, analytics, and secure payment verification, making it ideal for scalable digital marketplace solutions.

🌐 Live Demo
🔗 https://adflow-pro-ashen.vercel.app/

✨ Key Features
🔐 Authentication & Role-Based Access
Secure authentication powered by Supabase Auth

Role-based access control:
👤 User
🛠️ Admin
🛡️ Moderator
👑 Super Admin

Protected routes and dashboards
📢 Ad Management
Create, edit, and delete ads
Upload ad images via URL
Organized listing system
Real-time updates using Supabase

🛡️ Moderation System
Moderator approval workflow
Approve or reject advertisements
Maintain platform quality and control

⏰ Scheduling System
Schedule ads for future publishing
Automatic activation based on time
Better campaign planning

📊 Analytics Dashboard
Monitor ad performance
Track engagement and activity
Data-driven insights

💳 Payment Verification
Submit transaction ID
Upload payment screenshot (URL-based)
Verification before ad approval

👤 Test Accounts
Role	Email	Password
👤 User	user@gmail.com
	user123
🛠️ Admin	admin@gmail.com
	admin123
🛡️ Moderator	moderator@gmail.com
	moderator123
👑 Super Admin	superadmin@gmail.com
	superadmin123
 
🛠️ Tech Stack
Frontend
Next.js
React.js
Backend / BaaS
Supabase (Database + Auth + APIs)
Database
PostgreSQL (via Supabase)
Styling
Tailwind CSS

📁 Project Structure (Simplified)
adflow-pro/
│── app/
│── components/
│── lib/          
│── services/
│── public/
│── styles/

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/mominabukhari/adflow-pro.git
2️⃣ Navigate to Project
cd adflow-pro
3️⃣ Install Dependencies
npm install
4️⃣ Setup Environment Variables
Create a .env.local file:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
5️⃣ Run Development Server
npm run dev
6️⃣ Open in Browser
http://localhost:3000

🚀 Future Enhancements
🔔 Real-time notifications
💬 Chat system for users
⭐ Featured ads & ranking system
📈 Advanced analytics dashboard

🤝 Contribution
Feel free to fork the repository and submit pull requests.

👩‍💻 Author
Developed by Momina Bukhari
