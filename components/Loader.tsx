import React from 'react';

const logoUrl = "https://agricultural-jade-xeunoadouy.edgeone.app/create%20an%20logo%20for%20an%20app%20with%20the%20name%20of%20flora%20lenz,%20and%20that%20based%20on%20the%20topic%20of%20identifying%20pla.jpg";

const Loader: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
            <div className="text-center">
                <img src={logoUrl} alt="Flora Lenz Logo" className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-lg animate-pulse" />
                <p className="text-gray-700 font-semibold text-lg dark:text-gray-300">Loading your garden...</p>
            </div>
        </div>
    );
};

export default Loader;