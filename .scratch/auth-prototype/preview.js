"use strict";

// AuthPreview represents review navigation only. It never represents a session.
const preview = {
  language: "th",
  appearance: "edge",
  screen: "welcome",
  email: "",
  message: null,
  pending: false,
  scenario: "disconnected",
};

const copy = {
  th: {
    language: "ภาษา", welcome: "ยินดีต้อนรับสู่คนใน", welcomeSub: "เข้าสู่ระบบ เพื่อดูแลสต็อกร้านของคุณ",
    google: "เข้าสู่ระบบด้วย Google", useEmail: "ใช้อีเมล", noAccount: "ยังไม่มีบัญชี?", create: "สร้างบัญชี",
    emailTitle: "กรอกอีเมลของคุณ", emailSub: "ใช้อีเมลที่คุณสมัครไว้กับคนใน", email: "อีเมล", next: "ถัดไป", back: "ย้อนกลับ",
    passwordTitle: "เข้าสู่ระบบด้วยรหัสผ่าน", passwordSub: "อีเมลสำหรับเข้าสู่ระบบ", password: "รหัสผ่าน", passwordPlaceholder: "กรอกรหัสผ่านของคุณ",
    show: "แสดงรหัสผ่าน", hide: "ซ่อนรหัสผ่าน", forgot: "ลืมรหัสผ่าน?", signIn: "เข้าสู่ระบบ",
    signupEmailTitle: "อีเมลสำหรับสร้างบัญชี", signupEmailSub: "กรอกอีเมลที่ต้องการใช้กับคนใน", signupTitle: "ตั้งรหัสผ่านของคุณ", signupSub: "เริ่มดูแลสต็อกด้วยบัญชีของคุณ", newPassword: "ตั้งรหัสผ่าน", newPasswordPlaceholder: "ใช้คำหลายคำที่คุณจำได้",
    passwordHint: "ใช้ประโยคที่จำง่ายได้ ไม่ต้องบังคับตัวพิมพ์ใหญ่หรือสัญลักษณ์", confirmPassword: "ยืนยันรหัสผ่าน", confirmPlaceholder: "กรอกรหัสผ่านเดิมอีกครั้ง", confirmRequired: "กรอกยืนยันรหัสผ่าน", confirmMismatch: "รหัสผ่านทั้งสองช่องยังไม่ตรงกัน", missingLetter: "เพิ่มตัวอักษร A–Z หรือ a–z อย่างน้อย 1 ตัว", missingNumber: "เพิ่มตัวเลข 0–9 อย่างน้อย 1 ตัว", ruleLength: "อย่างน้อย 8 ตัวอักษร", ruleLetter: "มีตัวอักษร A–Z หรือ a–z อย่างน้อย 1 ตัว", ruleNumber: "มีตัวเลข 0–9 อย่างน้อย 1 ตัว", ruleMatch: "รหัสผ่านทั้งสองช่องตรงกัน", passed: "ผ่านแล้ว", waiting: "ยังไม่ผ่าน", progress: (n) => `ผ่าน ${n} จาก 4 ข้อ`, signupNote: "ตัวอย่างขั้นตอนสมัคร ยังไม่สร้างบัญชีจริง",
    recoveryTitle: "ตั้งรหัสผ่านใหม่", recoverySub: "กรอกอีเมลเพื่อดูขั้นตอนถัดไป", recoveryAction: "ขอลิงก์ตั้งรหัสผ่านใหม่",
    checkTitle: "ขั้นตอนถัดไปคือเช็กอีเมล", checkSub: "เมื่อเชื่อมระบบแล้ว หากดำเนินการต่อได้ คุณจะได้รับอีเมลพร้อมขั้นตอนถัดไป",
    checkNote: "นี่เป็นเพียงตัวอย่างหน้าจอ ยังไม่ได้ส่งอีเมลหรือสร้างบัญชีจริง", backLogin: "กลับไปเข้าสู่ระบบ",
    invalidEmail: "กรอกอีเมลให้ครบ เช่น name@example.com", requiredPassword: "กรอกรหัสผ่านของคุณ", shortPassword: "ตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร",
    disconnected: "ตัวอย่างหน้าจอนี้ยังไม่เชื่อมระบบ จึงยังเข้าสู่ระบบไม่ได้", credentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง ลองอีกครั้งได้", network: "เชื่อมต่อไม่ได้ ลองอีกครั้งในอีกสักครู่",
    "rate-limit": "ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่", expired: "ลิงก์นี้ใช้ไม่ได้หรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่",
    cancelled: "ยกเลิกการเข้าสู่ระบบด้วย Google แล้ว", unconfirmed: "ยังเข้าสู่ระบบไม่ได้ ตรวจอีเมลสำหรับขั้นตอนถัดไป หรือลองอีกครั้ง",
    simulationNote: "สถานการณ์จำลอง ยังไม่ได้ส่งคำขอจริง", pending: "กำลังแสดงตัวอย่าง…",
    reviewTitle: "Prototype สำหรับเลือกแบบ", reviewNote: "ยังไม่เชื่อมระบบ ไม่เก็บรหัสผ่าน และไม่ส่งอีเมลจริง",
    appearance: "แสงพื้นหลัง", halo: "A · แสงฟุ้งหลังการ์ด", edge: "B · แสงเฉพาะขอบ", scenario: "จำลองผลเมื่อกดดำเนินการ",
    scenarioNames: ["ยังไม่เชื่อมระบบ", "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง", "เชื่อมต่อไม่ได้", "ลองบ่อยเกินไป", "ลิงก์หมดอายุ", "ยกเลิก Google", "ต้องยืนยันการเข้าสู่ระบบ"],
  },
  en: {
    language: "Language", welcome: "Welcome to Khonnai", welcomeSub: "Sign in to manage your shop’s stock.",
    google: "Continue with Google", useEmail: "Continue with email", noAccount: "New to Khonnai?", create: "Create an account",
    emailTitle: "Enter your email", emailSub: "Use the email you registered with Khonnai.", email: "Email", next: "Continue", back: "Back",
    passwordTitle: "Sign in with password", passwordSub: "Sign in with", password: "Password", passwordPlaceholder: "Enter your password",
    show: "Show password", hide: "Hide password", forgot: "Forgot password?", signIn: "Sign in",
    signupEmailTitle: "Email for your new account", signupEmailSub: "Enter the email you want to use with Khonnai.", signupTitle: "Set your password", signupSub: "Start managing stock with your own account.", newPassword: "Create a password", newPasswordPlaceholder: "Try a memorable passphrase",
    passwordHint: "A memorable phrase works. No uppercase or symbol requirement.", confirmPassword: "Confirm password", confirmPlaceholder: "Enter the same password again", confirmRequired: "Confirm your password", confirmMismatch: "The passwords do not match yet", missingLetter: "Add at least one letter (A–Z or a–z)", missingNumber: "Add at least one number (0–9)", ruleLength: "At least 8 characters", ruleLetter: "At least one letter (A–Z or a–z)", ruleNumber: "At least one number (0–9)", ruleMatch: "Both passwords match", passed: "Met", waiting: "Not met yet", progress: (n) => `${n} of 4 checks met`, signupNote: "Signup preview only. No account will be created.",
    recoveryTitle: "Reset your password", recoverySub: "Enter your email to preview the next step.", recoveryAction: "Request a reset link",
    checkTitle: "Next, check your email", checkSub: "Once connected, if the request can proceed, an email will explain what to do next.",
    checkNote: "Screen preview only. No email was sent and no account was created.", backLogin: "Back to sign in",
    invalidEmail: "Enter a complete email, such as name@example.com.", requiredPassword: "Enter your password.", shortPassword: "Use at least 8 characters for your new password.",
    disconnected: "This preview is not connected. You cannot sign in yet.", credentials: "The email or password is incorrect. Please try again.", network: "Unable to connect. Please try again shortly.",
    "rate-limit": "Too many attempts. Please wait a while and try again.", expired: "This link is invalid or has expired. Please request a new one.",
    cancelled: "Google sign-in was cancelled.", unconfirmed: "Unable to sign in yet. Check your email for next steps, or try again.",
    simulationNote: "Simulated result. No real request was sent.", pending: "Showing preview…",
    reviewTitle: "Prototype for design review", reviewNote: "Not connected. No passwords are saved and no emails are sent.",
    appearance: "Background light", halo: "A · Soft light behind card", edge: "B · Subtle edge glow", scenario: "Simulate the next action",
    scenarioNames: ["Not connected", "Incorrect credentials", "Connection error", "Rate limited", "Expired link", "Google cancelled", "Sign-in confirmation needed"],
  },
};

