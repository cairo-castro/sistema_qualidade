<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public string $title = '',
        public bool $dismissible = true,
        public string $icon = ''
    ) {
        if (empty($this->icon)) {
            $this->icon = match($this->type) {
                'success' => 'fas fa-check-circle',
                'error', 'danger' => 'fas fa-exclamation-triangle',
                'warning' => 'fas fa-exclamation-circle',
                'info' => 'fas fa-info-circle',
                default => 'fas fa-info-circle'
            };
        }
    }

    public function render(): View|Closure|string
    {
        return view('components.alert');
    }
}