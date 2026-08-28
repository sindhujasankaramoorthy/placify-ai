import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Code2,
  CheckCircle2,
  Star,
  Trophy,
  AlertCircle,
  Edit2,
  Unlink,
  RefreshCw,
  ExternalLink,
  Zap,
  Sparkles,
  Layers,
  BookOpen,
} from "lucide-react";
import { ConnectedProfiles } from "../../lib/resume/types";
import { fetchGitHubProfile, fetchLeetCodeProfile, fetchLinkedInProfile } from "../../lib/resume/profileFetcher";
import { toast } from "sonner";

interface ConnectedProfilesSectionProps {
  connected: ConnectedProfiles;
  onUpdateProfiles: (profiles: ConnectedProfiles) => void;
  candidateName?: string;
  candidateGithub?: string;
  candidateLinkedin?: string;
}

export const ConnectedProfilesSection: React.FC<ConnectedProfilesSectionProps> = ({
  connected,
  onUpdateProfiles,
  candidateName = "Sindhuja Sankaramoorthy",
  candidateGithub = "https://github.com/sindhujasankaramoorthy",
  candidateLinkedin = "https://www.linkedin.com/in/sindhuja-sankaramoorthy/",
}) => {
  const defaultGhHandle = candidateGithub ? candidateGithub.replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/\/$/, "") : "sindhujasankaramoorthy";
  const defaultLiUrl = candidateLinkedin || "https://www.linkedin.com/in/sindhuja-sankaramoorthy/";
  const defaultLcHandle = "sindhuja_sankaramoorthy";

  const [githubInput, setGithubInput] = useState(connected.github.username || defaultGhHandle);
  const [leetcodeInput, setLeetcodeInput] = useState(connected.leetcode.username || defaultLcHandle);
  const [linkedinInput, setLinkedinInput] = useState(connected.linkedin.profileUrl || defaultLiUrl);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<"github" | "leetcode" | "linkedin" | null>(null);
  const [isConnectingAll, setIsConnectingAll] = useState(false);

  // 1-Click Connect All via Live APIs
  const handleConnectAll = async () => {
    setIsConnectingAll(true);
    toast.loading("Querying live GitHub, LeetCode, and LinkedIn APIs...");

    try {
      const [ghData, lcData, liData] = await Promise.all([
        fetchGitHubProfile(githubInput || defaultGhHandle),
        fetchLeetCodeProfile(leetcodeInput || defaultLcHandle),
        fetchLinkedInProfile(linkedinInput || defaultLiUrl),
      ]);

      const updated: ConnectedProfiles = {
        github: ghData,
        leetcode: lcData,
        linkedin: liData,
      };

      onUpdateProfiles(updated);
      toast.dismiss();
      toast.success("Successfully connected to GitHub, LeetCode, and LinkedIn via Live APIs!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to connect one or more platforms.");
    } finally {
      setIsConnectingAll(false);
    }
  };

  // Connect Individual GitHub
  const handleConnectGitHub = async () => {
    const handle = githubInput.trim() || defaultGhHandle;
    setLoadingMap((prev) => ({ ...prev, github: true }));
    try {
      const data = await fetchGitHubProfile(handle);
      onUpdateProfiles({
        ...connected,
        github: data,
      });
      setActiveModal(null);
      toast.success(`Connected to GitHub account @${data.username} via GitHub REST API!`);
    } catch (e) {
      toast.error("Could not fetch GitHub account.");
    } finally {
      setLoadingMap((prev) => ({ ...prev, github: false }));
    }
  };

  // Connect Individual LeetCode
  const handleConnectLeetCode = async () => {
    const handle = leetcodeInput.trim() || defaultLcHandle;
    setLoadingMap((prev) => ({ ...prev, leetcode: true }));
    try {
      const data = await fetchLeetCodeProfile(handle);
      onUpdateProfiles({
        ...connected,
        leetcode: data,
      });
      setActiveModal(null);
      toast.success(`Connected to LeetCode handle @${data.username} (${data.totalSolved} solved)!`);
    } catch (e) {
      toast.error("Could not fetch LeetCode account.");
    } finally {
      setLoadingMap((prev) => ({ ...prev, leetcode: false }));
    }
  };

  // Connect Individual LinkedIn
  const handleConnectLinkedIn = async () => {
    const url = linkedinInput.trim() || defaultLiUrl;
    setLoadingMap((prev) => ({ ...prev, linkedin: true }));
    try {
      const data = await fetchLinkedInProfile(url);
      onUpdateProfiles({
        ...connected,
        linkedin: data,
      });
      setActiveModal(null);
      toast.success("Connected to LinkedIn Profile!");
    } catch (e) {
      toast.error("Could not fetch LinkedIn account.");
    } finally {
      setLoadingMap((prev) => ({ ...prev, linkedin: false }));
    }
  };

  const handleDisconnect = (type: "github" | "leetcode" | "linkedin") => {
    if (type === "github") {
      onUpdateProfiles({
        ...connected,
        github: { ...connected.github, connected: false },
      });
      toast.info("Disconnected GitHub profile.");
    } else if (type === "leetcode") {
      onUpdateProfiles({
        ...connected,
        leetcode: { ...connected.leetcode, connected: false },
      });
      toast.info("Disconnected LeetCode profile.");
    } else {
      onUpdateProfiles({
        ...connected,
        linkedin: { ...connected.linkedin, connected: false },
      });
      toast.info("Disconnected LinkedIn profile.");
    }
  };

  const allConnected = connected.github.connected && connected.leetcode.connected && connected.linkedin.connected;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Connect */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-3xl p-6 border border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-primary" /> Live API Integration
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground mt-1.5">
            Connected Developer & Professional Platforms
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
            Query live APIs from GitHub, LeetCode, and LinkedIn to verify public repositories, code stars, and problem-solving stats for ATS resume tailoring.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleConnectAll}
            disabled={isConnectingAll}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            {isConnectingAll ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Querying APIs...
              </>
            ) : allConnected ? (
              <>
                <RefreshCw className="h-4 w-4" /> Refresh All Live APIs
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> ⚡ 1-Click Connect All via API
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. GitHub Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-purple-500 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">GitHub</h3>
                  <p className="text-xs text-muted-foreground">Public Repos & Activity</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  connected.github.connected
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {connected.github.connected ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {connected.github.connected ? "API Connected" : "Not Connected"}
              </span>
            </div>

            {connected.github.connected ? (
              <div className="mt-5 space-y-3.5">
                <div className="flex items-center gap-3 rounded-2xl bg-card/60 border border-border p-3">
                  {connected.github.avatarUrl ? (
                    <img
                      src={connected.github.avatarUrl}
                      alt={connected.github.username}
                      className="h-10 w-10 rounded-xl object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 grid place-items-center text-purple-500 font-bold">
                      GH
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">@{connected.github.username}</p>
                    <a
                      href={`https://github.com/${connected.github.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate"
                    >
                      github.com/{connected.github.username} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-border bg-card/40 p-2.5 text-center">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Public Repos</span>
                    <p className="text-base font-extrabold text-foreground">{connected.github.publicReposCount}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/40 p-2.5 text-center">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Stars Earned</span>
                    <p className="text-base font-extrabold text-amber-500 flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {connected.github.totalStars}
                    </p>
                  </div>
                </div>

                {connected.github.featuredRepos && connected.github.featuredRepos.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/40 p-3 space-y-2">
                    <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-purple-500" /> Featured Repositories
                    </p>
                    <div className="space-y-1.5">
                      {connected.github.featuredRepos.slice(0, 2).map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-lg bg-background/80 p-2 hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                            <span className="truncate">{repo.name}</span>
                            <span className="text-[10px] text-primary font-mono">{repo.language}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{repo.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Connect GitHub via REST API to pull public repositories, language distribution, and star metrics for ATS tailoring.
                </p>
                <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-2.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  Default Handle: @{defaultGhHandle}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.github.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("github")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Re-sync / Change
                </button>
                <button
                  onClick={() => handleDisconnect("github")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline cursor-pointer"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("github")}
                className="btn-gradient w-full rounded-xl py-2.5 text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Connect GitHub Profile
              </button>
            )}
          </div>
        </div>

        {/* 2. LeetCode Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-amber-500 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">LeetCode</h3>
                  <p className="text-xs text-muted-foreground">DSA & Problem Solving</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  connected.leetcode.connected
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {connected.leetcode.connected ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {connected.leetcode.connected ? "API Connected" : "Not Connected"}
              </span>
            </div>

            {connected.leetcode.connected ? (
              <div className="mt-5 space-y-3.5">
                <div className="rounded-2xl bg-card/60 border border-border p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Total Solved</span>
                    <p className="text-lg font-extrabold text-foreground flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-amber-500" /> {connected.leetcode.totalSolved} Problems
                    </p>
                  </div>
                  <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    @{connected.leetcode.username}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2">
                    <div className="text-[10px] font-bold uppercase text-emerald-600">Easy</div>
                    <div className="text-sm font-extrabold text-foreground">{connected.leetcode.easySolved}</div>
                  </div>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2">
                    <div className="text-[10px] font-bold uppercase text-amber-600">Medium</div>
                    <div className="text-sm font-extrabold text-foreground">{connected.leetcode.mediumSolved}</div>
                  </div>
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2">
                    <div className="text-[10px] font-bold uppercase text-rose-600">Hard</div>
                    <div className="text-sm font-extrabold text-foreground">{connected.leetcode.hardSolved}</div>
                  </div>
                </div>

                {connected.leetcode.topTopics && connected.leetcode.topTopics.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/40 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-500" /> Verified Problem Solving Topics
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {connected.leetcode.topTopics.map((topic) => (
                        <span key={topic} className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Connect LeetCode to verify Data Structures & Algorithms proficiency and problem-solving badges.
                </p>
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-2.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  Default Handle: @{defaultLcHandle}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.leetcode.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("leetcode")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Re-sync / Change
                </button>
                <button
                  onClick={() => handleDisconnect("leetcode")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline cursor-pointer"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("leetcode")}
                className="btn-gradient w-full rounded-xl py-2.5 text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Connect LeetCode Profile
              </button>
            )}
          </div>
        </div>

        {/* 3. LinkedIn Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-blue-500 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">LinkedIn</h3>
                  <p className="text-xs text-muted-foreground">Network & Endorsements</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  connected.linkedin.connected
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {connected.linkedin.connected ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {connected.linkedin.connected ? "API Connected" : "Not Connected"}
              </span>
            </div>

            {connected.linkedin.connected ? (
              <div className="mt-5 space-y-3.5">
                <div className="rounded-2xl bg-card/60 border border-border p-3 space-y-1.5">
                  <p className="text-xs font-bold text-foreground line-clamp-1">{connected.linkedin.headline}</p>
                  <a
                    href={connected.linkedin.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate"
                  >
                    {connected.linkedin.profileUrl.replace(/^https?:\/\/(www\.)?/, "")} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                {connected.linkedin.endorsedSkills && connected.linkedin.endorsedSkills.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/40 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-foreground">Endorsed Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {connected.linkedin.endorsedSkills.map((skill) => (
                        <span key={skill} className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Connect LinkedIn profile to import verified endorsements, certifications, and professional headline.
                </p>
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-2.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                  Default Link: {defaultLiUrl}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.linkedin.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("linkedin")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Link
                </button>
                <button
                  onClick={() => handleDisconnect("linkedin")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline cursor-pointer"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("linkedin")}
                className="btn-gradient w-full rounded-xl py-2.5 text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Connect LinkedIn Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Connect Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-3xl p-6 space-y-4 border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2 capitalize">
                {activeModal === "github" && <Github className="h-5 w-5 text-purple-500" />}
                {activeModal === "leetcode" && <Code2 className="h-5 w-5 text-amber-500" />}
                {activeModal === "linkedin" && <Linkedin className="h-5 w-5 text-blue-500" />}
                Connect {activeModal} via API
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeModal === "github" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-foreground">GitHub Username or URL</label>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="e.g. sindhujasankaramoorthy"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Queries GitHub REST API (`https://api.github.com/users/{githubInput || "username"}`)
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnectGitHub}
                    disabled={loadingMap.github}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loadingMap.github ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Querying API...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" /> Fetch & Connect API
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "leetcode" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-foreground">LeetCode Username or Handle</label>
                  <input
                    type="text"
                    value={leetcodeInput}
                    onChange={(e) => setLeetcodeInput(e.target.value)}
                    placeholder="e.g. sindhuja_sankaramoorthy"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Fetches verified problem-solving counts and DSA topics.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnectLeetCode}
                    disabled={loadingMap.leetcode}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loadingMap.leetcode ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Querying API...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" /> Fetch & Connect API
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "linkedin" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-foreground">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={linkedinInput}
                    onChange={(e) => setLinkedinInput(e.target.value)}
                    placeholder="https://www.linkedin.com/in/sindhuja-sankaramoorthy/"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Structures verified endorsements and headline into your resume tailoring profile.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnectLinkedIn}
                    disabled={loadingMap.linkedin}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loadingMap.linkedin ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" /> Connect Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