const icon = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="4"/><path d="m4 7 8 6 8-6"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2.5 12s3.2-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.2 6.5-9.5 6.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.39 9.39 0 0 1-4.08 6.17v5.01h6.61c3.87-3.56 6.08-8.81 6.08-14.68Z"/><path fill="#34A853" d="M24 44c5.51 0 10.13-1.83 13.5-4.86l-6.61-5.01c-1.83 1.23-4.17 1.96-6.89 1.96-5.31 0-9.8-3.59-11.4-8.42H5.77v5.17A20.38 20.38 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.67A12.1 12.1 0 0 1 12 24c0-1.27.22-2.5.6-3.67v-5.17H5.77A19.8 19.8 0 0 0 3.6 24c0 3.2.77 6.21 2.17 8.84l6.83-5.17Z"/><path fill="#EA4335" d="M24 11.91c3 0 5.69 1.03 7.81 3.05l5.86-5.86C34.12 5.8 29.5 4 24 4A20.38 20.38 0 0 0 5.77 15.16l6.83 5.17c1.6-4.83 6.09-8.42 11.4-8.42Z"/></svg>',
};

const screen = document.getElementById("screen");
let pendingTimer;
const t = () => copy[preview.language];

function button(action, label, style = "secondary", svg = "") {
  return `<button type="button" class="button ${style}" data-action="${action}">${svg}<span>${label}</span></button>`;
}

