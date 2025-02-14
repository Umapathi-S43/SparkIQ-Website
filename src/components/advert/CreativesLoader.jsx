import "./CreativesLoader.css";

export default function CreativesLoader({ steps }) {
  const stepList = [
    { key: "brandDetails", text: "Fetching logo & Brand elements" },
    { key: "templateData", text: "Analyzing your brand" },
    { key: "generateContent", text: "Determining Target Audience" },
    { key: "applyTemplate", text: "Applying Template" },
    { key: "cloudRender", text: "Finalizing creative" },
  ];

  return (
    <div className="bg-blue-100 p-4 rounded-lg flex flex-col gap-3">
      {stepList.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          {steps[step.key] ? (
            <div className="spinner"></div>
          ) : (
            <span className="text-green-500">✔</span>
          )}
          <p className="text-[#082A66] font-medium text-sm">{step.text}</p>
        </div>
      ))}
    </div>
  );
}
