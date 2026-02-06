import { supabase } from './supabase';

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit: number;
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface APIUsage {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByDay: Record<string, number>;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastDelivery?: {
    status: number;
    timestamp: string;
    success: boolean;
  };
}

class PublicAPIService {
  // API Key Management
  async createAPIKey(
    name: string,
    permissions: string[] = ['read'],
    expiresInDays?: number
  ): Promise<{ key: string; apiKey: APIKey }> {
    // Generate secure key
    const key = this.generateSecureKey();
    const keyPrefix = key.substring(0, 8);
    
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await supabase
      .from('api_keys')
      .insert([{
        name,
        key_hash: key, // In production, hash this!
        key_prefix: keyPrefix,
        permissions,
        expires_at: expiresAt,
      }])
      .select()
      .single();

    if (error) throw error;

    return { key, apiKey: data };
  }

  async getAPIKeys(): Promise<APIKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async revokeAPIKey(keyId: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  }

  // API Usage Analytics
  async getAPIUsage(
    keyId?: string,
    days: number = 30
  ): Promise<APIUsage> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('api_usage_logs')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (keyId) {
      query = query.eq('api_key_id', keyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate analytics
    const logs = data || [];
    const totalRequests = logs.length;
    const successfulRequests = logs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageResponseTime = logs.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) / totalRequests || 0;

    // Group by endpoint
    const requestsByEndpoint = logs.reduce((acc, l) => {
      const endpoint = `${l.method} ${l.path}`;
      acc[endpoint] = (acc[endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by day
    const requestsByDay = logs.reduce((acc, l) => {
      const day = new Date(l.created_at).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      requestsByEndpoint,
      requestsByDay,
    };
  }

  // Webhook Management
  async createWebhook(
    url: string,
    events: string[],
    projectId?: string
  ): Promise<WebhookConfig> {
    const secret = this.generateWebhookSecret();

    const { data, error } = await supabase
      .from('webhooks')
      .insert([{
        url,
        events,
        secret,
        project_id: projectId,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getWebhooks(projectId?: string): Promise<WebhookConfig[]> {
    let query = supabase
      .from('webhooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async updateWebhook(
    webhookId: string,
    updates: Partial<WebhookConfig>
  ): Promise<WebhookConfig> {
    const { data, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', webhookId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', webhookId);

    if (error) throw error;
  }

  // Test webhook delivery
  async testWebhook(webhookId: string): Promise<{ success: boolean; status: number; response: string }> {
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (!webhook) throw new Error('Webhook not found');

    // Send test payload
    const testPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test webhook delivery' },
    };

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret || '',
          'X-Noir-Event': 'test',
        },
        body: JSON.stringify(testPayload),
      });

      const responseText = await response.text();

      // Log delivery
      await supabase.from('webhook_deliveries').insert([{
        webhook_id: webhookId,
        event_type: 'test',
        payload: testPayload,
        response_status: response.status,
        response_body: responseText,
        delivery_status: response.ok ? 'delivered' : 'failed',
      }]);

      return {
        success: response.ok,
        status: response.status,
        response: responseText,
      };
    } catch (error) {
      // Log failed delivery
      await supabase.from('webhook_deliveries').insert([{
        webhook_id: webhookId,
        event_type: 'test',
        payload: testPayload,
        delivery_status: 'failed',
      }]);

      return {
        success: false,
        status: 0,
        response: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // API Documentation
  getAPIDocumentation(): string {
    return `# NOIR AI API Documentation

## Authentication
All API requests require an API key to be included in the header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Rate Limiting
- Free tier: 100 requests/hour
- Pro tier: 10,000 requests/hour
- Enterprise: Custom limits

## Endpoints

### Generate Code
\`\`\`http
POST /v1/generate
\`\`\`
Generate code from a design or prompt.

**Request Body:**
\`\`\`json
{
  "prompt": "Create a login form",
  "framework": "react",
  "design_system": "mui"
}
\`\`\`

**Response:**
\`\`\`json
{
  "code": "...",
  "language": "tsx",
  "tokens_used": 150
}
\`\`\`

### List Projects
\`\`\`http
GET /v1/projects
\`\`\`
Get a list of your projects.

**Query Parameters:**
- \`limit\` (number): Maximum results (default: 20)
- \`offset\` (number): Pagination offset

### Export Project
\`\`\`http
POST /v1/projects/:id/export
\`\`\`
Export a project in various formats.

**Request Body:**
\`\`\`json
{
  "format": "zip",
  "include_dependencies": true
}
\`\`\`

## Webhooks
Subscribe to events using webhooks.

### Events
- \`project.created\` - New project created
- \`project.updated\` - Project updated
- \`generation.completed\` - Code generation completed
- \`export.completed\` - Export completed

### Payload Format
\`\`\`json
{
  "event": "generation.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "project_id": "uuid",
    "status": "success"
  }
}
\`\`\`

## Error Codes
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`429\` - Rate Limit Exceeded
- \`500\` - Internal Server Error

## SDKs
- [JavaScript/TypeScript](https://github.com/noir-ai/js-sdk)
- [Python](https://github.com/noir-ai/python-sdk)
`;
  }

  // SDK Code Examples
  getSDKExamples(): Record<string, string> {
    return {
      javascript: `import { NoirAI } from '@noir-ai/sdk';

const noir = new NoirAI({
  apiKey: 'your-api-key'
});

// Generate code
const result = await noir.generate({
  prompt: 'Create a dashboard with charts',
  framework: 'react',
  designSystem: 'mui'
});

console.log(result.code);`,

      python: `from noir_ai import NoirAI

noir = NoirAI(api_key='your-api-key')

# Generate code
result = noir.generate(
    prompt='Create a dashboard with charts',
    framework='react',
    design_system='mui'
)

print(result.code)`,

      curl: `curl -X POST https://api.noir.ai/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Create a dashboard with charts",
    "framework": "react",
    "design_system": "mui"
  }'`,
    };
  }

  // Helpers
  private generateSecureKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'noir_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateWebhookSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `whsec_${result}`;
  }
}

export const publicAPIService = new PublicAPIService();
