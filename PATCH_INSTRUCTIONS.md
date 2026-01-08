# Manual Patch Instructions

Please make the following changes to complete the permission-granted workflow:

## 1. ClearDues.tsx - Add permission-granted filter

Around line 160, after the `cleared-by-permission` status check, add:

```typescript
if (statusFilter === "permission-granted") {
  // Permission granted by ACCOUNTS, waiting for SCHOLARSHIP to clear
  return d.status === "permission-granted";
}
```

## 2. ClearDues.tsx - Add filter dropdown option

Around line 226, add this option in the status select dropdown:

```tsx
<option value="permission-granted">Permission Granted</option>
```

## 3. ClearDues.tsx - Add summary stats

Around line 260, before "Cleared by Permission" paragraph, add:

```tsx
<p>
  <strong>Permission Granted:</strong>{" "}
  {filteredDues.filter((d) => d.status === "permission-granted").length}
  {filteredDues.filter((d) => d.status === "permission-granted").length > 0 && (
    <span
      style={{
        marginLeft: "8px",
        padding: "2px 8px",
        backgroundColor: "#ddd6fe",
        borderRadius: "12px",
        fontSize: "11px",
        color: "#5b21b6",
      }}
    >
      📄 Waiting for clearance
    </span>
  )}
</p>
```

## 4. ClearDues.tsx - Update status display in table

Around line 410, update the status display to handle permission-granted:

```tsx
<td className={`clear-due-status ${d.status}`}>
  {d.status === "permission-granted" ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>📄 Permission Granted</span>
    </div>
  ) : d.status === "cleared-by-permission" ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>📄 Cleared by Permission</span>
    </div>
  ) : (
    d.status.charAt(0).toUpperCase() + d.status.slice(1)
  )}
</td>
```

## 5. ClearDues.tsx - Update actions column

Around line 430, change:

```tsx
{d.status === "pending" ? (
```

to:

```tsx
{d.status === "pending" || d.status === "permission-granted" ? (
```

## 6. ClearDues.tsx - REMOVE the permission button

Around lines 453-470, **REMOVE** this entire block:

```tsx
{
  /* Permission button only for ACCOUNTS dept and only for SCHOLARSHIP dues */
}
{
  userDepartment === "ACCOUNTS" && d.department === "SCHOLARSHIP" && (
    <button
      className="clear-due-btn-clear"
      onClick={() => handleClearClick(d._id, "permission")}
      title="Clear by providing document (no payment required)"
      style={{
        backgroundColor: "#7c3aed",
        fontSize: "12px",
        padding: "6px 10px",
      }}
    >
      📄 Permission
    </button>
  );
}
```

## 7. ClearDues.tsx - Add clear button for permission-granted dues

After removing the permission button, update the payable dues section to handle permission-granted status.

Replace the payable section (around line 447) with:

```tsx
{d.category === "payable" ? (
  d.status === "permission-granted" ? (
    // Permission granted - SCHOLARSHIP dept can clear it
    <button
      className="clear-due-btn-clear"
      onClick={() => handleClearClick(d._id, "regular")}
      style={{
        backgroundColor: "#7c3aed",
        cursor: "pointer",
      }}
    >
      Clear (Permission)
    </button>
  ) : (
    // Regular payable dues
    <>
      <button
        className="clear-due-btn-clear"
        onClick={() =>
          handleClearClick(d._id, "regular")
        }
        disabled={d.paymentStatus === "due"}
        title={
          d.paymentStatus === "due"
            ? "Payment must be completed by Accounts before clearing"
            : "Clear this due after payment"
        }
        style={{
          fontSize: "12px",
          padding: "6px 10px",
        }}
      >
        Clear
      </button>
    </>
  )
) : (
```

## Summary of Changes

1. **Statuses**: Only `pending`, `cleared`, and `cleared-by-permission` are used
2. **ACCOUNTS Dept**: Grant permission endpoint directly sets `cleared-by-permission` with document URL
3. **SCHOLARSHIP Dept**: Sees `cleared-by-permission` and can treat as cleared; no amount change
4. **Amount Impact**: Only `pending` dues contribute to totals; permission-cleared dues are excluded

After making these changes, restart the backend server for the model changes to take effect.
