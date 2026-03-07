import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

type PackageMetadata = {
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;
  homepage?: string;
  bugs?: string | { url?: string };
  repository?: string | { url?: string };
};

const packageMetadata = JSON.parse(
  JSON.stringify(await import("./package.json")),
) as PackageMetadata;

function normalizeRepositoryUrl(
  repository: PackageMetadata["repository"],
): string {
  const url =
    typeof repository === "string"
      ? repository
      : (repository?.url ?? packageMetadata.homepage);

  if (!url) {
    throw new Error("Missing repository or homepage URL in package.json");
  }

  return url.replace(/^git\+/, "").replace(/\.git$/, "");
}

function resolveSupportUrl(
  bugs: PackageMetadata["bugs"],
  fallbackRepoUrl: string,
): string {
  if (typeof bugs === "string") {
    return bugs;
  }

  return bugs?.url ?? `${fallbackRepoUrl}/issues`;
}

const repoUrl =
  packageMetadata.homepage ??
  normalizeRepositoryUrl(packageMetadata.repository);
const supportUrl = resolveSupportUrl(packageMetadata.bugs, repoUrl);
const releaseAssetName = `${packageMetadata.name}.user.js`;
const releaseAssetUrl = `${repoUrl}/blob/main/dist/${releaseAssetName}`;

export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        "version": packageMetadata.version,
        "name": { "": "USST Schedule Sync", "zh-CN": "USST 课表同步" },
        "description": {
          "": packageMetadata.description,
          "zh-CN": "将 USST 教务系统课表导出为标准 `.ics` 日历文件",
        },
        "author": packageMetadata.author,
        "license": packageMetadata.license,
        "icon": "https://www.usst.edu.cn/_upload/tpl/00/40/64/template64/favicon.ico",
        "namespace": repoUrl,
        "homepageURL": repoUrl,
        "supportURL": supportUrl,
        "updateURL": releaseAssetUrl,
        "downloadURL": releaseAssetUrl,
        "match": ["*://jwgl.usst.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html*"],
        "grant": ["GM_addStyle", "GM_getValue", "GM_setValue"],
        "run-at": "document-idle",
        "noframes": true,
      },
    }),
  ],
});
