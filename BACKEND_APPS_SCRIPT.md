# Google Apps Script Backend Setup Guide & Code

This guide provides the complete Google Apps Script backend implementation for the **Project Nova Video & LinkedIn Submission Portal**.

---

## 1. Google Sheet Column Layout

Configure your active tab (named `Submissions`) with the following column structure:

| Column | Col # | Header Name | Description | Mandatory / Optional |
| :--- | :--- | :--- | :--- | :--- |
| **B** | 2 (Col Index 1) | `Doc ID` | System Registration Document ID | Pre-filled |
| **C** | 3 (Col Index 2) | `Team Name` | Registered Team Name | Pre-filled |
| **D** | 4 (Col Index 3) | `Track` | Competition Track | Pre-filled |
| **E** | 5 (Col Index 4) | `Name` | Member / Leader Name | Pre-filled |
| **F** | 6 (Col Index 5) | `Email Address` | Registered Email (Primary Key) | Pre-filled |
| **G** | 7 (Col Index 6) | `Role` | Must contain "Leader" to submit | Pre-filled |
| **H** | 8 (Col Index 7) | `University` | University Name | Pre-filled |
| **K** | 11 (Col Index 10) | `WhatsApp Contact` | Leader Contact Number | Pre-filled |
| **T** | 20 (Col Index 19) | `OTP Code` | 6-digit OTP verification code | System Generated |
| **U** | 21 (Col Index 20) | `OTP Expiry` | ISO timestamp (5-minute expiry) | System Generated |
| **AC** | 29 | `YouTube Demo Link` | YouTube video submission URL | Submitted by Leader |
| **AD** | 30 | `YouTube Status` | `PENDING_VERIFICATION`, `VERIFIED`, `SUBMITTED` | System Generated |
| **AE** | 31 | `Submission Time` | ISO Timestamp of final submission | System Generated |
| **AF** | 32 | `Submission Reference` | Unique Reference (`NOVA-YT-XXXXXX`) | System Generated |
| **AG** | 33 | `Team Email Status` | `OTP_EMAIL_SENT`, `CONFIRMATION_EMAIL_SENT` | System Generated |
| **AH** | 34 | `Admin Notified Status`| `SENT` / `FAILED` | System Generated |
| **AI** | 35 | `Member 1 (Leader) LinkedIn` | Demo video LinkedIn post URL for Member 1 | **Required** |
| **AJ** | 36 | `Member 2 LinkedIn` | Demo video LinkedIn post URL for Member 2 | **Required** |
| **AK** | 37 | `Member 3 LinkedIn` | Demo video LinkedIn post URL for Member 3 | **Required** |
| **AL** | 38 | `Member 4 LinkedIn` | Demo video LinkedIn post URL for Member 4 | **Required** |
| **AM** | 39 | `Member 5 LinkedIn` | Demo video LinkedIn post URL for Member 5 | *Required only for 5-member teams* |

---

## 2. Google Apps Script Code (`Code.gs`)

1. Open your Google Sheet.
2. Click **Extensions** → **Apps Script**.
3. Replace all content in `Code.gs` with the following production-ready script:

