import React, { useState } from 'react';

const ShapeWithSVG = ({ handleAddSVG }) => {
    const [isOpen, setIsOpen] = useState(true);

    const svgs = [
        {
            name: 'SVG Shape 01',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M401.6 288.4 450 240l-48.4-48.4 8.1-8.2A80 80 0 0 0 296.6 70.3l-8.2 8.1L240 30l-48.4 48.4-8.2-8.1A80 80 0 0 0 70.3 183.4l8.1 8.2L30 240l48.4 48.4-8.1 8.2a80 80 0 0 0 113.1 113.1l8.2-8.1L240 450l48.4-48.4 8.2 8.1a80 80 0 0 0 113.1-113.1l-8.1-8.2Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 02',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M400 160V80h-80a80 80 0 0 0-160 0H80v80a80 80 0 0 0 0 160v80h80a80 80 0 0 0 160 0h80v-80a80 80 0 0 0 0-160Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 1',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='m452.3 154.4 8.5-47.6A75.6 75.6 0 0 0 373.2 19l-47.4 8.5c-16.7 3-34 .2-49-7.8l-1.1-.6c-22.3-12-49-12-71.4 0l-1.2.6c-15 8-32.2 10.8-48.9 7.8L106.7 19A75.6 75.6 0 0 0 19 106.7l8.5 47.5c3 16.7.3 34-7.8 49l-.6 1.1c-12 22.3-12 49 0 71.3l.6 1.3c8 15 10.8 32.2 7.8 48.9L19 373.3a75.6 75.6 0 0 0 87.7 87.7l47.5-8.5c16.7-3 34-.3 49 7.8l1.1.6c22.3 12 49 12 71.3 0l1.3-.6c15-8 32.2-10.8 48.9-7.8l47.5 8.5a75.6 75.6 0 0 0 87.7-87.7l-8.4-47.2c-3-16.9-.2-34.3 8-49.4a75.5 75.5 0 0 0 .3-71.6l-1-1.8c-8-15-10.7-32.2-7.6-48.9Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 2',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M447.6 180.2v-.2A127.3 127.3 0 0 0 300 32S240 0 240 0l-60 32.1h-.2A127.3 127.3 0 0 0 32 179.8v.2L0 240l32.1 60v.2A127.3 127.3 0 0 0 179.8 448h.2l60 32.1 60-32.1h.3a127.3 127.3 0 0 0 147.6-147.7v-.2l32.1-59-32.4-60.8Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 3',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M360 240c-66.3 0-120-53.7-120-120a120 120 0 1 0-120 120c66.3 0 120 53.7 120 120a120 120 0 1 0 120-120Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 4',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M0 240v240h240A240 240 0 0 0 0 240Z'></path>
                    <path d='M240 0A240 240 0 0 0 0 240h240v240a240 240 0 1 0 0-480Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 5',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M450.9 169.7a99.4 99.4 0 0 0-140.6 0 99.4 99.4 0 1 0-140.6 0 99.4 99.4 0 1 0 0 140.6 99.4 99.4 0 1 0 140.6 0 99.4 99.4 0 0 0 140.6-140.6ZM169.7 310.3l140.6-140.6'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 6',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M450.9 169.7a99.4 99.4 0 0 0-140.6 0A99.4 99.4 0 1 0 169.7 29.1a99.4 99.4 0 0 0 140.6 140.6 99.4 99.4 0 1 0 140.6 0Z'></path>
                    <path d='M169.7 310.3A99.4 99.4 0 1 0 29.1 169.7a99.4 99.4 0 0 0 140.6 140.6 99.4 99.4 0 1 0 140.6 140.6 99.4 99.4 0 0 0-140.6-140.6Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 7',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <circle cx='120' cy='120' r='120'></circle>
                    <circle cx='120' cy='360' r='120'></circle>
                    <circle cx='360' cy='120' r='120'></circle>
                    <circle cx='360' cy='360' r='120'></circle>
                </svg>
            )
        },
        {
            name: 'SVG Shape 8',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='m394.7 317.4-51.5-25.8a57.7 57.7 0 0 1 0-103.2l51.5-25.8a57.7 57.7 0 1 0-77.4-77.4l-25.7 51.6a57.7 57.7 0 0 1-103.2 0l-25.8-51.5a57.7 57.7 0 1 0-77.3 77.3l51.5 25.8a57.7 57.7 0 0 1 0 103.2l-51.5 25.8a57.7 57.7 0 1 0 77.3 77.3l25.8-51.5a57.7 57.7 0 0 1 103.2 0l25.8 51.5a57.7 57.7 0 1 0 77.4-77.4Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 9',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M70.9 69.7 69.7 71a85.2 85.2 0 0 0 43.6 143.8L240 240l-25.4-126.7A85.2 85.2 0 0 0 71 69.7ZM69.7 409.1l1.2 1.2a85.2 85.2 0 0 0 143.8-43.6L240 240l-126.7 25.3a85.2 85.2 0 0 0-43.6 143.8ZM410.3 70.9l-1.2-1.2a85.2 85.2 0 0 0-143.8 43.6L240 240l126.7-25.4A85.2 85.2 0 0 0 410.3 71ZM366.7 265.4 240 240l25.4 126.7A85.2 85.2 0 0 0 409 410.3l1.2-1.2a85.2 85.2 0 0 0-43.6-143.7Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 10',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M366.7 265.4c-27.7-5.6-27.7-45.2 0-50.7a85.2 85.2 0 0 0 43.6-143.8s-1.2-1.2-1.2-1.2a85.2 85.2 0 0 0-143.7 43.6c-5.6 27.7-45.2 27.7-50.7 0A85.2 85.2 0 0 0 70.9 69.7S69.7 71 69.7 71a85.2 85.2 0 0 0 43.6 143.8c27.7 5.5 27.7 45.1 0 50.7a85.2 85.2 0 0 0-42.4 144.9 85.2 85.2 0 0 0 143.8-43.6c5.5-27.7 45.1-27.7 50.7 0a85.2 85.2 0 0 0 144.9 42.4 85.2 85.2 0 0 0-43.6-143.8Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 11',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M437.3 158.3A99.5 99.5 0 0 0 321.6 42.8a99.5 99.5 0 0 0-163.4 0A99.5 99.5 0 0 0 42.7 158.3a99.5 99.5 0 0 0 0 163.4 99.5 99.5 0 0 0 115.6 115.6 99.5 99.5 0 0 0 163.4 0 99.5 99.5 0 0 0 115.5-115.6 99.5 99.5 0 0 0 0-163.4Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 12',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='m404.1 185.3-54.7 18.2a57.4 57.4 0 0 1-27.1 2.4c5.1-7 12-13 20.9-17.5l51.5-25.8a57.7 57.7 0 1 0-77.4-77.4l-25.7 51.6a57.4 57.4 0 0 1-17.5 21 57.4 57.4 0 0 1 2.4-27.2l18.2-54.7a57.7 57.7 0 1 0-109.4 0l18.2 54.7a57.4 57.4 0 0 1 2.4 27.1 57.3 57.3 0 0 1-17.5-20.8l-25.8-51.6a57.7 57.7 0 1 0-77.4 77.4l51.6 25.7a57.4 57.4 0 0 1 21 17.5c-8.7 1.4-18 .7-27.2-2.4l-54.7-18.2a57.7 57.7 0 1 0 0 109.4l54.7-18.2a57.4 57.4 0 0 1 27.1-2.4 57.3 57.3 0 0 1-20.8 17.5l-51.6 25.8a57.7 57.7 0 1 0 77.4 77.4l25.7-51.6a57.4 57.4 0 0 1 17.5-21c1.4 8.7.7 18-2.4 27.2l-18.2 54.7a57.7 57.7 0 1 0 109.4 0l-18.2-54.7a57.4 57.4 0 0 1-2.4-27.1c7 5.1 13 12 17.5 20.9l25.8 51.5a57.7 57.7 0 1 0 77.4-77.4l-51.6-25.7a57.4 57.4 0 0 1-21-17.5c8.7-1.4 18-.7 27.2 2.4l54.7 18.2a57.7 57.7 0 1 0 0-109.4Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 13',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 210A160 160 0 0 0 210 93.8V0A160 160 0 0 0 93.8 270H0a160 160 0 0 0 270 116.2V480a160 160 0 0 0 116.2-270H480Zm-210 60h-60v-60h60v60Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 14',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240a160 160 0 0 0-240-138.6V0a160 160 0 0 0-138.6 240H0a160 160 0 0 0 240 138.6V480a160 160 0 0 0 138.6-240H480Z'></path>
                </svg>
            )
        },

        {
            name: 'SVG Shape 15',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240a160 160 0 0 0-94.1-145.9 160 160 0 0 0-291.8 0 160 160 0 0 0 0 291.8 160 160 0 0 0 291.8 0A160 160 0 0 0 480 240Zm-320 80V160h160v160H160Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 16',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 240A240 240 0 0 0 0 480h120a120 120 0 0 1 240 0h120a240 240 0 0 0-240-240Z'></path>
                    <path d='M480 0H360a120 120 0 0 1-240 0H0a240 240 0 1 0 480 0Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 17',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 240A240 240 0 0 0 0 480h120a120 120 0 0 1 240 0h120a240 240 0 0 0-240-240Z'></path>
                    <path d='M480 0H360a120 120 0 0 1-240 0H0a240 240 0 1 0 480 0Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 18',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 480H0a240 240 0 1 1 480 0Z'></path>
                    <path d='M0 0h480A240 240 0 1 1 0 0Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 19',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 0A240 240 0 0 0 0 240v240h480V240A240 240 0 0 0 240 0ZM120 360V240a120 120 0 0 1 240 0v120H120Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 20',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240H0a240 240 0 1 1 480 0ZM480 480H0a240 240 0 1 1 480 0Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 21',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M0 0v120a360 360 0 0 1 360 360h120A480 480 0 0 0 0 0Z'></path>
                    <path d='M0 240v120a120 120 0 0 1 120 120h120A240 240 0 0 0 0 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 22',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 0a240 240 0 1 0 0 480 240 240 0 0 0 0-480Zm0 400a160 160 0 1 1 0-320 160 160 0 0 1 0 320Z'></path>
                    <circle cx='240' cy='240' r='80'></circle>
                </svg>
            )
        },
        {
            name: 'SVG Shape 23',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240ZM240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0ZM480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240ZM240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 24',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M360 289.7c43.4 0 86.9-16.6 120-49.7a169.2 169.2 0 0 0-120-49.7 169.2 169.2 0 0 0 49.7-120c-46.9 0-89.3 19-120 49.7 0-43.4-16.6-86.9-49.7-120a169.2 169.2 0 0 0-49.7 120 169.2 169.2 0 0 0-120-49.7c0 46.8 19 89.3 49.7 120-43.4 0-86.9 16.6-120 49.7a169.2 169.2 0 0 0 120 49.7 169.2 169.2 0 0 0-49.7 120c46.8 0 89.3-19 120-49.7 0 43.4 16.6 86.9 49.7 120a169.2 169.2 0 0 0 49.7-120 169.2 169.2 0 0 0 120 49.7c0-46.9-19-89.3-49.7-120Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 25',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M0 240a169.7 169.7 0 0 0 240 0 169.7 169.7 0 0 0-240 0ZM240 0a169.7 169.7 0 0 0 0 240 169.7 169.7 0 0 0 0-240ZM480 240a169.7 169.7 0 0 0-240 0 169.7 169.7 0 0 0 240 0ZM240 480a169.7 169.7 0 0 0 0-240 169.7 169.7 0 0 0 0 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 26',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 240A240 240 0 0 0 0 480a240 240 0 0 0 240-240ZM240 240A240 240 0 0 0 0 0a240 240 0 0 0 240 240ZM480 0a240 240 0 0 0-240 240A240 240 0 0 0 480 0ZM480 480a240 240 0 0 0-240-240 240 240 0 0 0 240 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 27',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 0v339.8A340.2 340.2 0 0 1 140.2 0H480Z'></path>
                    <path d='M0 480V140.2A340.2 340.2 0 0 1 339.8 480H0Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 28',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240H240V0a240 240 0 0 1 240 240ZM240 480H0V240a240 240 0 0 1 240 240ZM480 480H240V240a240 240 0 0 1 240 240ZM240 240H0V0a240 240 0 0 1 240 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 29',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M0 240v120a120 120 0 0 1 120 120h120A240 240 0 0 0 0 240ZM480 240V120A120 120 0 0 1 360 0H240a240 240 0 0 0 240 240ZM240 0H120A120 120 0 0 1 0 120v120A240 240 0 0 0 240 0ZM240 480h120a120 120 0 0 1 120-120V240a240 240 0 0 0-240 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 30',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M0 240v240h240A240 240 0 0 0 0 240ZM240 480h240V240a240 240 0 0 0-240 240ZM240 0H0v240A240 240 0 0 0 240 0ZM240 0a240 240 0 0 0 240 240V0H240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 31',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240.2 240A240 240 0 0 0 480 0H240a240 240 0 1 0 0 480h240a240 240 0 0 0-239.8-240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 32',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 0H0a240 240 0 0 0 240 240h240A240 240 0 0 0 240 0ZM240 240H0a240 240 0 0 0 240 240h240a240 240 0 0 0-240-240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 33',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M240 480a240 240 0 0 0 240-240L240 0A240 240 0 0 0 0 240l240 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 34',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240H240V0a240 240 0 0 1 240 240ZM0 240h240v240A240 240 0 0 1 0 240Z'></path>
                </svg>
            )
        },
        {
            name: 'SVG Shape 35',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}><path d='M240 0v240h240A240 240 0 0 0 240 0ZM240 480h240V240a240 240 0 0 0-240 240ZM0 240a240 240 0 0 0 240 240V240H0ZM0 240V0h240A240 240 0 0 1 0 240Z'></path></svg>

            )
        }, {
            name: 'SVG Shape 36',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0c-43.7 0-84.7 11.7-120 32.1a240 240 0 0 1 0 415.8A240 240 0 1 0 240 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 37',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0c-132.6 0 0 240 0 240s240 132.6 240 0S372.6 0 240 0ZM240 480c132.6 0 0-240 0-240S0 107.4 0 240s107.5 240 240 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 38',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< circle cx='240' cy='240' r='240' ></ circle ></ svg >

            )
        }, {
            name: 'SVG Shape 39',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M211.5 154.6a30 30 0 0 0 57 0l15.5-46.7a46.4 46.4 0 1 0-88 0l15.5 46.7ZM268.5 325.4a30 30 0 0 0-57 0L196 372.1a46.4 46.4 0 1 0 88 0l-15.5-46.7ZM372.1 196l-46.7 15.5a30 30 0 0 0 0 57l46.7 15.5c29.8 10 60.9-12 61.1-43.3v-1.3a46.4 46.4 0 0 0-61-43.4ZM107.9 284l46.7-15.5a30 30 0 0 0 0-57L107.9 196a46.4 46.4 0 1 0 0 88.1ZM320.5 199.7l44-22a46.4 46.4 0 0 0 12.6-73.9l-.9-.9a46.4 46.4 0 0 0-74 12.5l-22 44a30 30 0 0 0 40.3 40.3ZM159.5 280.3l-44 22a46.4 46.4 0 0 0-12.5 74l.8.8a46.4 46.4 0 0 0 74-12.6l22-44a30 30 0 0 0-40.3-40.2ZM364.6 302.3l-44-22a30 30 0 0 0-40.3 40.2l22 44a46.4 46.4 0 0 0 73.9 12.6l.8-.9a46.4 46.4 0 0 0-12.4-74ZM115.4 177.7l44 22a30 30 0 0 0 40.3-40.2l-22-44a46.4 46.4 0 1 0-62.2 62.2Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 40',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 240 160-80c0-23.5-5-45.8-14.1-65.9-20.1-9-42.4-14.1-65.9-14.1l-80 160ZM240 240 160 80c-23.5 0-45.8 5-65.9 14.1-9 20.1-14.1 42.4-14.1 65.9l160 80ZM240 240l80 160c23.5 0 45.8-5 65.9-14.1 9-20.1 14.1-42.4 14.1-65.9l-160-80ZM240 240 80 320c0 23.5 5 45.8 14.1 65.9 20.1 9 42.4 14.1 65.9 14.1l80-160ZM240 240l169.7 56.6c16.6-16.6 28.8-36 36.6-56.6-7.8-20.6-20-40-36.6-56.6L240 240ZM240 240l56.6-169.7A159.4 159.4 0 0 0 240 33.7c-20.6 7.8-40 20-56.6 36.6L240 240ZM240 240l-56.6 169.7c16.6 16.6 36 28.8 56.6 36.6 20.6-7.8 40-20 56.6-36.6L240 240ZM240 240 70.3 183.4A159.4 159.4 0 0 0 33.7 240c7.8 20.6 20 40 36.6 56.6L240 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 41',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m320.5 199.7 38.1-19L400 160v-.4A79.6 79.6 0 0 0 321 80h-1l-19.6 39.2-20.1 40.3a30 30 0 0 0 40.2 40.3ZM159.5 199.7a30 30 0 0 0 40.2-40.2l-16.3-32.6L160 80h-1a79.7 79.7 0 0 0-79 79.6v.4l41 20.5 38.5 19.2ZM320.5 280.3a30 30 0 0 0-40.2 40.2l16.3 32.6L320 400h1.1a80 80 0 0 0 78.9-78.8V320l-43-21.5-36.5-18.2ZM159.5 280.3l-32.6 16.3L80 320v1.2A80 80 0 0 0 159 400h1.1l20.4-40.8 19.3-38.7a30 30 0 0 0-40.2-40.2ZM410.2 184l-.5-.6-47.1 15.8-37.2 12.3a30 30 0 0 0 0 57l43.7 14.5 40.6 13.6.5-.5a79.8 79.8 0 0 0 0-112.2ZM268.5 154.6l16.1-48.4 12-35.9-.5-.5a79.7 79.7 0 0 0-112.7.5l16.9 50.5 11.2 33.8a30 30 0 0 0 57 0ZM211.5 325.4 198.7 364l-15.3 45.8.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5-16.9-50.4-11.2-33.9a30 30 0 0 0-57 0ZM154.6 211.5 115 198.4l-44.8-15-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5 44.6-14.9 39.7-13.2a30 30 0 0 0 0-57Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 42',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 240 160-80v-.7A79.8 79.8 0 0 0 320.7 80h-.7l-80 160ZM240 240 160 80h-.7A79.8 79.8 0 0 0 80 159.3v.7l160 80ZM240 240l80 160h.7a79.8 79.8 0 0 0 79.3-79.3v-.7l-160-80ZM240 240 80 320v.7a79.8 79.8 0 0 0 79.3 79.3h.7l80-160ZM240 240l169.7 56.6.5-.5a79.8 79.8 0 0 0 0-112.2l-.5-.5L240 240ZM240 240l56.6-169.7-.5-.5a79.8 79.8 0 0 0-112.2 0l-.5.5L240 240ZM240 240l-56.6 169.7.5.5a79.8 79.8 0 0 0 112.2 0l.5-.5L240 240ZM240 240 70.3 183.4l-.5.5a79.8 79.8 0 0 0 0 112.2l.5.5L240 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 43',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M347.5 168.3C324 184 296 156 311.7 132.5 348.8 76.8 310.7 0 239.2 0s-108.6 75.8-70.9 132.5C184 156 156 184 132.5 168.3A85.2 85.2 0 0 0 0 239.2v1.6c0 68 75.8 108.6 132.5 70.9C156 296 184 324 168.3 347.6A85.2 85.2 0 0 0 239.2 480h1.6c68 0 108.6-75.8 70.9-132.5C296 324 324 296 347.6 311.7c55.6 37.1 132.4-1 132.4-72.5s-75.8-108.6-132.5-70.9Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 44',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M356.5 65.3a42 42 0 0 0-35-65.3h-163a42 42 0 0 0-35 65.3c25.5 38.2-20 83.7-58.2 58.2a42 42 0 0 0-65.3 35v163a42 42 0 0 0 65.3 35c38.2-25.5 83.7 20 58.2 58.2a42 42 0 0 0 35 65.3h163a42 42 0 0 0 35-65.3c-25.5-38.2 20-83.7 58.2-58.2a42 42 0 0 0 65.3-35v-163a42 42 0 0 0-65.3-35c-38.2 25.5-83.7-20-58.2-58.2Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 45',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210a169.3 169.3 0 0 0-130.6-49.4c2.9-46.9-13.6-94.8-49.4-130.6a42.4 42.4 0 0 0-60 0 169.3 169.3 0 0 0-49.4 130.6C113.7 157.7 65.8 174.2 30 210a42.4 42.4 0 0 0 0 60 169.3 169.3 0 0 0 130.6 49.4c-2.9 46.9 13.6 94.8 49.4 130.6a42.4 42.4 0 0 0 60 0 169.3 169.3 0 0 0 49.4-130.6c46.9 2.9 94.8-13.6 130.6-49.4a42.4 42.4 0 0 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 46',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M398.7 240A239.4 239.4 0 0 0 480 60a60 60 0 0 0-60-60c-71.7 0-136 31.4-180 81.3A239.4 239.4 0 0 0 60 0 60 60 0 0 0 0 60c0 71.7 31.4 136 81.3 180A239.4 239.4 0 0 0 0 420a60 60 0 0 0 60 60c71.7 0 136-31.4 180-81.3A239.4 239.4 0 0 0 420 480a60 60 0 0 0 60-60c0-71.7-31.4-136-81.3-180Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 47',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M398.7 240A239.4 239.4 0 0 0 480 60V0h-60c-71.7 0-136 31.4-180 81.3A239.4 239.4 0 0 0 60 0H0v60c0 71.7 31.4 136 81.3 180A239.4 239.4 0 0 0 0 420v60h60c71.7 0 136-31.4 180-81.3A239.4 239.4 0 0 0 420 480h60v-60c0-71.7-31.4-136-81.3-180Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 48',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210a169.3 169.3 0 0 0-130.6-49.4c2.9-46.9-13.6-94.8-49.4-130.6L240 0l-30 30a169.3 169.3 0 0 0-49.4 130.6C113.7 157.7 65.8 174.2 30 210L0 240l30 30a169.3 169.3 0 0 0 130.6 49.4c-2.9 46.9 13.6 94.8 49.4 130.6l30 30 30-30a169.3 169.3 0 0 0 49.4-130.6c46.9 2.9 94.8-13.6 130.6-49.4l30-30-30-30Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 49',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 240 71.7-107.5A85.2 85.2 0 0 0 240.8 0h-1.6a85.2 85.2 0 0 0-70.9 132.5L240 240l-107.5-71.7A85.2 85.2 0 0 0 0 239.2v1.6c0 68 75.8 108.6 132.5 70.9L240 240l-71.7 107.5A85.2 85.2 0 0 0 239.2 480h1.6c68 0 108.6-75.8 70.9-132.5L240 240l107.5 71.7A85.2 85.2 0 0 0 480 240.8a85.2 85.2 0 0 0-132.5-72.5L240 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 50',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 240 400 0H80l160 240L0 80v320l240-160L80 480h320L240 240l240 160V80L240 240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 51',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m480 160-240 80L320 0H160l80 240L0 160v160l240-80-80 240h160l-80-240 240 80V160z' ></ path >< path d='M466.3 353.1 240 240l226.3-113.1L353.1 13.7 240 240 126.9 13.7 13.7 126.9 240 240 13.7 353.1l113.2 113.2L240 240l113.1 226.3 113.2-113.2z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 52',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M466.3 353.1 240 240l226.3-113.1L353.1 13.7 240 240 126.9 13.7 13.7 126.9 240 240 13.7 353.1l113.2 113.2L240 240l113.1 226.3 113.2-113.2z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 53',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m480 160-240 80L320 0H160l80 240L0 160v160l240-80-80 240h160l-80-240 240 80V160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 54',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240 320 0l-80 120L160 0 0 240l160 240 80-120 80 120 160-240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 55',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M197.6 42.4 42.4 197.6a60 60 0 0 0 0 84.8l155.2 155.2a60 60 0 0 0 84.8 0l155.2-155.2a60 60 0 0 0 0-84.8L282.4 42.4a60 60 0 0 0-84.8 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 56',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 240 240 0l240 240-240 240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 57',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0H0v240a240 240 0 0 1 240 240h240V240A240 240 0 0 1 240 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 58',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0H0v240l240 240h240V240L240 0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 59',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360 240 240 0 120 240v120l120 120 120-120V240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 60',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 160 320 0H160v160H0v160l160 160h160V320h160V160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 61',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 120 360 0H120L0 120l120 120L0 360l120 120h240l120-120-120-120 120-120z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 62',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360 120 240 0 120 120v240l120 120 120-120V120z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 63',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m0 360 120-120 120 120-120 120zM0 120 120 0l120 120-120 120zM240 120 360 0l120 120-120 120zM240 360l120-120 120 120-120 120z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 64',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0 120 120l120 120-120 120 120 120 240-240L240 0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 65',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 240 120 120-120 120-120-120zM240 0l120 120-120 120-120-120z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 66',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 120 360 0 240 120 120 0 0 120l120 120L0 360l120 120 120-120 120 120 120-120-120-120 120-120z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 67',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m60 240 132 176c24 32 72 32 96 0l132-176L288 64a60 60 0 0 0-96 0L60 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 68',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M371.3 294.4 480 240l-108.7-54.4 38.4-115.3-115.3 38.4L240 0l-54.4 108.7L70.3 70.3l38.4 115.3L0 240l108.7 54.4-38.4 115.3 115.3-38.4L240 480l54.4-108.7 115.3 38.4-38.4-115.3z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 69',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M372.7 186.3 320 160l-26.3-52.7a60 60 0 0 0-107.4 0L160 160l-52.7 26.3a60 60 0 0 0 0 107.4L160 320l26.3 52.7a60 60 0 0 0 107.4 0L320 320l52.7-26.3a60 60 0 0 0 0-107.4Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 70',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m320 320 160-80-160-80L240 0l-80 160L0 240l160 80 80 160 80-160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 71',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m186.3 107.3-52.9 105.9a60 60 0 0 0 0 53.6l53 105.9a60 60 0 0 0 107.3 0l52.9-105.9a60 60 0 0 0 0-53.6l-53-105.9a60 60 0 0 0-107.3 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 72',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 353.1 169.7 56.6L353.1 240l56.6-169.7L240 126.9 70.3 70.3 126.9 240 70.3 409.7 240 353.1z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 73',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m360 240-66.3-132.7a60 60 0 0 0-107.4 0L120 240l66.3 132.7a60 60 0 0 0 107.4 0L360 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 74',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360 240 240 0 120 240l120 240 120-240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 75',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m349.4 276.5 54.7 18.2a57.7 57.7 0 1 0 0-109.4l-54.7 18.2a57.4 57.4 0 0 1-27.1 2.4c5.1-7 12-13 20.8-17.5l51.6-25.8a57.7 57.7 0 1 0-77.3-77.3l-25.8 51.6a57.4 57.4 0 0 1-17.5 20.8 57.4 57.4 0 0 1 2.4-27.1l18.2-54.7a57.6 57.6 0 1 0-109.4 0l18.2 54.7a57.4 57.4 0 0 1 2.4 27.1 57.3 57.3 0 0 1-17.5-20.8l-25.8-51.6a57.7 57.7 0 1 0-77.3 77.3l51.5 25.8a57.4 57.4 0 0 1 21 17.5c-8.7 1.4-18 .7-27.2-2.4l-54.7-18.2a57.7 57.7 0 1 0 0 109.4l54.7-18.2a57.4 57.4 0 0 1 27.1-2.4 57.3 57.3 0 0 1-20.8 17.5l-51.6 25.8a57.7 57.7 0 1 0 77.3 77.3l25.8-51.5a57.4 57.4 0 0 1 17.5-21c1.4 8.7.7 18-2.4 27.2l-18.2 54.7a57.7 57.7 0 1 0 109.4 0l-18.2-54.7a57.4 57.4 0 0 1-2.4-27.1c7 5.1 13 12 17.5 20.9l25.8 51.5a57.7 57.7 0 1 0 77.4-77.4l-51.6-25.7a57.4 57.4 0 0 1-21-17.5c8.7-1.4 18-.7 27.2 2.4ZM240 300a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 76',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360 240a120 120 0 1 0-120-120 120 120 0 1 0-120 120 120 120 0 1 0 120 120 120 120 0 1 0 120-120Zm-120 60a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 77',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450.9 169.7a100 100 0 0 0-13.6-11.4A99.4 99.4 0 0 0 321.6 42.7a99.3 99.3 0 0 0-163.4 0A99.4 99.4 0 0 0 42.7 158.3a99.3 99.3 0 0 0 0 163.4 99.4 99.4 0 0 0 115.6 115.6 99.3 99.3 0 0 0 163.4 0 99.4 99.4 0 0 0 115.5-115.5 99.3 99.3 0 0 0 13.7-152ZM240 300a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 78',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M447.9 240c-14-24.3-32.3-46-53.7-63.9 2.4-27.8 0-56-7.2-83a241.2 241.2 0 0 0-83.1-7.3 241.3 241.3 0 0 0-64-53.7c-24.2 14-45.8 32.3-63.8 53.7-27.8-2.4-56 0-83.1 7.2a241.2 241.2 0 0 0-7.2 83.1A241.3 241.3 0 0 0 32 240c14 24.3 32.3 46 53.7 63.9-2.5 27.8 0 56 7.2 83 27.1 7.3 55.3 9.7 83.1 7.3 18 21.4 39.6 39.6 63.9 53.7 24.3-14 46-32.3 63.9-53.7 27.8 2.4 56 0 83-7.2 7.3-27.1 9.7-55.3 7.3-83.1 21.4-18 39.6-39.6 53.7-63.9ZM240 300a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 79',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M398.7 240c30.3-26.7 53.8-61 67.6-99.8a60 60 0 0 0-47-79.5 60 60 0 0 0-79.5-47A240.4 240.4 0 0 0 240 81.3a240.3 240.3 0 0 0-99.8-67.6 60 60 0 0 0-79.5 47 60 60 0 0 0-47 79.5C27.5 179 51 213.2 81.3 240a240.3 240.3 0 0 0-67.6 99.8 60 60 0 0 0 47 79.5 60 60 0 0 0 79.5 47c38.8-13.8 73-37.3 99.8-67.6 26.7 30.3 61 53.8 99.8 67.6a60 60 0 0 0 79.5-47 60 60 0 0 0 47-79.5 240.4 240.4 0 0 0-67.6-99.8ZM240 300a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 80',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240a169.2 169.2 0 0 0-120-49.7 169.2 169.2 0 0 0 49.7-120c-46.9 0-89.3 19-120 49.7 0-43.4-16.6-86.9-49.7-120a169.2 169.2 0 0 0-49.7 120 169.2 169.2 0 0 0-120-49.7c0 46.8 19 89.3 49.7 120-43.4 0-86.9 16.6-120 49.7a169.2 169.2 0 0 0 120 49.7 169.2 169.2 0 0 0-49.7 120c46.8 0 89.3-19 120-49.7 0 43.4 16.6 86.9 49.7 120a169.2 169.2 0 0 0 49.7-120 169.2 169.2 0 0 0 120 49.7c0-46.9-19-89.3-49.7-120 43.4 0 86.9-16.6 120-49.7Zm-240 60a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 81',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M401.6 288.4 450 240l-48.4-48.4 8.1-8.2A80 80 0 0 0 296.6 70.3l-8.2 8.1L240 30l-48.4 48.4-8.2-8.1A80 80 0 0 0 70.3 183.4l8.1 8.2L30 240l48.4 48.4-8.1 8.2a80 80 0 0 0 113.1 113.1l8.2-8.1L240 450l48.4-48.4 8.2 8.1a80 80 0 0 0 113.1-113.1l-8.1-8.2ZM240 300a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 82',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240c0-29.1-20.7-55.8-55.2-76.5 9.7-39.1 5.5-72.6-15-93.2-20.7-20.6-54.2-24.8-93.3-15.1C295.8 20.7 269.1 0 240 0s-55.8 20.7-76.5 55.2c-39.1-9.7-72.6-5.5-93.2 15s-24.8 54.2-15.1 93.2C20.7 184.3 0 211 0 240s20.7 55.8 55.2 76.5c-9.7 39.1-5.5 72.6 15 93.2 20.7 20.6 54.2 24.8 93.2 15.1C184.2 459.3 211 480 240 480s55.8-20.7 76.5-55.2c39.1 9.7 72.6 5.5 93.2-15s24.8-54.2 15-93.2C459.4 295.8 480 269 480 240Zm-240 60a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 83',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210a57 57 0 0 1-40.3-97.3 30 30 0 1 0-42.4-42.4A57 57 0 0 1 270 30a30 30 0 1 0-60 0 57 57 0 0 1-97.3 40.3 30 30 0 1 0-42.4 42.4A57 57 0 0 1 30 210a30 30 0 1 0 0 60 57 57 0 0 1 40.3 97.3 30 30 0 1 0 42.4 42.4A57 57 0 0 1 210 450a30 30 0 1 0 60 0 57 57 0 0 1 97.3-40.3 30 30 0 1 0 42.4-42.4A57 57 0 0 1 450 270a30 30 0 1 0 0-60Zm-210 90a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 84',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 210h-89.2l82.4-34.1-23-55.5-82.3 34.2 63-63L388.5 49l-63 63 34-82.4-55.4-23L270 89.3V0h-60v89.2L175.9 6.8l-55.5 23 34.2 82.3-63-63L49 91.5l63 63-82.3-34-23 55.4L89.2 210H0v60h89.2L6.8 304.1l23 55.5 82.3-34.2-63 63L91.5 431l63-63-34 82.4 55.4 23 34.1-82.5V480h60v-89.2l34.1 82.4 55.5-23-34.2-82.3 63 63 42.5-42.4-63-63 82.4 34 23-55.4-82.5-34.1H480v-60Zm-240 90a60 60 0 1 1 0-120 60 60 0 0 1 0 120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 85',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M400 480H80a160 160 0 1 1 320 0ZM80 0h320A160 160 0 1 1 80 0ZM0 400V80a160 160 0 1 1 0 320ZM480 80v320a160 160 0 1 1 0-320Z' ></ path >< circle cx='240' cy='240' r='80' ></ circle ></ svg >

            )
        }, {
            name: 'SVG Shape 86',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m337 320 63-160h-80a160 160 0 1 0-320 0h160L80 320h80a160 160 0 1 0 320 0H337Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 87',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 120A120 120 0 0 1 120 0H0a240 240 0 0 0 240 240A240 240 0 0 0 0 480h120c0-66.3 53.7-120 120-120a120 120 0 1 0 0-240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 88',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0v120A120 120 0 0 1 120 0H0a240 240 0 0 0 240 240A240 240 0 0 0 0 480h120a120 120 0 0 1 120-120v120a240 240 0 1 0 0-480Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 89',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 160a160 160 0 1 0-320 0v320h160V160h160ZM320 0v320H160a160 160 0 1 0 320 0V0H320Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 90',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 0v160a160 160 0 1 0-320 0v320h160V320a160 160 0 1 0 320 0V0H320Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 91',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 0v240a160 160 0 1 0-320 0v240h160V240a160 160 0 1 0 320 0V0H320Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 92',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0A240 240 0 0 0 0 240v240h240a240 240 0 0 0 240-240V0H240Zm0 360a120 120 0 1 1 0-240 120 120 0 0 1 0 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 93',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0H240A240 240 0 0 0 0 240v240h240a240 240 0 0 0 240-240V0ZM360 240a120 120 0 0 1-120 120H120V240a120 120 0 0 1 120-120h120v120ZM480 0H240A240 240 0 0 0 0 240v240h240a240 240 0 0 0 240-240V0ZM360 240a120 120 0 0 1-120 120H120V240a120 120 0 0 1 120-120h120v120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 94',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0h230c138 0 250 112 250 250v230H250C112 480 0 368 0 230V0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 95',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409.7 310.3 480 240l-70.3-70.3V70.3h-99.4L240 0l-70.3 70.3H70.3v99.4L0 240l70.3 70.3v99.4h99.4L240 480l70.3-70.3h99.4v-99.4z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 96',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0v240L240 0H0zM480 480V240L240 480h240zM240 0h240v240H240zM0 240h240v240H0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 97',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M447.9 240c20.4-17.6 32.1-38.1 32.1-60 0-66.3-107.5-120-240-120S0 113.7 0 180c0 21.9 11.7 42.4 32.1 60C11.7 257.6 0 278.1 0 300c0 66.3 107.5 120 240 120s240-53.7 240-120c0-21.9-11.7-42.4-32.1-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 98',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 180c0-66.3-107.5-120-240-120S0 113.7 0 180v120c0 66.3 107.5 120 240 120s240-53.7 240-120V180Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 99',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M447.9 240c20.4-17.6 32.1-38.1 32.1-60 0-66.3-107.5-120-240-120S0 113.7 0 180c0 21.9 11.7 42.4 32.1 60C11.7 257.6 0 278.1 0 300c0 66.3 107.5 120 240 120s240-53.7 240-120c0-21.9-11.7-42.4-32.1-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 100',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240c0-47-54-87.7-132.7-107.3C327.7 54 287 0 240 0s-87.7 54-107.3 132.7C54 152.3 0 193 0 240s54 87.7 132.7 107.3C152.3 426 193 480 240 480s87.7-54 107.3-132.7C426 327.8 480 287 480 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 101',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< ellipse cx='240' cy='120' rx='240' ry='120' ></ ellipse >< ellipse cx='240' cy='360' rx='240' ry='120' ></ ellipse ></ svg >

            )
        }, {
            name: 'SVG Shape 102',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409.7 409.7c33.2-33.2 23.8-100.2-17.9-169.7 41.7-69.6 51.1-136.5 18-169.7C376.4 37 309.4 46.5 240 88.2 170.4 46.5 103.5 37 70.3 70.2 37 103.6 46.5 170.5 88.2 240c-41.7 69.5-51.1 136.5-18 169.7 33.3 33.2 100.2 23.8 169.8-17.9 69.5 41.7 136.5 51.1 169.7 18Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 103',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 120C480 53.7 372.6 0 240 0S0 53.7 0 120v240c0 66.3 107.5 120 240 120s240-53.7 240-120V120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 104',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240c0-21.9-11.7-42.4-32.1-60 20.4-17.6 32.1-38.1 32.1-60C480 53.7 372.6 0 240 0S0 53.7 0 120c0 21.9 11.7 42.4 32.1 60C11.7 197.7 0 218.1 0 240s11.7 42.4 32.1 60C11.7 317.6 0 338.1 0 360c0 66.3 107.5 120 240 120s240-53.7 240-120c0-21.9-11.7-42.4-32.1-60 20.4-17.6 32.1-38.1 32.1-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 105',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240c0-29.1-20.7-55.8-55.2-76.5 9.7-39.1 5.5-72.6-15-93.2-20.7-20.6-54.2-24.8-93.3-15.1C295.8 20.7 269.1 0 240 0s-55.8 20.7-76.5 55.2c-39.1-9.7-72.6-5.5-93.2 15s-24.8 54.2-15.1 93.2C20.7 184.3 0 211 0 240s20.7 55.8 55.2 76.5c-9.7 39.1-5.5 72.6 15 93.2 20.7 20.6 54.2 24.8 93.2 15.1C184.3 459.3 211 480 240 480s55.8-20.7 76.5-55.2c39.1 9.7 72.6 5.5 93.2-15s24.8-54.2 15.1-93.2C459.3 295.8 480 269 480 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 106',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 480H240V0c132.6 0 240 214.9 240 480ZM240 480H0V0c132.6 0 240 214.9 240 480Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 107',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m400 160-160 80-160-80a160 160 0 1 1 320 0ZM80 320l160-80 160 80a160 160 0 1 1-320 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 108',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< ellipse cx='240' cy='240' rx='240' ry='120' ></ ellipse ></ svg >

            )
        }, {
            name: 'SVG Shape 109',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 180V60h-60V0H300v60H180V0H60v60H0v120h60v120H0v120h60v60h120v-60h120v60h120v-60h60V300h-60V180h60ZM300 300H180V180h120v120Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 110',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 120h240v120H240zM0 240h240v120H0zM240 360h240v120H240zM0 0h240v120H0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 111',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 160H320V0H160v160H0v160h160v160h160V320h160V160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 112',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M400 160h-80V80a80 80 0 0 0-160 0v80H80a80 80 0 0 0 0 160h80v80a80 80 0 0 0 160 0v-80h80a80 80 0 0 0 0-160Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 113',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409 295.9a79 79 0 0 1 .7-112.5A80 80 0 0 0 296.6 70.3 79 79 0 0 1 184 71a80.7 80.7 0 0 0-113.4-1.1C39 101 39 152 70.3 183.4s30.5 82.7.7 112.5a80.7 80.7 0 0 0-1.1 113.4 80 80 0 0 0 113.5.4 79 79 0 0 1 113.2 0 80 80 0 0 0 113.5-.4c31-31.4 30-82.2-1.1-113.4Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 114',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m353.1 240 56.6-56.6a80 80 0 0 0-61-136.4H131.3a79.8 79.8 0 0 0-61 136.4l56.6 56.6-56.6 56.6a80 80 0 0 0 61 136.4h217.4a79.8 79.8 0 0 0 61-136.4L353.1 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 115',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409.7 296.6 353.1 240l56.6-56.6A80 80 0 0 0 296.6 70.3L240 126.9l-56.6-56.6A80 80 0 0 0 70.3 183.4l56.6 56.6-56.6 56.6a80 80 0 0 0 113.1 113.1l56.6-56.6 56.6 56.6a80 80 0 0 0 113.1-113.1Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 116',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409.7 296.6 320 206.9h32.9a80 80 0 0 0 0-160h-226a80 80 0 0 0-56.6 136.6L160 273h-32.9a80 80 0 0 0 0 160h226a80 80 0 0 0 56.6-136.5Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 117',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M80 0h320v480H80z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 118',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 60 32.2 420h415.7L240 60z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 119',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M70.3 70.3h339.4v339.4H70.3z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 120',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 11.8 0 186.1l91.7 282.2h296.6L480 186.1 240 11.8z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 121',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360 32.2H120L0 240l120 207.9h240L480 240 360 32.2z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 122',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 6 47.5 98.7 0 307l133.2 167h213.6L480 307 432.5 98.7 240 6z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 123',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M339.4 0H140.6L0 140.6v198.8L140.6 480h198.8L480 339.4V140.6L339.4 0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 124',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 3.7-156.6 57L0 205l29 164.2 127.7 107.2h166.7l127.7-107.2L480 205 396.7 60.7 240 3.7z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 125',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240H240V0a240 240 0 0 1 240 240ZM0 240h240v240A240 240 0 0 1 0 240Z'></path>
                </svg>
            )
        }, {
            name: 'SVG Shape 126',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M314.2 11.8H165.8l-120 87.1L0 240l45.8 141.1 120 87.2h148.4l120-87.2L480 240 434.2 98.9l-120-87.1z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 127',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M343.3 282.8A239 239 0 0 1 480 240c-50.8 0-98-15.8-136.8-42.8 8.4-46.5 30.6-91 66.5-127-36 36-80.4 58.2-127 66.5C255.9 98 240 50.8 240 0c0 50.8-15.8 98-42.8 136.8-46.5-8.4-91-30.6-127-66.5 36 36 58.2 80.4 66.5 127C98 224.1 50.8 240 0 240c50.8 0 98 15.8 136.8 42.8-8.4 46.5-30.6 91-66.5 127 36-36 80.4-58.2 127-66.6A239 239 0 0 1 240 480c0-50.8 15.8-98 42.8-136.8 46.5 8.4 91 30.6 127 66.5-36-36-58.2-80.4-66.5-127Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 128',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240A240 240 0 0 1 240 0L0 240a240 240 0 0 1 240 240l240-240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 129',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240A240 240 0 0 1 240 0 240 240 0 0 1 0 240a240 240 0 0 1 240 240 240 240 0 0 1 240-240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 130',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0A339.4 339.4 0 0 1 0 0a339.4 339.4 0 0 1 0 480 339.4 339.4 0 0 1 480 0 339.4 339.4 0 0 1 0-480Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 131',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M447.9 240c-14-24.3-32.3-46-53.7-63.9 2.4-27.8 0-56-7.2-83a241.2 241.2 0 0 0-83.1-7.3 241.3 241.3 0 0 0-64-53.7c-24.2 14-45.8 32.3-63.8 53.7-27.8-2.4-56 0-83.1 7.2a241.2 241.2 0 0 0-7.2 83.1A241.3 241.3 0 0 0 32 240c14 24.3 32.3 46 53.7 63.9-2.5 27.8 0 56 7.2 83 27.1 7.3 55.3 9.7 83.1 7.3 18 21.4 39.6 39.6 63.9 53.7 24.3-14 46-32.3 63.9-53.7 27.8 2.4 56 0 83-7.2 7.3-27.1 9.7-55.3 7.3-83.1 21.4-18 39.6-39.6 53.7-63.9Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 132',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M447.9 240a241 241 0 0 0-109.1-98.8 241 241 0 0 0-98.8-109 241 241 0 0 0-98.8 109 241 241 0 0 0-109 98.8 241 241 0 0 0 109 98.8 241 241 0 0 0 98.8 109 241 241 0 0 0 98.8-109 241 241 0 0 0 109-98.8Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 133',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 240c0-88.8-48.3-166.4-120-207.9a240 240 0 0 0 0 415.8A240 240 0 0 0 480 240Z' ></ path >< path d='M240 240c0-88.8-48.3-166.4-120-207.9a239.9 239.9 0 0 0 0 415.8A240 240 0 0 0 240 240Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 134',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 360c88.8 0 166.4-48.3 207.9-120A240 240 0 0 0 32 240 240 240 0 0 0 240 360Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 135',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M398.7 240c30.3-26.7 53.8-61 67.6-99.8a60 60 0 0 0-47-79.5 60 60 0 0 0-79.5-47A240.4 240.4 0 0 0 240 81.3a240.3 240.3 0 0 0-99.8-67.6 60 60 0 0 0-79.5 47 60 60 0 0 0-47 79.5C27.5 179 51 213.2 81.3 240a240.3 240.3 0 0 0-67.6 99.8 60 60 0 0 0 47 79.5 60 60 0 0 0 79.5 47c38.8-13.8 73-37.3 99.8-67.6 26.7 30.3 61 53.8 99.8 67.6a60 60 0 0 0 79.5-47 60 60 0 0 0 47-79.5 240.4 240.4 0 0 0-67.6-99.8Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 136',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M398.7 240c30.3-26.7 53.8-61 67.6-99.8A60 60 0 1 0 353.2 100a120 120 0 0 1-226.3 0 60 60 0 1 0-113.1 40.1C27.4 179 51 213.2 81.2 240a240.3 240.3 0 0 0-67.6 99.8A60 60 0 1 0 126.8 380a120 120 0 0 1 226.3 0 60 60 0 1 0 113.1-40.1 240.4 240.4 0 0 0-67.5-99.8Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 137',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M438.82 74.19c-54.9-54.9-143.92-54.9-198.82 0-54.9-54.9-143.92-54.9-198.82 0-54.9 54.9-54.9 143.92 0 198.82l156.4 156.4a60 60 0 0 0 84.85 0l156.4-156.4c54.9-54.9 54.9-143.92 0-198.82Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 1384',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 160v160H160V160h160C320 71.63 248.37 0 160 0S0 71.63 0 160v320h320c88.37 0 160-71.63 160-160s-71.63-160-160-160Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 139',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 160C320 71.63 248.37 0 160 0S0 71.63 0 160v320h320c88.37 0 160-71.63 160-160s-71.63-160-160-160Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 140',
            component: (fillColor) => (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor}>
                    <path d='M480 240H240V0a240 240 0 0 1 240 240ZM0 240h240v240A240 240 0 0 1 0 240Z'></path>
                </svg>
            )
        }, {
            name: 'SVG Shape 141',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 438.82' fill={fillColor} >< path d='M438.82 41.18c-54.9-54.9-143.92-54.9-198.82 0-54.9-54.9-143.92-54.9-198.82 0-54.9 54.9-54.9 143.92 0 198.82L240 438.82 438.82 240c54.9-54.9 54.9-143.92 0-198.82Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 142',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< rect width='360' height='360' x='60' y='60' rx='60' ry='60' ></ rect ></ svg >

            )
        }, {
            name: 'SVG Shape 143',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 0H0v480h480V240A240 240 0 0 1 240 0Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 144',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0H0v480h480V0ZM320 320H160V160h160v160Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 145',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M400 160h80A160 160 0 0 0 320 0H160A160 160 0 0 0 0 160h80a80 80 0 0 1 0 160H0a160 160 0 0 0 160 160h160a160 160 0 0 0 160-160h-80a80 80 0 0 1 0-160Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 146',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='m240 240 240-80A160 160 0 0 0 320 0H160A160 160 0 0 0 0 160l240 80L0 320a160 160 0 0 0 160 160h160a160 160 0 0 0 160-160l-240-80Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 147',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< rect width='480' height='480' rx='120' ry='120' ></ rect ></ svg >

            )
        }, {
            name: 'SVG Shape   148',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0h480v480H0z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 149',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0h240v240H0zM240 240h240v240H240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 150',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M360.5 240V120.5H240V0H0v240h120.5v120.5H240V480h240V240H360.5z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 151',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 160h160v160H320zM0 160h160v160H0zM160 320h160v160H160zM160 0h160v160H160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 152',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M160 320v160h320V320H320V160H160V0H0v320h160z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 153',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M120 120h120v120H120zM0 240h120v120H0zM120 360h120v120H120zM0 0h120v120H0zM360 120h120v120H360zM240 240h120v120H240zM360 360h120v120H360zM240 0h120v120H240z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 154',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0H120v120h120v120h120v120h120V0zM0 480h360V360H240V240H120V120H0v360z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 155',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M409.7 367.3a180 180 0 0 1 0-254.6 30 30 0 1 0-42.4-42.4 180 180 0 0 1-254.6 0 30 30 0 1 0-42.4 42.4 180 180 0 0 1 0 254.6 30 30 0 1 0 42.4 42.4 180 180 0 0 1 254.6 0 30 30 0 1 0 42.4-42.4Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 156',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210A180 180 0 0 1 270 30a30 30 0 1 0-60 0A180 180 0 0 1 30 210a30 30 0 1 0 0 60 180 180 0 0 1 180 180 30 30 0 1 0 60 0 180 180 0 0 1 180-180 30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 157',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210H270V30a30 30 0 1 0-60 0v180H30a30 30 0 1 0 0 60h180v180a30 30 0 1 0 60 0V270h180a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 158',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 210H270V0h-60v210H0v60h210v210h60V270h210v-60z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 159',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210a57 57 0 0 1-40.3-97.3 30 30 0 1 0-42.4-42.4A57 57 0 0 1 270 30a30 30 0 1 0-60 0 57 57 0 0 1-97.3 40.3 30 30 0 1 0-42.4 42.4A57 57 0 0 1 30 210a30 30 0 1 0 0 60 57 57 0 0 1 40.3 97.3 30 30 0 1 0 42.4 42.4A57 57 0 0 1 210 450a30 30 0 1 0 60 0 57 57 0 0 1 97.3-40.3 30 30 0 1 0 42.4-42.4A57 57 0 0 1 450 270a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 160',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210H312.4l97.3-97.3a30 30 0 1 0-42.4-42.4L270 167.6V30a30 30 0 1 0-60 0v137.6l-97.3-97.3a30 30 0 1 0-42.4 42.4l97.3 97.3H30a30 30 0 1 0 0 60h137.6l-97.3 97.3a30 30 0 1 0 42.4 42.4l97.3-97.3V450a30 30 0 1 0 60 0V312.4l97.3 97.3a30 30 0 1 0 42.4-42.4L312.4 270H450a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 161',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 210H312.4L430.9 91.5l-42.4-42.4L270 167.6V0h-60v167.6L91.5 49.1 49.1 91.5 167.6 210H0v60h167.6L49.1 388.5l42.4 42.4L210 312.4V480h60V312.4l118.5 118.5 42.4-42.4L312.4 270H480v-60z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 162',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210c-26.9 0-36.4-35.6-13.1-49a30 30 0 1 0-30-52c-23.3 13.5-49.3-12.6-36-35.9a30 30 0 0 0-52-30h.1c-13.4 23.3-49 13.8-49-13a30 30 0 1 0-60 0c0 26.8-35.6 36.3-49 13a30 30 0 1 0-52 30c13.5 23.3-12.6 49.4-35.9 36a30 30 0 0 0-30 52c23.3 13.3 13.8 48.9-13 48.9a30 30 0 1 0 0 60c26.8 0 36.3 35.6 13 49a30 30 0 1 0 30 52c23.3-13.5 49.4 12.6 36 35.9a30 30 0 0 0 52 30h-.1c13.4-23.3 49-13.8 49 13a30 30 0 1 0 60 0c0-26.8 35.6-36.3 49-13a30 30 0 1 0 52-30c-13.4-23.3 12.6-49.4 35.9-36a30 30 0 0 0 30-52c-23.3-13.3-13.8-48.9 13.1-48.9a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 163',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210h-98l84.9-49a30 30 0 1 0-30-52l-85 49 49-84.9a30 30 0 0 0-52-30l-48.9 85V30a30 30 0 1 0-60 0v98l-49-84.9a30 30 0 1 0-52 30l49 85-84.9-49a30 30 0 0 0-30 52l85 48.9H30a30 30 0 1 0 0 60h98l-84.9 49a30 30 0 1 0 30 52l85-49-49 84.9a30 30 0 0 0 52 30l48.9-85V450a30 30 0 1 0 60 0v-98l49 84.9a30 30 0 1 0 52-30l-49-85 84.9 49a30 30 0 0 0 30-52l-85-48.9H450a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 164',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 210H352l110.9-64-30-52L322 158l64-110.8-52-30L270 128V0h-60v128L146 17.2l-52 30L158 158 47.2 94l-30 52L128 210H0v60h128L17.2 334l30 52L158 322 94 432.9l52 30L210 352v128h60V352l64 110.9 52-30L322 322l110.9 64 30-52L352 270h128v-60z' ></ path ></ svg >

            )
        }, {
            name: 'SVG Shape 165',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210c-12.9 0-16.4-17.7-4.5-22.6a30 30 0 1 0-23-55.4c-11.9 4.8-21.9-10.2-12.8-19.3a30 30 0 1 0-42.4-42.4c-9.1 9-24.1-1-19.2-12.9a30 30 0 1 0-55.4-23c-5 12-22.7 8.5-22.7-4.4a30 30 0 0 0-60 0c0 12.9-17.7 16.4-22.6 4.5a30 30 0 1 0-55.4 23c4.8 11.9-10.2 22-19.3 12.8a30 30 0 1 0-42.4 42.4c9 9.1-1 24.2-12.9 19.2a30 30 0 1 0-23 55.4c12 5 8.5 22.7-4.4 22.7a30 30 0 1 0 0 60c12.9 0 16.4 17.7 4.5 22.7a30 30 0 1 0 23 55.4c11.8-5 21.9 10.1 12.8 19.2a30 30 0 1 0 42.4 42.4c9.1-9 24.1 1 19.2 12.9a30 30 0 1 0 55.4 23c5-12 22.7-8.5 22.7 4.4a30 30 0 1 0 60 0c0-12.9 17.7-16.4 22.6-4.5a30 30 0 1 0 55.4-23c-4.8-11.8 10.2-21.9 19.3-12.8a30 30 0 1 0 42.4-42.4c-9-9.1 1-24.1 12.8-19.2a30 30 0 1 0 23-55.4c-11.9-5-8.4-22.7 4.5-22.7a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 166',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M450 210h-59.2l54.7-22.6a30 30 0 1 0-23-55.4L368 154.5l41.8-41.9a30 30 0 1 0-42.4-42.4L325.4 112l22.7-54.6a30 30 0 1 0-55.4-23L270 89.2V30a30 30 0 1 0-60 0v59.2l-22.7-54.7a30 30 0 1 0-55.4 23l22.6 54.6-41.8-41.8a30 30 0 1 0-42.4 42.4l41.8 41.9-54.7-22.7a30 30 0 1 0-23 55.4L89.3 210H30a30 30 0 1 0 0 60h59.2l-54.7 22.7a30 30 0 1 0 23 55.4l54.6-22.6-41.8 41.8a30 30 0 1 0 42.4 42.4l41.9-41.8-22.7 54.7a30 30 0 1 0 55.4 23l22.7-54.8V450a30 30 0 1 0 60 0v-59.2l22.7 54.7a30 30 0 1 0 55.4-23L325.5 368l41.8 41.8a30 30 0 1 0 42.4-42.4L368 325.4l54.7 22.7a30 30 0 1 0 23-55.4L390.7 270H450a30 30 0 1 0 0-60Z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 167',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 210h-89.2l82.4-34.1-22.9-55.5-82.4 34.2 63-63.1-42.4-42.4-63.1 63 34.2-82.3-55.5-23L270 89.2V0h-60v89.2L175.9 6.8l-55.5 23 34.2 82.3-63.1-63-42.4 42.4 63 63.1-82.3-34.2-23 55.5L89.2 210H0v60h89.2L6.8 304.1l23 55.5 82.3-34.2-63 63.1 42.4 42.4 63.1-63-34.2 82.4 55.5 22.9 34.1-82.4V480h60v-89.2l34.1 82.4 55.5-22.9-34.2-82.4 63.1 63 42.4-42.4-63-63.1 82.4 34.2 22.9-55.5-82.4-34.1H480v-60z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 168',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 240 206.6 70a56 56 0 0 0-93.2 0L0 240h160l113.4 170a56 56 0 0 0 93.2 0L480 240H320Z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 169',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M320 240 160 0 0 240h160l160 240 160-240H320z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 170',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 480H0V0l480 480z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 171',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0H0l240 480L480 0z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 172',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 480H0V0l240 480zM480 0H240v480L480 0z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 173',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 480H0V0l240 480zM480 480H240V0l240 480z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 174',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M480 0H0l240 240L480 0zM480 240H0l240 240 240-240z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 175',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0v240L240 0H0zM480 480V240L240 480h240zM240 240h240L240 0v240zM240 240H0l240 240V240z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 176',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M240 480H0V240l240 240zM480 480H240V240l240 240zM240 240H0V0l240 240zM480 240H240V0l240 240z' ></ path ></ svg >

            )
        },
        {
            name: 'SVG Shape 167',
            component: (fillColor) => (
                < svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480' fill={fillColor} >< path d='M0 0v240L240 0H0zM480 480V240L240 480h240zM0 480h240L0 240v240zM240 0l240 240V0H240z' ></ path ></ svg >

            )
        },

    ];


    const handleSVGClick = (svg) => {
        handleAddSVG(svg); // Call parent function to add SVG
    };

    return (
        <div className="border-2 shadow-md p-3 pl-2 text-[#FCFCFC]">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h5 className="font-semibold text-xl pb-4 pt-2 text-[#082A66]">more shapes</h5>
                <span>{isOpen ? '▼' : '▲'}</span>
            </div>
            {isOpen && (
                <div className="grid-container">
                    {svgs.map((svg, index) => (
                        <div
                            key={index}
                            className={`shape-box`}
                            style={{
                                width: '90px',
                                height: '90px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onClick={() => handleSVGClick(svg)} // Handle click to add SVG
                        >
                            {svg.component('#082A66')} {/* Pass default color */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShapeWithSVG;
