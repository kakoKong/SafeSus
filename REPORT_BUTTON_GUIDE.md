# 🚩 Report Button Design Guide

## Overview
Report buttons are now **much clearer** with descriptive text instead of just a flag icon. Users immediately understand they can report fake or wrong information.

---

## 📊 Button Variants

### 1. **Subtle Variant** (Community Feed)
Used for inline reporting in community cards.

```
┌─────────────────────────────────────────────┐
│ 💡 Amazing Bangkok Street Food Guide        │
│ Check out these hidden gems in Chinatown... │
│                                             │
│ [scam] ✓ Verified • 2024-10-23   [🚩 Wrong info? Report] │
│                                      ↑                    │
│                              Subtle, non-intrusive       │
└─────────────────────────────────────────────┘
```

**Appearance:**
- Text: "Wrong info? Report"
- Style: Ghost button (subtle gray)
- Icon: Flag (🚩)
- Size: Small
- Hover: Changes to red color

**Usage:**
```tsx
<ReportButton targetType="tip" targetId={id} variant="subtle" />
```

---

### 2. **Compact Variant** (Detail Sheets)
Used in zone/pin detail sheets at the bottom.

```
┌─────────────────────────────────────┐
│ Scam Alert - Taxi Overcharge        │
│ [scam]                              │
│                                     │
│ Summary                             │
│ Watch out for taxis at the airport  │
│ that refuse to use the meter...     │
│                                     │
│ What to Do                          │
│ Always insist on using the meter... │
│ ─────────────────────────────────── │
│ [🚩 Report Issue]                   │ ← Clear button with text
└─────────────────────────────────────┘
```

**Appearance:**
- Text: "Report Issue"
- Style: Ghost button
- Icon: Flag (🚩)
- Size: Small
- Full width on border separator

**Usage:**
```tsx
<ReportButton targetType="pin" targetId={id} compact />
```

---

### 3. **Default Variant** (General Use)
Full-sized button for prominent placement.

```
[🚩 Report Issue]  ← Standard button
```

**Appearance:**
- Text: "Report Issue"
- Style: Outline button
- Icon: Flag (🚩)
- Size: Default

**Usage:**
```tsx
<ReportButton targetType="zone" targetId={id} />
```

---

## 🎯 Where Each Variant is Used

### Community Feed (`/community`)
```
┌──────────────────────────────────────────────┐
│  🌐 Recent Verified Updates                  │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │ 💡 Bangkok Night Market Tips      │     │
│  │ Best markets to visit after dark   │     │
│  │                                    │     │
│  │ [stay] ✓ Verified • Oct 23    [🚩 Wrong info? Report] │
│  └────────────────────────────────────┘     │
│                                       ↑      │
│                              Subtle variant  │
└──────────────────────────────────────────────┘
```

### City Detail Sheets (`/city/bangkok`)
```
┌─────────────────────────────────────┐
│ Old Town District                   │
│ [recommended]                       │
│                                     │
│ Overview                            │
│ Safe, tourist-friendly area...      │
│                                     │
│ Details                             │
│ Well-lit streets, police presence.. │
│ ─────────────────────────────────── │
│ [🚩 Report Issue]                   │ ← Compact variant
└─────────────────────────────────────┘
```

### Live Mode Warnings (`/live`)
```
┌─────────────────────────────────────┐
│ Scam Alert Near You                 │
│ [scam] • 250m away                  │
│                                     │
│ What's Happening                    │
│ Fake taxi drivers at this location  │
│                                     │
│ What to Do                          │
│ Use Grab or Bolt instead...         │
│ ─────────────────────────────────── │
│ [🚩 Report Issue]                   │ ← Compact variant
└─────────────────────────────────────┘
```

---

## 🎨 Visual Comparison

### Before (Just Icon):
```
[🚩]  ← What is this?
```
**Problems:**
- ❌ Unclear purpose
- ❌ Users don't know it's for reporting
- ❌ Easy to overlook

### After (With Text):
```
[🚩 Wrong info? Report]  ← Community
[🚩 Report Issue]        ← Detail sheets
```
**Benefits:**
- ✅ Clear call-to-action
- ✅ Users understand immediately
- ✅ Encourages reporting fake content
- ✅ Professional appearance

---

## 💬 Button Text Options

| Variant | Text | Context |
|---------|------|---------|
| Subtle | "Wrong info? Report" | Community feed, inline |
| Compact | "Report Issue" | Detail sheets, prominent |
| Default | "Report Issue" | General pages |

