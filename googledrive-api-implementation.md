# 📘 Documentation: Displaying Google Drive Files on the Frontend

## 1. Overview

This guide shows how to implement a **Google Drive File Browser** on the frontend using **Google Drive API (v3)** + **JavaScript (React or Vanilla)**.
The goal is to:

- Allow users to **browse folders and files** inside a shared Google Drive folder.
- Display results in a **hierarchical format** (folder tree, breadcrumbs, or list view).
- Allow **downloading or viewing** files with Google’s built-in file viewers.
- Avoid backend involvement (only frontend with an API key).

---

## 2. Prerequisites

1. **Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create/select a project.
   - Enable **Google Drive API**.
   - Create **API Key** (for public read-only shared folders, an API key is enough).

2. **A Shared Folder Link**

   - You need the **Folder ID**.
     Example:

   ```
   https://drive.google.com/drive/folders/1A2B3C4D5E6F
   ```

   Folder ID = `1A2B3C4D5E6F`

---

## 3. API Basics

Google Drive API endpoint for listing files in a folder:

```http
GET https://www.googleapis.com/drive/v3/files
?key=YOUR_API_KEY
&q='<FOLDER_ID>' in parents
&fields=files(id,name,mimeType,iconLink,thumbnailLink,webViewLink,webContentLink)
```

- `id` → Unique ID of file/folder
- `name` → File/folder name
- `mimeType` → Distinguishes folder vs file

  - Folder = `application/vnd.google-apps.folder`

- `iconLink` / `thumbnailLink` → For preview icons
- `webViewLink` → Open in PDF viewer (this will mostly contain PDF files), open external link in new tab
- `webContentLink` → Direct download link

---

## 4. Implementation Steps

### Step 1: Initialize Folder Fetch

```javascript
async function listFiles(folderId) {
  const apiKey = "YOUR_API_KEY";
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,iconLink,thumbnailLink,webViewLink,webContentLink)`;

  const res = await fetch(url);
  const data = await res.json();
  return data.files;
}
```

---

### Step 2: Distinguish Files vs Folders

```javascript
function renderFileItem(file, onFolderClick) {
  if (file.mimeType === "application/vnd.google-apps.folder") {
    return `
      <div class="folder" onclick="onFolderClick('${file.id}')">
        📁 ${file.name}
      </div>
    `;
  } else {
    return `
      <div class="file">
        📄 <a href="${file.webViewLink}" target="_blank">${file.name}</a>
      </div>
    `;
  }
}
```

---

### Step 3: Recursive Navigation (BreadCrumbs + Hierarchy)

```javascript
let breadcrumbs = [{ id: "ROOT_FOLDER_ID", name: "Root" }];

async function navigate(folderId) {
  const files = await listFiles(folderId);
  const container = document.getElementById("drive-browser");

  container.innerHTML = files.map((f) => renderFileItem(f, navigate)).join("");

  updateBreadcrumbs(folderId);
}

function updateBreadcrumbs(folderId) {
  const bc = document.getElementById("breadcrumbs");
  bc.innerHTML = breadcrumbs
    .map((b, i) => `<span onclick="navigate('${b.id}')">${b.name}</span>`)
    .join(" › ");
}
```

---

### Step 4: UI Structure (HTML Example)

```html
<div id="breadcrumbs"></div>
<div id="drive-browser"></div>

<script>
  navigate("ROOT_FOLDER_ID"); // Replace with your shared folder ID
</script>
```

---

### Step 5: File Viewing Options

- **Download File** → use `file.webContentLink`
- **Preview File** → use `file.webViewLink`
- **Image Thumbnail** → use `file.thumbnailLink`

Example:

```html
<div class="file">
  <img src="${file.iconLink}" />
  <a href="${file.webViewLink}" target="_blank">${file.name}</a>
</div>
```

---

## 5. Recommended Enhancements

- **Tree View / Collapsible Folders**: Use a React component library (e.g., `rc-tree` or custom).
- **Lazy Loading**: Fetch only when a folder is opened.
- **File Type Icons**: Map MIME types to custom icons.
- **Search Bar**: Add query support with `q=name contains 'keyword'`.
- **Pagination**: Drive API returns 100 files max, handle `nextPageToken`.

---

## 6. Limitations

- Requires **public/shared folders** (otherwise OAuth needed).
- API key usage is rate-limited (~100 requests/sec).
- No deep "syncing" — always fetched live from Google.

---

✅ With this doc, a dev in Cursor can implement:

- **Frontend-only GDrive file explorer**
- Browse folders hierarchically
- View/download files without backend

---
