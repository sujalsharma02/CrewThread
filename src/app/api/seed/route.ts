import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Job from "@/models/Job";
import Project from "@/models/Project";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Job.deleteMany({});
    await Project.deleteMany({});

    // Seed Users
    const users = await User.insertMany([
      {
        name: "Sujal Sharma",
        username: "sujalsharma",
        email: "sujal@example.com",
        role: "jobseeker",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sujal",
        headline: "Frontend Developer | React | Next.js",
        bio: "Passionate frontend developer from NIT Hamirpur. Love building beautiful UIs.",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
        location: "Himachal Pradesh, India",
        availability: "open_to_work",
        githubLink: "https://github.com/sujalsharma",
        education: [{ institution: "NIT Hamirpur", degree: "B.Tech CSE", year: "2026" }],
      },
      {
        name: "Priya Mehta",
        username: "priyamehta",
        email: "priya@example.com",
        role: "jobseeker",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        headline: "Full Stack Developer | MERN | AWS",
        bio: "Building scalable web applications. Open to remote opportunities.",
        skills: ["MongoDB", "Express", "React", "Node.js", "AWS", "Docker"],
        location: "Mumbai, India",
        availability: "freelance",
      },
      {
        name: "TechCorp India",
        username: "techcorpindia",
        email: "hr@techcorp.com",
        role: "company",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=techcorp",
        headline: "Building the Future of Tech | 500+ Engineers",
        bio: "We are a product-first company building AI-powered SaaS tools used by 2M+ users globally.",
        location: "Bangalore, India",
        availability: "not_available",
      },
      {
        name: "Rahul Gupta",
        username: "rahulgupta",
        email: "rahul@example.com",
        role: "jobseeker",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
        headline: "Backend Developer | Node.js | Go | Microservices",
        bio: "6 years building high-performance backend systems. Looking for senior roles.",
        skills: ["Node.js", "Go", "PostgreSQL", "Redis", "Kubernetes"],
        location: "Delhi, India",
        availability: "open_to_work",
        experience: [{ company: "Flipkart", role: "Senior Backend Engineer", duration: "2021-2024", description: "Built order management microservices" }],
      },
      {
        name: "StartupHub",
        username: "startuphub",
        email: "jobs@startuphub.io",
        role: "company",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=startuphub",
        headline: "India's Fastest Growing Startup | Series B",
        bio: "We build fintech products disrupting traditional banking. Remote-first culture.",
        location: "Hyderabad, India",
        availability: "not_available",
      },
    ]);

    const [sujal, priya, techcorp, rahul, startuphub] = users;

    // Seed Jobs
    const jobs = await Job.insertMany([
      {
        companyId: techcorp._id,
        title: "Senior React Developer",
        description: "We are looking for a passionate React developer to join our frontend team. You will be working on our core product used by millions of users. Must have 2+ years experience with React and TypeScript.",
        salary: { min: 10, max: 18, currency: "LPA" },
        skills: ["React", "TypeScript", "Next.js", "GraphQL"],
        location: "Remote",
        jobType: "remote",
        experienceMin: 2,
        experienceMax: 5,
        openings: 3,
        lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        companyId: startuphub._id,
        title: "Full Stack Intern – MERN",
        description: "Join our 3-month internship program and work on real products. You'll get mentorship, stipend, and a pre-placement offer for top performers.",
        salary: { min: 15000, max: 25000, currency: "month" },
        skills: ["MongoDB", "Express", "React", "Node.js"],
        location: "Hyderabad / Remote",
        jobType: "internship",
        experienceMin: 0,
        experienceMax: 1,
        openings: 5,
        lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        companyId: techcorp._id,
        title: "DevOps Engineer",
        description: "Manage our cloud infrastructure on AWS. Experience with Kubernetes, Docker, and CI/CD pipelines required. You will own deployments and infrastructure.",
        salary: { min: 15, max: 25, currency: "LPA" },
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
        location: "Bangalore",
        jobType: "hybrid",
        experienceMin: 3,
        experienceMax: 7,
        openings: 2,
        lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        companyId: startuphub._id,
        title: "Backend Developer – Node.js",
        description: "Build APIs and microservices for our fintech platform handling millions of transactions. Strong Node.js and PostgreSQL skills needed.",
        salary: { min: 8, max: 15, currency: "LPA" },
        skills: ["Node.js", "PostgreSQL", "Redis", "REST API"],
        location: "Remote",
        jobType: "remote",
        experienceMin: 1,
        experienceMax: 4,
        openings: 4,
        lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);

    // Seed Projects
    const projects = await Project.insertMany([
      {
        ownerId: techcorp._id,
        title: "MERN Stack Admin Dashboard",
        description: "Need a fully functional admin dashboard with analytics, user management, and charts. Should include dark mode and responsive design.",
        budget: 25000,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        pricingType: "fixed",
        status: "open",
      },
      {
        ownerId: sujal._id,
        title: "E-Commerce Website with Payment Gateway",
        description: "Build a complete e-commerce site with product catalog, cart, checkout, and Razorpay integration. Must be mobile-first.",
        budget: 40000,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        skills: ["Next.js", "MongoDB", "Razorpay", "Tailwind CSS"],
        pricingType: "fixed",
        status: "open",
      },
      {
        ownerId: startuphub._id,
        title: "REST API for Mobile App",
        description: "Build Node.js REST APIs for our fitness tracking mobile app. Includes user profiles, workout logs, and social features.",
        budget: 18000,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        skills: ["Node.js", "Express", "MongoDB", "JWT"],
        pricingType: "fixed",
        status: "open",
      },
    ]);

    // Seed Posts
    await Post.insertMany([
      {
        authorId: techcorp._id,
        type: "job",
        content: "🚀 We're hiring! TechCorp India is looking for Senior React Developers.\n\n📍 Location: Remote\n💰 Salary: ₹10–18 LPA\n🎯 Experience: 2–5 years\n\nSkills: React, TypeScript, Next.js, GraphQL\n\nApply now! 3 openings available. Last date: 30 days from now. 👇",
        tags: ["hiring", "react", "remote", "frontend"],
        jobRef: jobs[0]._id,
      },
      {
        authorId: sujal._id,
        type: "normal",
        content: "Just finished building a full-stack social platform using Next.js 14, MongoDB, and Tailwind CSS! 🎉\n\nFeatures:\n✅ Twitter-like feed\n✅ LinkedIn-style profiles\n✅ Job board\n✅ Freelance marketplace\n\nOpen to frontend opportunities! Check out my profile 🙌 #opentowork #react #nextjs",
        tags: ["opentowork", "react", "nextjs", "portfolio"],
      },
      {
        authorId: startuphub._id,
        type: "job",
        content: "StartupHub is growing fast! 🔥 We need 5 MERN Stack Interns to join our team.\n\n💼 Duration: 3 months\n💰 Stipend: ₹15K–25K/month\n🎁 PPO for top performers\n📍 Hyderabad / Remote\n\nFreshers welcome! Last date: 20 days. Apply below 👇",
        tags: ["internship", "mern", "fresher", "hiring"],
        jobRef: jobs[1]._id,
      },
      {
        authorId: priya._id,
        type: "normal",
        content: "Available for freelance work! 🛠️\n\nI can help with:\n• MERN Stack web apps\n• REST API development\n• AWS deployment & DevOps\n• React UI/UX implementation\n\n5+ projects delivered. DM me with your requirements! 💬 #freelance #mern #availableforwork",
        tags: ["freelance", "mern", "available", "webdev"],
      },
      {
        authorId: rahul._id,
        type: "normal",
        content: "Looking for Senior Backend Engineer opportunities (Node.js / Go) 🔍\n\n6 years exp | Ex-Flipkart | Open to remote\nSpecialties: Microservices, High-performance APIs, Kubernetes\n\nHMU if you're hiring or know someone! #opentowork #backend #nodejs #hiring",
        tags: ["opentowork", "backend", "nodejs", "senior"],
      },
      {
        authorId: techcorp._id,
        type: "project",
        content: "🔧 New Freelance Project Posted!\n\nNeed a MERN Admin Dashboard built in 10 days.\n💰 Budget: ₹25,000 (Fixed)\n🛠️ Stack: React, Node.js, MongoDB, Tailwind\n\nExperienced freelancers, bid now! Full details on the projects page 👇",
        tags: ["freelance", "mern", "project", "dashboard"],
        projectRef: projects[0]._id,
      },
    ]);

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seeding failed", details: String(error) }, { status: 500 });
  }
}
