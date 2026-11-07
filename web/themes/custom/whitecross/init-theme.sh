#!/usr/bin/env bash
# Usage: ./init-theme.sh <new_theme_machine_name> ["Human Readable Theme Name"]
set -e

NEW_MACHINE="$1"
NEW_LABEL="${2:-$1}"
OLD_MACHINE="starter"

if [ -z "$NEW_MACHINE" ]; then
  echo "Usage: ./init-theme.sh <new_machine_name> [\"Theme Label\"]"
  exit 1
fi

echo "Renaming '$OLD_MACHINE' to '$NEW_MACHINE'..."

# 1. Rename files
for file in ${OLD_MACHINE}.*; do
  if [ -f "$file" ]; then
    mv "$file" "${file/${OLD_MACHINE}/${NEW_MACHINE}}"
  fi
done

# 2. Replace text in theme configuration, PHP namespaces, and Twig references
find . -type f \( -name "*.yml" -o -name "*.php" -o -name "*.twig" -o -name "*.json" -o -name "*.css" \) \
  -not -path "./node_modules/*" -not -path "./.git/*" | while read -r f; do
    sed -i "s/${OLD_MACHINE}/${NEW_MACHINE}/g" "$f"
done

# 3. Update human-readable name in .info.yml
if [ -f "${NEW_MACHINE}.info.yml" ]; then
  sed -i "s/name: .*/name: \"${NEW_LABEL}\"/" "${NEW_MACHINE}.info.yml"
fi

echo "Theme successfully renamed to '$NEW_MACHINE' ('$NEW_LABEL')."
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run build"
echo "  3. drush theme:enable $NEW_MACHINE && drush config:set system.theme default $NEW_MACHINE -y"
