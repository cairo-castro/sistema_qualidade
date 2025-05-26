@props(['type' => 'info', 'title' => '', 'dismissible' => true, 'icon' => ''])

<div class="alert alert-{{ $type }} {{ $dismissible ? 'alert-dismissible' : '' }} fade show" role="alert">
    <div class="d-flex align-items-center">
        @if($icon)
            <i class="{{ $icon }} mr-2"></i>
        @endif
        <div class="flex-grow-1">
            @if($title)
                <h6 class="alert-heading mb-1">{{ $title }}</h6>
            @endif
            {{ $slot }}
        </div>
    </div>
    
    @if($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    @endif
</div>