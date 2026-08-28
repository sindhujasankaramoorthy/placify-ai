import React, { useState, useMemo } from "react";
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
  Search,
  FolderGit2,
  Clock,
  Filter,
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
  const defaultLcHandle = "sindhujasankaramoorthy";

  const [githubInput, setGithubInput] = useState(connected.github.username || defaultGhHandle);
  const [leetcodeInput, setLeetcodeInput] = useState(connected.leetcode.username || defaultLcHandle);
  const [linkedinInput, setLinkedinInput] = useState(connected.linkedin.profileUrl || defaultLiUrl);

  const [leetcodeEasyInput, setLeetcodeEasyInput] = useState<number>(connected.leetcode.easySolved ?? 24);
  const [leetcodeMediumInput, setLeetcodeMediumInput] = useState<number>(connected.leetcode.mediumSolved ?? 0);
  const [leetcodeHardInput, setLeetcodeHardInput] = useState<number>(connected.leetcode.hardSolved ?? 0);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<"github" | "leetcode" | "linkedin" | "all_repos" | null>(null);
  const [isConnectingAll, setIsConnectingAll] = useState(false);

  React.useEffect(() => {
    setLeetcodeInput(connected.leetcode.username || defaultLcHandle);
    setLeetcodeEasyInput(connected.leetcode.easySolved ?? 24);
    setLeetcodeMediumInput(connected.leetcode.mediumSolved ?? 0);
    setLeetcodeHardInput(connected.leetcode.hardSolved ?? 0);
  }, [connected.leetcode]);

  // Auto-upgrade repository list if old cache had less than 10 repos
  React.useEffect(() => {
    if (connected?.github?.connected && (!connected?.github?.featuredRepos || connected?.github?.featuredRepos?.length < 10)) {
      fetchGitHubProfile(connected?.github?.username || defaultGhHandle).then((ghData) => {
        onUpdateProfiles({
          ...connected,
          github: ghData,
        });
      }).catch(() => {});
    }
  }, [connected?.github?.connected, connected?.github?.featuredRepos?.length]);

  // Search & Filter for All Repos
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("All");

  const filteredRepos = useMemo(() => {
    const repos = connected.github.featuredRepos || [];
    return repos.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase()));
      const matchesLang = selectedLang === "All" || r.language.toLowerCase() === selectedLang.toLowerCase();
      return matchesSearch && matchesLang;
    });
  }, [connected.github.featuredRepos, repoSearch, selectedLang]);

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    (connected.github.featuredRepos || []).forEach((r) => {
      if (r.language && r.language !== "Code") set.add(r.language);
    });
    return ["All", ...Array.from(set)];
  }, [connected.github.featuredRepos]);

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
      toast.success(`Successfully connected ${ghData.featuredRepos.length} GitHub repositories, LeetCode, and LinkedIn!`);
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
      toast.success(`Connected to @${data.username} with all ${data.featuredRepos.length} public repositories!`);
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

  const getLangBadgeColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "python":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "typescript":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "javascript":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "kotlin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "java":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "html":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

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
                  <p className="text-xs text-muted-foreground">All Public Repos & Activity</p>
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
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Total Repositories</span>
                    <p className="text-base font-extrabold text-foreground">{connected.github.featuredRepos?.length || connected.github.publicReposCount}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/40 p-2.5 text-center">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Stars Earned</span>
                    <p className="text-base font-extrabold text-amber-500 flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {connected.github.totalStars}
                    </p>
                  </div>
                </div>

                {/* Repos Preview & View All Button */}
                {connected.github.featuredRepos && connected.github.featuredRepos.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/40 p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                        <FolderGit2 className="h-3.5 w-3.5 text-purple-500" /> Public Repos ({connected.github.featuredRepos.length})
                      </p>
                      <button
                        onClick={() => setActiveModal("all_repos")}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        View All Details →
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {connected.github.featuredRepos.slice(0, 3).map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-xl bg-background/80 border border-border/60 p-2.5 hover:border-purple-500/40 hover:bg-accent/40 transition-all group"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                            <span className="truncate group-hover:text-primary transition-colors">{repo.name}</span>
                            {repo.language && (
                              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono border ${getLangBadgeColor(repo.language)}`}>
                                {repo.language}
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">{repo.description}</p>
                          )}
                        </a>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveModal("all_repos")}
                      className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 py-1.5 text-center text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 cursor-pointer transition-colors"
                    >
                      Browse All {connected.github.featuredRepos.length} Repositories with Code Details
                    </button>
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
                  <Edit2 className="h-3.5 w-3.5" /> Re-sync Handle
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
                    ? connected.leetcode.totalSolved > 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {connected.leetcode.connected ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {connected.leetcode.connected
                  ? connected.leetcode.totalSolved > 0
                    ? `Live Verified (${connected.leetcode.totalSolved} Solved)`
                    : `Active @${connected.leetcode.username || "sindhuja"}`
                  : "Not Connected"}
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
                  <a
                    href={`https://leetcode.com/u/${connected.leetcode.username}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    @{connected.leetcode.username} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
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

                {/* Quick handle switch */}
                <div className="flex items-center justify-between rounded-xl bg-card/40 border border-border p-2 text-[11px]">
                  <span className="text-muted-foreground font-medium">Switch Profile:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onUpdateProfiles({
                          ...connected,
                          leetcode: {
                            connected: true,
                            username: "sindhujas",
                            totalSolved: 24,
                            easySolved: 24,
                            mediumSolved: 0,
                            hardSolved: 0,
                            ranking: 4042839,
                            contestRating: 56,
                            topTopics: ["Arrays & Hashing", "Problem Solving", "Strings"],
                          },
                        });
                        toast.success("Switched to @sindhujas (24 Problems Solved)!");
                      }}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer transition-all ${
                        connected.leetcode.username === "sindhujas"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      @sindhujas (24)
                    </button>
                    <button
                      onClick={() => {
                        onUpdateProfiles({
                          ...connected,
                          leetcode: {
                            connected: true,
                            username: "sindhujasankaramoorthy",
                            totalSolved: 0,
                            easySolved: 0,
                            mediumSolved: 0,
                            hardSolved: 0,
                            ranking: 0,
                            contestRating: 0,
                            topTopics: ["Problem Solving", "Java", "C", "Python"],
                          },
                        });
                        toast.success("Switched to @sindhujasankaramoorthy!");
                      }}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer transition-all ${
                        connected.leetcode.username === "sindhujasankaramoorthy"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      }`}
                    >
                      @sindhujasankaramoorthy
                    </button>
                  </div>
                </div>

                {connected.leetcode.topTopics && connected.leetcode.topTopics.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card/40 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-500" /> Problem Solving Topics
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
              <div className="mt-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Connect LeetCode to verify Data Structures & Algorithms problem solving metrics.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground">LeetCode Username</label>
                  <input
                    type="text"
                    value={leetcodeInput}
                    onChange={(e) => setLeetcodeInput(e.target.value)}
                    placeholder="e.g. sindhujasankaramoorthy or sindhujas"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Quick select:</span>
                  <button
                    onClick={() => {
                      setLeetcodeInput("sindhujas");
                      onUpdateProfiles({
                        ...connected,
                        leetcode: {
                          connected: true,
                          username: "sindhujas",
                          totalSolved: 24,
                          easySolved: 24,
                          mediumSolved: 0,
                          hardSolved: 0,
                          ranking: 4042839,
                          contestRating: 56,
                          topTopics: ["Arrays & Hashing", "Problem Solving", "Strings"],
                        },
                      });
                      toast.success("Connected @sindhujas (24 Solved)!");
                    }}
                    className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                  >
                    @sindhujas (24 Solved)
                  </button>
                  <button
                    onClick={() => {
                      setLeetcodeInput("sindhujasankaramoorthy");
                      handleConnectLeetCode();
                    }}
                    className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                  >
                    @sindhujasankaramoorthy
                  </button>
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
                  <Edit2 className="h-3.5 w-3.5" /> Re-sync / Edit Counts
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
                onClick={handleConnectLeetCode}
                disabled={loadingMap.leetcode}
                className="btn-gradient w-full rounded-xl py-2.5 text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                {loadingMap.leetcode ? "Connecting to LeetCode..." : "⚡ Connect LeetCode Profile"}
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

      {/* ALL REPOSITORIES EXPLORER MODAL */}
      {activeModal === "all_repos" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-4xl max-h-[85vh] rounded-3xl p-6 flex flex-col border border-border shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/10 text-purple-500">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                    All Public GitHub Repositories
                    <span className="rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 text-xs font-bold">
                      {connected.github.featuredRepos?.length || 0} Repositories
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connected account: <span className="font-semibold text-foreground">@{connected.github.username}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search & Language Filters */}
            <div className="py-4 border-b border-border space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="Search repositories by name or keyword..."
                    className="w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Language Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mr-1 shrink-0">
                  <Filter className="h-3 w-3" /> Language:
                </span>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedLang === lang
                        ? "bg-purple-500 text-white shadow-sm"
                        : "bg-card hover:bg-accent text-muted-foreground border border-border"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Repositories Scrollable List */}
            <div className="overflow-y-auto flex-1 py-4 space-y-3 pr-1">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo, idx) => (
                  <div
                    key={repo.name}
                    className="rounded-2xl border border-border bg-card/50 hover:bg-card/90 p-4 transition-all hover:border-purple-500/40 space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            {repo.name}
                            <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                          </a>

                          {repo.language && (
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getLangBadgeColor(repo.language)}`}>
                              {repo.language}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {repo.description || "Public repository hosted on GitHub."}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 fill-amber-500" /> {repo.stars}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="h-3 w-3" /> Updated: {repo.updatedAt}
                      </span>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        Open on GitHub <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderGit2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-bold text-foreground">No repositories found matching your filter</p>
                  <p className="text-xs mt-1">Try resetting the search keyword or language filter.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-3 shrink-0 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Showing {filteredRepos.length} of {connected.github.featuredRepos?.length || 0} repositories
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="btn-gradient rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modals */}
      {activeModal && activeModal !== "all_repos" && (
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
                    Queries GitHub REST API (`https://api.github.com/users/{githubInput || "username"}/repos`) for all public repositories.
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
                        <Zap className="h-3.5 w-3.5" /> Fetch All Repos & Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "leetcode" && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-foreground">LeetCode Username or Profile Link</label>
                  <input
                    type="text"
                    value={leetcodeInput}
                    onChange={(e) => setLeetcodeInput(e.target.value)}
                    placeholder="e.g. sindhujasankaramoorthy or sindhujas"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Queries live LeetCode APIs. Enter your handle to pull live metrics.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Problem Count Breakdown</label>
                    <span className="text-[10px] text-muted-foreground">Editable counts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-emerald-600 font-bold uppercase">Easy</label>
                      <input
                        type="number"
                        value={leetcodeEasyInput}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setLeetcodeEasyInput(val);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-600 font-bold uppercase">Medium</label>
                      <input
                        type="number"
                        value={leetcodeMediumInput}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setLeetcodeMediumInput(val);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-rose-600 font-bold uppercase">Hard</label>
                      <input
                        type="number"
                        value={leetcodeHardInput}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setLeetcodeHardInput(val);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnectLeetCode}
                    disabled={loadingMap.leetcode}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loadingMap.leetcode ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Querying API...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" /> Fetch Live API
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const total = (Number(leetcodeEasyInput) || 0) + (Number(leetcodeMediumInput) || 0) + (Number(leetcodeHardInput) || 0);
                      onUpdateProfiles({
                        ...connected,
                        leetcode: {
                          connected: true,
                          username: leetcodeInput || "sindhujasankaramoorthy",
                          totalSolved: total,
                          easySolved: Number(leetcodeEasyInput) || 0,
                          mediumSolved: Number(leetcodeMediumInput) || 0,
                          hardSolved: Number(leetcodeHardInput) || 0,
                          ranking: 0,
                          contestRating: 0,
                          topTopics: total > 0 ? ["Problem Solving", "DSA", "Algorithms"] : [],
                        },
                      });
                      setActiveModal(null);
                      toast.success(`Saved LeetCode profile (${total} solved)!`);
                    }}
                    className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Save Counts
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
