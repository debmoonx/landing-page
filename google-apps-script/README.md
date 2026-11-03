# Google Sheets setup for Work with Deb

The Apps Script integration is in `google-apps-script/Code.gs`.

## One-time setup

1. Open https://script.google.com while signed into the Google account that should own the inquiry sheet.
2. Create a new project named **Work with Deb Inquiries**.
3. Replace the starter code with the contents of `google-apps-script/Code.gs` in this repository.
4. Select the `setup` function and click **Run**. Approve the Google Sheets and email permissions. This creates the spreadsheet and emails its link to `ezinneifegwu@gmail.com`.
5. Click **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and copy the Web app URL ending in `/exec`.
7. Add that URL to the website as `VITE_GOOGLE_SHEETS_WEBHOOK` in the GitHub repository's Actions secrets, then rerun the **Deploy website to GitHub Pages** workflow.

The public website sends inquiry details to this endpoint. The Apps Script writes each submission to the **Inquiries** tab and emails a notification to the address above.

## Important

- The Apps Script URL is a public form endpoint. Do not put Google passwords, API keys, or private credentials in the website.
- The current form sends attachment names and sizes only; it does not upload the actual file.
- Test with a submission you control before sharing the website.
