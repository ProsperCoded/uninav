## **🌟 General Coding Standards**

- **Maintain Clean, Modular Code**: Keep functions and components small, reusable, and well-documented.
- **Error Handling**: Always handle errors gracefully, especially in API calls and blockchain transactions.
- **Security First**: Never expose private keys, API secrets, or sensitive logic in the frontend.
- Naming Conventions: Use meaningful names, using **Camel Case naming style.**
- **Follow Existing Convetions:** This nestjs project uses a controller, services,

# **UniNav - University Study Materials Platform**

## **Project Overview**

UniNav is a **university-focused study material platform** that allows students to **upload, share, and access course-related materials** . It organizes resources by **Faculty and Department** , .

## **Key Features**

- **Study Material Management:** Upload PDFs, URLs, and images categorized by course.
- **Faculty & Department Structure:** Materials are organized into faculties and departments.
- **Authentication:** Students register using their **university email** , verified via **email confirmation** .
- **Bookmarks & Collections:** Users can save materials and create personal collections.
- **Blogs & Community Posts:** Students can write guides, articles, and scheme-of-work breakdowns.
- **Search & Recommendations:** AI-driven suggestions based on academic interests.
- **Monetization (Ads & Promotions):** Paid promotions for study materials and academic services.

## **Technical Overview**

- **Backend:** Node.js (Express) API with PostgreSQL
- **ORM:** Drizzle ORM
- **Email Services:** Gmail + Nodemailer, Brevo
- **Storage:** Google Drive API for material storage
- **Authentication:** JWT-based authentication
- **Payments (for ads):** Paystack Web Checkout
- **Real-time Features:** Socket.io for notifications
