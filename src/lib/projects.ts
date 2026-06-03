export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  architecture: string;
  githubUrl: string;
  liveUrl?: string;
  challenges: string[];
  featured: boolean;
  category: string;
}

const projects: Project[] = [
  {
    id: 'distributed-task-queue',
    name: 'Distributed Task Queue',
    description:
      'A horizontally-scalable task queue that distributes work across a cluster of workers with at-least-once delivery guarantees, priority scheduling, and dead-letter routing. Supports delayed tasks, retries with exponential backoff, and real-time progress tracking via gRPC streaming.',
    techStack: ['Go', 'Redis', 'gRPC', 'Kubernetes'],
    architecture:
      'Producer-consumer architecture with Redis Streams as the backbone. A scheduler service enqueues tasks with priority scores. Worker pods pull from sorted sets, acquire distributed locks via Redlock, and report progress over bidirectional gRPC streams. Kubernetes HPA scales workers based on queue depth exposed through a Prometheus metrics endpoint.',
    githubUrl: 'https://github.com/yourusername/distributed-task-queue',
    challenges: [
      'Guaranteeing at-least-once delivery without duplicating side effects required idempotency keys persisted in Redis with TTL-based expiration.',
      'Achieving fair scheduling across priority levels while preventing starvation of low-priority tasks used a weighted round-robin algorithm.',
      'Graceful shutdown of workers mid-task demanded a two-phase drain: stop accepting new tasks, then wait for in-flight tasks to finish before the SIGTERM deadline.',
    ],
    featured: true,
    category: 'Backend Engineering',
  },
  {
    id: 'cloud-native-api-gateway',
    name: 'Cloud-Native API Gateway',
    description:
      'A high-performance API gateway written in Rust that handles authentication, rate limiting, request transformation, and intelligent routing. Deployed on AWS with Terraform-managed infrastructure and auto-scaling based on request latency percentiles.',
    techStack: ['Rust', 'AWS', 'Terraform', 'Docker'],
    architecture:
      'Reverse-proxy architecture built on Hyper and Tokio for async I/O. JWT validation happens in a zero-copy middleware layer. Rate limiting uses a sliding-window counter backed by ElastiCache Redis. Routing rules are loaded from a DynamoDB config table and hot-reloaded via DynamoDB Streams. The gateway runs as a Fargate service behind an NLB, with Terraform modules managing VPC, subnets, and IAM.',
    githubUrl: 'https://github.com/yourusername/cloud-api-gateway',
    challenges: [
      'Keeping p99 latency under 5ms required profiling the hot path with flamegraphs and eliminating all heap allocations in the request-routing loop.',
      'Hot-reloading routing rules without downtime used an ArcSwap pattern to atomically swap the routing table while in-flight requests drained on the old table.',
      'Terraform state management across multiple environments was solved with workspaces and a remote S3 backend with DynamoDB locking.',
    ],
    featured: true,
    category: 'Cloud Computing',
  },
  {
    id: 'event-driven-microservices',
    name: 'Event-Driven Microservices Platform',
    description:
      'A reference platform demonstrating event-driven microservices for an e-commerce domain. Services communicate exclusively through Kafka events, with full event sourcing and CQRS for the order and inventory bounded contexts.',
    techStack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Kubernetes'],
    architecture:
      'Each bounded context (orders, inventory, payments, notifications) is an independent Spring Boot service with its own PostgreSQL schema. Domain events are published to Kafka topics partitioned by aggregate ID. The order service uses event sourcing—state is rebuilt by replaying events from a Kafka-backed event store. A CQRS read model is materialized into PostgreSQL via Kafka Connect sink connectors. Deployed on Kubernetes with Strimzi-managed Kafka.',
    githubUrl: 'https://github.com/yourusername/event-driven-platform',
    challenges: [
      'Ensuring exactly-once processing across services required implementing the transactional outbox pattern with Debezium CDC.',
      'Replaying millions of events to rebuild read models was optimized with snapshotting every 1000 events and parallel partition processing.',
      'Schema evolution without breaking consumers was managed through an Avro schema registry with backward-compatible changes enforced by CI.',
    ],
    featured: true,
    category: 'System Design',
  },
  {
    id: 'log-aggregation-pipeline',
    name: 'Real-Time Log Aggregation Pipeline',
    description:
      'A centralized logging pipeline that ingests, transforms, and indexes logs from hundreds of services. Provides sub-second search and real-time alerting with pre-built Grafana dashboards for operational visibility.',
    techStack: ['Python', 'Elasticsearch', 'Fluentd', 'Grafana'],
    architecture:
      'Fluentd DaemonSets on each Kubernetes node collect container stdout/stderr and forward structured JSON logs to a Python-based enrichment service. The enrichment layer adds request tracing IDs, geo-IP data, and service metadata before writing to Elasticsearch via the bulk API. Grafana reads from Elasticsearch for dashboards, and ElastAlert fires PagerDuty alerts on anomaly detection rules. Index lifecycle management rotates and archives indices to S3 after 30 days.',
    githubUrl: 'https://github.com/yourusername/log-aggregation-pipeline',
    challenges: [
      'Handling bursty log volume during deployments without dropping events required a Kafka buffer between Fluentd and the enrichment service.',
      'Elasticsearch cluster stability under heavy write load was solved by tuning bulk batch sizes, refresh intervals, and shard allocation.',
      'Correlating logs across services needed a custom Fluentd plugin that extracts and propagates W3C trace context headers.',
    ],
    featured: false,
    category: 'Cloud Computing',
  },
  {
    id: 'serverless-data-engine',
    name: 'Serverless Data Processing Engine',
    description:
      'A fully serverless ETL engine that processes CSV, JSON, and Parquet uploads through configurable transformation pipelines. Uses step functions for orchestration and DynamoDB for state, with zero infrastructure to manage.',
    techStack: ['TypeScript', 'AWS Lambda', 'DynamoDB', 'SQS'],
    architecture:
      'S3 event notifications trigger a Lambda that validates the upload and writes a job record to DynamoDB. An SQS FIFO queue ensures ordered processing per tenant. Worker Lambdas pull from SQS, apply user-defined transformation rules (stored as JSON DSL in DynamoDB), and write results back to S3. A Step Functions state machine orchestrates multi-stage pipelines with error handling and retry logic. CloudWatch metrics feed a cost dashboard.',
    githubUrl: 'https://github.com/yourusername/serverless-data-engine',
    challenges: [
      'Processing files larger than Lambda memory limits was solved by streaming S3 objects in chunks and maintaining transformation state in DynamoDB.',
      'Cold start latency for TypeScript Lambdas was reduced from 800ms to 150ms using esbuild bundling, tree-shaking, and provisioned concurrency for critical paths.',
      'Ensuring exactly-once processing with SQS FIFO required deduplication IDs derived from S3 object ETags and careful visibility timeout tuning.',
    ],
    featured: false,
    category: 'Cloud Computing',
  },
  {
    id: 'container-orchestration-dashboard',
    name: 'Container Orchestration Dashboard',
    description:
      'A real-time dashboard for monitoring and managing Docker containers across multiple hosts. Features live log streaming, resource usage graphs, one-click deploys, and container shell access via WebSocket.',
    techStack: ['React', 'Go', 'Docker API', 'WebSocket'],
    architecture:
      'A Go backend connects to Docker daemons on multiple hosts via the Docker Engine API over mTLS. Container metrics (CPU, memory, network I/O) are sampled every second and pushed to connected React clients over WebSocket. The React frontend uses recharts for real-time graphs and xterm.js for browser-based shell access. Authentication uses JWT with refresh token rotation. A SQLite database stores user preferences and deployment templates.',
    githubUrl: 'https://github.com/yourusername/container-dashboard',
    challenges: [
      'Multiplexing hundreds of container log streams over a single WebSocket connection required a custom binary framing protocol with container ID headers.',
      'Keeping the React UI responsive while rendering real-time charts for 50+ containers was solved with virtualized lists and requestAnimationFrame-batched state updates.',
      'Secure shell access to containers needed a PTY allocation on the server side with input sanitization to prevent escape sequences from breaking the terminal.',
    ],
    featured: false,
    category: 'Backend Engineering',
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getAllProjects(): Project[] {
  return [...projects];
}
