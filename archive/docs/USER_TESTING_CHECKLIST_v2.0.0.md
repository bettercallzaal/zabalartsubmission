# ZABAL Live Hub – User Testing Checklist (v2.0.0)

**Purpose:** Validate the complete voting experience in the Farcaster Mini App  
**Target Users:** Normal Farcaster users (non-developers)  
**Environment:** Warpcast mobile app or desktop client

---

## A. First-Time User Flow

### 1. Opening the App
**Action:** Open ZABAL Live Hub from Warpcast  
**Expected Result:** App loads within 3 seconds, splash screen appears briefly

### 2. Splash Screen
**Action:** Wait for splash screen to dismiss  
**Expected Result:** Splash screen disappears automatically, main voting interface appears

### 3. Authentication
**Action:** Check top-right corner of the app  
**Expected Result:** Your Farcaster username and profile picture are displayed

### 4. Daily Voting Availability
**Action:** Scroll to the "Vote Today" section  
**Expected Result:** Four voting cards are visible (Studio Mode, Market Mode, Social Mode, Battle Mode), all are clickable

---

## B. Daily Voting

### 5. First Vote
**Action:** Click any mode card (e.g., "Studio Mode")  
**Expected Result:**
- Green checkmark appears on the selected card
- Toast notification: "Vote Recorded - Voted for Studio Mode"
- Share modal opens asking if you want to share your vote
- Vote count increases by your vote power (1-6)

### 6. Dismiss Share Modal
**Action:** Click "Close" or tap outside the share modal  
**Expected Result:** Share modal closes, you return to the main screen

### 7. Vote Override
**Action:** Click a **different** mode card (e.g., "Market Mode")  
**Expected Result:**
- Green checkmark moves to the new card
- Toast notification: "Vote Changed from Studio Mode to Market Mode"
- **No share modal appears**
- Vote counts update (Studio decreases, Market increases)

### 8. Vote Confirmation
**Action:** Click the **same** mode card again (e.g., "Market Mode")  
**Expected Result:**
- Toast notification: "Vote Confirmed - Voted for Market Mode"
- **No share modal appears**
- Vote counts remain the same

### 9. No Duplicate Toasts
**Action:** Click any mode card  
**Expected Result:** Only **one** toast notification appears (no duplicates stacking)

---

## C. Weekly Voting (Gated)

### 10. Locked State (Before Daily Vote)
**Action:** Scroll to "Weekly Social Focus" section **before voting daily**  
**Expected Result:**
- All platform cards are blurred/grayed out
- Text reads: "🔒 Vote daily to unlock weekly voting"
- Cards are not clickable

### 11. Unlock After Daily Vote
**Action:** Vote on any daily mode, then scroll to "Weekly Social Focus"  
**Expected Result:**
- Platform cards are now clear and colorful
- Text reads: "Vote for your preferred platform this week"
- Cards are clickable

### 12. Visual Confirmation of Unlock
**Action:** Look at the weekly voting section  
**Expected Result:** No blur overlay, cards look vibrant and interactive

### 13. First Weekly Vote
**Action:** Click any platform card (e.g., "🟣 Farcaster")  
**Expected Result:**
- Green checkmark appears on the selected card
- Toast notification: "Vote Recorded - Voted for Farcaster"
- Share modal opens
- Vote count increases

### 14. Weekly Vote Override
**Action:** Click a **different** platform card (e.g., "🐦 X (Twitter)")  
**Expected Result:**
- Green checkmark moves to the new card
- Toast notification: "Vote Changed from Farcaster to X (Twitter)"
- **No share modal appears**
- Vote counts update

### 15. Weekly Vote Confirmation
**Action:** Click the **same** platform card again  
**Expected Result:**
- Toast notification: "Vote Confirmed - Voted for X (Twitter)"
- **No share modal appears**
- Vote counts remain the same

### 16. Share Modal (First Weekly Vote Only)
**Action:** After first weekly vote, check if share modal appeared  
**Expected Result:** Share modal appeared only on the **first** weekly vote, not on overrides or confirmations

---

## D. Persistence & Reloads

### 17. Page Refresh After Voting
**Action:** Vote daily and weekly, then refresh the page (pull down on mobile or F5 on desktop)  
**Expected Result:**
- App reloads successfully
- Your daily vote is still shown with a green checkmark
- Your weekly vote is still shown with a green checkmark
- Vote counts reflect your previous votes
- Weekly voting is still unlocked

### 18. Returning Same Day
**Action:** Close the app completely, then reopen it later the same day  
**Expected Result:**
- Your daily vote is still shown
- Your weekly vote is still shown
- Weekly voting is still unlocked
- You can change your votes if desired

### 19. UI Reflecting Previous Votes
**Action:** After reload, check the voting cards  
**Expected Result:**
- Green checkmarks appear on your previously selected cards
- No other visual glitches or incorrect states

### 20. Weekly Still Unlocked Same Day
**Action:** After reload, scroll to weekly voting  
**Expected Result:** Weekly voting section is still unlocked and interactive (no blur)

---

## E. Edge Cases

### 21. Clicking Weekly Vote While Locked
**Action:** Before voting daily, try clicking a weekly platform card  
**Expected Result:** Nothing happens, card is not clickable, no error messages

### 22. Clicking Same Option Twice Rapidly
**Action:** Double-click or rapidly tap the same voting card  
**Expected Result:**
- Only one vote is recorded
- Only one toast notification appears
- No duplicate votes or errors

### 23. Rapid Clicking Different Options
**Action:** Quickly click multiple different voting cards in succession  
**Expected Result:**
- Final vote reflects the last card clicked
- Toast notifications may stack briefly but clear
- No errors or broken states

### 24. Multiple Tabs Open
**Action:** Open the app in two browser tabs or two devices simultaneously  
**Expected Result:**
- Both tabs/devices show the same vote state after refresh
- Voting in one tab updates the database
- Other tab shows updated state after refresh

---

## F. Visual & UX Sanity Checks

### 25. Locked Blur Overlay Clarity
**Action:** View the weekly voting section before voting daily  
**Expected Result:** Blur overlay is clearly visible, cards look disabled, lock icon and text are readable

### 26. "You Voted" State Visibility
**Action:** After voting, check the selected card  
**Expected Result:** Green checkmark is clearly visible, card has a distinct "selected" appearance

### 27. Vote Results Updating Correctly
**Action:** After voting, check the vote count numbers  
**Expected Result:**
- Vote counts increase by your vote power (1-6)
- Numbers update immediately after voting
- No negative numbers or incorrect totals

### 28. No Console-Blocking Errors
**Action:** Open browser console (if on desktop) and vote  
**Expected Result:**
- No red error messages related to voting
- App functions normally
- (Wallet extension errors are okay and can be ignored)

### 29. Vote Power Display
**Action:** After voting, check if your vote power is reflected  
**Expected Result:** Vote count increases by your calculated power (1-6x based on activity)

### 30. Toast Positioning
**Action:** Trigger a toast notification  
**Expected Result:** Toast appears in a consistent location (top-right), doesn't block important UI elements

---

## ✅ Completion Criteria

**All 30 test cases should pass without errors or unexpected behavior.**

If any test case fails:
1. Note the specific test case number
2. Describe what happened vs. what was expected
3. Include any error messages or screenshots
4. Report to the development team

---

**Testing Status:** ⏳ In Progress  
**Version:** v2.0.0  
**Last Updated:** January 17, 2026
