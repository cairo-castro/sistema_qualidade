@props([
    'title' => '', 
    'subtitle' => '', 
    'icon' => '', 
    'color' => '', 
    'collapsible' => false,
    'tools' => ''
])

<div class="card {{ $color ? 'card-' . $color : '' }}">
    @if($title || $subtitle || $icon || $tools)
    <div class="card-header">
        <h3 class="card-title">
            @if($icon)
                <i class="{{ $icon }} mr-1"></i>
            @endif
            {{ $title }}
            @if($subtitle)
                <small class="text-muted">{{ $subtitle }}</small>
            @endif
        </h3>

        @if($tools || $collapsible)
        <div class="card-tools">
            {!! $tools !!}
            @if($collapsible)
                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                </button>
            @endif
        </div>
        @endif
    </div>
    @endif

    <div class="card-body">
        {{ $slot }}
    </div>

    @isset($footer)
    <div class="card-footer">
        {{ $footer }}
    </div>
    @endisset
</div>