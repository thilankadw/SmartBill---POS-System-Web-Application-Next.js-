import React from 'react';

const PackageCard: React.FC<PackageCardProps> = ({ title, description, price, features, bgColor, textColor }) => {
  return (
    <div className={`bg-${bgColor} p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl`}>
      <h3 className={`text-2xl font-bold mb-4 text-${textColor}`}>{title}</h3>
      <p className={`text-lg mb-6 text-${textColor}`}>{description}</p>
      <ul className="text-sm mb-6">
        {features.map((feature, index) => (
          <li key={index} className={`text-${textColor} flex items-center mb-2`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <p className={`text-2xl font-semibold text-${textColor} mb-6`}>Rs {price}</p>
      <button className={`bg-${textColor} text-${bgColor} hover:bg-black hover:text-white py-2 px-4 rounded-md transition-all duration-200`}>
        Get Started
      </button>
    </div>
  );
};

export default PackageCard;
