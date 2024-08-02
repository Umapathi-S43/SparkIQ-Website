import React, { useState } from 'react';
import sample_img from '../../../assets/dashboard_img/ad_creatives_img.jpg'; // Adjust the path as needed

export default function AdCreatives({ onItemSelected, onClose }) {
    const [selectedTab, setSelectedTab] = useState('Templates');

    const gradients = [
        'bg-gradient-to-br from-purple-300 via-pink-300 to-red-500',
        'bg-gradient-to-tr from-green-300 via-blue-300 to-purple-500',
        'bg-gradient-to-bl from-yellow-300 via-orange-500 to-red-500',
        'bg-gradient-to-tl from-blue-300 via-purple-300 to-pink-500',
        'bg-gradient-to-r from-red-300 via-yellow-300 to-green-500',
        'bg-gradient-to-b from-pink-300 via-red-300 to-yellow-500',
    ];

    const aiBackgrounds = [
        'bg-gradient-to-b from-white via-blue-100 to-blue-300',
        'bg-gradient-to-tr from-white via-green-100 to-green-300',
        'bg-gradient-to-bl from-white via-red-100 to-red-300',
        'bg-gradient-to-tr from-white via-yellow-100 to-yellow-300',
        'bg-gradient-to-bl from-white via-purple-100 to-purple-300',
        'bg-gradient-to-tl from-white via-pink-100 to-pink-300',
    ];

    const templates = [
        { layout: 'layout-five', idx: 0 },
        { layout: 'layout-two', idx: 1 },
        { layout: 'layout-six', idx: 2 },
        { layout: 'layout-three', idx: 3 },
        { layout: 'layout-four', idx: 4 },
        { layout: 'layout-one', idx: 5 },
    ];

    const getCardClass = (tab, idx) => {
        if (tab === 'Gradient Ads') return `${gradients[idx % gradients.length]} p-4 rounded-lg shadow-md w-60`;
        if (tab === 'AI Backgrounds') return `bg-white p-4 rounded-lg shadow-md w-60 ${aiBackgrounds[idx % aiBackgrounds.length]}`;
        if (tab === 'Video Ads') return `bg-gray-100 p-4 rounded-lg shadow-md w-60 animate-slide-${idx % 6}`;
        return `bg-[#FCFCFC40] p-4 rounded-lg shadow-md w-60 ${templates[idx].layout}`;
    };

    const handleItemClick = (tab, idx) => {
        let item = {};
        if (tab === 'Templates') {
            item = templates[idx];
        } else if (tab === 'Gradient Ads') {
            item = { bgClass: gradients[idx % gradients.length] };
        } else if (tab === 'AI Backgrounds') {
            item = { bgClass: aiBackgrounds[idx % aiBackgrounds.length] };
        } else if (tab === 'Video Ads') {
            item = { idx };
        }
        onItemSelected(item, tab);
    };

    return (
        <div className="flex flex-col items-center p-3 border border-[#FCFCFC] rounded-[12px] shadow-lg">
            <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-lg font-bold">Ad Creatives</h2>
                <button className="text-xl font-bold" onClick={onClose}>×</button>
            </div>
            <div className="flex justify-between w-full mb-3">
                {['Templates', 'Gradient Ads', 'AI Backgrounds', 'Video Ads'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-1 ${selectedTab === tab ? 'border-b-2 border-[#082A66] text-[#082A66]' : ''}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 pr-4 pb-2 overflow-auto" style={{ height: 'calc(100vh - 27rem)' }}>
                {[...Array(6)].map((_, idx) => (
                    <div
                        key={idx}
                        className={getCardClass(selectedTab, idx)}
                        onClick={() => handleItemClick(selectedTab, idx)}
                    >
                        <img src={sample_img} alt="Ad Image" className="w-full h-32 object-cover" />
                        <h3 className="text-sm font-bold justify-items-start">Surveying prisms - Geomatics</h3>
                        <p className="text-xs mb-2">Surveyors and engineers to measure the change in position of a target that is assumed to be moving.</p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">Learn More</button>
                    </div>
                ))}
            </div>
            <button className="px-8 py-2 bg-blue-500 text-white rounded">Regenerate</button>
        </div>
    );
}

// Add styles for different layouts and animations
const styles = `
.layout-one {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.layout-one img {
  order: 1;
}
.layout-one h3 {
  order: 2;
  margin-top: 10px;
}
.layout-one p {
  order: 3;
}
.layout-one button {
  order: 4;
  margin-top: 10px;
}
.layout-two {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.layout-two img {
  order: 3;
}
.layout-two h3 {
  order: 1;
  margin-top: 10px;
}
.layout-two p {
  order: 2;
}
.layout-two button {
  order: 4;
  margin-top: 10px;
}
.layout-three {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.layout-three img {
  order: 2;
}
.layout-three h3 {
  order: 1;
  margin-top: 10px;
}
.layout-three p {
  order: 3;
}
.layout-three button {
  order: 4;
  margin-top: 10px;
}
.layout-four {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.layout-four img {
  order: 1;
}
.layout-four h3 {
  order: 3;
  margin-top: 10px;
}
.layout-four p {
  order: 2;
}
.layout-four button {
  order: 4;
  margin-top: 10px;
}
.layout-five {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.layout-five img {
  order: 1;
}
.layout-five h3 {
  order: 2;
  margin-top: 10px;
}
.layout-five p {
  order: 3;
}
.layout-five button {
  order: 4;
  margin-top: 10px;
}
.layout-six {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.layout-six img {
  order: 1;
}
.layout-six h3 {
  order: 2;
  margin-top: 10px;
}
.layout-six p {
  order: 3;
}
.layout-six button {
  order: 4;
  margin-top: 10px;
}

@keyframes slide-in-0 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
@keyframes slide-out-0 {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
@keyframes slide-in-1 {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0); }
}
@keyframes slide-out-1 {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
@keyframes slide-in-2 {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}
@keyframes slide-out-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
@keyframes slide-in-3 {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
@keyframes slide-out-3 {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
}
@keyframes slide-in-4 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
@keyframes slide-out-4 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}
@keyframes slide-in-5 {
  0% { opacity: 0; }
  100% { opacity: 1); }
}
@keyframes slide-out-5 {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.animate-slide-0 {
  animation: slide-in-0 1s ease-in-out, slide-out-0 1s ease-in-out 3s;
}
.animate-slide-1 {
  animation: slide-in-1 1s ease-in-out, slide-out-1 1s ease-in-out 3s;
}
.animate-slide-2 {
  animation: slide-in-2 1s ease-in-out, slide-out-2 1s ease-in-out 3s;
}
.animate-slide-3 {
  animation: slide-in-3 1s ease-in-out, slide-out-3 1s ease-in-out 3s;
}
.animate-slide-4 {
  animation: slide-in-4 1s ease-in-out, slide-out-4 1s ease-in-out 3s;
}
.animate-slide-5 {
  animation: slide-in-5 1s ease-in-out, slide-out-5 1s ease-in-out 3s;
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
