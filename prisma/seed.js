const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@bestcctvservice.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@bestcctvservice.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // 2. Seed CCTV & Biometric Products
  const products = [
    {
      name: "CP Plus 2MP Full HD IR Bullet Camera",
      slug: "cp-plus-2mp-ir-bullet",
      category: "CCTV_CAMERA",
      brand: "CP Plus",
      modelNumber: "CP-UVC-T1100L2",
      price: 1350.00,
      description: "High performance 2MP bullet camera with 20m IR range, weatherproof IP66, ideal for outdoor house and shop security.",
      features: JSON.stringify(["1080P Full HD", "20M IR Distance", "IP66 Weatherproof", "Night Vision"]),
      imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
      featured: true,
      inStock: true,
    },
    {
      name: "Hikvision 4MP ColorVu Dome Camera",
      slug: "hikvision-4mp-colorvu-dome",
      category: "CCTV_CAMERA",
      brand: "Hikvision",
      modelNumber: "DS-2CE72DF0T-F",
      price: 2450.00,
      description: "24/7 ColorVu technology delivers colorful images day and night. 4MP high resolution dome camera for offices and homes.",
      features: JSON.stringify(["24/7 Color Imaging", "4MP Resolution", "Audio over Coaxial", "F1.0 Super Aperture"]),
      imageUrl: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=600&auto=format&fit=crop&q=80",
      featured: true,
      inStock: true,
    },
    {
      name: "Dahua 8 Channel 4K Ultra HD NVR",
      slug: "dahua-8ch-4k-nvr",
      category: "NVR_DVR",
      brand: "Dahua",
      modelNumber: "NVR4108HS-4KS2",
      price: 6800.00,
      description: "8 Channel Network Video Recorder with 4K HDMI output, H.265+ smart compression, supporting up to 10TB HDD.",
      features: JSON.stringify(["8 Channels IP", "4K HDMI Output", "H.265+ Compression", "Mobile App Remote View"]),
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      featured: false,
      inStock: true,
    },
    {
      name: "eSSL K90 Pro Biometric Attendance Machine",
      slug: "essl-k90-pro-biometric",
      category: "BIOMETRIC_ATTENDANCE",
      brand: "eSSL",
      modelNumber: "K90 Pro",
      price: 5200.00,
      description: "Fingerprint attendance device with built-in battery backup, TCP/IP, USB export, and free attendance software for up to 800 users.",
      features: JSON.stringify(["Fingerprint & RFID Card", "800 Users Capacity", "Built-in Battery Backup", "Excel Report Export"]),
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
      featured: true,
      inStock: true,
    },
    {
      name: "Matrix COSEC Face Recognition Access Control",
      slug: "matrix-cosec-face-access-control",
      category: "ACCESS_CONTROL",
      brand: "Matrix",
      modelNumber: "COSEC VEGA FAX",
      price: 18500.00,
      description: "AI-powered touchless face recognition access control and attendance machine for corporate offices and institutions.",
      features: JSON.stringify(["Touchless AI Face Recognition", "0.3s Fast Matching", "EM Lock Support", "Cloud Software Integration"]),
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      featured: true,
      inStock: true,
    },
    {
      name: "Realtime T502 Fingerprint + WiFi Time Attendance",
      slug: "realtime-t502-wifi-attendance",
      category: "BIOMETRIC_ATTENDANCE",
      brand: "Realtime",
      modelNumber: "T502 WiFi",
      price: 4600.00,
      description: "Smart WiFi biometric attendance machine with real-time cloud data sync and mobile app notifications for manager.",
      features: JSON.stringify(["WiFi Connectivity", "1000 Fingerprint Storage", "Mobile App Tracking", "Voice Prompt"]),
      imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80",
      featured: false,
      inStock: true,
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log("Seeded", products.length, "products.");

  // 3. Seed Sample Leads
  const leads = [
    {
      name: "Sunil Verma",
      phone: "9823456781",
      email: "sunil@gmail.com",
      serviceType: "CCTV Installation (4 Cameras)",
      message: "Need 4 dome cameras and 1 DVR for retail shop in main market.",
      status: "NEW",
    },
    {
      name: "Apex Logistics Pvt Ltd",
      phone: "9876500123",
      email: "hr@apexlogistics.in",
      serviceType: "Biometric Attendance & Access Control",
      message: "Looking for biometric access control for 45 employees at warehouse.",
      status: "CONTACTED",
    }
  ];

  for (const l of leads) {
    await prisma.lead.create({ data: l });
  }

  // 4. Seed Sample Service Tickets
  const tickets = [
    {
      ticketNumber: "TKT-1001",
      customerName: "Dr. Rajesh Sharma",
      phone: "9988776655",
      address: "B-12, Sector 4, Near City Hospital",
      city: "Local",
      serviceType: "CCTV_REPAIR",
      issueDescription: "Camera 2 and 3 showing 'No Video' on monitor.",
      status: "IN_PROGRESS",
      technicianName: "Amit Kumar",
      technicianPhone: "9871122334",
    },
    {
      ticketNumber: "TKT-1002",
      customerName: "Pooja Gupta",
      phone: "9123456780",
      address: "Flat 402, Royal Palms Society",
      city: "Local",
      serviceType: "CCTV_INSTALL",
      issueDescription: "New installation of 2 WiFi cameras for home balcony and entrance.",
      status: "PENDING",
      technicianName: null,
      technicianPhone: null,
    }
  ];

  for (const t of tickets) {
    await prisma.serviceTicket.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {},
      create: t,
    });
  }

  // 5. Seed AMC Contract
  await prisma.amcContract.upsert({
    where: { contractNumber: "AMC-2026-001" },
    update: {},
    create: {
      contractNumber: "AMC-2026-001",
      customerName: "Green Valley School",
      companyName: "Green Valley Educational Trust",
      phone: "9811223344",
      email: "admin@greenvalleyschool.edu",
      address: "Campus 1, Bypass Road",
      planType: "Gold Comprehensive",
      totalCameras: 32,
      totalBiometrics: 4,
      amount: 35000.00,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
      notes: "Quarterly maintenance with cleaning and cable inspection.",
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
