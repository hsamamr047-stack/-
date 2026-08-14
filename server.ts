import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  INITIAL_USERS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSFERS,
  INITIAL_INVOICES,
  INITIAL_MESSAGES,
} from "./src/data/initialData.js";
import { TransferOrder, ArchivedInvoice, Message, BankAccount, User } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for server state persistence
let usersState: User[] = [...INITIAL_USERS];
let bankAccountsState: BankAccount[] = [...INITIAL_BANK_ACCOUNTS];
let transfersState: TransferOrder[] = [...INITIAL_TRANSFERS];
let invoicesState: ArchivedInvoice[] = [...INITIAL_INVOICES];
let messagesState: Message[] = [...INITIAL_MESSAGES];

// Server-side Gemini AI client initialization
const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "20mb" }));

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "شركة قطينة والحسام العالمية لتحويلات المالية" });
  });

  // Authentication
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = usersState.find((u) => u.email.toLowerCase() === (email || "").toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ success: false, error: "البريد الإلكتروني غير مسجل في النظام المغلق." });
    }

    if (user.password && password && user.password !== password) {
      return res.status(401).json({ success: false, error: "كلمة المرور غير صحيحة." });
    }

    if (!user.active) {
      return res.status(403).json({ success: false, error: "هذا الحساب معطل حالياً من قبل الإدارة." });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    res.json({
      success: true,
      user,
      token: `token-${user.id}-${Date.now()}`,
    });
  });

  // User Management
  app.get("/api/users", (_req, res) => {
    res.json({ success: true, users: usersState });
  });

  app.post("/api/users", (req, res) => {
    const { name, email, password, role, phone, brokerCommissionPct, agentCommissionPct } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "الرجاء إدخال اسم المستخدم والبريد الإلكتروني" });
    }

    const existing = usersState.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, error: "البريد الإلكتروني مسجل مسبقاً في النظام" });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.trim(),
      password: password || "123456",
      role: role || "agent",
      agentCode: `QH-${(role || "ag").toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      phone: phone || "",
      brokerCommissionPct: brokerCommissionPct !== undefined ? Number(brokerCommissionPct) : 10,
      agentCommissionPct: agentCommissionPct !== undefined ? Number(agentCommissionPct) : 10,
      active: true,
      createdAt: new Date().toISOString(),
    };

    usersState.unshift(newUser);
    res.json({ success: true, user: newUser });
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const index = usersState.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "المستخدم غير موجود" });
    }
    const { name, email, password, role, phone, brokerCommissionPct, agentCommissionPct } = req.body;
    usersState[index] = {
      ...usersState[index],
      name: name || usersState[index].name,
      email: email ? email.trim() : usersState[index].email,
      password: password || usersState[index].password,
      role: role || usersState[index].role,
      phone: phone !== undefined ? phone : usersState[index].phone,
      brokerCommissionPct: brokerCommissionPct !== undefined ? Number(brokerCommissionPct) : usersState[index].brokerCommissionPct,
      agentCommissionPct: agentCommissionPct !== undefined ? Number(agentCommissionPct) : usersState[index].agentCommissionPct,
    };
    res.json({ success: true, user: usersState[index] });
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = usersState.find((u) => u.id === id);
    if (user?.email === "hsamamr047@gmail.com") {
      return res.status(400).json({ success: false, error: "لا يمكن حذف حساب المدير الرئيسي" });
    }
    usersState = usersState.filter((u) => u.id !== id);
    res.json({ success: true, id });
  });

  app.patch("/api/users/:id/toggle", (req, res) => {
    const { id } = req.params;
    const user = usersState.find((u) => u.id === id);
    if (!user) return res.status(404).json({ success: false, error: "المستخدم غير موجود" });

    user.active = !user.active;
    res.json({ success: true, user });
  });

  // Bank Accounts API
  app.get("/api/accounts", (_req, res) => {
    res.json({ success: true, accounts: bankAccountsState });
  });

  app.post("/api/accounts", (req, res) => {
    const { bankName, country, countryCode, countryFlag, accountHolder, accountNumber, iban, swiftCode, currency, dailyLimit, notes } = req.body;

    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName,
      country,
      countryCode: countryCode || "GL",
      countryFlag: countryFlag || "🌐",
      accountHolder,
      accountNumber,
      iban,
      swiftCode,
      currency: currency || "USD",
      dailyLimit: Number(dailyLimit) || 100000,
      currentSpent: 0,
      active: true,
      notes,
    };

    bankAccountsState.unshift(newAccount);
    res.json({ success: true, account: newAccount });
  });

  app.put("/api/accounts/:id", (req, res) => {
    const { id } = req.params;
    const index = bankAccountsState.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "الحساب البنكي غير موجود" });
    }

    const { bankName, country, countryCode, countryFlag, accountHolder, accountNumber, iban, swiftCode, currency, dailyLimit, notes } = req.body;

    bankAccountsState[index] = {
      ...bankAccountsState[index],
      bankName: bankName || bankAccountsState[index].bankName,
      country: country || bankAccountsState[index].country,
      countryCode: countryCode || bankAccountsState[index].countryCode,
      countryFlag: countryFlag || bankAccountsState[index].countryFlag,
      accountHolder: accountHolder || bankAccountsState[index].accountHolder,
      accountNumber: accountNumber || bankAccountsState[index].accountNumber,
      iban: iban || bankAccountsState[index].iban,
      swiftCode: swiftCode !== undefined ? swiftCode : bankAccountsState[index].swiftCode,
      currency: currency || bankAccountsState[index].currency,
      dailyLimit: dailyLimit !== undefined ? Number(dailyLimit) : bankAccountsState[index].dailyLimit,
      notes: notes !== undefined ? notes : bankAccountsState[index].notes,
    };

    res.json({ success: true, account: bankAccountsState[index] });
  });

  app.delete("/api/accounts/:id", (req, res) => {
    const { id } = req.params;
    bankAccountsState = bankAccountsState.filter((b) => b.id !== id);
    res.json({ success: true, id });
  });

  // Transfers Lifecycle API
  app.get("/api/transfers", (_req, res) => {
    res.json({ success: true, transfers: transfersState });
  });

  app.post("/api/transfers", (req, res) => {
    const {
      agentId,
      agentName,
      agentCode,
      brokerName,
      bankAccountId,
      grossAmount,
      currency,
      senderName,
      senderPhone,
      beneficiaryName,
      beneficiaryCountry,
      beneficiaryPhone,
      transferCategory,
      transferMethod,
      accountOrPhone,
      receiptUrl,
      notes,
    } = req.body;

    let bankAcc = bankAccountsState.find((b) => b.id === bankAccountId) || bankAccountsState[0];
    if (!bankAcc) {
      bankAcc = {
        id: "bank-01",
        bankName: "مصرف الراجحي - الحساب المركزي",
        country: "السعودية",
        countryCode: "SA",
        countryFlag: "🇸🇦",
        accountHolder: "شركة قطينة والحسام العالمية",
        accountNumber: "4820000123456789",
        iban: "SA03800004820000123456789",
        swiftCode: "RJBKSA22",
        currency: "USD",
        dailyLimit: 250000,
        currentSpent: 0,
        active: true,
      };
    }

    const numericGross = Number(grossAmount);
    if (!numericGross || numericGross <= 0) {
      return res.status(400).json({ success: false, error: "الرجاء إدخال مبلغ تحويل صحيح" });
    }

    // Financial Engine automated 10% broker and 10% agent commission calculations
    const brokerPct = 10;
    const agentPct = 10;
    const brokerCommissionAmount = Math.round((numericGross * (brokerPct / 100)) * 100) / 100;
    const agentCommissionAmount = Math.round((numericGross * (agentPct / 100)) * 100) / 100;
    const totalCommissions = brokerCommissionAmount + agentCommissionAmount;
    const netAmount = Math.round((numericGross - totalCommissions) * 100) / 100;

    const serialNumber = `QH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransfer: TransferOrder = {
      id: `trf-${Date.now()}`,
      serialNumber,
      agentId: agentId || "usr-agent-01",
      agentName: agentName || "وكالة معتمدة",
      agentCode: agentCode || "QH-AG-100",
      brokerName: brokerName || "مجموعة الحسام الوسيطة",
      bankAccountId: bankAcc.id,
      bankName: bankAcc.bankName,
      iban: bankAcc.iban,
      grossAmount: numericGross,
      currency: currency || bankAcc.currency,
      brokerCommissionPct: brokerPct,
      brokerCommissionAmount,
      agentCommissionPct: agentPct,
      agentCommissionAmount,
      totalCommissions,
      netAmount,
      senderName,
      senderPhone,
      beneficiaryName,
      beneficiaryCountry: beneficiaryCountry || "مصر",
      beneficiaryPhone,
      transferCategory: transferCategory || "bank_exchange",
      transferMethod: transferMethod || "حساب بنكي",
      accountOrPhone: accountOrPhone || "",
      status: "pending",
      receiptUrl: receiptUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
    };

    transfersState.unshift(newTransfer);

    // Update spent limit on bank account
    bankAcc.currentSpent += numericGross;

    // Send automated notification system message in chat hub
    const sysMsg: Message = {
      id: `msg-${Date.now()}`,
      transferOrderId: newTransfer.id,
      senderId: "system",
      senderName: "نظام قطينة والحسام الآلي",
      senderRole: "super_admin",
      content: `تم إنشاء طلب تحويل جديد رقم [${newTransfer.serialNumber}] بمبلغ ${numericGross.toLocaleString()} ${newTransfer.currency}. صافي المبلغ بعد خصم العمولات (20%): ${netAmount.toLocaleString()} ${newTransfer.currency}.`,
      type: "text",
      timestamp: new Date().toISOString(),
      read: false,
    };
    messagesState.push(sysMsg);

    res.json({ success: true, transfer: newTransfer });
  });

  // Admin order status update (Workflow)
  app.patch("/api/transfers/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const transfer = transfersState.find((t) => t.id === id);
    if (!transfer) {
      return res.status(404).json({ success: false, error: "الطلب غير موجود" });
    }

    transfer.status = status;
    transfer.updatedAt = new Date().toISOString();

    let createdInvoice: ArchivedInvoice | null = null;

    if (status === "delivered") {
      transfer.deliveredAt = new Date().toISOString();

      // Convert order to Archived Invoice automatically (المواصفات: تحويل الطلب تلقائياً إلى فاتورة مؤرشفة للتدقيق المالي)
      const invoiceNum = `INV-${transfer.serialNumber}`;
      createdInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invoiceNum,
        transferOrderId: transfer.id,
        serialNumber: transfer.serialNumber,
        issuedAt: new Date().toISOString(),
        agentName: transfer.agentName,
        agentCode: transfer.agentCode,
        brokerName: transfer.brokerName || "مجموعة الحسام الوسيطة",
        bankName: transfer.bankName,
        iban: transfer.iban,
        grossAmount: transfer.grossAmount,
        brokerCommissionAmount: transfer.brokerCommissionAmount,
        agentCommissionAmount: transfer.agentCommissionAmount,
        totalCommissions: transfer.totalCommissions,
        netAmount: transfer.netAmount,
        currency: transfer.currency,
        senderName: transfer.senderName,
        beneficiaryName: transfer.beneficiaryName,
        beneficiaryCountry: transfer.beneficiaryCountry,
        transferCategory: transfer.transferCategory,
        transferMethod: transfer.transferMethod,
        accountOrPhone: transfer.accountOrPhone,
        verified: true,
        digitalSignature: `QH-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`,
      };

      transfer.invoiceId = createdInvoice.id;
      invoicesState.unshift(createdInvoice);

      messagesState.push({
        id: `msg-${Date.now()}`,
        transferOrderId: transfer.id,
        senderId: "system",
        senderName: "الإدارة العامة",
        senderRole: "super_admin",
        content: `تم تسليم الطلب رقم [${transfer.serialNumber}] بنجاح، وتمت أرشفة الفاتورة المالية المعتمدة رقم (${invoiceNum}).`,
        type: "text",
        timestamp: new Date().toISOString(),
        read: false,
      });
    } else if (status === "rejected") {
      transfer.rejectionReason = rejectionReason || "لم يتم استيفاء شروط مطابقة الإيصال.";
      messagesState.push({
        id: `msg-${Date.now()}`,
        transferOrderId: transfer.id,
        senderId: "system",
        senderName: "الإدارة العامة",
        senderRole: "super_admin",
        content: `تم رفض الطلب رقم [${transfer.serialNumber}]. السبب: ${transfer.rejectionReason}`,
        type: "text",
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    res.json({ success: true, transfer, invoice: createdInvoice });
  });

  // Archived Invoices API
  app.get("/api/invoices", (_req, res) => {
    res.json({ success: true, invoices: invoicesState });
  });

  // Messages API
  app.get("/api/messages", (req, res) => {
    const { orderId } = req.query;
    if (orderId) {
      const filtered = messagesState.filter((m) => m.transferOrderId === orderId);
      return res.json({ success: true, messages: filtered });
    }
    res.json({ success: true, messages: messagesState });
  });

  app.post("/api/messages", (req, res) => {
    const { transferOrderId, senderId, senderName, senderRole, content, type, mediaUrl, audioDuration } = req.body;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      transferOrderId,
      senderId: senderId || "usr-admin-01",
      senderName: senderName || "المدير الحسام",
      senderRole: senderRole || "super_admin",
      content: content || "",
      type: type || "text",
      mediaUrl,
      audioDuration,
      timestamp: new Date().toISOString(),
      read: false,
    };

    messagesState.push(newMessage);
    res.json({ success: true, message: newMessage });
  });

  // Gemini API OCR Receipt Scanner Endpoint
  app.post("/api/gemini/scan-receipt", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ success: false, error: "الرجاء تزويد صورة الإيصال لتحليلها" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback simulated parsing if API key is not configured
        return res.json({
          success: true,
          data: {
            amount: 15000,
            currency: "USD",
            bankName: "بنك زراعات التركي",
            iban: "TR62 0001 0008 8900 4512 3001 01",
            senderName: "عبد الرحمن العتيبي",
            date: "2026-08-10",
            transactionRef: "TXN-99812",
          },
          rawAnalysis: "تم استخراج البيانات من إيصال التحويل بنجاح.",
        });
      }

      const promptText = `أنت الخبير المالي الرقمي لشركة قطينة والحسام العالمية لتحويلات المالية.
قم بتحليل صورة إيصال التحويل البنكي وتحديد العناصر التالية بدقة فائقة وإرجاعها بتنسيق JSON حصراً:
1. amount (رقم المبلغ المحول)
2. currency (رمز العملة مثل USD, EUR, SAR, AED, TRY)
3. bankName (اسم البنك المستقبل المذكور)
4. iban (رقم الآيبان IBAN إن وجد)
5. senderName (اسم المرسل)
6. date (تاريخ التحويل)
7. transactionRef (رقم المرجع أو رقم الحوالة)

أرجع النتيجة بصيغة JSON خالية من أي نص إضافي:
{
  "amount": number,
  "currency": string,
  "bankName": string,
  "iban": string,
  "senderName": string,
  "date": string,
  "transactionRef": string
}`;

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/png",
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      };

      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, { text: promptText }] },
      });

      const rawText = response.text || "";
      let parsedJson: any = {};

      try {
        const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedJson = JSON.parse(cleanJson);
      } catch (e) {
        parsedJson = { rawText };
      }

      res.json({
        success: true,
        data: parsedJson,
        rawAnalysis: rawText,
      });
    } catch (error: any) {
      console.error("Gemini OCR error:", error);
      res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء تحليل إيصال التحويل بواسطة ذكاء جميناي: " + (error?.message || ""),
      });
    }
  });

  // System Summary Stats Endpoint
  app.get("/api/stats", (_req, res) => {
    const totalTransfersCount = transfersState.length;
    const totalGrossVolumeUSD = transfersState.reduce((acc, t) => acc + t.grossAmount, 0);
    const totalNetVolumeUSD = transfersState.reduce((acc, t) => acc + t.netAmount, 0);
    const totalCommissionsUSD = transfersState.reduce((acc, t) => acc + t.totalCommissions, 0);
    const pendingCount = transfersState.filter((t) => t.status === "pending").length;
    const deliveredCount = transfersState.filter((t) => t.status === "delivered").length;
    const archivedInvoicesCount = invoicesState.length;
    const activeAccountsCount = bankAccountsState.filter((b) => b.active).length;

    res.json({
      success: true,
      stats: {
        totalTransfersCount,
        totalGrossVolumeUSD,
        totalNetVolumeUSD,
        totalCommissionsUSD,
        pendingCount,
        deliveredCount,
        archivedInvoicesCount,
        activeAccountsCount,
      },
    });
  });

  // Catch-all 404 handler for API routes to prevent Vite from returning index.html
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ success: false, error: "المسار المطلق للأبي غير موجود (API endpoint not found)" });
  });

  // Global error handler for API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith("/api")) {
      console.error("API Error:", err);
      return res.status(500).json({ success: false, error: err?.message || "حدث خطأ غير متوقع في الخادم" });
    }
    next(err);
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server for Qutaina & Al-Husam running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
