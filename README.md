InternArea 🚀

InternArea is a full‑stack internship platform designed similar to an Internshala‑style system. It enables students to explore available internships and submit applications using secure authentication, OTP verification, and a subscription‑based application model.

This project extends beyond a simple clone by incorporating multiple advanced capabilities such as paid subscription plans, automated resume generation, login monitoring, multilingual accessibility, and a regulated social posting environment.

🌐 Live Demo
https://internshala-clone-omega.vercel.app

✨ Features
🔐 Authentication & Security
- Email-based OTP verification for secure login
- Forgot password functionality
- Password reset permitted only once per day
- Automatic password generator using uppercase and lowercase characters
- Login tracking using device and IP information
- Login history saved within the database

💳 Subscription System
- Payment gateway logic integrated similar to Razorpay / Stripe.
- Free Plan – ₹0 – Allows application to 1 internship
- Bronze Plan – ₹100/month – Allows application to 3 internships
- Silver Plan – ₹300/month – Allows application to 5 internships
- Gold Plan – ₹1000/month – Unlimited internship applications
- Payment is permitted only between 10 AM – 11 AM IST.
- After a successful payment, the system automatically sends the invoice and subscription details to the user via email.

📄 Resume Builder
- Users can provide details such as name, qualifications, work experience, personal information, and a profile photo.
- The generated resume is automatically linked to the student’s profile.
- The resume is used when submitting internship applications.
- This is a premium feature costing ₹50 per resume.
- Email OTP verification is required before completing the payment.

🌍 Multi‑Language Support
- Supported languages include:
- English
- Hindi
- Spanish
- Portuguese
- Chinese
- French
- Email verification is required when switching the interface to French.

🧑‍🤝‍🧑 Social Public Space
- Users can upload images and videos.
- Posts can receive likes, comments, and shares.

📊 Posting Rules
- 0 friends → Maximum 1 post per day
- 2 friends → Maximum 2 posts per day
- 10+ friends → Unlimited posts per day

📊 Login Tracking System
- The system records:
- Browser type
- Operating system
- Device type (desktop or mobile)
- IP address
- Login timestamp
- Mobile logins are allowed only between 10 AM – 1 PM IST.

🛠️ Tech Stack
- Frontend: React, Next.js, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication & Email: Firebase, Emailjs
- Payments: Razorpay
- Deployment: Render, Vercel

🚀 How to Run the Project
- Clone the repository
- git clone https://github.com/yourusername/internarea.git
- Install dependencies → npm install
- Start backend → npm run server
- Start frontend → npm run dev

👩‍💻 Author

Shravani Advirkar