function emailField() {
  return `<div class="field"><label for="email">${t().email}</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="name@example.com" required aria-describedby="email-error"><p class="field-error" id="email-error" hidden></p></div>`;
}

function passwordField(isNew) {
  return `<div class="field"><label for="password">${isNew ? t().newPassword : t().password}</label><div class="input-wrap"><input id="password" name="password" data-password type="password" autocomplete="${isNew ? "new-password" : "current-password"}" placeholder="${isNew ? t().newPasswordPlaceholder : t().passwordPlaceholder}" required aria-describedby="password-error${isNew ? " password-hint" : ""}"><button type="button" class="eye" data-action="eye" aria-label="${t().show}" aria-pressed="false">${icon.eye}</button></div><p class="field-error" id="password-error" hidden></p></div>`;
}

function confirmationField() {
  return `<div class="field"><label for="confirm-password">${t().confirmPassword}</label><div class="input-wrap"><input id="confirm-password" name="confirm-password" data-password type="password" autocomplete="new-password" placeholder="${t().confirmPlaceholder}" required aria-describedby="confirm-password-error"><button type="button" class="eye" data-action="eye" data-target="confirm-password" aria-label="${t().show} · ${t().confirmPassword}" aria-pressed="false">${icon.eye}</button></div><p class="field-error" id="confirm-password-error" hidden></p></div>`;
}

const passwordRules = [
  { id: "length", label: "ruleLength", error: "shortPassword", passes: (password) => Array.from(password).length >= 8 },
  { id: "letter", label: "ruleLetter", error: "missingLetter", passes: (password) => /[A-Za-z]/.test(password) },
  { id: "number", label: "ruleNumber", error: "missingNumber", passes: (password) => /[0-9]/.test(password) },
  { id: "match", label: "ruleMatch", passes: (password, _email, confirmation) => Boolean(password && confirmation && password === confirmation) },
];

function passwordChecklist() {
  const mark = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="m6 10 3 3 5-6"/></svg>';
  return `<ul class="password-rules" id="password-hint" aria-label="${t().newPassword}">${passwordRules.map(rule => `<li data-rule="${rule.id}" data-passed="false">${mark}<span>${t()[rule.label]}</span></li>`).join("")}</ul><span class="sr" id="password-progress" role="status" aria-live="polite" aria-atomic="true"></span>`;
}

function updatePasswordRules() {
  if (preview.screen !== "signup") return;
  const password = document.getElementById("password").value;
  const email = preview.email;
  const confirmation = document.getElementById("confirm-password").value;
  let passed = 0;
  for (const rule of passwordRules) {
    const met = rule.passes(password, email, confirmation);
    const row = screen.querySelector(`[data-rule="${rule.id}"]`);
    row.dataset.passed = String(met);
    row.setAttribute("aria-label", `${t()[rule.label]} · ${met ? t().passed : t().waiting}`);
    passed += Number(met);
  }
  const progress = document.getElementById("password-progress");
  const message = t().progress(passed);
  if (progress.textContent !== message) progress.textContent = message;
}

