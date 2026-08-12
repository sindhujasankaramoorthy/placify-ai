import React, { useState } from "react";
import { Github, Linkedin, Code2, CheckCircle2, Star, Trophy, AlertCircle, Edit2, Unlink } from "lucide-react";
import { ConnectedProfiles } from "../../lib/resume/types";
import { fetchGitHubProfile, fetchLeetCodeProfile, fetchLinkedInProfile } from "../../lib/resume/profileFetcher";

interface ConnectedProfilesSectionProps {
  connected: ConnectedProfiles;
  onUpdateProfiles: (profiles: ConnectedProfiles) => void;
}

export const ConnectedProfilesSection: React.FC<ConnectedProfilesSectionProps> = ({
  connected,
  onUpdateProfiles,
}) => {
  const [githubInput, setGithubInput] = useState(connected.github.username);
  const [githubReposInput, setGithubReposInput] = useState(connected.github.publicReposCount);
  const [githubStarsInput, setGithubStarsInput] = useState(connected.github.totalStars);

  const [leetcodeInput, setLeetcodeInput] = useState(connected.leetcode.username);
  const [leetcodeSolvedInput, setLeetcodeSolvedInput] = useState(connected.leetcode.totalSolved);
  const [leetcodeEasyInput, setLeetcodeEasyInput] = useState(connected.leetcode.easySolved);
  const [leetcodeMediumInput, setLeetcodeMediumInput] = useState(connected.leetcode.mediumSolved);
  const [leetcodeHardInput, setLeetcodeHardInput] = useState(connected.leetcode.hardSolved);
  const [leetcodeContestRatingInput, setLeetcodeContestRatingInput] = useState(connected.leetcode.contestRating || 0);

  const [linkedinInput, setLinkedinInput] = useState(connected.linkedin.profileUrl);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<"github" | "leetcode" | "linkedin" | null>(null);

  const handleSaveGitHub = async () => {
    setLoadingMap((prev) => ({ ...prev, github: true }));
    const baseData = await fetchGitHubProfile(githubInput || "sindhujasankaramoorthy");
    onUpdateProfiles({
      ...connected,
      github: {
        ...baseData,
        username: githubInput,
        publicReposCount: Number(githubReposInput) || 5,
        totalStars: Number(githubStarsInput) || 0,
      },
    });
    setLoadingMap((prev) => ({ ...prev, github: false }));
    setActiveModal(null);
  };

  const handleSaveLeetCode = async () => {
    setLoadingMap((prev) => ({ ...prev, leetcode: true }));
    const baseData = await fetchLeetCodeProfile(leetcodeInput || "sindhuja_sankaramoorthy");
    onUpdateProfiles({
      ...connected,
      leetcode: {
        ...baseData,
        username: leetcodeInput,
        totalSolved: Number(leetcodeSolvedInput) || 0,
        easySolved: Number(leetcodeEasyInput) || 0,
        mediumSolved: Number(leetcodeMediumInput) || 0,
        hardSolved: Number(leetcodeHardInput) || 0,
        contestRating: Number(leetcodeContestRatingInput) || 0,
      },
    });
    setLoadingMap((prev) => ({ ...prev, leetcode: false }));
    setActiveModal(null);
  };

  const handleSaveLinkedIn = async () => {
    setLoadingMap((prev) => ({ ...prev, linkedin: true }));
    const baseData = await fetchLinkedInProfile(linkedinInput || "https://www.linkedin.com/in/sindhuja-sankaramoorthy/");
    onUpdateProfiles({
      ...connected,
      linkedin: baseData,
    });
    setLoadingMap((prev) => ({ ...prev, linkedin: false }));
    setActiveModal(null);
  };

  const handleDisconnect = (type: "github" | "leetcode" | "linkedin") => {
    if (type === "github") {
      onUpdateProfiles({
        ...connected,
        github: { ...connected.github, connected: false },
      });
    } else if (type === "leetcode") {
      onUpdateProfiles({
        ...connected,
        leetcode: { ...connected.leetcode, connected: false },
      });
    } else {
      onUpdateProfiles({
        ...connected,
        linkedin: { ...connected.linkedin, connected: false },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Connected Developer & Professional Profiles</h2>
          <p className="text-sm text-muted-foreground">
            Merge live verified metrics from GitHub, LeetCode, and LinkedIn into your candidate profile.
          </p>
        </div>
      </div>

      {/* Profiles Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* GitHub Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-purple-500">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">GitHub</h3>
                  <p className="text-xs text-muted-foreground">Repos & Activity</p>
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
                {connected.github.connected ? "Connected" : "Not Connected"}
              </span>
            </div>

            {connected.github.connected ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Public Repos:</span>
                  <span className="font-bold text-foreground">{connected.github.publicReposCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Stars Earned:</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {connected.github.totalStars}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground">Top Verified Tech</p>
                  <div className="flex flex-wrap gap-1">
                    {connected.github.topLanguages.map((lang) => (
                      <span key={lang.name} className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-500">
                        {lang.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Connect GitHub to pull your repositories and primary languages into ATS tailoring.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.github.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("github")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Metrics
                </button>
                <button
                  onClick={() => handleDisconnect("github")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("github")}
                className="btn-gradient w-full rounded-xl py-2 text-xs font-semibold shadow-md"
              >
                Connect GitHub Profile
              </button>
            )}
          </div>
        </div>

        {/* LeetCode Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-amber-500">
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
                {connected.leetcode.connected ? "Connected" : "Not Connected"}
              </span>
            </div>

            {connected.leetcode.connected ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Solved:</span>
                  <span className="font-bold text-foreground flex items-center gap-1 text-amber-600">
                    <Trophy className="h-3.5 w-3.5" /> {connected.leetcode.totalSolved} Problems
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-emerald-500/10 p-2">
                    <div className="text-[10px] font-semibold text-emerald-600">Easy</div>
                    <div className="text-xs font-bold">{connected.leetcode.easySolved}</div>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-2">
                    <div className="text-[10px] font-semibold text-amber-600">Medium</div>
                    <div className="text-xs font-bold">{connected.leetcode.mediumSolved}</div>
                  </div>
                  <div className="rounded-xl bg-rose-500/10 p-2">
                    <div className="text-[10px] font-semibold text-rose-600">Hard</div>
                    <div className="text-xs font-bold">{connected.leetcode.hardSolved}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Contests Attended:</span>
                  <span className="font-bold text-foreground">
                    {connected.leetcode.contestRating && connected.leetcode.contestRating > 0
                      ? `${connected.leetcode.contestRating} Rating`
                      : "0 Contests Attended (N/A)"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Connect LeetCode to verify your Data Structures & Algorithms problem-solving stats.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.leetcode.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("leetcode")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Solved Count
                </button>
                <button
                  onClick={() => handleDisconnect("leetcode")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("leetcode")}
                className="btn-gradient w-full rounded-xl py-2 text-xs font-semibold shadow-md"
              >
                Connect LeetCode Profile
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-blue-500">
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
                {connected.linkedin.connected ? "Connected" : "Not Connected"}
              </span>
            </div>

            {connected.linkedin.connected ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-border bg-card/50 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground">Profile URL</p>
                  <p className="text-xs font-medium text-foreground truncate">{connected.linkedin.profileUrl}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Connect your LinkedIn profile URL.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {connected.linkedin.connected ? (
              <>
                <button
                  onClick={() => setActiveModal("linkedin")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Link
                </button>
                <button
                  onClick={() => handleDisconnect("linkedin")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("linkedin")}
                className="btn-gradient w-full rounded-xl py-2 text-xs font-semibold shadow-md"
              >
                Connect LinkedIn Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg capitalize">Edit {activeModal} Data</h3>
              <button onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {activeModal === "github" && (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">GitHub Username</label>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Public Repos Count</label>
                    <input
                      type="number"
                      value={githubReposInput}
                      onChange={(e) => setGithubReposInput(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Total Stars Earned</label>
                    <input
                      type="number"
                      value={githubStarsInput}
                      onChange={(e) => setGithubStarsInput(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button onClick={() => setActiveModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">Cancel</button>
                  <button onClick={handleSaveGitHub} className="btn-gradient rounded-xl px-4 py-2 text-xs font-semibold">
                    {loadingMap.github ? "Saving..." : "Save GitHub Stats"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "leetcode" && (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">LeetCode Username / Handle</label>
                  <input
                    type="text"
                    value={leetcodeInput}
                    onChange={(e) => setLeetcodeInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Total Problems Solved</label>
                  <input
                    type="number"
                    value={leetcodeSolvedInput}
                    onChange={(e) => setLeetcodeSolvedInput(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Easy Solved</label>
                    <input
                      type="number"
                      value={leetcodeEasyInput}
                      onChange={(e) => setLeetcodeEasyInput(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Medium Solved</label>
                    <input
                      type="number"
                      value={leetcodeMediumInput}
                      onChange={(e) => setLeetcodeMediumInput(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Hard Solved</label>
                    <input
                      type="number"
                      value={leetcodeHardInput}
                      onChange={(e) => setLeetcodeHardInput(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Contest Rating (Enter 0 if No Contests Attended)</label>
                  <input
                    type="number"
                    value={leetcodeContestRatingInput}
                    onChange={(e) => setLeetcodeContestRatingInput(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button onClick={() => setActiveModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">Cancel</button>
                  <button onClick={handleSaveLeetCode} className="btn-gradient rounded-xl px-4 py-2 text-xs font-semibold">
                    {loadingMap.leetcode ? "Saving..." : "Save LeetCode Metrics"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "linkedin" && (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={linkedinInput}
                    onChange={(e) => setLinkedinInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button onClick={() => setActiveModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">Cancel</button>
                  <button onClick={handleSaveLinkedIn} className="btn-gradient rounded-xl px-4 py-2 text-xs font-semibold">
                    {loadingMap.linkedin ? "Saving..." : "Save LinkedIn URL"}
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
