#!/bin/bash

# MedCareer Test Automation Script
# This script runs all tests for the MedCareer application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    if [ ! -d "client/node_modules" ]; then
        cd client && npm install && cd ..
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to run linting
run_linting() {
    print_status "Running linting..."
    
    # Backend linting
    if command_exists eslint; then
        npm run lint || print_warning "Backend linting issues found"
    else
        print_warning "ESLint not found, skipping backend linting"
    fi
    
    # Frontend linting
    cd client
    if command_exists eslint; then
        npm run lint || print_warning "Frontend linting issues found"
    else
        print_warning "ESLint not found, skipping frontend linting"
    fi
    cd ..
    
    print_success "Linting completed"
}

# Function to run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    # Backend unit tests
    npm run test:ci || {
        print_error "Backend unit tests failed"
        exit 1
    }
    
    print_success "Unit tests completed successfully"
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    npm run test:integration || {
        print_error "Integration tests failed"
        exit 1
    }
    
    print_success "Integration tests completed successfully"
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    # Check if Playwright is installed
    if ! command_exists playwright; then
        print_status "Installing Playwright..."
        npx playwright install
    fi
    
    # Start the application in background
    print_status "Starting application for E2E tests..."
    npm run dev &
    APP_PID=$!
    
    # Wait for application to start
    sleep 30
    
    # Run E2E tests
    npm run test:e2e || {
        print_error "E2E tests failed"
        kill $APP_PID 2>/dev/null || true
        exit 1
    }
    
    # Stop the application
    kill $APP_PID 2>/dev/null || true
    
    print_success "E2E tests completed successfully"
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    
    cd client
    npm run test:coverage || {
        print_error "Frontend tests failed"
        cd ..
        exit 1
    }
    cd ..
    
    print_success "Frontend tests completed successfully"
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Check if Artillery is installed
    if ! command_exists artillery; then
        print_status "Installing Artillery..."
        npm install -g artillery
    fi
    
    # Start the application in background
    print_status "Starting application for performance tests..."
    npm run dev &
    APP_PID=$!
    
    # Wait for application to start
    sleep 30
    
    # Run performance tests
    artillery run tests/performance/load-test.yml || {
        print_error "Performance tests failed"
        kill $APP_PID 2>/dev/null || true
        exit 1
    }
    
    # Stop the application
    kill $APP_PID 2>/dev/null || true
    
    print_success "Performance tests completed successfully"
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    # Create reports directory
    mkdir -p reports
    
    # Generate coverage report
    if [ -d "coverage" ]; then
        cp -r coverage reports/backend-coverage
    fi
    
    if [ -d "client/coverage" ]; then
        cp -r client/coverage reports/frontend-coverage
    fi
    
    # Generate test summary
    cat > reports/test-summary.md << EOF
# MedCareer Test Report

Generated on: $(date)

## Test Results

- Unit Tests: ✅ Passed
- Integration Tests: ✅ Passed
- E2E Tests: ✅ Passed
- Frontend Tests: ✅ Passed
- Performance Tests: ✅ Passed

## Coverage Reports

- Backend Coverage: reports/backend-coverage/
- Frontend Coverage: reports/frontend-coverage/

## Next Steps

1. Review coverage reports
2. Address any failing tests
3. Update test cases as needed
EOF
    
    print_success "Test report generated in reports/ directory"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    
    # Kill any running processes
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "node server" 2>/dev/null || true
    
    # Remove temporary files
    rm -rf .nyc_output
    rm -rf coverage
    
    print_success "Cleanup completed"
}

# Main function
main() {
    print_status "Starting MedCareer Test Automation..."
    
    # Parse command line arguments
    case "${1:-all}" in
        "install")
            install_dependencies
            ;;
        "lint")
            run_linting
            ;;
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "frontend")
            run_frontend_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "all")
            install_dependencies
            run_linting
            run_unit_tests
            run_integration_tests
            run_frontend_tests
            run_e2e_tests
            run_performance_tests
            generate_report
            ;;
        "quick")
            run_unit_tests
            run_integration_tests
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  install     Install all dependencies"
            echo "  lint        Run linting"
            echo "  unit        Run unit tests"
            echo "  integration Run integration tests"
            echo "  e2e         Run E2E tests"
            echo "  frontend    Run frontend tests"
            echo "  performance Run performance tests"
            echo "  all         Run all tests (default)"
            echo "  quick       Run quick test suite"
            echo "  help        Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
    
    print_success "Test automation completed successfully!"
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"

