// import dns from "dns/promises";

// // ✅ Step 0: Load disposable email domains safely
// let disposableDomains = [];
// try {
//   const data = await import("disposable-email-domains/index.json", {
//     with: { type: "json" }, // Modern syntax; "assert" deprecated in Node 23+
//   });
//   disposableDomains = data.default;
//   console.log(`✅ Loaded ${disposableDomains.length} disposable domains`);
// } catch (err) {
//   console.error("❌ Failed to load disposable domains list:", err.message);
// }


// // ✅ Main validation function
// export const validateEmail = async (email) => {
//   // Step 1: Syntax check
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return { email, status: "Bad", reason: "Invalid email syntax" };
//   }

//   // Step 2: Extract domain
//   const domain = email.split("@")[1];
//   if (!domain) {
//     return { email, status: "Bad", reason: "Domain not found" };
//   }

//   // Step 3: Check disposable domain
//   if (disposableDomains.includes(domain)) {
//     return { email, status: "Bad", reason: "Disposable or temporary email domain" };
//   }

//   // Step 4: MX Record Check
//   try {
//     const mxRecords = await dns.resolveMx(domain);
//     if (!mxRecords?.length) {
//       return { email, status: "Bad", reason: "No MX records found" };
//     }

//     // ✅ Step 5: Trusted email providers
//     const trustedMailProviders = [
//       "google.com", "gmail-smtp-in.l.google.com",
//       "outlook.com", "hotmail.com", "office365.com",
//       "yahoodns.net", "yahoo.com", "icloud.com",
//       "me.com", "apple.com", "zoho.com", "zohomail.com",
//       "yandex.net", "protonmail.com", "pm.me",
//       "fastmail.com", "tutanota.com", "gmx.com",
//       "1and1.com", "ionos.com", "rackspace.com",
//       "godaddy.com", "dreamhost.com", "mailgun.org",
//       "sendgrid.net", "amazonaws.com", "aws-ses",
//       "postmarkapp.com", "sparkpostmail.com",
//       "aol.com", "hey.com", "protection.outlook.com",
//       "googlemail.com", "smtp.secureserver.net",
//       "mx.cloudflare.net", "mx.cloudflare.com",
//       "mx.migadu.com", ".edu"
//     ];

//     // Step 6: Identify trusted MX servers
//     const validMX = mxRecords.some(record =>
//       trustedMailProviders.some(provider =>
//         record.exchange.toLowerCase().includes(provider)
//       )
//     );

//     if (validMX) {
//       return { email, status: "Good", reason: "Domain has valid MX records" };
//     } else {
//       return { email, status: "Risky", reason: "MX record found but not from a known provider" };
//     }

//   } catch {
//     return { email, status: "Bad", reason: "Domain lookup failed or invalid" };
//   }
// };
import dns from "dns/promises";

// ✅ Load disposable email domains safely
let disposableDomains = [];
try {
  const data = await import("disposable-email-domains/index.json", {
    with: { type: "json" },
  });
  disposableDomains = data.default;
  console.log(`✅ Loaded ${disposableDomains.length} disposable domains`);
} catch (err) {
  console.error("❌ Failed to load disposable domains list:", err.message);
}

// ✅ Main validation function
export const validateEmail = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { email, status: "Bad", reason: "Invalid email syntax", mx_found: false };
  }

  const domain = email.split("@")[1];
  if (!domain) {
    return { email, status: "Bad", reason: "Domain not found", mx_found: false };
  }

  if (disposableDomains.includes(domain)) {
    return { email, status: "Bad", reason: "Disposable or temporary email domain", mx_found: false };
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    const mx_found = mxRecords?.length > 0;

    if (!mx_found) {
      return { email, domain, status: "Bad", reason: "No MX records found", mx_found: false };
    }

    const trustedMailProviders = [
      "google.com", "gmail-smtp-in.l.google.com",
      "outlook.com", "hotmail.com", "office365.com",
      "yahoodns.net", "yahoo.com", "icloud.com",
      "me.com", "apple.com", "zoho.com", "zohomail.com",
      "yandex.net", "protonmail.com", "pm.me",
      "fastmail.com", "tutanota.com", "gmx.com",
      "1and1.com", "ionos.com", "rackspace.com",
      "godaddy.com", "dreamhost.com", "mailgun.org",
      "sendgrid.net", "amazonaws.com", "aws-ses",
      "postmarkapp.com", "sparkpostmail.com",
      "aol.com", "hey.com", "protection.outlook.com",
      "googlemail.com", "smtp.secureserver.net",
      "mx.cloudflare.net", "mx.cloudflare.com",
      "mx.migadu.com", ".edu"
    ];

    const validMX = mxRecords.some(record =>
      trustedMailProviders.some(provider =>
        record.exchange.toLowerCase().includes(provider)
      )
    );

    if (validMX) {
      return { email, domain, status: "Good", reason: "Domain has valid MX records", mx_found: true };
    } else {
      return { email, domain, status: "Risky", reason: "MX record found but not from a known provider", mx_found: true };
    }

  } catch (err) {
    console.error("❌ MX lookup error:", err.message);
    return { email, domain, status: "Bad", reason: "Domain lookup failed or invalid", mx_found: false };
  }
};
