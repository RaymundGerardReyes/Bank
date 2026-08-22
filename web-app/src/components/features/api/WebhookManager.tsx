"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import React, { useEffect, useState } from "react";
import { WebhookTestConsole } from "./WebhookTestConsole";

export interface WebhookEndpoint {
  id: number;
  url: string;
  environment: "LIVE" | "SANDBOX";
  status: string;
  events: string;
  secretHash: string;
  createdAt: string;
}

const AVAILABLE_EVENTS = [
  "payment.succeeded",
  "payment.failed",
  "payment.disputed",
  "account.created",
  "transfer.completed"
];

export const WebhookManager: React.FC = () => {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  // Form State
  const [url, setUrl] = useState("");
  const [environment, setEnvironment] = useState<"LIVE" | "SANDBOX">("SANDBOX");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["payment.succeeded", "payment.failed"]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"EXTERNAL" | "LOCAL">("EXTERNAL");

  const fetchEndpoints = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy/webhooks");
      if (res.ok) {
        const json = await res.json();
        setEndpoints(json.data || []);
      }
    } catch (err: any) {
      console.error("Failed to load webhooks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!url.trim().startsWith("https://")) {
      return setErrorMsg("Webhook URL must start with https://");
    }
    
    setIsGenerating(true);
    try {
      const payload = {
        url: url.trim(),
        environment,
        events: selectedEvents.join(",")
      };

      const res = await fetch("/api/proxy/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error?.message || json.message || "Failed to create webhook");

      const createdEndpoint: WebhookEndpoint = json.data;
      setEndpoints([createdEndpoint, ...endpoints]);
      setNewSecret(createdEndpoint.secretHash);
      setCopiedState(false);
      setUrl("");
      setShowCreateForm(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Webhook creation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteEndpoint = async (id: number) => {
    if (!window.confirm("Deleting this endpoint will instantly stop all event delivery to it. Continue?")) return;
    try {
      await fetch(`/api/proxy/webhooks/${id}`, { method: "DELETE" });
      setEndpoints(endpoints.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete webhook endpoint.");
    }
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-secondary/30 pb-2">
        <button 
          onClick={() => setActiveTab("EXTERNAL")}
          className={`pb-2 px-1 font-bold text-sm border-b-2 transition-colors ${activeTab === "EXTERNAL" ? "border-accent text-accent" : "border-transparent text-accent/50 hover:text-accent/80"}`}
        >
          External Webhook Endpoints
        </button>
        <button 
          onClick={() => setActiveTab("LOCAL")}
          className={`pb-2 px-1 font-bold text-sm border-b-2 transition-colors ${activeTab === "LOCAL" ? "border-sky-600 text-sky-700" : "border-transparent text-accent/50 hover:text-accent/80"}`}
        >
          Local Webhook Testing
        </button>
      </div>

      {activeTab === "EXTERNAL" && (
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-accent">Webhook Endpoints</h3>
              <p className="text-sm text-accent/70 font-medium mt-1">
                Receive real-time HTTPS callbacks for events happening in your accounts.
              </p>
            </div>
          {!showCreateForm && !newSecret && (
            <Button onClick={() => setShowCreateForm(true)}>+ Add Endpoint</Button>
          )}
        </div>

        {errorMsg && <ErrorBanner message={errorMsg} onClose={() => setErrorMsg(null)} />}

        {newSecret && (
          <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-500/40 rounded-xl shadow-lg shadow-emerald-500/10 animate-in zoom-in-95 duration-300">
            <h4 className="text-emerald-800 font-extrabold text-lg mb-2">Webhook Created Successfully</h4>
            <p className="text-emerald-700/80 text-sm font-medium mb-4">
              Please copy this Webhook Signing Secret. Use it to verify HMAC-SHA256 signatures on incoming requests. <strong>You will not be able to see it again.</strong>
            </p>
            <div className="flex items-center gap-3 bg-dominant p-3 rounded-lg border border-emerald-200">
              <code className="text-accent font-mono text-sm font-bold flex-1 break-all">
                {newSecret}
              </code>
              <Button
                variant={copiedState ? "primary" : "secondary"}
                onClick={() => handleCopySecret(newSecret)}
                className={copiedState ? "bg-emerald-600 text-white border-emerald-600" : ""}
              >
                {copiedState ? "Copied!" : "Copy Secret"}
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setNewSecret(null)}>I have saved this secret</Button>
            </div>
          </div>
        )}

        {showCreateForm && !newSecret && (
          <form onSubmit={handleCreateWebhook} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-surface p-6 rounded-xl border border-secondary/30 animate-in slide-in-from-top-4">
            
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">Endpoint URL</label>
              <input
                type="url"
                placeholder="https://yourdomain.com/webhooks"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as "LIVE" | "SANDBOX")}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
              >
                <option value="SANDBOX">Sandbox</option>
                <option value="LIVE">Live Prod</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              <Button type="submit" isLoading={isGenerating}>Save Endpoint</Button>
            </div>

            <div className="flex flex-col gap-3 md:col-span-4 mt-4">
              <div className="flex items-center justify-between border-b border-secondary/30 pb-2">
                 <label className="text-xs font-bold text-accent uppercase tracking-wider">Subscribed Events</label>
              </div>
              <div className="flex flex-wrap gap-4">
                {AVAILABLE_EVENTS.map((event) => (
                    <label key={event} className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer ml-1">
                        <input
                        type="checkbox"
                        checked={selectedEvents.includes(event)}
                        onChange={(e) => {
                            if (e.target.checked) setSelectedEvents([...selectedEvents, event]);
                            else setSelectedEvents(selectedEvents.filter((s) => s !== event));
                        }}
                        className="rounded border-secondary w-4 h-4 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-[11px] font-mono">{event}</span>
                    </label>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Existing Endpoints List */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="p-8 text-center bg-surface rounded-xl border border-secondary/30">
              <p className="text-accent/60 font-bold animate-pulse">Loading endpoints...</p>
            </div>
          ) : endpoints.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-xl border border-secondary/30">
              <p className="text-accent/60 font-bold">No active webhooks configured.</p>
            </div>
          ) : (
            endpoints.map((endpoint) => (
                <div key={endpoint.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-dominant border rounded-xl gap-4 shadow-sm border-secondary/40 hover:border-secondary/80">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h5 className="font-bold text-accent text-lg">{endpoint.url}</h5>
                      <span className={`px-2 py-0.5 rounded text-xs font-extrabold tracking-wide ${endpoint.environment === "LIVE" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                        {endpoint.environment}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider bg-emerald-100 text-emerald-700 border-emerald-200">
                        {endpoint.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-accent/60 mb-3">
                      Events: {endpoint.events.split(",").join(", ")}
                    </div>
                    <div className="flex gap-6 text-xs font-bold text-accent/50">
                      <span>Created: {new Date(endpoint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-end">
                      <Button variant="danger" onClick={() => deleteEndpoint(endpoint.id)}>
                        Delete
                      </Button>
                  </div>
                </div>
            ))
          )}
        </div>
      </Card>
      )}

      {activeTab === "LOCAL" && (
        <WebhookTestConsole />
      )}
    </div>
  );
};
