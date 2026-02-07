/* Enhanced Animations for Professional Website */

@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateY(10px);
    }
    to { 
        opacity: 1; 
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-40px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(40px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulse {
    0%, 100% { 
        transform: scale(1); 
    }
    50% { 
        transform: scale(1.05); 
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes progress {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}

/* Animation Classes */
.animate-fade-in {
    animation: fadeIn 0.6s ease forwards;
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
}

.animate-fade-in-down {
    animation: fadeInDown 0.6s ease forwards;
}

.animate-fade-in-left {
    animation: fadeInLeft 0.6s ease forwards;
}

.animate-fade-in-right {
    animation: fadeInRight 0.6s ease forwards;
}

.animate-scale-in {
    animation: scaleIn 0.4s ease forwards;
}

.animate-slide-in-right {
    animation: slideInRight 0.3s ease forwards;
}

.animate-slide-in-left {
    animation: slideInLeft 0.3s ease forwards;
}

/* Staggered Animations */
.stagger-item {
    opacity: 0;
    transform: translateY(20px);
}

.stagger-item.animated {
    animation: fadeInUp 0.5s ease forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
.stagger-item:nth-child(5) { animation-delay: 0.5s; }
.stagger-item:nth-child(6) { animation-delay: 0.6s; }
.stagger-item:nth-child(7) { animation-delay: 0.7s; }
.stagger-item:nth-child(8) { animation-delay: 0.8s; }

/* Hover Animations */
.hover-lift {
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hover-lift:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.hover-glow {
    transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
    box-shadow: 0 0 20px rgba(46, 125, 50, 0.3);
}

.hover-scale {
    transition: transform 0.3s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}

.hover-underline {
    position: relative;
}

.hover-underline::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.hover-underline:hover::after {
    width: 100%;
}

/* Loading Animation */
.loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
}

.loading-spinner-sm {
    width: 20px;
    height: 20px;
    border-width: 2px;
}

.loading-dots {
    display: flex;
    gap: 4px;
}

.loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-color);
    animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* Skeleton Loading */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
    border-radius: var(--border-radius);
}

.skeleton-text {
    height: 1em;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.skeleton-text:last-child {
    margin-bottom: 0;
    width: 80%;
}

.skeleton-image {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius);
}

/* Button Animation */
.btn-animate {
    position: relative;
    overflow: hidden;
}

.btn-animate::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.btn-animate:focus:not(:active)::after {
    animation: ripple 1s ease-out;
}

/* Cart Count Animation */
.cart-count.bump {
    animation: bump 0.3s ease;
}

@keyframes bump {
    0% { transform: scale(1); }
    30% { transform: scale(1.4); }
    50% { transform: scale(1.2); }
    70% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

/* Progress Bar Animation */
.progress-bar {
    height: 4px;
    background: var(--light-gray);
    border-radius: 2px;
    overflow: hidden;
    margin: 20px 0;
}

.progress-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 2px;
    animation: progress 2s ease-out;
}

/* Floating Animation */
.floating {
    animation: float 3s ease-in-out infinite;
}

.floating-delay-1 {
    animation-delay: 0.5s;
}

.floating-delay-2 {
    animation-delay: 1s;
}

/* Page Transition */
.page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
}

.page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-exit {
    opacity: 1;
    transform: translateY(0);
}

.page-transition-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Toast Animation */
.toast-enter {
    transform: translateY(100px);
    opacity: 0;
}

.toast-enter-active {
    transform: translateY(0);
    opacity: 1;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-exit {
    transform: translateY(0);
    opacity: 1;
}

.toast-exit-active {
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Modal Animation */
.modal-enter {
    opacity: 0;
}

.modal-enter-active {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.modal-exit {
    opacity: 1;
}

.modal-exit-active {
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* Menu Slide Animation */
.menu-slide-enter {
    transform: translateX(-100%);
}

.menu-slide-enter-active {
    transform: translateX(0);
    transition: transform 0.3s ease;
}

.menu-slide-exit {
    transform: translateX(0);
}

.menu-slide-exit-active {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
}

/* Tooltip Animation */
.tooltip {
    position: relative;
}

.tooltip::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--dark-color);
    color: var(--white);
    padding: 8px 12px;
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    z-index: 100;
    pointer-events: none;
}

.tooltip::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    border: 5px solid transparent;
    border-top-color: var(--dark-color);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    z-index: 100;
    pointer-events: none;
}

.tooltip:hover::before,
.tooltip:hover::after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

/* Success Check Animation */
.success-check {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--success);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    animation: scaleIn 0.3s ease;
}

.success-check i {
    color: var(--white);
    font-size: 1.5rem;
    animation: bounce 0.6s ease;
}
