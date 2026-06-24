import React, { useState, useEffect, useMemo } from 'react'

export default function Home({deviceApiUrl}) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [showAttendanceOnly, setShowAttendanceOnly] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [stats, setStats] = useState({
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,
    });

    useEffect(() => {
        const fetchDevices = () => {
            axios.get(deviceApiUrl)
                .then(response => {
                    const deviceData = response.data.data || [];
                    setDevices(deviceData);
                    setStats({
                        totalDevices: deviceData.length,
                        onlineDevices: deviceData.filter(d => d.connection_status === 'online').length,
                        offlineDevices: deviceData.filter(d => d.connection_status === 'offline').length,
                    });
                    setLastUpdated(new Date());
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching devices:', error);
                    setLoading(false);
                });
        };

        fetchDevices();
        const interval = setInterval(fetchDevices, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatLastSeen = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);

        if (diffSeconds < 60) return 'Just now';
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const formatLastUpdated = (date) => {
        if (!date) return '—';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const onlineRate = stats.totalDevices > 0
        ? Math.round((stats.onlineDevices / stats.totalDevices) * 100)
        : 0;

    const filteredDevices = useMemo(() => {
        const sorted = [...devices].sort((a, b) => {
            if (a.connection_status === 'online' && b.connection_status !== 'online') return -1;
            if (a.connection_status !== 'online' && b.connection_status === 'online') return 1;
            return a.device_name.localeCompare(b.device_name);
        });

        let filtered = sorted;

        if (showOnlineOnly) {
            filtered = filtered.filter(device => device.connection_status === 'online');
        }

        if (showAttendanceOnly) {
            filtered = filtered.filter(device => device.for_attendance === 1);
        }

        if (!searchTerm.trim()) return filtered;

        const term = searchTerm.toLowerCase();
        return filtered.filter(device =>
            device.device_name?.toLowerCase().includes(term) ||
            device.ip_address?.toLowerCase().includes(term) ||
            device.serial_number?.toLowerCase().includes(term)
        );
    }, [devices, searchTerm, showOnlineOnly, showAttendanceOnly]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Biometric Devices</h1>
                        </div>
                        <p className="text-slate-500 ml-1">Real-time monitoring and status overview</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700">Live</span>
                        </div>
                        <div className="w-px h-4 bg-slate-300"></div>
                        <div className="text-sm text-slate-500">
                            Updated: <span className="font-medium text-slate-700">{formatLastUpdated(lastUpdated)}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalDevices}</p>
                        <p className="text-sm text-slate-500 mt-1">Registered devices</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{onlineRate}%</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats.onlineDevices}</p>
                        <p className="text-sm text-slate-500 mt-1">Online devices</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Offline</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stats.offlineDevices}</p>
                        <p className="text-sm text-slate-500 mt-1">Disconnected devices</p>
                    </div>
                </div>

                {/* Uptime Progress Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Network Availability</span>
                        <span className="text-sm font-semibold text-slate-900">{onlineRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${onlineRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Device Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Device Status Overview</h2>
                            <p className="text-sm text-slate-500">{filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''} displayed</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <label className="inline-flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={showOnlineOnly}
                                    onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-medium text-slate-700">Online only</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={showAttendanceOnly}
                                    onChange={(e) => setShowAttendanceOnly(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-medium text-slate-700">For attendance only</span>
                            </label>
                            <div className="relative">
                                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search devices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Device</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Serial Number</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Seen</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <svg className="w-10 h-10 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="text-sm font-medium">Loading devices...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredDevices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-10 h-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm font-medium">No devices found</p>
                                                {searchTerm && <p className="text-xs text-slate-400 mt-1">Try adjusting your search</p>}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDevices.map(device => (
                                        <tr key={device.id} className="hover:bg-slate-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {device.connection_status === 'online' ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                                        Online
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                                        Offline
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900">{device.device_name}</div>
                                                <div className="text-xs text-slate-500">{device.mac_address || 'No MAC address'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded">{device.ip_address}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-600 font-mono">{device.serial_number || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-600">{formatLastSeen(device.last_seen_at)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${device.is_active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {device.is_active ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-slate-400">
                    Dashboard refreshes automatically every 10 seconds
                </div>
            </div>
        </div>
    );
}