---

## 🎯 Report Dialog

When any button is clicked, users see:

```
┌─────────────────────────────────────┐
│ Report Content                      │
│ Help us maintain quality by         │
│ reporting inappropriate or false    │
│ information.                        │
│                                     │
│ Reason *                            │
│ [False or misleading information ▼] │
│                                     │
│ Additional details (optional)       │
│ ┌─────────────────────────────────┐ │
│ │ Provide more context...         │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancel]  [Submit Report]           │
└─────────────────────────────────────┘
```

**Report Reasons:**
- False or misleading information ⭐ (Most common)
- Spam or promotion
- Offensive content
- Outdated information
- Other

---

## 🔄 User Flow

### Community Feed Flow:
```
User sees tip
    ↓
Reads content
    ↓
Notices "Wrong info? Report" button
    ↓
Clicks button
    ↓
Selects reason
    ↓
Submits report
    ↓
Toast: "Report submitted"
```

### Detail Sheet Flow:
```
User clicks zone/pin on map
    ↓
Sheet opens with details
    ↓
Scrolls to bottom
    ↓
Sees "Report Issue" button
    ↓
Clicks to report
    ↓
Submits with reason
    ↓
Toast confirmation
```

---

## 🎨 Hover States

### Subtle Variant:
- **Default**: Muted gray text
- **Hover**: Red text (`text-destructive`)
- **Click**: Opens dialog

### Compact Variant:
- **Default**: Ghost button
- **Hover**: Light gray background
- **Click**: Opens dialog

### Default Variant:
- **Default**: Outlined button
- **Hover**: Filled background
- **Click**: Opens dialog

---

## 📱 Responsive Design

### Desktop:
```
Full text visible: "Wrong info? Report"
```

### Mobile:
```
Slightly smaller but still readable
Icon + text both show
```

### Tablet:
```
Adapts to available space
Maintains clarity
```

---

## 🌟 Key Improvements

### Clarity:
- ✅ **Before**: Just a flag icon (confusing)
- ✅ **After**: Clear text explaining purpose

### Discoverability:
- ✅ Users can quickly find report option
- ✅ Encourages community moderation
- ✅ Text prompts action

### Accessibility:
- ✅ Screen readers can read button text
- ✅ Clear purpose for all users
- ✅ Proper ARIA labels

### User Experience:
- ✅ Reduces confusion
- ✅ Increases report submissions
- ✅ Builds trust in platform

---

## 📊 Implementation Summary

| Location | Button Variant | Placement | Text |
|----------|---------------|-----------|------|
| Community Feed | Subtle | Bottom-right of card | "Wrong info? Report" |
| City Zone Sheet | Compact | Bottom (bordered section) | "Report Issue" |
| City Pin Sheet | Compact | Bottom (bordered section) | "Report Issue" |
| Live Warning Sheet | Compact | Bottom (bordered section) | "Report Issue" |

---

## 🚀 Code Examples

### Subtle (Community):
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <Badge>Category</Badge>
    <span>✓ Verified</span>
  </div>
  <ReportButton targetType="tip" targetId={id} variant="subtle" />
</div>
```

### Compact (Sheets):
```tsx
<div className="space-y-4">
  <div>
    <h4>Summary</h4>
    <p>{content}</p>
  </div>
  <div className="pt-4 border-t">
    <ReportButton targetType="pin" targetId={id} compact />
  </div>
</div>
```

---

## 🎯 Expected User Behavior

With clearer buttons, users will:
1. **Understand** the purpose immediately
2. **Report** fake or wrong information more often
3. **Trust** the platform knows quality matters
4. **Feel empowered** to contribute to community safety

---

## ✅ Testing Checklist

### Visual Tests:
- [ ] Button text is clearly readable
- [ ] Icon and text align properly
- [ ] Hover states work correctly
- [ ] Colors meet accessibility standards

### Functional Tests:
- [ ] Click opens report dialog
- [ ] Subtle variant shows in community
- [ ] Compact variant shows in sheets
- [ ] All variants submit reports correctly

### UX Tests:
- [ ] Users understand button purpose
- [ ] Text is compelling ("Wrong info?")
- [ ] Placement doesn't clutter UI
- [ ] Mobile users can tap easily

---

**Your report buttons are now crystal clear! 🎉**

Users will immediately understand they can report fake information, making your platform more trustworthy and community-driven.

