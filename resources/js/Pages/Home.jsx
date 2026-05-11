import React, { useState, useEffect } from 'react'

export default function Home() {
    const [devices, setDevices] = useState([]);
    const [status, setStatus] = useState([]);
    const [stats, setStats] = useState({
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,

    });

    useEffect(() => {
        axios.post('/api/deviceList')
            .then(response => {
                setDevices(response.data.devices);
            })
            .catch(error => {
                console.error('Error fetching status:', error);
            });
    }, []);



    // Fetch status from API
    useEffect(() => {
        const fetchStatus = () => {
            axios.post('/api/status')
                .then(response => {
                    setStatus(response.data.devices);
                    setStats({
                        totalDevices: response.data.totalDevices,
                        onlineDevices: response.data.onlineDevices,
                        offlineDevices: response.data.offlineDevices,
                    });
                })
                .catch(error => {
                    console.error('Error fetching status:', error);
                });
        };

        // Initial call
        fetchStatus();

        // Set interval for every 3 minutes (180,000 milliseconds)
        const interval = setInterval(fetchStatus, 180000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDevices(prevDevices =>
                prevDevices.map(device => ({
                    ...device,
                    lastSeen: getRandomLastSeen(),
                    signal: device.status === 'online' ? Math.max(70, Math.min(100, device.signal + Math.floor(Math.random() * 11) - 5)) : device.signal,
                    battery: device.status === 'online' ? Math.max(0, Math.min(100, device.battery - Math.floor(Math.random() * 2))) : device.battery
                }))
            );
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const getRandomLastSeen = () => {
        const times = ['30 seconds ago', '1 minute ago', '2 minutes ago', '5 minutes ago', '10 minutes ago'];
        return times[Math.floor(Math.random() * times.length)];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'online': return 'text-green-600';
            case 'offline': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getSignalStrength = (signal) => {
        if (signal >= 80) return 'excellent';
        if (signal >= 60) return 'good';
        if (signal >= 40) return 'fair';
        return 'poor';
    };

    const getBatteryColor = (battery) => {
        if (battery >= 60) return 'bg-green-500';
        if (battery >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Biometric Devices Dashboard</h1>
                <p className="text-gray-600">Real-time monitoring and status of all biometric security devices</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Devices</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDevices}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Online</p>
                            <p className="text-2xl font-bold text-green-600">{stats.onlineDevices}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>



                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Offline</p>
                            <p className="text-2xl font-bold text-red-600">{stats.offlineDevices}</p>
                        </div>
                        <div className="bg-red-100 rounded-full p-3">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>



            </div>

            {/* Device Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Device Status Overview</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Device Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IP Address
                                </th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {devices?.map(device => (
                                <tr key={device.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {status.length > 0 ? (
                                            <div className="flex items-center">
                                                {status.find(s => s.deviceID === device.id)?.connected ? (
                                                    <>
                                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3"></div>
                                                        <span className="text-sm font-medium text-green-600">Online</span>
                                                        {/* <svg className="w-4 h-4 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg> */}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                                                        <span className="text-sm font-medium text-red-600">Offline</span>
                                                        {/* <svg className="w-4 h-4 ml-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg> */}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full bg-gray-400 mr-3 animate-pulse"></div>
                                                <span className="text-sm font-medium text-gray-500">Connecting...</span>
                                                {/* <svg className="w-4 h-4 ml-2 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg> */}
                                            </div>
                                        )}
                                    </td>

                                    {/* Device Name */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{device.device_name}</div>
                                    </td>

                                    {/* IP Address */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{device.ip_address}</div>
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Live Indicator */}
            <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Monitoring</span>
            </div>
        </div>
    );
}