function validateConfirmation() {
  const confirmation = document.getElementById("confirm-password");
  if (!confirmation) return true;
  const password = document.getElementById("password");
  return fieldError(confirmation, !confirmation.value ? t().confirmRequired : confirmation.value !== password.value ? t().confirmMismatch : null);
}

function form(contents, submitLabel, backScreen) {
  return `<form novalidate>${contents}<div class="actions"><button type="submit" class="button primary"><span>${submitLabel}</span></button>${button(backScreen, t().back)}</div></form>`;
}

function clearPassword() {
  screen.querySelectorAll("input[data-password]").forEach(input => { input.value = ""; });
}

function navigate(next) {
  clearTimeout(pendingTimer);
  clearPassword();
  preview.pending = false;
  preview.screen = next;
  preview.message = null;
  render(true);
}

function render(focusTitle = false) {
  clearPassword();
  const text = t();
  const screens = {
    welcome: {
      title: text.welcome,
      body: `<p class="subtitle">${text.welcomeSub}</p><div class="actions">${button("google", text.google, "provider", icon.google)}${button("email", text.useEmail, "primary", icon.email)}</div><p class="account-prompt">${text.noAccount} <button class="text-button" type="button" data-action="signup">${text.create}</button></p>`,
    },
    email: {
      title: text.emailTitle,
      body: `<p class="subtitle">${text.emailSub}</p>${form(emailField(), text.next, "welcome")}<p class="account-prompt">${text.noAccount} <button class="text-button" type="button" data-action="signup">${text.create}</button></p>`,
    },
    password: {
      title: text.passwordTitle,
      body: `<p class="subtitle">${text.passwordSub} <span data-entered-email></span></p>${form(`${passwordField(false)}<div class="recovery-link"><button type="button" class="text-button" data-action="recovery">${text.forgot}</button></div>`, text.signIn, "email")}`,
    },
    "signup-email": {
      title: text.signupEmailTitle,
      body: `<p class="subtitle">${text.signupEmailSub}</p>${form(emailField(), text.next, "welcome")}`,
    },
    signup: {
      title: text.signupTitle,
      body: form(`${passwordField(true)}${confirmationField()}${passwordChecklist()}`, text.next, "signup-email"),
    },
    recovery: {
      title: text.recoveryTitle,
      body: `<p class="subtitle">${text.recoverySub}</p>${form(emailField(), text.recoveryAction, "password")}`,
    },
    "check-email": {
      title: text.checkTitle,
      body: `<p class="subtitle">${text.checkSub}</p><p class="notice">${text.checkNote}</p>${button("welcome", text.backLogin, "primary")}`,
    },
  };
  const current = screens[preview.screen];
  screen.dataset.stage = preview.screen;
  document.documentElement.lang = preview.language;
  document.title = `${current.title} · Khonnai · Prototype`;
  screen.innerHTML = `<div class="screen-enter">${preview.screen === "check-email" ? `<div class="check-symbol">${icon.email}</div>` : ""}<h1 id="screen-title" tabindex="-1">${current.title}</h1><p id="notice" class="notice" role="status" tabindex="-1" hidden></p>${current.body}</div>`;
  const email = document.getElementById("email");
  if (email) email.value = preview.email;
  const enteredEmail = screen.querySelector("[data-entered-email]");
  if (enteredEmail) enteredEmail.textContent = preview.email;
  document.getElementById("language-label").textContent = text.language;
  document.getElementById("review-title").textContent = text.reviewTitle;
  document.getElementById("review-note").textContent = text.reviewNote;
  document.getElementById("appearance-label").textContent = text.appearance;
  document.getElementById("scenario-label").textContent = text.scenario;
  const appearanceOptions = document.getElementById("appearance").options;
  appearanceOptions[0].textContent = text.halo;
  appearanceOptions[1].textContent = text.edge;
  Array.from(document.getElementById("scenario").options).forEach((option, i) => { option.textContent = text.scenarioNames[i]; });
  if (preview.message) showMessage(preview.message);
  if (focusTitle) document.getElementById("screen-title").focus();
}

