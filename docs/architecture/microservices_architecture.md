# Fraud Detection System - Microservices Architecture

## Overview

The Transaction Monitoring and Fraud Detection System is implemented as a microservices architecture with a central Signal Service that orchestrates communication between services. This document outlines the architecture, responsibilities, and interactions of each microservice.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    
│   API Gateway   │━━━▶│ Transaction API │━━━┓
└─────────────────┘    └─────────────────┘   ┃
                                             ▼
                                     ┌─────────────────┐
                  ┏━━━━━━━━━━━━━━━━━▶│  Signal Service │◀━━━━━━━━━━━━━━━━━┓
                  ┃                  └─────────────────┘                  ┃
                  ┃                        ┃ ┃ ┃ ┃                        ┃
          ┏━━━━━━━┻━━━━━━━┳━━━━━━━━━━━━━━━┻━┻━┻━┻━━━━━━━━━━━━━━┳━━━━━━━━━┻━━━━━━━┓
          ▼                ▼                ▼                   ▼                 ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐
│  Block Service  ││  Rule Service   ││ Velocity Service││   ML Service    ││   AML Service   │
└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘
          ┃                ┃                ┃                   ┃                 ┃   
          ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┛
                                             ┃
                                             ▼
                                    ┌─────────────────┐
                                    │ Response Service│
                                    └─────────────────┘
