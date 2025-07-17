# Megaverse Challenge - Robust Implementation

A production-ready solution for the Crossmint Megaverse Challenge with comprehensive error handling, retry logic, logging, and testing.

## Features

- **🔄 Retry Logic**: Exponential backoff for API failures
- **📊 Progress Tracking**: Real-time progress updates
- **📝 Comprehensive Logging**: Structured logging with different levels
- **🛡️ Error Handling**: Graceful error handling with detailed error messages
- **⚡ Rate Limiting**: Configurable delays to respect API limits
- **🧪 Testing**: Unit tests with coverage requirements
- **⚙️ Configuration**: Environment-based configuration management

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. To run Phase 1 (X-shape):
   ```bash
   npm start
   ```
3. To reset the map for Phase 1:
   ```bash
   npm run reset
   ```
4. To run Phase 2 (logo from goal map):
   ```bash
   npm run phase2
   ```

## Testing & Validation

The project includes comprehensive testing and validation features:

### **Unit Tests**

- **Astral Objects**: Tests for Polyanet, Soloon, and Cometh classes
- **API Client**: Tests for MegaverseAPI with mocked HTTP responses and error handling
- **Creator Logic**: Tests for pattern generation and API interactions (with mocked API client)
- **Utilities**: Tests for RetryHandler and Logger classes

### **Integration Tests**

- **Full Workflow**: End-to-end testing of Phase 1 and Phase 2 operations
- **Error Recovery**: Testing retry logic and partial failure handling
- **Dry Run Mode**: Validation of operations without making API calls
- **State Validation**: Comparison of current state against goal state

### **Dry Run Mode**

Test operations without making actual API calls:

```bash
# Dry run Phase 1
npm run dry-run:phase1

# Dry run Phase 2
npm run dry-run:phase2

# Or use the validation script
node scripts/validate.js dry-run:phase1
node scripts/validate.js dry-run:phase2
```

### **State Validation**

Validate your current megaverse against the goal state:

```bash
npm run validate
# or
node scripts/validate.js validate
```

### **Test Commands**

```bash
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:coverage      # Run tests with coverage
```

## Configuration

Edit `config.js` to customize:

- Retry attempts and delays
- Logging levels
- API timeouts
- Rate limiting delays

## Thought Process

- **Phase 1:** Automated the X-shape by using simple math rules for diagonals. First diagonal is row = colummn and the second diagonal is row+column = size - 1 while leaving 2 empty cell on each edge
- **Phase 2:** Parsed the goal map and placed objects programmatically based on its contents. For SOLoon and comETHs, I split the string in 2 to identify color and orientation respectively

## Architecture

- **RetryHandler**: Exponential backoff for failed API calls
- **Logger**: Structured logging with configurable levels
- **MegaverseAPI**: Robust API client with retry logic
- **MegaverseCreator**: High-level operations with progress tracking
- **Configuration**: Centralized config management