function fieldError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message || "";
  error.hidden = !message;
  return !message;
}

function validateEmail() {
  const email = document.getElementById("email");
  if (!email) return true;
  email.value = email.value.trim();
  preview.email = email.value;
  return fieldError(email, !email.value || email.validity.typeMismatch ? t().invalidEmail : null);
}

function validatePassword() {
  const password = document.getElementById("password");
  if (!password) return true;
  if (!password.value) return fieldError(password, t().requiredPassword);
  if (preview.screen === "signup") {
    const failed = passwordRules.find(rule => rule.id !== "match" && !rule.passes(password.value));
    if (failed) return fieldError(password, t()[failed.error]);
  }
  return fieldError(password, null);
}

function showMessage(key) {
  const notice = document.getElementById("notice");
  notice.textContent = `${t()[key]}${key === "disconnected" ? "" : ` ${t().simulationNote}`}`;
  notice.hidden = false;
  notice.classList.toggle("error", key !== "disconnected");
}

function simulateAction(provider = false) {
  if (preview.pending) return;
  clearPassword();
  preview.pending = true;
  const activeScreen = preview.screen;
  const activeScenario = preview.scenario;
  screen.querySelectorAll('button[type="submit"], button[data-action="google"]').forEach((node) => {
    node.disabled = true;
    node.setAttribute("aria-busy", "true");
  });
  const notice = document.getElementById("notice");
  notice.classList.remove("error");
  notice.hidden = false;
  notice.textContent = `${t().pending} ${t().reviewNote}`;
  pendingTimer = setTimeout(() => {
    preview.pending = false;
    if (!provider && ["signup", "recovery"].includes(activeScreen) && activeScenario === "disconnected") {
      navigate("check-email");
      return;
    }
    preview.message = activeScenario;
    render();
    document.getElementById("notice").focus();
  }, 600);
}

screen.addEventListener("submit", (event) => {
  event.preventDefault();
  if (preview.pending) return;
  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  const confirmationValid = validateConfirmation();
  updatePasswordRules();
  if (!emailValid || !passwordValid || !confirmationValid) {
    screen.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  if (preview.screen === "email") navigate("password");
  else if (preview.screen === "signup-email") navigate("signup");
  else simulateAction();
});

screen.addEventListener("input", (event) => {
  if (event.target.id === "email") preview.email = event.target.value;
  if (preview.screen === "signup") {
    updatePasswordRules();
    const changedPassword = event.target.matches("input[data-password]");
    if (changedPassword && event.target.hasAttribute("aria-invalid")) {
      if (event.target.id === "password") validatePassword();
      else validateConfirmation();
    }
    const confirmation = document.getElementById("confirm-password");
    if (confirmation.hasAttribute("aria-invalid") && event.target.id === "password") validateConfirmation();
    if (event.target.id === "email" && document.getElementById("password").hasAttribute("aria-invalid")) validatePassword();
  }
});

screen.addEventListener("focusout", (event) => {
  if (event.target.id === "email") validateEmail();
  if (event.target.id === "password") validatePassword();
});

screen.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "eye") {
    const password = document.getElementById(target.dataset.target || "password");
    const showing = password.type === "password";
    password.type = showing ? "text" : "password";
    target.setAttribute("aria-pressed", String(showing));
    target.setAttribute("aria-label", `${showing ? t().hide : t().show}${target.dataset.target ? ` · ${t().confirmPassword}` : ""}`);
  } else if (action === "google") simulateAction(true);
  else if (action === "signup") navigate("signup-email");
  else navigate(action);
});

document.getElementById("language").addEventListener("change", (event) => {
  clearTimeout(pendingTimer);
  preview.pending = false;
  preview.language = event.target.value;
  render(true);
});

document.getElementById("appearance").addEventListener("change", (event) => {
  preview.appearance = event.target.value;
  document.body.dataset.appearance = preview.appearance;
});

document.getElementById("scenario").addEventListener("change", (event) => {
  preview.scenario = event.target.value;
});

window.addEventListener("pagehide", () => {
  clearTimeout(pendingTimer);
  clearPassword();
  preview.email = "";
  preview.message = null;
  preview.pending = false;
});

render();
