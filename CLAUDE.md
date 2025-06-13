# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hospital Quality Management System (Sistema de Gestão da Qualidade Hospitalar) - A Laravel 12 web application for healthcare quality management with advanced custom theming, role-based access control, and modular architecture.

## Tech Stack
- **Backend**: Laravel 12 (PHP 8.2+), MySQL 8+
- **Frontend**: Alpine.js, Tailwind CSS, Preline UI, DaisyUI, ApexCharts
- **Build**: Vite with optimized asset pipeline
- **Permissions**: Spatie Laravel Permission (RBAC)
- **Architecture**: Nwidart Laravel Modules for modularity

## Development Commands

### Comprehensive Development Environment
```bash
# Start all services (server, queue, logs, vite) - RECOMMENDED
composer run dev

# Individual Laravel services
php artisan serve
php artisan queue:listen --tries=1
php artisan pail --timeout=0

# Frontend development
npm run dev
npm run build
```

### Testing & Quality
```bash
# Run all tests
composer run test

# Code formatting
./vendor/bin/pint

# Database operations
php artisan migrate
php artisan db:seed
```

## Architecture Overview

### Core Application Structure
- **Entry Points**: `/` (auto-redirect), `/dashboard` (main), `/admin/**` (management)
- **Theme System**: 4-zone theming (Navbar, Sidebar, Background, Accent) with real-time preview
- **User Management**: Complete RBAC with roles/permissions via Spatie
- **Modular Design**: Extensible via Laravel Modules

### Key Directories
```
app/Http/Controllers/    # MVC Controllers (thin, delegate to services)
app/Services/           # Business logic layer
app/Models/            # Eloquent models with relationships
app/Helpers/helpers.php # Auto-loaded utility functions
resources/views/       # Blade templates with components
resources/js/          # Alpine.js + custom classes
resources/css/         # Tailwind + custom theme system
```

### Database Schema Notes
- **users.theme_settings**: JSON field storing custom theme preferences
- **users.usuario_sistema_id**: Integration field for legacy system
- Uses Spatie Permission tables for RBAC

## Theme System Architecture

The advanced theme system is a core feature:
- **Real-time color preview** without page reload
- **Custom CSS properties** for dynamic theming
- **JavaScript classes** following SOLID principles
- **4 preset themes**: Blue, Green, Purple, Dark
- **User persistence** with individual preferences
- **Accessibility**: Automatic contrast calculation

Theme files: `resources/js/theme-manager.js`, `resources/views/components/theme/**`

## Development Guidelines

### Code Patterns
- **Repository Pattern**: Use service layer for business logic
- **Thin Controllers**: Delegate to services, keep controllers minimal  
- **Form Requests**: Use for validation, not inline validation
- **Blade Components**: Reusable UI components in `resources/views/components/`

### Frontend Patterns
- **Alpine.js**: For reactive interactions, avoid jQuery where possible
- **Tailwind Utility-First**: Follow utility-first CSS methodology
- **Component-based**: Use Blade components for reusability
- **Vite Asset Pipeline**: All assets processed through Vite

### Security & Performance
- Built-in CSRF protection, proper RBAC implementation
- File upload validation, input sanitization
- Optimized Vite build with code splitting and minification
- Database relationships properly indexed

## Testing Strategy

Run tests with `composer run test` - includes feature and unit tests for critical functionality including the theme system, user management, and dashboard features.

## Important Configuration

- **config/sistema.php**: Custom system configuration
- **Vite config**: Optimized with terser, code splitting, vendor chunks
- **Tailwind config**: Custom theme integration with CSS variables
- **Helper functions**: Auto-loaded from `app/Helpers/helpers.php`

## System Status

All core features operational: authentication, dashboard, theme system, admin panel, and asset pipeline. The system is production-ready with comprehensive documentation in the `docs/` directory.