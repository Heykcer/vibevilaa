// metro.config.js
// ─────────────────────────────────────────────────────────────────────────────
// FIX: "EINVAL: invalid argument, readlink" on Windows + OneDrive
//
// Root cause:
//   OneDrive "Files On-Demand" marks undownloaded files with the Windows
//   REPARSE_POINT attribute.  Older Node.js builds on Windows treat ANY
//   reparse-point as a symlink (stat.isSymbolicLink() === true).
//   Metro's @expo/metro-file-map therefore calls fs.promises.readlink() on
//   those paths — which throws EINVAL because OneDrive placeholders are NOT
//   real NTFS symlinks.
//
// Fix:
//   Patch fs.promises.lstat so that, when a file LOOKS like a symlink but
//   readlink() returns EINVAL, the stat is returned with isSymbolicLink()
//   overridden to false (and isFile() to true).
//   Metro then indexes the file as a regular module and never calls readlink
//   on it, avoiding the crash entirely.
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️  Must patch BEFORE expo/metro-config is required.
const fs = require('fs');

// Save originals before any other code runs
const _lstat     = fs.promises.lstat;
const _readlink  = fs.promises.readlink;   // unpatched version
const _lstatSync = fs.lstatSync;
const _readdir = fs.promises.readdir;
const _readdirSync = fs.readdirSync;
const _readdirCallback = fs.readdir;

/**
 * Return a cloned Stats object with isSymbolicLink() => false / isFile() => true.
 * Used to tell Metro that an OneDrive cloud-placeholder is a regular file.
 */
function asRegularFile(stat) {
  return Object.create(Object.getPrototypeOf(stat), {
    ...Object.getOwnPropertyDescriptors(stat),
    isSymbolicLink: { value: () => false, configurable: true, writable: true },
    isFile:         { value: () => true,  configurable: true, writable: true },
  });
}

// Async lstat patch
fs.promises.lstat = async function patchedLstat(path, options) {
  const stat = await _lstat.call(this, path, options);
  if (!stat.isSymbolicLink()) return stat;          // fast-path: normal file

  // It looks like a symlink — verify it's an actual NTFS symlink.
  try {
    await _readlink(path);                          // succeeds → real symlink
    return stat;
  } catch (err) {
    if (err.code === 'EINVAL') {
      return asRegularFile(stat);                   // OneDrive placeholder
    }
    throw err;
  }
};

// Sync lstat patch (some Metro internals may use this)
fs.lstatSync = function patchedLstatSync(path, options) {
  const stat = _lstatSync.call(this, path, options);
  if (!stat.isSymbolicLink()) return stat;

  try {
    fs.readlinkSync(path);
    return stat;
  } catch (err) {
    if (err.code === 'EINVAL') {
      return asRegularFile(stat);
    }
    throw err;
  }
};

// Async readdir patch to handle Dirent objects returned with withFileTypes: true
fs.promises.readdir = async function patchedReaddir(path, options) {
  const entries = await _readdir.call(this, path, options);
  if (options && options.withFileTypes && Array.isArray(entries)) {
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        const fullPath = require('path').join(path.toString(), entry.name.toString());
        try {
          await _readlink(fullPath);
        } catch (err) {
          if (err.code === 'EINVAL') {
            Object.defineProperties(entry, {
              isSymbolicLink: { value: () => false, configurable: true, writable: true },
              isFile:         { value: () => true,  configurable: true, writable: true },
            });
          }
        }
      }
    }
  }
  return entries;
};

// Sync readdir patch to handle Dirent objects returned with withFileTypes: true
fs.readdirSync = function patchedReaddirSync(path, options) {
  const entries = _readdirSync.call(this, path, options);
  if (options && options.withFileTypes && Array.isArray(entries)) {
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        const fullPath = require('path').join(path.toString(), entry.name.toString());
        try {
          fs.readlinkSync(fullPath);
        } catch (err) {
          if (err.code === 'EINVAL') {
            Object.defineProperties(entry, {
              isSymbolicLink: { value: () => false, configurable: true, writable: true },
              isFile:         { value: () => true,  configurable: true, writable: true },
            });
          }
        }
      }
    }
  }
  return entries;
};

// Callback-based readdir patch to handle Dirent objects returned with withFileTypes: true
fs.readdir = function patchedReaddirCallback(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  return _readdirCallback.call(this, path, options, (err, entries) => {
    if (err) {
      return callback(err);
    }
    if (options && options.withFileTypes && Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.isSymbolicLink()) {
          const fullPath = require('path').join(path.toString(), entry.name.toString());
          try {
            fs.readlinkSync(fullPath);
          } catch (readlinkErr) {
            if (readlinkErr.code === 'EINVAL') {
              Object.defineProperties(entry, {
                isSymbolicLink: { value: () => false, configurable: true, writable: true },
                isFile:         { value: () => true,  configurable: true, writable: true },
              });
            }
          }
        }
      }
    }
    callback(null, entries);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
