-- Q3 2025: Backend Integration & API Schema

-- ============================================
-- 1. API ENDPOINTS MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS api_endpoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
    description TEXT,
    request_schema JSONB DEFAULT '{}',
    response_schema JSONB DEFAULT '{}',
    authentication VARCHAR(50) DEFAULT 'none', -- none, api_key, jwt, oauth
    rate_limit INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. DATABASE SCHEMA GENERATOR
-- ============================================

CREATE TABLE IF NOT EXISTS database_schemas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'postgresql', -- postgresql, mysql, mongodb, supabase
    tables JSONB NOT NULL DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    migrations JSONB DEFAULT '[]',
    is_generated BOOLEAN DEFAULT false,
    generated_sql TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS database_tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schema_id UUID NOT NULL REFERENCES database_schemas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    columns JSONB NOT NULL DEFAULT '[]',
    indexes JSONB DEFAULT '[]',
    constraints JSONB DEFAULT '[]',
    row_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 3. API KEYS & ACCESS TOKENS
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSONB DEFAULT '["read"]', -- read, write, admin
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id),
    endpoint_id UUID REFERENCES api_endpoints(id),
    user_id UUID REFERENCES auth.users(id),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_body JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 4. BACKEND CODE TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS backend_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    framework VARCHAR(50) NOT NULL, -- express, fastify, nestjs, django, laravel
    language VARCHAR(50) NOT NULL, -- javascript, typescript, python, php
    template_code TEXT NOT NULL,
    dependencies JSONB DEFAULT '[]',
    dev_dependencies JSONB DEFAULT '[]',
    config_files JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 5. MOBILE APP EXPORTS
-- ============================================

CREATE TABLE IF NOT EXISTS mobile_app_exports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- react-native, flutter, ios, android
    framework VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
    export_url TEXT,
    file_size BIGINT,
    build_logs TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 6. WEBHOOKS
-- ============================================

CREATE TABLE IF NOT EXISTS webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255),
    events JSONB NOT NULL DEFAULT '[]', -- project.created, project.updated, etc.
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, delivered, failed
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 7. EXTERNAL INTEGRATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- stripe, supabase, firebase, vercel, github
    name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials_encrypted TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_api_endpoints_project ON api_endpoints(project_id);
CREATE INDEX IF NOT EXISTS idx_database_schemas_project ON database_schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_project ON webhooks(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_app_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- API Endpoints: Project owners and collaborators
CREATE POLICY "Project members can view API endpoints"
    ON api_endpoints FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = api_endpoints.project_id
            AND (projects.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM project_shares
                    WHERE project_shares.project_id = projects.id
                    AND project_shares.shared_with = auth.uid()
                )
            )
        )
    );

-- API Keys: Users can only see their own
CREATE POLICY "Users can view own API keys"
    ON api_keys FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own API keys"
    ON api_keys FOR ALL
    USING (user_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table api_endpoints;
alter publication supabase_realtime add table database_schemas;
alter publication supabase_realtime add table mobile_app_exports;
alter publication supabase_realtime add table webhooks;
alter publication supabase_realtime add table webhook_deliveries;

-- ============================================
-- SEED DATA - Backend Templates
-- ============================================

INSERT INTO backend_templates (name, framework, language, template_code, dependencies, is_default) VALUES
(
    'Express.js + TypeScript',
    'express',
    'typescript',
    'import express from ''express'';
import cors from ''cors'';
import dotenv from ''dotenv'';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get(''/api/health'', (req, res) => {
    res.json({ status: ''ok'', timestamp: new Date().toISOString() });
});

// {{GENERATED_ROUTES}}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});',
    '["express", "cors", "dotenv", "@types/express", "@types/cors", "typescript", "ts-node"]',
    true
),
(
    'Fastify + TypeScript',
    'fastify',
    'typescript',
    'import Fastify from ''fastify'';
import cors from ''@fastify/cors'';
import dotenv from ''dotenv'';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || ''3000'');

app.register(cors);

// Health check
app.get(''/api/health'', async () => {
    return { status: ''ok'', timestamp: new Date().toISOString() };
});

// {{GENERATED_ROUTES}}

const start = async () => {
    try {
        await app.listen({ port: PORT });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();',
    '["fastify", "@fastify/cors", "dotenv", "typescript", "ts-node"]',
    false
),
(
    'Django REST Framework',
    'django',
    'python',
    'from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view([''GET''])
def health_check(request):
    return Response({
        ''status'': ''ok'',
        ''timestamp'': timezone.now().isoformat()
    })

# {{GENERATED_VIEWS}}',
    '["django", "djangorestframework", "django-cors-headers"]',
    false
);
