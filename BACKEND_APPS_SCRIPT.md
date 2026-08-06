# Google Apps Script Backend Setup Guide & Code

This guide provides the complete Google Apps Script backend implementation for the **Project Nova Proposal Submission Portal**.

---

## 1. Google Drive & Google Sheet Setup

1. **Google Drive Folder**:
   - Primary Destination Folder: `1QVNh76dTlw4PcV7ZLpZyNxfAzZ3XBi0w`
   - URL: `https://drive.google.com/drive/folders/1QVNh76dTlw4PcV7ZLpZyNxfAzZ3XBi0w?usp=sharing`
   - All submitted PDF proposal documents will be stored in this folder.

2. **Google Sheet Structure**:
   Create a Google Sheet and name the active tab `Submissions` (or `Sheet1`). Configure the following column headers in Row 1:

| Column | Header | Description |
| :--- | :--- | :--- |
| **A** | `Timestamp` | Date & time of registration/submission |
| **B** | `Category` | `University` or `School` |
| **C** | `Team Name` | Name of the registered team |
| **D** | `Leader Name` | Name of team leader |
| **E** | `Leader Email` | Registered email address (Primary key) |
| **F** | `YouTube Link` | YouTube pitch/demonstration video URL |
| **G** | `Drive File URL` | Link to the uploaded proposal PDF in Google Drive |
| **H** | `Status` | `PENDING_VERIFICATION`, `VERIFIED`, or `SUBMITTED` |
| **I** | `OTP Code` | 6-digit verification code |
| **J** | `OTP Expiry` | ISO Timestamp when OTP expires |

---

## 2. Google Apps Script Code (`Code.gs`)

1. Open your Google Sheet.
2. Click **Extensions** → **Apps Script**.
3. Replace all content in `Code.gs` with the following production-ready script:

