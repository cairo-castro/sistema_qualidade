<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Card extends Component
{
    public function __construct(
        public string $title = '',
        public string $subtitle = '',
        public string $icon = '',
        public string $color = '',
        public bool $collapsible = false,
        public string $tools = ''
    ) {}

    public function render(): View|Closure|string
    {
        return view('components.card');
    }
}