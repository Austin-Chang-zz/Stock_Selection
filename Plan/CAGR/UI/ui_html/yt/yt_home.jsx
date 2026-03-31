import React, { useState } from 'react';

export default function FinanceDashboard() {
    const [activeTab, setActiveTab] = useState('最多人看');
    const [selectedIndex, setSelectedIndex] = useState('加權指數');

    // 热门台股数据
    const stockData = {
        '最多人看': [
            { name: '華邦電', price: 68.40, change: -2.90, changePercent: -4.07, trend: 'down' },
            { name: '台積電', price: 1500.00, change: 20.00, changePercent: 1.35, trend: 'up' },
            { name: '繰創', price: 147.00, change: -2.50, changePercent: -1.57, trend: 'down' },
        ],
        '大盤強勢': [
            { name: '台積電', price: 1500.00, change: 20.00, changePercent: 1.35, trend: 'up' },
            { name: '聯發科', price: 1250.00, change: 15.00, changePercent: 1.21, trend: 'up' },
            { name: '鴻海', price: 185.50, change: 2.50, changePercent: 1.37, trend: 'up' },
        ],
        '急拉股': [
            { name: '華航', price: 32.45, change: 1.25, changePercent: 4.01, trend: 'up' },
            { name: '長榮航', price: 41.20, change: 1.50, changePercent: 3.78, trend: 'up' },
            { name: '陽明', price: 68.30, change: 2.10, changePercent: 3.17, trend: 'up' },
        ],
        '量大股': [
            { name: '聯電', price: 52.80, change: -0.40, changePercent: -0.75, trend: 'down' },
            { name: '長榮', price: 185.00, change: -3.50, changePercent: -1.86, trend: 'down' },
            { name: '國泰金', price: 58.90, change: 0.30, changePercent: 0.51, trend: 'up' },
        ],
    };

    // 指数数据
    const indexData = [
        { name: '加權指數', value: 28362.38, change: 179.78, changePercent: 0.64, trend: 'up' },
        { name: '上櫃指數', value: 264.64, change: 0.45, changePercent: 0.17, trend: 'up' },
        { name: '(延)滬深300', value: 4559.849, change: -38.374, changePercent: -0.83, trend: 'down' },
    ];

    // 热门排行数据
    const hotRankings = [
        { id: 1, name: '匯率', icon: '💱' },
        { id: 2, name: 'ETF 專區', icon: '📊' },
        { id: 3, name: '定期定額', icon: '💰' },
    ];

    // 库存报价数据
    const inventoryQuotes = [
        { id: 1, name: '基金', icon: '📈' },
        { id: 2, name: '存股獎勵', icon: '🏆' },
        { id: 3, name: '抽籤/競拍', icon: '🎯' },
    ];

    // 底部导航
    const bottomNav = ['專家', '自選', '交易', '行情', 'e 櫃台'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* 头部用户信息 */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">張○英先生 <span className="text-gray-400">&gt;</span></h1>
                    <button className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                        編輯
                    </button>
                </div>

                {/* 快捷方式区域 */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 text-gray-300">捷徑</h2>
                    <div className="flex space-x-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="w-24 h-20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">+</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 热门排行 */}
                    <section className="bg-gray-800 rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-300">熱門排行</h2>
                        <div className="space-y-3">
                            {hotRankings.map((item) => (
                                <div key={item.id} className="flex items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                    <span className="mr-3 text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ETF專區 */}
                    <section className="bg-gray-800 rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-300">ETF 專區</h2>
                        <div className="space-y-4">
                            <div className="p-3 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span>0050 元大台灣50</span>
                                    <span className="text-green-400">+1.2%</span>
                                </div>
                                <div className="text-sm text-gray-300 mt-1">追蹤大盤指數</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span>0056 元大高股息</span>
                                    <span className="text-green-400">+0.8%</span>
                                </div>
                                <div className="text-sm text-gray-300 mt-1">高股息ETF</div>
                            </div>
                        </div>
                    </section>

                    {/* 库存报价 */}
                    <section className="bg-gray-800 rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-300">庫存報價</h2>
                        <div className="space-y-3">
                            {inventoryQuotes.map((item) => (
                                <div key={item.id} className="flex items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                    <span className="mr-3 text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 指数区域 */}
                <section className="bg-gray-800 rounded-xl p-5 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">指數</h2>
                        <button className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors">
                            編輯
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {indexData.map((index) => (
                            <div
                                key={index.name}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedIndex === index.name ? 'ring-2 ring-blue-500 bg-gray-900' : 'bg-gray-900 hover:bg-gray-700'}`}
                                onClick={() => setSelectedIndex(index.name)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-300">{index.name}</h3>
                                        <div className="text-2xl font-bold mt-2">{index.value.toLocaleString()}</div>
                                    </div>
                                    <div className={`text-right ${index.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                        <div className="text-lg font-semibold">
                                            {index.trend === 'up' ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)}
                                        </div>
                                        <div className="text-sm">({index.trend === 'up' ? '+' : ''}{index.changePercent}%)</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 热门台股区域 */}
                <section className="bg-gray-800 rounded-xl p-5 mb-8">
                    <h2 className="text-xl font-bold mb-4">熱門台股</h2>

                    {/* 标签页 */}
                    <div className="flex flex-wrap border-b border-gray-700 mb-6">
                        {Object.keys(stockData).map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* 股票列表 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stockData[activeTab].map((stock, index) => (
                            <div key={index} className="bg-gray-900 rounded-xl p-5 hover:bg-gray-700 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold">{stock.name}</h3>
                                    <div className={`text-lg font-bold ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                        {stock.price.toLocaleString()}
                                    </div>
                                </div>
                                <div className={`text-right ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    <div className="text-lg">
                                        {stock.trend === 'up' ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}
                                    </div>
                                    <div className="text-sm">({stock.trend === 'up' ? '+' : ''}{stock.changePercent}%)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 底部导航 */}
                <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-3">
                    <div className="max-w-4xl mx-auto flex justify-around">
                        {bottomNav.map((item) => (
                            <button
                                key={item}
                                className={`px-4 py-2 font-medium ${item === '交易' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}