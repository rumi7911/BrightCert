import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PINNED_VERSION = "5.3.0";
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const outputDirectory = path.join(projectRoot, "public", "fonts");

const packages = [
  {
    name: "@fontsource/bricolage-grotesque",
    licenceOutput: "LICENSE-Bricolage-Grotesque.txt",
    fonts: [
      {
        source: "files/bricolage-grotesque-latin-400-normal.woff",
        output: "BricolageGrotesque-Regular.woff",
      },
      {
        source: "files/bricolage-grotesque-latin-600-normal.woff",
        output: "BricolageGrotesque-SemiBold.woff",
      },
    ],
  },
  {
    name: "@fontsource/inter",
    licenceOutput: "LICENSE-Inter.txt",
    fonts: [
      {
        source: "files/inter-latin-400-normal.woff",
        output: "Inter-Regular.woff",
      },
      {
        source: "files/inter-latin-600-normal.woff",
        output: "Inter-SemiBold.woff",
      },
    ],
  },
  {
    name: "@fontsource/jetbrains-mono",
    licenceOutput: "LICENSE-JetBrains-Mono.txt",
    fonts: [
      {
        source: "files/jetbrains-mono-latin-400-normal.woff",
        output: "JetBrainsMono-Regular.woff",
      },
      {
        source: "files/jetbrains-mono-latin-700-normal.woff",
        output: "JetBrainsMono-Bold.woff",
      },
    ],
  },
];

fs.mkdirSync(outputDirectory, { recursive: true });

for (const fontPackage of packages) {
  const packageDirectory = path.join(
    projectRoot,
    "node_modules",
    ...fontPackage.name.split("/")
  );
  const packageManifestPath = path.join(packageDirectory, "package.json");
  const packageManifest = JSON.parse(
    fs.readFileSync(packageManifestPath, "utf8")
  );

  if (packageManifest.version !== PINNED_VERSION) {
    throw new Error(
      `Expected ${fontPackage.name}@${PINNED_VERSION}, found ${packageManifest.version}`
    );
  }

  for (const font of fontPackage.fonts) {
    fs.copyFileSync(
      path.join(packageDirectory, font.source),
      path.join(outputDirectory, font.output)
    );
  }

  const licenceSource = path.join(packageDirectory, "LICENSE");
  const sourcePath = path
    .relative(projectRoot, licenceSource)
    .split(path.sep)
    .join("/");
  const provenance = [
    "BrightCert bundled report font provenance",
    `Package: ${fontPackage.name}@${PINNED_VERSION}`,
    `Source: ${sourcePath}`,
    "",
  ].join("\n");
  const licence = fs.readFileSync(licenceSource, "utf8");

  fs.writeFileSync(
    path.join(outputDirectory, fontPackage.licenceOutput),
    `${provenance}${licence.endsWith("\n") ? licence : `${licence}\n`}`,
    "utf8"
  );
}
