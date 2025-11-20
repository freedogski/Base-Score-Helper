# ✅ macOS Safari — How to Allow JavaScript From the Smart Search Field

## 1. Open Safari
Launch Safari on your Mac.

---

## 2. Open Safari Settings
In the top-left menu bar, click:

**Safari → Settings…**
![Safari Settings](screenshots/safari_settings.png)

*(In older macOS versions, this was **Preferences…**, but it’s in the same place.)*

---

## 3. Go to the **Advanced** tab
At the top of the Settings window, click:

**Advanced**

---

## 4. Enable: **“Show features for web developers”**
Safari no longer uses the old “Allow JavaScript from Smart Search Field” label.  
The updated option that controls bookmarklet execution is:

✔ **Show features for web developers**

Turn this ON.

This enables:
- The **Develop** menu  
- **Bookmarklet JavaScript execution**  
- Console and debugging tools  

---

## 5. (Automatically enabled)
Once the checkbox is ON, Safari will allow JavaScript from bookmarklets.

---

## 6. Optional: Confirm the **Develop** Menu is visible
You should now see:

**Develop** in the Safari menu bar.

This confirms that developer features — including bookmarklet JS — are enabled.

---
---
## 7. Optional: Test that your bookmarklets are enabled

**Here’s a super simple bookmarklet you can use to test if Safari is executing JavaScript:**

1. Create a new bookmark in Safari.
2. Edit the URL of the bookmark and replace it with this code:


```

javascript:(function(){alert('JavaScript is running!');})();

```

3. Save the bookmark.
4. Tap/click the bookmark.

---
---