```

## Microservices Responsibilities

### 1. API Gateway

**Primary Responsibilities:**
- Entry point for all client requests
- Authentication and rate limiting
- Request routing to appropriate services
- API documentation

**Key Components:**
- Authentication middleware
- Rate limiting middleware
- Routing configuration
- API documentation generator

**Database Models Used:**
- User
- UserSession
- Permission
- Role

**Endpoints:**
- `/api/auth/*` - Authentication endpoints
- `/api/docs/*` - API documentation
- Proxy routes to all other services

### 2. Transaction API Service

**Primary Responsibilities:**
- Transaction validation and normalization
- Initial transaction processing
- Submits transactions to Signal Service

**Key Components:**
- Transaction validator
- Data normalizer
- Transaction enrichment service
- Signal Service client

**Database Models Used:**
- Transaction
- POSTransaction
- EcommerceTransaction
- WalletTransaction
- PaymentCard
- TransactionMetadata

**Endpoints:**
- `/api/transactions` - Create new transactions
- `/api/transactions/:id` - Get transaction details
- `/api/transactions/batch` - Batch transaction processing

### 3. Signal Service (Central Event Bus)

**Primary Responsibilities:**
- Receives incoming transactions
- Coordinates communication between microservices
- Manages event streams and message queues
- Tracks service responses and status
- Orchestrates the evaluation workflow

**Key Components:**
- Redis Streams manager
- Signal collector and aggregator
- Transaction state manager
- Service coordinator

**Database Models Used:**
- Transaction (read-only)
- Custom signal models for internal use

**Endpoints:**
- `/api/signals` - Signal submission endpoint
- `/api/signals/status/:transactionId` - Get signal status for transaction
- Internal endpoints for service communication

### 4. Block Service

**Primary Responsibilities:**
- Quick rejection based on blacklists and simple rules
- Sends block/allow signals back to Signal Service
- Maintains block lists and history

**Key Components:**
- Blocklist manager
- Block evaluator
- Signal generator

**Database Models Used:**
- Custom blocklist models
- Transaction (read-only)

**Endpoints:**
- `/api/blocks` - Manage blocklists
- `/api/blocks/check` - Check if entity is blocked
- Internal endpoints for Signal Service communication

### 5. Rule Service

**Primary Responsibilities:**
- Evaluates complex rules against transactions
- Rule management and compilation
- Returns rule evaluation results to Signal Service
- Maintains rule performance metrics

**Key Components:**
- Rule engine
- Rule compiler
- Rule management API
- Performance tracker

**Database Models Used:**
- Rule
- RuleExecution
- RuleSet
- RuleFunction
- RuleApproval
- RulePerformanceMetric
- Transaction (read-only)

**Endpoints:**
- `/api/rules` - CRUD operations for rules
- `/api/rules/sets` - Manage rule sets
- `/api/rules/functions` - Manage rule functions
- `/api/rules/performance` - Rule performance metrics
- Internal endpoints for Signal Service communication

### 6. Velocity Service

**Primary Responsibilities:**
- Tracks transaction rates and patterns
- Detects unusual transaction frequencies
- Returns velocity analysis to Signal Service
- Maintains historical velocity data

**Key Components:**
- Transaction tracker
- Sliding window analyzer
- Velocity signal generator

**Database Models Used:**
- Custom velocity models
- Transaction (read-only)

**Endpoints:**
- `/api/velocity/metrics` - Get velocity metrics
- `/api/velocity/thresholds` - Manage velocity thresholds
- Internal endpoints for Signal Service communication

### 7. ML Service

**Primary Responsibilities:**
- Applies machine learning models to transactions
- Model management and versioning
- Returns risk scores to Signal Service
- Handles model training and evaluation

**Key Components:**
- Feature engineering pipeline
- Model serving infrastructure
- Model management API
- Training job manager

**Database Models Used:**
- MLModel
- MLPrediction
- MLFeature
- MLTrainingJob
- MLModelPerformance
- Transaction (read-only)

**Endpoints:**
- `/api/ml/models` - CRUD operations for ML models
- `/api/ml/predictions/:transactionId` - Get predictions for transaction
- `/api/ml/features` - Manage features
- `/api/ml/training` - Manage training jobs
- `/api/ml/performance` - Model performance metrics
- Internal endpoints for Signal Service communication

### 8. AML Service

**Primary Responsibilities:**
- Specialized anti-money laundering detection
- Network analysis for connected transactions
- Returns AML indicators to Signal Service
- Handles regulatory reporting

**Key Components:**
- AML detection algorithms
- Network analyzer
- Regulatory reporting engine
- Case management system

**Database Models Used:**
- AMLCase
- AMLCaseNote
- AMLCaseEvidence
- AMLAlert
- AMLRiskProfile
- AMLTransactionPattern
- AMLWatchList
- AMLWatchListEntry
- Transaction (read-only)

**Endpoints:**
- `/api/aml/cases` - CRUD operations for AML cases
- `/api/aml/alerts` - Manage AML alerts
- `/api/aml/risk-profiles` - Manage risk profiles
- `/api/aml/patterns` - Transaction pattern analysis
- `/api/aml/watchlists` - Manage watch lists
- `/api/aml/reports` - Regulatory reporting
- Internal endpoints for Signal Service communication

### 9. Response Service

**Primary Responsibilities:**
- Collects results from all services via Signal Service
- Makes final decision based on aggregated signals
- Formats and returns appropriate response
- Tracks transaction outcomes

**Key Components:**
- Signal aggregator
- Decision engine
- Response formatter
- Outcome tracker

**Database Models Used:**
- Transaction
- TransactionResponse
- Custom response models

**Endpoints:**
- `/api/responses/:transactionId` - Get final response for transaction
- `/api/responses/metrics` - Response metrics and statistics
- Internal endpoints for Signal Service communication

## Signal Types and Flow

### Signal Flow

1. Client submits transaction to Transaction API Service
2. Transaction API validates and normalizes the transaction
3. Transaction API sends transaction to Signal Service
4. Signal Service distributes transaction to all detection services in parallel:
   - Block Service
   - Rule Service
   - Velocity Service
   - ML Service
   - AML Service
5. Each service evaluates the transaction and returns signals to Signal Service
6. Signal Service collects and aggregates all signals
7. Signal Service sends aggregated signals to Response Service
8. Response Service makes final decision and returns response
9. Signal Service updates transaction status and notifies Transaction API
10. Transaction API returns final result to client

### Signal Types

1. **Block Signals**
   - Binary signals (block/allow) from Block Service
   - Include reason codes and confidence levels
   - High priority with immediate processing

2. **Rule Signals**
   - Rule match signals from Rule Service
   - Include rule IDs, conditions met, and risk scores
   - Can trigger additional evaluations based on rule actions

3. **Velocity Signals**
   - Transaction frequency and pattern signals
   - Include velocity metrics and historical comparisons
   - Time-based analysis with trending indicators

4. **ML Signals**
   - Risk scores and classification results from ML models
   - Include model version, confidence levels, and feature importance
   - Support for explainable AI features

5. **AML Signals**
   - Money laundering risk indicators
   - Network relationship data
   - Regulatory compliance flags

## Service Communication

### Synchronous Communication

- REST API calls between services for direct requests
- Used for immediate responses and simple queries
- Implemented with Django REST Framework

### Asynchronous Communication

- Redis Streams for event-driven communication
- Used for signal distribution and collection
- Implemented with Redis and Celery
- Consumer groups for load balancing

### Message Format

```json
{
  "signal_id": "sig_123456",
  "transaction_id": "tx_789012",
  "source": "rule_service",
  "signal_type": "rule_match",
  "timestamp": 1625097600,
  "priority": 2,
  "payload": {
    "rule_id": "rule_456",
    "rule_name": "High Amount Transaction",
    "conditions_met": ["amount > 1000", "is_new_card == true"],
    "risk_score": 0.75,
    "actions": ["flag_for_review"]
  },
  "metadata": {
    "execution_time_ms": 15.5,
    "version": "1.0"
  }
}
```

## Resilience and Fault Tolerance

### Circuit Breakers

- Implemented for service-to-service communication
- Prevents cascading failures
- Configurable thresholds and recovery times

### Timeouts and Retries

- Service-specific timeout configurations
- Retry policies with exponential backoff
- Dead letter queues for failed messages

### Fallback Mechanisms

- Default responses when services are unavailable
- Graceful degradation of functionality
- Cached responses for critical services

## Monitoring and Observability

### Metrics Collection

- Service-level metrics (response times, throughput)
- Business metrics (fraud detection rates, false positives)
- System metrics (CPU, memory, disk usage)

### Distributed Tracing

- Transaction flow visualization
- End-to-end request tracking
- Performance bottleneck identification

### Alerting

- Service degradation alerts
- Business metric anomalies
- Security incident notifications

## Deployment and Scaling

### Containerization

- Docker containers for all services
- Docker Compose for development
- Kubernetes for production

### Scaling Strategies

- Horizontal scaling for stateless services
- Vertical scaling for database and Redis
- Auto-scaling based on load metrics

### Deployment Strategies

- Blue-green deployment
- Canary releases for critical services
- Rollback capabilities
