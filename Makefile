# Unravel Cloudflare Pages Deployment Makefile
# ==============================================
# Simplifies building and deploying the Astro site to Cloudflare Pages

# Configuration Variables
# These can be overridden via environment variables or command line
# Example: make deploy PROJECT_NAME=unravel-tech
SITE_DIR := unravel-site
BUILD_DIR := $(SITE_DIR)/dist
CLOUDFLARE_PROJECT ?= $(CLOUDFLARE_PROJECT_NAME)
CLOUDFLARE_ACCOUNT_ID ?= $(CLOUDFLARE_ACCOUNT_ID)
BRANCH ?= production

# Colors for terminal output
COLOR_RESET := \033[0m
COLOR_BOLD := \033[1m
COLOR_GREEN := \033[32m
COLOR_BLUE := \033[34m
COLOR_YELLOW := \033[33m

# Default target
.DEFAULT_GOAL := help

# Phony targets (not actual files)
.PHONY: help install build clean deploy preview check-config purge-cache

# Help target - displays available commands
help:
	@echo "$(COLOR_BOLD)Unravel Cloudflare Pages Deployment$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_GREEN)Available targets:$(COLOR_RESET)"
	@echo "  $(COLOR_BLUE)install$(COLOR_RESET)       Install npm dependencies"
	@echo "  $(COLOR_BLUE)build$(COLOR_RESET)         Build the Astro site"
	@echo "  $(COLOR_BLUE)preview$(COLOR_RESET)       Preview the built site locally"
	@echo "  $(COLOR_BLUE)clean$(COLOR_RESET)         Remove build artifacts"
	@echo "  $(COLOR_BLUE)deploy$(COLOR_RESET)        Build and deploy to Cloudflare Pages"
	@echo "  $(COLOR_BLUE)purge-cache$(COLOR_RESET)   Purge Cloudflare cache"
	@echo "  $(COLOR_BLUE)check-config$(COLOR_RESET)  Verify Cloudflare configuration"
	@echo ""
	@echo "$(COLOR_YELLOW)Configuration:$(COLOR_RESET)"
	@echo "  Set these environment variables or pass as arguments:"
	@echo "    CLOUDFLARE_PROJECT_NAME  - Cloudflare Pages project name"
	@echo "    CLOUDFLARE_ACCOUNT_ID    - Cloudflare account ID (optional for some commands)"
	@echo "    CLOUDFLARE_API_TOKEN     - Cloudflare API token (required for API operations)"
	@echo "    BRANCH                   - Git branch name (default: production)"
	@echo ""
	@echo "$(COLOR_YELLOW)Examples:$(COLOR_RESET)"
	@echo "  make deploy PROJECT_NAME=unravel-tech"
	@echo "  export CLOUDFLARE_PROJECT_NAME=unravel-tech && make deploy"
	@echo "  BRANCH=staging make deploy"

# Install npm dependencies
install:
	@echo "$(COLOR_GREEN)Installing dependencies...$(COLOR_RESET)"
	cd $(SITE_DIR) && npm install
	@echo "$(COLOR_GREEN)✓ Dependencies installed$(COLOR_RESET)"

# Build the Astro site (with automatic dependency installation)
build: install
	@echo "$(COLOR_GREEN)Building Astro site...$(COLOR_RESET)"
	cd $(SITE_DIR) && npm run build
	@echo "$(COLOR_GREEN)✓ Build complete: $(BUILD_DIR)$(COLOR_RESET)"

# Preview the built site locally
preview: build
	@echo "$(COLOR_GREEN)Starting preview server...$(COLOR_RESET)"
	cd $(SITE_DIR) && npm run preview

# Clean build artifacts
clean:
	@echo "$(COLOR_YELLOW)Cleaning build artifacts...$(COLOR_RESET)"
	rm -rf $(BUILD_DIR)
	@echo "$(COLOR_GREEN)✓ Build directory cleaned$(COLOR_RESET)"

# Check Cloudflare configuration
check-config:
	@echo "$(COLOR_BLUE)Checking Cloudflare configuration...$(COLOR_RESET)"
	@if ! command -v wrangler >/dev/null 2>&1; then \
		echo "$(COLOR_YELLOW)⚠ Wrangler CLI not found$(COLOR_RESET)"; \
		echo "Install it via: npm install -g wrangler"; \
		echo "Or use npx: The deploy command will use npx wrangler automatically"; \
	else \
		echo "$(COLOR_GREEN)✓ Wrangler CLI found$(COLOR_RESET)"; \
	fi
	@if [ -n "$(CLOUDFLARE_PROJECT)" ]; then \
		echo "$(COLOR_GREEN)✓ Project name: $(CLOUDFLARE_PROJECT)$(COLOR_RESET)"; \
	else \
		echo "$(COLOR_YELLOW)⚠ CLOUDFLARE_PROJECT_NAME not set$(COLOR_RESET)"; \
		echo "Deploy will use default project or prompt for configuration"; \
	fi

# Deploy to Cloudflare Pages
deploy: build
	@echo "$(COLOR_GREEN)Deploying to Cloudflare Pages...$(COLOR_RESET)"
	@if [ ! -d "$(BUILD_DIR)" ]; then \
		echo "$(COLOR_YELLOW)⚠ Build directory not found. Running build first...$(COLOR_RESET)"; \
		$(MAKE) build; \
	fi
	@if command -v wrangler >/dev/null 2>&1; then \
		if [ -n "$(CLOUDFLARE_PROJECT)" ]; then \
			wrangler pages deploy $(BUILD_DIR) \
				--project-name=$(CLOUDFLARE_PROJECT) \
				--branch=$(BRANCH); \
		else \
			wrangler pages deploy $(BUILD_DIR) --branch=$(BRANCH); \
		fi \
	else \
		if [ -n "$(CLOUDFLARE_PROJECT)" ]; then \
			npx wrangler pages deploy $(BUILD_DIR) \
				--project-name=$(CLOUDFLARE_PROJECT) \
				--branch=$(BRANCH); \
		else \
			npx wrangler pages deploy $(BUILD_DIR) --branch=$(BRANCH); \
		fi \
	fi
	@echo ""
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)✓ Deployment complete!$(COLOR_RESET)"
	@echo ""
	@echo "Your site has been deployed to Cloudflare Pages."
	@if [ -n "$(CLOUDFLARE_PROJECT)" ]; then \
		echo "View at: https://$(CLOUDFLARE_PROJECT).pages.dev"; \
	fi

# Purge Cloudflare cache (requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID)
purge-cache:
	@echo "$(COLOR_GREEN)Purging Cloudflare cache...$(COLOR_RESET)"
	@if [ -z "$(CLOUDFLARE_API_TOKEN)" ]; then \
		echo "$(COLOR_YELLOW)⚠ CLOUDFLARE_API_TOKEN not set$(COLOR_RESET)"; \
		echo "Set it via: export CLOUDFLARE_API_TOKEN=your-api-token"; \
		echo "Note: Cache will be automatically purged on new deployments"; \
		exit 1; \
	fi
	@if [ -z "$(CLOUDFLARE_ACCOUNT_ID)" ]; then \
		echo "$(COLOR_YELLOW)⚠ CLOUDFLARE_ACCOUNT_ID not set$(COLOR_RESET)"; \
		echo "Set it via: export CLOUDFLARE_ACCOUNT_ID=your-account-id"; \
		exit 1; \
	fi
	@if [ -z "$(CLOUDFLARE_PROJECT)" ]; then \
		echo "$(COLOR_YELLOW)⚠ CLOUDFLARE_PROJECT_NAME not set$(COLOR_RESET)"; \
		echo "Set it via: export CLOUDFLARE_PROJECT_NAME=your-project-name"; \
		exit 1; \
	fi
	@curl -X POST "https://api.cloudflare.com/client/v4/accounts/$(CLOUDFLARE_ACCOUNT_ID)/pages/projects/$(CLOUDFLARE_PROJECT)/purge_build_cache" \
		-H "Authorization: Bearer $(CLOUDFLARE_API_TOKEN)" \
		-H "Content-Type: application/json" \
		--silent --show-error | jq '.'
	@echo "$(COLOR_GREEN)✓ Cache purge requested$(COLOR_RESET)"