```javascript
/**
 * Project Nova Proposal Submission Portal Backend
 * Handles Email Lookup, OTP Generation & Mailing, OTP Verification, and PDF File Uploads to Google Drive.
 */

const DRIVE_FOLDER_ID = "1QVNh76dTlw4PcV7ZLpZyNxfAzZ3XBi0w";
const SHEET_NAME = "Submissions"; // Change if your tab name is different

/**
 * Handle HTTP POST Requests from Next.js Frontend
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    let result;
    if (action === "VERIFY_EMAIL") {
      result = handleVerifyEmail(contents.email);
    } else if (action === "VERIFY_OTP") {
      result = handleVerifyOtp(contents.email, contents.otp);
    } else if (action === "SUBMIT_PROPOSAL") {
      result = handleSubmitProposal(contents);
    } else {
      result = { success: false, error: "Invalid action requested" };
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
 * Step 1: Verify Email Address & Dispatch OTP Code
 */
function handleVerifyEmail(email) {
  if (!email) return { success: false, error: "Email address is required." };
  
  const cleanEmail = email.trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  let teamName = "";
  let leaderName = "";

  // Search row matching email (Column E = index 4)
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] && data[i][4].toString().trim().toLowerCase() === cleanEmail) {
      rowIndex = i + 1;
      teamName = data[i][2] || "Registered Team";
      leaderName = data[i][3] || "Team Leader";
      break;
    }
  }

  // If email is not found in registered list
  if (rowIndex === -1) {
    return {
      success: false,
      error: "Email address not found in registered teams list. Please verify your email."
    };
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

  // Update Sheet with OTP and status
  sheet.getRange(rowIndex, 8).setValue("PENDING_VERIFICATION"); // Column H: Status
  sheet.getRange(rowIndex, 9).setValue(otpCode);               // Column I: OTP Code
  sheet.getRange(rowIndex, 10).setValue(expiryTime);            // Column J: OTP Expiry

  // Send Email via Gmail App
  const subject = `[Project Nova] Verification Code: ${otpCode}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #001233; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #FFB81B; margin-top: 0;">PROJECT NOVA PROPOSAL PORTAL</h2>
      <p>Hello <strong>${leaderName}</strong> (${teamName}),</p>
      <p>Your 6-digit email verification code for Project Nova Proposal Submission is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #00e5ff; background: rgba(0,229,255,0.1); padding: 15px 25px; border-radius: 8px; width: fit-content; margin: 20px 0;">
        ${otpCode}
      </div>
      <p>This code will expire in 10 minutes. Do not share this code with anyone.</p>
      <hr style="border: 0.5px solid rgba(255,184,27,0.3); margin: 25px 0;" />
      <p style="font-size: 12px; color: #a0aec0;">Project Nova Organising Committee · AIESEC in USJ</p>
    </div>
  `;

  MailApp.sendEmail({
    to: cleanEmail,
    subject: subject,
    htmlBody: htmlBody
  });

  return {
    success: true,
    teamName: teamName,
    leaderName: leaderName,
    message: "OTP verification code sent successfully to " + cleanEmail
  };
}

/**
 * Step 2: Verify 6-digit OTP Code
 */
function handleVerifyOtp(email, inputOtp) {
  const cleanEmail = email.trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] && data[i][4].toString().trim().toLowerCase() === cleanEmail) {
      const storedOtp = data[i][8] ? data[i][8].toString().trim() : "";
      const expiry = data[i][9] ? new Date(data[i][9]) : null;

      if (storedOtp !== inputOtp.toString().trim()) {
        return { success: false, error: "Invalid OTP verification code. Please check and try again." };
      }

      if (expiry && new Date() > expiry) {
        return { success: false, error: "OTP has expired. Please request a new verification code." };
      }

      // Mark as Verified
      const rowIndex = i + 1;
      sheet.getRange(rowIndex, 8).setValue("VERIFIED");

      return {
        success: true,
        teamName: data[i][2] || "Team",
        leaderName: data[i][3] || "Leader",
        email: cleanEmail
      };
    }
  }

  return { success: false, error: "Email record not found." };
}

/**
 * Step 3: Upload Proposal PDF to Google Drive & Save Submission
 */
function handleSubmitProposal(data) {
  const cleanEmail = data.email.trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const sheetData = sheet.getDataRange().getValues();

  let rowIndex = -1;
  let teamName = "";
  let leaderName = "";

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][4] && sheetData[i][4].toString().trim().toLowerCase() === cleanEmail) {
      rowIndex = i + 1;
      teamName = sheetData[i][2];
      leaderName = sheetData[i][3];
      break;
    }
  }

  if (rowIndex === -1) {
    return { success: false, error: "Team registration record not found." };
  }

  // Upload PDF to Target Google Drive Folder
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const pdfBlob = Utilities.newBlob(
    Utilities.base64Decode(data.fileBase64),
    "application/pdf",
    `Nova_Proposal_${teamName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
  );
  
  const driveFile = folder.createFile(pdfBlob);
  driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const fileUrl = driveFile.getUrl();

  // Update Sheet with YouTube Link, Drive File Link, Status & Timestamp
  const now = new Date().toISOString();
  sheet.getRange(rowIndex, 1).setValue(now);             // Column A: Timestamp
  sheet.getRange(rowIndex, 6).setValue(data.youtubeUrl);  // Column F: YouTube Link
  sheet.getRange(rowIndex, 7).setValue(fileUrl);          // Column G: Drive File Link
  sheet.getRange(rowIndex, 8).setValue("SUBMITTED");      // Column H: Status

  // Send Confirmation Email
  const confirmationSubject = `[Project Nova] Proposal Submission Received - ${teamName}`;
  const confirmationBody = `
    <div style="font-family: Arial, sans-serif; background-color: #001233; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #FFB81B; margin-top: 0;">PROPOSAL SUBMISSION CONFIRMED</h2>
      <p>Congratulations <strong>${leaderName}</strong>,</p>
      <p>We have successfully received the proposal submission for <strong>${teamName}</strong>.</p>
      <ul>
        <li><strong>YouTube Pitch Link:</strong> <a href="${data.youtubeUrl}" style="color: #00e5ff;">${data.youtubeUrl}</a></li>
        <li><strong>Uploaded Proposal PDF:</strong> <a href="${fileUrl}" style="color: #00e5ff;">View File in Google Drive</a></li>
        <li><strong>Timestamp:</strong> ${now}</li>
      </ul>
      <p>Thank you for submitting your project proposal for Project Nova!</p>
      <hr style="border: 0.5px solid rgba(255,184,27,0.3); margin: 25px 0;" />
      <p style="font-size: 12px; color: #a0aec0;">Project Nova Organising Committee · AIESEC in USJ</p>
    </div>
  `;

  MailApp.sendEmail({
    to: cleanEmail,
    subject: confirmationSubject,
    htmlBody: confirmationBody
  });

  return {
    success: true,
    submissionId: "NOVA-SUB-" + Math.floor(100000 + Math.random() * 900000),
    fileUrl: fileUrl,
    timestamp: now
  };
}
```

---

## 3. Web App Deployment Instructions

1. In the Apps Script Editor, click **Deploy** → **New deployment**.
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Project Nova Proposal API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial for allowing frontend submissions without requiring user Google login)*
4. Click **Deploy**.
5. Grant permissions when prompted.
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 4. Next.js Integration Setup

Add your Web App URL to `.env.local` in your Next.js project root:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Now your Next.js Proposal Submission Portal is ready to send requests directly to Google Apps Script, dispatch real OTP emails, and upload PDFs directly into your Google Drive folder!
