import { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { dashboardApi, analyticsApi, activityApi, maintenanceApi, weatherApi } from '../api';

import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import OverviewGrid from '../components/dashboard/OverviewGrid';
import WeatherCard from '../components/dashboard/WeatherCard';
import EnergyConsumptionChart from '../components/dashboard/EnergyConsumptionChart';
import AppliancePlanner from '../components/dashboard/AppliancePlanner';
import RecommendationCenter from '../components/dashboard/RecommendationCenter';
import MaintenanceAlerts from '../components/dashboard/MaintenanceAlerts';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [weather, setWeather] = useState(null);

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await dashboardApi.getOverview();
      if (res.success) setOverview(res.data);
    } catch {
      setOverview(null);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const res = await analyticsApi.daily();
      if (res.success) setAnalytics(res.data);
    } catch {
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const res = await activityApi.list();
      if (res.success) setActivities(res.data?.activities || []);
    } catch {
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  const fetchMaintenance = useCallback(async () => {
    setLoadingMaintenance(true);
    try {
      const res = await maintenanceApi.list();
      if (res.success) setMaintenance(res.data?.alerts || []);
    } catch {
      setMaintenance([]);
    } finally {
      setLoadingMaintenance(false);
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    setLoadingWeather(true);
    try {
      const res = await weatherApi.latest();
      if (res.success && res.data?.items?.length > 0) setWeather(res.data.items[0]);
    } catch {
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchAnalytics(),
      fetchActivities(),
      fetchMaintenance(),
      fetchWeather(),
    ]);
    toast.success('Dashboard refreshed');
  }, [fetchOverview, fetchAnalytics, fetchActivities, fetchMaintenance, fetchWeather]);

  const pollActivities = useCallback(async () => {
    try {
      const res = await activityApi.list();
      if (res.success) setActivities(res.data?.activities || []);
    } catch { /* ignore polling errors */ }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchAnalytics();
    fetchActivities();
    fetchMaintenance();
    fetchWeather();
    const interval = setInterval(pollActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = loadingOverview || loadingAnalytics || loadingActivities;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const latestOutput = overview?.todays_prediction?.predicted_output ?? null;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={refreshAll}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* 1. Welcome */}
      <WelcomeBanner weatherCondition={weather?.weather_condition} />

      {/* 2. Overview Grid */}
      <OverviewGrid overview={overview} loading={loadingOverview} />

      {/* 3. Chart + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyConsumptionChart analyticsData={analytics} loading={loadingAnalytics} />
        </div>
        <div className="lg:col-span-1">
          <WeatherCard weather={weather} loading={loadingWeather} onRefresh={fetchWeather} />
        </div>
      </div>

      {/* 4. Appliance Planner + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppliancePlanner solarOutputKw={latestOutput} />
        <RecommendationCenter
          recommendations={overview?.recommendations}
          loading={loadingOverview}
        />
      </div>

      {/* 5. Maintenance + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceAlerts
          alerts={maintenance}
          loading={loadingMaintenance}
          onRefresh={fetchMaintenance}
        />
        <RecentActivityFeed activities={activities} loading={loadingActivities} />
      </div>
    </div>
  );
}
