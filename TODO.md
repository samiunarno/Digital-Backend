# TODO

## Goal
Make the AI UI/global navbar work everywhere, add AI history + “new chat” option on the AI page.

## Steps
1. Implement a global navbar component shared across pages (Portfolio/Admin/AI pages) and remove/avoid per-page nav duplication.
2. Ensure the AI entry button navigates to the AI page and also triggers chat “new chat” state if needed.
3. Add conversation history support to `AIChatPage`:
   - New chat button resets current thread.
   - History list loads persisted threads.
   - Clicking a history item restores messages.
4. Decide persistence layer:
   - First implement localStorage-based persistence (fast, no backend DB required).
   - Optionally later connect to backend if persistence is required across devices.
5. Update routing so AI page supports history + query params (e.g. `?chatId=`) for deep linking.
6. Wire any existing floating chatbot (`JoyiChat`) to open the full AI page in the correct mode.
7. Run build/lint/tests (if available) and manually verify:
   - Navbar visible everywhere.
   - AI page shows “History” and “New chat”.
   - Switching chats restores messages correctly.

