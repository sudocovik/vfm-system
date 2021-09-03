# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- LocalCluster interface
- NODE_ENV - depending on environment
- Bash, Docker and k3d binaries in local environment

### Changed
- Docker build target "development" to "base"

## [0.0.1] - 2021-09-03
### Added
- Local environment support (using Docker and Makefile)
- TypeScript
- Hot reload in local environment
- GitHub Action for deploying production infrastructure
- DigitalOcean Project & Domain

[Unreleased]: https://github.com/Covik/vfm-system/compare/v0.0.1-infrastructure...HEAD
[0.0.1]: https://github.com/Covik/vfm-system/releases/tag/v0.0.1-infrastructure