```javascript
/**
 * Project Nova Video & LinkedIn Submission Portal Backend
 * Configured for YouTube Submissions starting at Column AC (Column 29)
 * and LinkedIn Member Post Submissions at Columns AI to AM (Columns 35 to 39).
 */

// ---------------------------------------------------------------------------
// ADMIN CONFIGURATION: Admin Emails
// ---------------------------------------------------------------------------
var ADMIN_EMAILS = [
  "isulaillepe2024@gmail.com",
  "isulailleperuma2022@gmail.com"
];

var SHEET_NAME = "Submissions"; // Active sheet name
var START_ROW_INDEX = 1;        // Scans Row 2 onwards (skips Row 1 header)
var SENDER_NAME = "Project Nova Organized by AIESEC in University of Sri Jayewardenepura";

// ---------------------------------------------------------------------------
// COLUMN INDEX CONFIGURATIONS
// ---------------------------------------------------------------------------
// Array Scanning (0-Indexed: Col A=0, B=1, C=2...)
var DOC_ID_COL_INDEX   = 1;  // Col B: Doc ID
var TEAM_COL_INDEX     = 2;  // Col C: Team Name
var TRACK_COL_INDEX    = 3;  // Col D: Track
var NAME_COL_INDEX     = 4;  // Col E: Member / Leader Name
var EMAIL_COL_INDEX    = 5;  // Col F: Email Address
var ROLE_COL_INDEX     = 6;  // Col G: Role ("Leader", "Team Leader", "Member")
var UNIV_COL_INDEX     = 7;  // Col H: University
var WHATSAPP_COL_INDEX = 10; // Col K: WhatsApp Contact

// OTP Columns
var OTP_CODE_INDEX     = 19; // Col T (0-indexed: 19)
var OTP_EXPIRY_INDEX   = 20; // Col U (0-indexed: 20)
var COL_OTP_CODE       = 20; // Col T (1-indexed for getRange)
var COL_OTP_EXPIRY     = 21; // Col U (1-indexed for getRange)

// YouTube Submission Columns (1-Indexed for sheet.getRange)
var COL_YT_LINK             = 29; // Col AC (29): YouTube Link
var COL_YT_STATUS           = 30; // Col AD (30): Status (SUBMITTED / VERIFIED)
var COL_YT_SUBMISSION_TIME  = 31; // Col AE (31): Submission Time
var COL_YT_SUBMISSION_REF   = 32; // Col AF (32): Submission Reference (NOVA-YT-XXXXXX)
var COL_YT_EMAIL_STATUS     = 33; // Col AG (33): Team Confirmation Email Status
var COL_YT_ADMIN_NOTIFIED   = 34; // Col AH (34): Admin Notified Status

// LinkedIn Post Submission Columns (1-Indexed for sheet.getRange - Columns after AH)
var COL_LINKEDIN_MEMBER_1   = 35; // Col AI (35): Member 1 (Leader) LinkedIn Post (Required)
var COL_LINKEDIN_MEMBER_2   = 36; // Col AJ (36): Member 2 LinkedIn Post (Required)
var COL_LINKEDIN_MEMBER_3   = 37; // Col AK (37): Member 3 LinkedIn Post (Required)
var COL_LINKEDIN_MEMBER_4   = 38; // Col AL (38): Member 4 LinkedIn Post (Required)
var COL_LINKEDIN_MEMBER_5   = 39; // Col AM (39): Member 5 LinkedIn Post (Required only for 5-member teams)

/**
 * Validates whether a provided URL is a valid YouTube link
 */
function isValidYouTubeUrl(url) {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url.trim());
}

/**
 * Validates whether a provided URL is a valid LinkedIn link (supports linkedin.com and lnkd.in)
 */
function isValidLinkedInUrl(url) {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(linkedin\.com|lnkd\.in)\/.+$/i.test(url.trim());
}

/**
 * HTTP POST Router for Next.js Frontend Requests
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = (contents.action || "").toString().trim().toUpperCase();

    let result;
    if (action === "VERIFY_EMAIL" || action === "CHECK_EMAIL") {
      result = handleVerifyEmail(contents.email);
    } else if (action === "VERIFY_OTP" || action === "VERIFY_CODE" || action === "CHECK_OTP") {
      const otpValue = contents.otp || contents.code || contents.otpCode || contents.verificationCode;
      result = handleVerifyOtp(contents.email, otpValue);
    } else if (
      action === "SUBMIT_DEMO_VIDEO" ||
      action === "SUBMIT_YOUTUBE" || 
      action === "SUBMIT_VIDEO" || 
      action === "SUBMIT_FIGMA" ||
      action === "SUBMIT_PROPOSAL" || 
      action === "SUBMIT" || 
      action === "UPLOAD_PROPOSAL"
    ) {
      result = handleSubmitProposal(contents);
    } else {
      result = { success: false, error: "Invalid action requested: " + contents.action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Action 1: Verify Email & Column G Leader Role Authorization, then Send 5-Minute OTP
 */
function handleVerifyEmail(email) {
  if (!email) return { success: false, error: "Email address is required." };

  clearExpiredOtps();
  
  const cleanEmail = email.trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) 
              || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  let teamName = "";
  let leaderName = "";
  let emailFound = false;

  for (let i = START_ROW_INDEX; i < data.length; i++) {
    const rowEmail = data[i][EMAIL_COL_INDEX] ? data[i][EMAIL_COL_INDEX].toString().trim().toLowerCase() : "";
    
    if (rowEmail === cleanEmail) {
      emailFound = true;
      const role = data[i][ROLE_COL_INDEX] ? data[i][ROLE_COL_INDEX].toString().trim().toLowerCase() : "";

      if (!role.includes("leader")) {
        return { 
          success: false, 
          error: "Access Restricted: You are registered as a Team Member. Only designated Team Leaders are authorized to submit proposals." 
        };
      }

      rowIndex = i + 1;
      teamName = data[i][TEAM_COL_INDEX] || "Registered Team";
      leaderName = data[i][NAME_COL_INDEX] || "Team Leader";
      break;
    }
  }

  if (!emailFound) {
    return { success: false, error: "Email address not found in the registered teams list. Please verify your email address." };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 Minute Lifespan

  sheet.getRange(rowIndex, COL_YT_STATUS).setValue("PENDING_VERIFICATION"); // Col AD (30)
  sheet.getRange(rowIndex, COL_OTP_CODE).setValue(otpCode);                 // Col T (20)
  sheet.getRange(rowIndex, COL_OTP_EXPIRY).setValue(expiryTime);             // Col U (21)

  try {
    MailApp.sendEmail({
      to: cleanEmail,
      name: SENDER_NAME,
      subject: `[Project Nova] Verification Code: ${otpCode}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #001233; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,229,255,0.2);">
          <img src="https://i.imgur.com/gi8943h.png" alt="Project Nova Banner" style="width: 100%; display: block;" />
          <div style="padding: 30px;">
            <h2 style="color: #FFB81B; margin-top: 0;">VERIFICATION CODE</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello <strong>${leaderName}</strong> (${teamName}),</p>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Your 6-digit email verification code for the Video & LinkedIn Submission Portal is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #000000; background: #ffffff; padding: 15px 25px; border-radius: 8px; width: fit-content; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="color: #ff4d4d; font-weight: bold;">⚠️ This code expires in 5 minutes.</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,184,27,0.2); margin: 25px 0;" />
            <div style="text-align: center;">
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 5px 0;">If you have any questions, feel free to reach out to our team.</p>
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 2px 0;">Manasha Fernando : 074 119 0028</p>
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 2px 0;">Vinothini Vickneshwaran : 071 362 0303</p>
            </div>
          </div>
        </div>
      `
    });
    sheet.getRange(rowIndex, COL_YT_EMAIL_STATUS).setValue("OTP_EMAIL_SENT"); // Col AG (33)
  } catch (err) {
    sheet.getRange(rowIndex, COL_YT_EMAIL_STATUS).setValue("OTP_EMAIL_FAILED: " + err.toString());
    return { success: false, error: "Failed to send verification email. Please try again." };
  }

  return { success: true, teamName: teamName, leaderName: leaderName };
}

/**
 * Action 2: Verify OTP Code
 */
function handleVerifyOtp(email, inputOtp) {
  if (!email || !inputOtp) return { success: false, error: "Email and OTP code are required." };
  
  const cleanEmail = email.trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
              || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = sheet.getDataRange().getValues();

  for (let i = START_ROW_INDEX; i < data.length; i++) {
    if (data[i][EMAIL_COL_INDEX] && data[i][EMAIL_COL_INDEX].toString().trim().toLowerCase() === cleanEmail) {
      const rowIndex = i + 1;
      const storedOtp = data[i][OTP_CODE_INDEX] ? data[i][OTP_CODE_INDEX].toString().trim() : "";
      const expiryStr = data[i][OTP_EXPIRY_INDEX] ? data[i][OTP_EXPIRY_INDEX].toString().trim() : "";
      const expiry = expiryStr ? new Date(expiryStr) : null;

      if (!expiry || new Date() > expiry) {
        sheet.getRange(rowIndex, COL_OTP_CODE).setValue("");
        sheet.getRange(rowIndex, COL_OTP_EXPIRY).setValue("");
        return { success: false, error: "OTP code has expired (5-minute limit reached). Please request a new code." };
      }

      if (storedOtp !== inputOtp.toString().trim()) {
        return { success: false, error: "Invalid OTP verification code. Please try again." };
      }

      sheet.getRange(rowIndex, COL_YT_STATUS).setValue("VERIFIED"); // Col AD (30)
      sheet.getRange(rowIndex, COL_OTP_CODE).setValue("");          // Col T (20)
      sheet.getRange(rowIndex, COL_OTP_EXPIRY).setValue("");        // Col U (21)

      return {
        success: true,
        teamName: data[i][TEAM_COL_INDEX] || "Team",
        leaderName: data[i][NAME_COL_INDEX] || "Leader",
        email: cleanEmail
      };
    }
  }

  return { success: false, error: "Email address not found in the registered teams list." };
}

/**
 * Action 3: Save YouTube & LinkedIn Links, Update Record, Dispatch Confirmation & Alert Admins
 */
function handleSubmitProposal(data) {
  if (!data) return { success: false, error: "No payload provided." };

  const inputEmail = (data.email || data.leaderEmail || data.userEmail || "").toString().trim().toLowerCase();
  const youtubeLink = (
    data.youtubeUrl ||
    data.youtubeLink ||
    data.videoUrl ||
    data.videoLink ||
    data.demoUrl ||
    data.fileUrl ||
    data.link ||
    data.proposalLink ||
    ""
  ).toString().trim();

  // Extract LinkedIn links (supports individual keys or arrays)
  const linkedinLinks = Array.isArray(data.linkedinLinks) ? data.linkedinLinks : [];
  const linkedin1 = (data.linkedin1 || data.linkedIn1 || linkedinLinks[0] || "").toString().trim();
  const linkedin2 = (data.linkedin2 || data.linkedIn2 || linkedinLinks[1] || "").toString().trim();
  const linkedin3 = (data.linkedin3 || data.linkedIn3 || linkedinLinks[2] || "").toString().trim();
  const linkedin4 = (data.linkedin4 || data.linkedIn4 || linkedinLinks[3] || "").toString().trim();
  const linkedin5 = (data.linkedin5 || data.linkedIn5 || linkedinLinks[4] || "").toString().trim();

  if (!inputEmail) return { success: false, error: "Email address is required." };
  if (!youtubeLink) return { success: false, error: "YouTube video submission link is required." };

  // 1. Validate YouTube Link Format
  if (!isValidYouTubeUrl(youtubeLink)) {
    return { 
      success: false, 
      error: "Invalid YouTube URL. Please provide a valid YouTube link (e.g., https://youtu.be/... or https://www.youtube.com/watch?v=...)." 
    };
  }

  // 2. Validate Required Member LinkedIn Links (Members 1 - 4 are mandatory)
  if (!linkedin1 || !isValidLinkedInUrl(linkedin1)) {
    return { success: false, error: "Member 1 (Team Leader) valid LinkedIn post link is required." };
  }
  if (!linkedin2 || !isValidLinkedInUrl(linkedin2)) {
    return { success: false, error: "Member 2 valid LinkedIn post link is required." };
  }
  if (!linkedin3 || !isValidLinkedInUrl(linkedin3)) {
    return { success: false, error: "Member 3 valid LinkedIn post link is required." };
  }
  if (!linkedin4 || !isValidLinkedInUrl(linkedin4)) {
    return { success: false, error: "Member 4 valid LinkedIn post link is required." };
  }
  // Member 5 is optional, but if provided, must be a valid LinkedIn URL
  if (linkedin5 && !isValidLinkedInUrl(linkedin5)) {
    return { success: false, error: "Member 5 LinkedIn link is invalid. Please provide a valid LinkedIn URL or leave blank." };
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
              || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const sheetData = sheet.getDataRange().getValues();

  let rowIndex = -1;
  let docId = "";
  let teamName = "";
  let trackName = "";
  let leaderName = "";
  let university = "";
  let whatsapp = "";

  // 3. Locate Leader Row & Validate Authorization
  for (let i = START_ROW_INDEX; i < sheetData.length; i++) {
    const rowEmail = sheetData[i][EMAIL_COL_INDEX] ? sheetData[i][EMAIL_COL_INDEX].toString().trim().toLowerCase() : "";
    if (rowEmail === inputEmail) {
      const role = sheetData[i][ROLE_COL_INDEX] ? sheetData[i][ROLE_COL_INDEX].toString().trim().toLowerCase() : "";
      
      if (!role.includes("leader")) {
        return { success: false, error: "Access Restricted: You are registered as a Team Member. Only designated Team Leaders are authorized to submit proposals." };
      }

      rowIndex = i + 1;
      docId = sheetData[i][DOC_ID_COL_INDEX] ? sheetData[i][DOC_ID_COL_INDEX].toString().trim() : "N/A";
      teamName = sheetData[i][TEAM_COL_INDEX] ? sheetData[i][TEAM_COL_INDEX].toString().trim() : "Registered Team";
      trackName = sheetData[i][TRACK_COL_INDEX] ? sheetData[i][TRACK_COL_INDEX].toString().trim() : "N/A";
      leaderName = sheetData[i][NAME_COL_INDEX] ? sheetData[i][NAME_COL_INDEX].toString().trim() : "Team Leader";
      university = sheetData[i][UNIV_COL_INDEX] ? sheetData[i][UNIV_COL_INDEX].toString().trim() : "N/A";
      whatsapp = sheetData[i][WHATSAPP_COL_INDEX] ? sheetData[i][WHATSAPP_COL_INDEX].toString().trim() : "N/A";
      break;
    }
  }

  if (rowIndex === -1) {
    return { success: false, error: "Email address not found in the registered teams list." };
  }

  // 4. Find All Unique Member Emails Associated with this Team Name
  let teamEmails = [];
  const targetTeamClean = teamName.toLowerCase();

  for (let i = START_ROW_INDEX; i < sheetData.length; i++) {
    const rowTeam = sheetData[i][TEAM_COL_INDEX] ? sheetData[i][TEAM_COL_INDEX].toString().trim().toLowerCase() : "";
    const rowEmail = sheetData[i][EMAIL_COL_INDEX] ? sheetData[i][EMAIL_COL_INDEX].toString().trim().toLowerCase() : "";
    
    if (rowTeam === targetTeamClean && rowEmail && teamEmails.indexOf(rowEmail) === -1) {
      teamEmails.push(rowEmail);
    }
  }

  if (teamEmails.length === 0) {
    teamEmails.push(inputEmail);
  }

  const submissionId = "NOVA-YT-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  // 5. Save YouTube Link & Submission Details to Spreadsheet Columns AC onwards
  sheet.getRange(rowIndex, COL_YT_LINK).setValue(youtubeLink);          // Col AC (29)
  sheet.getRange(rowIndex, COL_YT_STATUS).setValue("SUBMITTED");         // Col AD (30)
  sheet.getRange(rowIndex, COL_YT_SUBMISSION_TIME).setValue(now);        // Col AE (31)
  sheet.getRange(rowIndex, COL_YT_SUBMISSION_REF).setValue(submissionId);// Col AF (32)
  sheet.getRange(rowIndex, COL_OTP_CODE).setValue("");                   // Clear Col T
  sheet.getRange(rowIndex, COL_OTP_EXPIRY).setValue("");                 // Clear Col U

  // 6. Save LinkedIn Member Links (Columns AI onwards)
  sheet.getRange(rowIndex, COL_LINKEDIN_MEMBER_1).setValue(linkedin1);   // Col AI (35)
  sheet.getRange(rowIndex, COL_LINKEDIN_MEMBER_2).setValue(linkedin2);   // Col AJ (36)
  sheet.getRange(rowIndex, COL_LINKEDIN_MEMBER_3).setValue(linkedin3);   // Col AK (37)
  sheet.getRange(rowIndex, COL_LINKEDIN_MEMBER_4).setValue(linkedin4);   // Col AL (38)
  sheet.getRange(rowIndex, COL_LINKEDIN_MEMBER_5).setValue(linkedin5);   // Col AM (39)

  // Build HTML list for LinkedIn links in emails
  let linkedInHtmlList = `
    <li style="margin-bottom: 6px;"><strong>Member 1 (Leader):</strong> <a href="${linkedin1}" style="color: #00e5ff; word-break: break-all;" target="_blank">${linkedin1}</a></li>
    <li style="margin-bottom: 6px;"><strong>Member 2:</strong> <a href="${linkedin2}" style="color: #00e5ff; word-break: break-all;" target="_blank">${linkedin2}</a></li>
    <li style="margin-bottom: 6px;"><strong>Member 3:</strong> <a href="${linkedin3}" style="color: #00e5ff; word-break: break-all;" target="_blank">${linkedin3}</a></li>
    <li style="margin-bottom: 6px;"><strong>Member 4:</strong> <a href="${linkedin4}" style="color: #00e5ff; word-break: break-all;" target="_blank">${linkedin4}</a></li>
  `;
  if (linkedin5) {
    linkedInHtmlList += `<li style="margin-bottom: 6px;"><strong>Member 5:</strong> <a href="${linkedin5}" style="color: #00e5ff; word-break: break-all;" target="_blank">${linkedin5}</a></li>`;
  }

  // 7. Dispatch Confirmation Email to ALL Team Members
  try {
    MailApp.sendEmail({
      to: teamEmails.join(","),
      name: SENDER_NAME,
      subject: `[Project Nova] Demo Video & LinkedIn Submission Confirmed - ${submissionId}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #001233; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 229, 255, 0.2);">
          <img src="https://i.imgur.com/gi8943h.png" alt="Project Nova Banner" style="width: 100%; display: block;" />
          <div style="padding: 30px;">
            <h2 style="color: #FFB81B; margin-top: 0; font-size: 22px; text-transform: uppercase;">Submission Successful!</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hello Team <strong>${teamName}</strong>,</p>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Thank you for submitting your project materials. Your YouTube demo video and team LinkedIn post links have been officially registered in our portal.</p>
            
            <div style="background-color: rgba(255, 255, 255, 0.05); border-left: 4px solid #00e5ff; padding: 18px; margin: 25px 0; border-radius: 6px;">
              <p style="margin: 4px 0; color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Submission Reference</p>
              <p style="margin: 0 0 12px 0; color: #00e5ff; font-size: 18px; font-weight: bold;">${submissionId}</p>
              
              <p style="margin: 4px 0; color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Team Name</p>
              <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${teamName}</p>
              
              <p style="margin: 4px 0; color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Submitted By (Team Leader)</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 600;">${leaderName}</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${youtubeLink}" target="_blank" style="background-color: #FF0000; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 15px; border-radius: 8px; display: inline-block;">
                ▶ Watch Submitted YouTube Video
              </a>
            </div>

            <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(0, 229, 255, 0.15); padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #00e5ff; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Submitted LinkedIn Post Links:</h4>
              <ul style="padding-left: 20px; margin: 0; font-size: 13px; color: #cbd5e0; line-height: 1.6;">
                ${linkedInHtmlList}
              </ul>
            </div>

            <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 15px 0 5px 0;">If you need to make updates before the deadline, your team leader can resubmit through the portal.</p>
            
            <hr style="border: 0; border-top: 1px solid rgba(255, 184, 27, 0.2); margin: 25px 0;" />
            <div style="text-align: center;">
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 5px 0;">If you have any questions, feel free to reach out to our team.</p>
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 2px 0;">Manasha Fernando : 074 119 0028</p>
              <p style="font-size: 13px; color: #a0aec0; line-height: 1.5; margin: 2px 0;">Vinothini Vickneshwaran : 071 362 0303</p>
            </div>
          </div>
        </div>
      `
    });
    sheet.getRange(rowIndex, COL_YT_EMAIL_STATUS).setValue("CONFIRMATION_EMAIL_SENT"); // Col AG (33)
  } catch (err) {
    sheet.getRange(rowIndex, COL_YT_EMAIL_STATUS).setValue("CONFIRMATION_EMAIL_FAILED: " + err.toString());
  }

  // 8. Alert Admins
  try {
    if (ADMIN_EMAILS && ADMIN_EMAILS.length > 0) {
      MailApp.sendEmail({
        to: ADMIN_EMAILS.join(","),
        name: SENDER_NAME,
        subject: `🚨 [Admin Alert] New Video & LinkedIn Submission - ${teamName} (${submissionId})`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; background-color: #001233; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 184, 27, 0.4);">
            <img src="https://i.imgur.com/gi8943h.png" alt="Project Nova Banner" style="width: 100%; display: block;" />
            <div style="background-color: #FFB81B; padding: 15px 25px; color: #001233;">
              <h3 style="margin: 0; font-size: 18px; text-transform: uppercase;">NEW VIDEO & LINKEDIN SUBMISSION RECEIVED</h3>
            </div>
            <div style="padding: 25px;">
              <p style="color: #e2e8f0; font-size: 14px;">A new submission has been received on the Project Nova Portal:</p>
              
              <div style="background-color: rgba(255, 255, 255, 0.05); border-left: 4px solid #FFB81B; padding: 15px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Submission Reference</p>
                <p style="margin: 0 0 10px 0; color: #00e5ff; font-weight: bold; font-size: 16px;">${submissionId}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Doc ID</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${docId}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Team Name</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${teamName}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Track</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${trackName}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">University</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${university}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">WhatsApp Contact</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${whatsapp}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Team Leader</p>
                <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">${leaderName} (${inputEmail})</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Submission Time</p>
                <p style="margin: 0 0 10px 0; color: #ffffff;">${now}</p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">YouTube Video Link</p>
                <p style="margin: 0 0 10px 0; color: #00e5ff; word-break: break-all;"><a href="${youtubeLink}" target="_blank" style="color: #00e5ff;">${youtubeLink}</a></p>

                <p style="margin: 4px 0; color: #a0aec0; font-size: 11px; text-transform: uppercase;">Member LinkedIn Post Links</p>
                <ul style="padding-left: 20px; margin: 0; font-size: 12px; color: #ffffff;">
                  ${linkedInHtmlList}
                </ul>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${youtubeLink}" target="_blank" style="background-color: #FF0000; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 14px; border-radius: 6px; display: inline-block;">
                  ▶ Open YouTube Video
                </a>
              </div>
              <p style="font-size: 12px; color: #718096; text-align: center; margin: 0;">Project Nova Automated Portal Backend</p>
            </div>
          </div>
        `
      });
      sheet.getRange(rowIndex, COL_YT_ADMIN_NOTIFIED).setValue("SENT"); // Col AH (34)
    }
  } catch (adminErr) {
    sheet.getRange(rowIndex, COL_YT_ADMIN_NOTIFIED).setValue("FAILED: " + adminErr.toString());
  }

  return {
    success: true,
    submissionId: submissionId,
    teamName: teamName,
    leaderName: leaderName,
    email: inputEmail,
    youtubeLink: youtubeLink,
    linkedin1: linkedin1,
    linkedin2: linkedin2,
    linkedin3: linkedin3,
    linkedin4: linkedin4,
    linkedin5: linkedin5,
    timestamp: now
  };
}

/**
 * Background Task: Automatically scans and erases OTPs older than 5 minutes.
 */
function clearExpiredOtps() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) 
              || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = START_ROW_INDEX; i < data.length; i++) {
    const otp = data[i][OTP_CODE_INDEX];
    const expiryStr = data[i][OTP_EXPIRY_INDEX];

    if (otp && expiryStr) {
      const expiry = new Date(expiryStr);
      if (now > expiry) {
        const rowIndex = i + 1;
        sheet.getRange(rowIndex, COL_OTP_CODE).setValue("");
        sheet.getRange(rowIndex, COL_OTP_EXPIRY).setValue("");
      }
    }
  }
}
```

---

## 3. Web App Deployment Instructions

1. In the Apps Script Editor, click **Deploy** → **New deployment** (or **Manage deployments** → **Edit** → **New version** if updating).
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Project Nova Video & LinkedIn Submission API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial for allowing frontend submissions without requiring user Google login)*
4. Click **Deploy**.
5. Grant permissions when prompted.
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 4. Next.js Integration Setup

Add your Web App URL to `.env.local` or `.env` in your Next.js project root:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```