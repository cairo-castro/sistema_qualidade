# 🧠 Cursor Instructions — PHP Best Practices

These instructions enforce production-ready, modern PHP code generation for Laravel 12 or pure PHP 8.2+ projects, aligned with PSR standards and SOLID principles.

---

## 🧩 ENVIRONMENT DETAILS

- **OS**: Windows 11 64-bit  
- **Terminal**: PowerShell (Admin)  
- **Browser**: Chrome  
- **Stack**:  
  - Laravel 12  
  - Alpine.js  
  - Tailwind CSS (Preline)  
  - Spatie Permission  
  - Nwidart Laravel Modules

---

## 🚨 CRITICAL RULES

### ✅ Code Completeness
- Return full files: controllers, models, migrations, views, services.
- Never use placeholders like `// TODO`, `/* add logic here */`.

### ✅ Strict Typing
- Always add `declare(strict_types=1);` at the top.
- Strongly type all method parameters and return values.

### ✅ Coding Standards
- Follow **PSR-12**: indentation, spacing, naming.
- Use **camelCase** for variables/methods, **PascalCase** for classes.
- Apply **dependency injection** over facades or statics.

### ✅ Clean Architecture
- Apply **SOLID principles** in all designs.
- Controllers must remain thin — offload logic to Service or Repository classes.
- Never put business logic in Blade views or route closures.

### ✅ Security Best Practices
- Sanitize inputs.
- Validate with Form Requests or `request()->validate()`.
- Escape output (`{{ $var }}` or `e()`).
- Use Laravel's Gate/Policy/Spatie for authorization.

### ✅ Database Best Practices
- Use **Eloquent relationships** instead of manual joins.
- Prefer **migrations** for schema and **seeders/factories** for data.
- Use UUIDs/ULIDs where applicable for identifiers.

### ✅ Commenting and Documentation
- Use full **PHPDoc**:
  ```php
  /**
   * Update a user profile.
   * @param UpdateUserRequest $request
   * @return RedirectResponse
   */
  ```
- Comment **why**, not **what**.

### ✅ Error Handling
- Avoid silent try-catch blocks.
- Log all exceptions using `report()`.
- Do not expose internal errors to the end user.

---

## 🔄 CONTEXTUAL BEHAVIOR

- Warn when context window is near capacity.
- Prompt user to paste missing files or definitions.
- Correct user misunderstandings in prompt or terminology.

---

## 🧪 EXAMPLE PROMPT

```md
Create a Laravel 12 controller and service to register a new hospital user. The user should be assigned a role using Spatie Permission. Use a FormRequest for validation, include a full migration, and add inline PHPDoc with proper error handling and type safety.
```

---

## 🧾 STRING RULES

- Use **double quotes** only: `"string"`
- Use template strings or `.join()` — avoid `.` for concatenation

---

## ❌ DISALLOWED

- `any`, `!`, or `as unknown as`
- Placeholders or incomplete code
- Raw user input handling without validation

---

Created for use in the **Cursor app** with PHP 8.2+ and Laravel 12 ecosystem.
